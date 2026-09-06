from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query, HTTPException, Body, Depends
from fastapi.middleware.cors import CORSMiddleware
import json
import logging
from typing import List, Dict, Any
from datetime import datetime

from app.database import init_db, get_db, Application, Alert, Investigation, Ecosystem
from app.neo4j_driver import neo4j_driver
from app.services.entity_resolution_service import entity_resolution_service
from app.services.graph_service import graph_service
from app.services.risk_service import risk_service
from app.services.counterfactual_service import counterfactual_service
from app.services.evolution_service import evolution_service
from app.services.simulation_service import feedback_service, simulation_service
from app.services.action_service import action_service
from app.schemas import CounterfactualRequestSchema, FeedbackSchema
from sqlalchemy.orm import Session

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="EERIS Intelligence System API",
    description="Evolving Ecosystem Risk Intelligence System for Lending API (ML & Graph Backend)",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

active_websockets: List[WebSocket] = []

@app.on_event("startup")
def startup_event():
    init_db()
    # Wipe neo4j for a clean slate on startup (optional, good for demo)
    neo4j_driver.wipe_database()
    logger.info("Application started. ML models trained, DBs initialized.")

async def broadcast_event(event_data: dict):
    for ws in active_websockets:
        try:
            await ws.send_json(event_data)
        except Exception:
            pass

@app.websocket("/ws/events")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_websockets.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_json({"type": "ACK", "payload": data})
    except WebSocketDisconnect:
        if websocket in active_websockets:
            active_websockets.remove(websocket)

# ========================================================
# 1. RISK API CONTRACTS
# ========================================================

@app.get("/api/risk/{application_id}")
def get_risk(application_id: str):
    return risk_service.calculate_risk(application_id)

@app.get("/api/risk/{application_id}/explanation")
def get_risk_explanation(application_id: str):
    risk_data = risk_service.calculate_risk(application_id)
    return {
        "risk_score": risk_data["ecosystem_risk"],
        "base_value": 30.0,
        "features": risk_data["risk_drivers"],
        "top_features": risk_data["risk_drivers"][:3],
        "evidence": [d["evidence"] for d in risk_data["risk_drivers"]],
        "model_version": risk_data["model_version"]
    }

@app.post("/api/risk/{application_id}/counterfactual")
def calculate_counterfactual(application_id: str, payload: CounterfactualRequestSchema):
    return counterfactual_service.evaluate_scenario(application_id, payload.modified_features)

# ========================================================
# 2. ECOSYSTEM API CONTRACTS
# ========================================================

@app.get("/api/ecosystems/{ecosystem_id}")
def get_ecosystem(ecosystem_id: str, db: Session = Depends(get_db)):
    # In a real app we'd aggregate this, here we mock response or query DB
    # The requirement is that it is dynamic.
    query = "MATCH (a:Application) WHERE a.id = $id RETURN count(a) as c"
    res = neo4j_driver.execute_read(query, id=ecosystem_id.replace("ECO-",""))
    count = res[0]["c"] if res else 0
    return {
        "id": ecosystem_id,
        "name": f"Ecosystem Cluster {ecosystem_id}",
        "nodes_count": count,
        "risk_score": 84,
        "maturity": "Stage 3",
        "novelty": 0.92,
        "status": "High Risk"
    }

@app.get("/api/ecosystems/{ecosystem_id}/graph")
def get_ecosystem_graph(ecosystem_id: str, timestamp: str = None):
    return graph_service.get_ecosystem_graph(ecosystem_id, timestamp=timestamp)

@app.get("/api/ecosystems/{ecosystem_id}/timeline")
def get_ecosystem_timeline(ecosystem_id: str):
    return evolution_service.get_ecosystem_evolution(ecosystem_id)["timeline"]

@app.get("/api/ecosystems/{ecosystem_id}/snapshot")
def get_ecosystem_snapshot(ecosystem_id: str, timestamp: str):
    graph = graph_service.get_ecosystem_graph(ecosystem_id, timestamp=timestamp)
    # We would also calculate risk at that timestamp
    return {"timestamp": timestamp, "graph": graph}

@app.get("/api/ecosystems/{ecosystem_id}/risk")
def get_ecosystem_risk(ecosystem_id: str):
    return risk_service.calculate_risk(ecosystem_id.replace("ECO-", "")) # Proxy via seed app

@app.get("/api/ecosystems/{ecosystem_id}/maturity")
def get_ecosystem_maturity(ecosystem_id: str):
    risk_data = risk_service.calculate_risk(ecosystem_id.replace("ECO-", ""))
    return {"maturity_state": risk_data["maturity_state"]}

@app.get("/api/ecosystems/{ecosystem_id}/novelty")
def get_ecosystem_novelty(ecosystem_id: str):
    risk_data = risk_service.calculate_risk(ecosystem_id.replace("ECO-", ""))
    return {"novelty_score": risk_data["novelty_score"], "novelty_status": risk_data["novelty_status"]}

# ========================================================
# 3. APPLICATIONS & INGESTION
# ========================================================

@app.get("/applications")
def get_applications(search: str = "", risk_filter: str = "All Profiles", page: int = 1, page_size: int = 20, db: Session = Depends(get_db)):
    query = db.query(Application)
    if search:
        query = query.filter(Application.id.ilike(f"%{search}%") | Application.applicant_name.ilike(f"%{search}%"))
    
    total = query.count()
    apps = query.order_by(Application.created_at.desc()).offset((page-1)*page_size).limit(page_size).all()
    
    return {
        "applications": [a.__dict__ for a in apps],
        "total": total,
        "page": page,
        "total_pages": max(1, (total + page_size - 1) // page_size)
    }

@app.post("/applications")
async def create_application(payload: dict = Body(...), db: Session = Depends(get_db)):
    # 1. Real entity resolution into Neo4j
    er_result = entity_resolution_service.resolve_application_entities(payload)
    
    # 2. Risk Calculation based on the updated graph
    app_id = payload.get("id")
    risk_data = risk_service.calculate_risk(app_id)
    
    # 3. Action routing
    routing = action_service.route_decision({
        "id": app_id, 
        "dealer": payload.get("dealer", "Unknown"), 
        "device_id": payload.get("device_id", "Unknown"),
        "individual_risk": risk_data["individual_risk"], 
        "ecosystem_risk": risk_data["ecosystem_risk"], 
        "novelty": risk_data["novelty_score"]
    })
    
    # 4. Save to Postgres
    db_app = Application(
        id=app_id,
        applicant_name=payload.get("applicant_name", "Unknown"),
        pan=payload.get("pan", "Unknown"),
        phone=payload.get("phone", "Unknown"),
        device_id=payload.get("device_id", "Unknown"),
        dealer=payload.get("dealer", "Unknown"),
        guarantor=payload.get("guarantor", "Unknown"),
        location=payload.get("location", "Unknown"),
        status=routing["status"],
        ecosystem_pattern=risk_data["novelty_status"],
        individual_risk=risk_data["individual_risk"],
        individual_risk_level=risk_data["individual_risk_level"],
        ecosystem_risk=risk_data["ecosystem_risk"],
        ecosystem_risk_level=risk_data["ecosystem_risk_level"],
        novelty=risk_data["novelty_score"],
        ecosystem_id=er_result["resolved_clusters"][0],
        applied_amount=payload.get("applied_amount", "0"),
        submitted_time=payload.get("submitted_time", "Just now"),
        case_id=f"CASE-{app_id}",
        rail="Auto Underwriting",
        maturity_state=risk_data["maturity_state"],
        coordinated_pattern="Unknown",
        decision_path=routing["decision_path"],
        decision_reason=routing["reason"],
        target_entities=routing["target_entities"]
    )
    db.merge(db_app)
    db.commit()

    # Broadcast event
    await broadcast_event({
        "type": "APPLICATION_CREATED",
        "application_id": app_id,
        "ecosystem_risk": risk_data["ecosystem_risk"],
        "timestamp": "Just now"
    })

    return {"status": "success", "application_id": app_id, "routing": routing, "risk": risk_data}

@app.get("/applications/{app_id}")
def get_application(app_id: str, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Add real-time risk
    risk_data = risk_service.calculate_risk(app_id)
    app_dict = app.__dict__.copy()
    app_dict.update({
        "current_ecosystem_risk": risk_data["ecosystem_risk"],
        "confidence": risk_data["confidence"],
        "missing_data": risk_data["missing_data"],
        "risk_drivers": risk_data["risk_drivers"]
    })
    return app_dict

# ========================================================
# 4. ALERTS & INVESTIGATIONS
# ========================================================

@app.get("/api/alerts")
def get_alerts(db: Session = Depends(get_db)):
    alerts = db.query(Alert).order_by(Alert.created_at.desc()).all()
    return [{"id": a.id, "severity": a.severity, "type": a.type, "risk": a.risk} for a in alerts]

@app.get("/api/investigations")
def get_investigations(db: Session = Depends(get_db)):
    inv = db.query(Investigation).order_by(Investigation.created_at.desc()).all()
    return [{"id": i.id, "status": i.status, "case_id": i.case_id} for i in inv]

@app.post("/api/investigations")
async def start_investigation(payload: dict = Body(...), db: Session = Depends(get_db)):
    case_id = payload.get("case_id", "")
    assignee = payload.get("assignee", "Senior Analyst")
    
    # Store investigation
    inv = Investigation(
        id=f"INV-{case_id}-{int(datetime.utcnow().timestamp())}",
        case_id=case_id,
        status="OPEN",
        assigned_to=assignee
    )
    db.add(inv)
    db.commit()
    
    # Broadcast event to stream
    await broadcast_event({
        "type": "INVESTIGATION_STARTED",
        "case_id": case_id,
        "assignee": assignee,
        "timestamp": datetime.utcnow().isoformat(),
        "message": f"Investigation started for {case_id.replace('CASE-','')}"
    })
    
    return {"status": "success", "investigation_id": inv.id}

# ========================================================
# 5. FEEDBACK & DASHBOARD
# ========================================================

@app.post("/api/feedback")
def record_feedback(payload: FeedbackSchema):
    return feedback_service.record_outcome(
        payload.case_id.replace("CASE-",""), 
        payload.outcome, 
        payload.notes, 
        payload.analyst
    )

@app.get("/api/dashboard")
def get_dashboard_metrics(db: Session = Depends(get_db)):
    total = db.query(Application).count()
    high_risk = db.query(Application).filter(Application.ecosystem_risk >= 70).count()
    emerging = db.query(Application).filter(Application.novelty >= 0.7).count()
    
    return {
        "total_applications": total,
        "high_ecosystem_risk": high_risk,
        "emerging_ecosystems": emerging,
        "under_investigation": 0,
        "fast_tracked": total - high_risk,
        "simulated_portfolio_impact": {
            "potential_exposure": "₹25 Lakh",
            "protected_exposure": "₹3.2 Lakh"
        }
    }

# ========================================================
# 6. SIMULATION CONTROL (GOLDEN DEMO)
# ========================================================

@app.post("/simulation/step")
async def step_simulation(payload: dict = Body(...)):
    stage = payload.get("stage", "Day 1")
    res = simulation_service.run_deterministic_scenario(stage)
    await broadcast_event(res)
    return res

@app.post("/simulation/reset")
async def reset_simulation():
    res = simulation_service.reset_demo()
    await broadcast_event({"type": "RESET", "stage": "Day 1"})
    return res

# Legacy routing aliases for the frontend
@app.get("/risk/{app_id}")
def get_risk_legacy(app_id: str):
    return risk_service.calculate_risk(app_id)

@app.get("/ecosystems/{ecosystem_id}/graph")
def get_ecosystems_graph_legacy(ecosystem_id: str, stage: str = "Current"):
    timeline_map = {"Day 1": "2024-01-02", "Day 7": "2024-01-08", "Day 14": "2024-01-15", "Day 21": "2024-01-22"}
    timestamp = timeline_map.get(stage)
    return graph_service.get_ecosystem_graph(ecosystem_id, timestamp=timestamp)

@app.get("/ecosystems/{ecosystem_id}/timeline")
def get_ecosystems_timeline_legacy(ecosystem_id: str):
    return evolution_service.get_ecosystem_evolution(ecosystem_id)["timeline"]

@app.get("/metrics")
def get_metrics_legacy(db: Session = Depends(get_db)):
    return get_dashboard_metrics(db)
