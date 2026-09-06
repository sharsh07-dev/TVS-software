from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
import json
import asyncio
import random
from typing import List, Dict, Any, Optional

from app.database import init_db, get_db
from app.services.data_service import data_service
from app.services.entity_resolution_service import entity_resolution_service
from app.services.graph_service import graph_service
from app.services.risk_service import risk_service, propagation_service
from app.services.prototype_service import prototype_service, open_set_service
from app.services.evolution_service import evolution_service
from app.services.action_service import action_service
from app.services.investigation_service import intervention_service, investigation_service
from app.services.simulation_service import feedback_service, simulation_service
from app.services.llm_service import llm_service
from pydantic import BaseModel

app = FastAPI(
    title="EERIS Intelligence System API",
    description="Evolving Ecosystem Risk Intelligence System for Lending API",
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

# 1. Applications APIs
@app.get("/applications")
def get_applications(search: str = "", risk_filter: str = "All Profiles", status_filter: str = "All Stages", page: int = 1, page_size: int = 20):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM applications ORDER BY created_at DESC;")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()

    query = search.strip().lower()
    filtered = []
    for app in rows:
        matches_search = not query or (
            query in app["id"].lower() or
            query in app["applicant_name"].lower() or
            query in app["pan"].lower() or
            query in app["phone"].lower() or
            query in app["device_id"].lower() or
            query in app["dealer"].lower() or
            query in app["ecosystem_id"].lower()
        )
        matches_risk = True
        if risk_filter in ["High Risk Divergence", "High Risk"]:
            matches_risk = app["ecosystem_risk"] >= 70
        elif risk_filter == "Medium Risk":
            matches_risk = 45 <= app["ecosystem_risk"] < 70
        elif risk_filter in ["Low Risk Base", "Low Risk"]:
            matches_risk = app["ecosystem_risk"] < 45

        if matches_search and matches_risk:
            filtered.append(app)

    total = len(filtered)
    total_pages = max(1, (total + page_size - 1) // page_size)
    start_idx = (page - 1) * page_size
    paginated = filtered[start_idx:start_idx + page_size]

    return {
        "applications": paginated,
        "total": total,
        "page": page,
        "total_pages": total_pages
    }

@app.post("/applications")
async def create_application(payload: dict = Body(...)):
    conn = get_db()
    cursor = conn.cursor()
    
    app_id = payload.get("id", f"APP-{78287 + random.randint(100, 999)}")
    applicant_name = payload.get("applicant_name", "New Applicant")
    pan = payload.get("pan", "XYZPS1092K")
    phone = payload.get("phone", "+91 98765 00000")
    device_id = payload.get("device_id", "DEV-9810")
    dealer = payload.get("dealer", "Apex Auto")
    guarantor = payload.get("guarantor", "GNT-8890")
    location = payload.get("location", "North Zone • Delhi NCR")
    applied_amount = payload.get("applied_amount", "₹2,50,000")

    # Entity resolution & risk calculation
    er_result = entity_resolution_service.resolve_application_entities(payload)
    ind_risk = payload.get("individual_risk", 32)
    eco_risk = payload.get("ecosystem_risk", 84) if "Apex Auto" in dealer else 28

    routing = action_service.route_decision({
        "id": app_id, "dealer": dealer, "device_id": device_id,
        "individual_risk": ind_risk, "ecosystem_risk": eco_risk, "novelty": 0.85
    })

    cursor.execute("""
    INSERT OR REPLACE INTO applications (
        id, applicant_name, pan, phone, device_id, dealer, guarantor, location, status,
        ecosystem_pattern, individual_risk, individual_risk_level, ecosystem_risk, ecosystem_risk_level,
        novelty, ecosystem_id, applied_amount, submitted_time, case_id, rail, maturity_state,
        coordinated_pattern, decision_path, decision_reason, target_entities
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, (
        app_id, applicant_name, pan, phone, device_id, dealer, guarantor, location,
        routing["status"], "Emerging Ecosystem Risk" if eco_risk > 70 else "Normal Cluster",
        ind_risk, "Low" if ind_risk < 40 else "Medium",
        eco_risk, "High" if eco_risk >= 70 else "Low", 0.85, er_result["resolved_clusters"][0],
        applied_amount, "Just now", f"CASE-{app_id}", "Auto Loan Underwriting Rail",
        "Stage 3" if eco_risk > 70 else "Stage 1", "Coordinated Pattern",
        routing["decision_path"], routing["reason"], json.dumps(routing["target_entities"])
    ))
    conn.commit()
    conn.close()

    event = {
        "type": "APPLICATION_CREATED",
        "application_id": app_id,
        "applicant_name": applicant_name,
        "ecosystem_risk": eco_risk,
        "decision_path": routing["decision_path"],
        "timestamp": "Just now"
    }
    await broadcast_event(event)

    return {"status": "success", "application_id": app_id, "routing": routing}

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    provider: str

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    messages_dict = [{"role": msg.role, "content": msg.content} for msg in request.messages]
    response = await llm_service.get_chat_response(request.provider, messages_dict)
    return response

@app.get("/applications/{app_id}")
def get_application(app_id: str):
    app = data_service.get_application(app_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    routing = action_service.route_decision(app)
    app["decision_routing"] = routing
    return app

# 2. Ecosystems APIs
@app.get("/ecosystems")
def get_ecosystems():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM ecosystems;")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

@app.get("/ecosystems/{ecosystem_id}")
def get_ecosystem(ecosystem_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM ecosystems WHERE LOWER(id) = LOWER(?);", (ecosystem_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Ecosystem not found")
    return dict(row)

@app.get("/ecosystems/{ecosystem_id}/graph")
def get_ecosystem_graph(ecosystem_id: str, stage: str = "Current"):
    return graph_service.get_ecosystem_graph(ecosystem_id, stage)

@app.get("/ecosystems/{ecosystem_id}/timeline")
def get_ecosystem_timeline(ecosystem_id: str):
    evolution = evolution_service.get_ecosystem_evolution(ecosystem_id)
    return evolution["timeline"]

@app.get("/ecosystems/{ecosystem_id}/evolution")
def get_ecosystem_evolution(ecosystem_id: str):
    return evolution_service.get_ecosystem_evolution(ecosystem_id)

# 3. Risk Engine APIs
@app.get("/risk/{app_id}")
def get_risk(app_id: str):
    return risk_service.calculate_risk(app_id)

@app.post("/risk/score")
def score_risk(payload: dict = Body(...)):
    app_id = payload.get("application_id", "APP-78287")
    return risk_service.calculate_risk(app_id)

# 4. Alerts / Early Warning APIs
@app.get("/alerts")
def get_alerts():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM alerts ORDER BY created_at DESC;")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

@app.get("/alerts/{alert_id}")
def get_alert(alert_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM alerts WHERE id = ?;", (alert_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Alert not found")
    return dict(row)

@app.post("/alerts/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE alerts SET is_acknowledged = 1 WHERE id = ?;", (alert_id,))
    conn.commit()
    conn.close()
    return {"status": "success", "alert_id": alert_id}

# 5. Interventions APIs
@app.get("/interventions")
def get_interventions():
    return intervention_service.get_all_interventions()

@app.post("/interventions")
def create_intervention(payload: dict = Body(...)):
    app_id = payload.get("application_id", "APP-78287")
    action_type = payload.get("action_type", "TARGETED_VERIFICATION")
    return intervention_service.simulate_intervention(app_id, action_type)

@app.post("/interventions/{app_id}/simulate")
def simulate_intervention(app_id: str, payload: dict = Body(default={})):
    action_type = payload.get("action_type", "Verify Dealer Apex Auto + Device DEV-9810")
    return intervention_service.simulate_intervention(app_id, action_type)

# 6. Investigations APIs
@app.get("/investigations")
def get_investigations():
    return investigation_service.get_investigations()

@app.post("/investigations")
def create_investigation(payload: dict = Body(...)):
    app_id = payload.get("application_id", "APP-78287")
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM applications WHERE LOWER(id) = LOWER(?);", (app_id,))
    app_row = cursor.fetchone()
    if app_row:
        app = dict(app_row)
        inv_id = f"INV-{app_id}"
        cursor.execute("""
        INSERT OR REPLACE INTO investigations (id, case_id, application_id, borrower_name, ecosystem_id, individual_risk, ecosystem_risk, divergence, status, priority, assignee)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (inv_id, f"CASE-{app_id}", app_id, app["applicant_name"], app["ecosystem_id"], app["individual_risk"], app["ecosystem_risk"], app["ecosystem_risk"] - app["individual_risk"], "UNDER_REVIEW", "High", "Arjun Mehta"))
        conn.commit()
    conn.close()
    return {"status": "success", "application_id": app_id}

@app.patch("/investigations/{investigation_id}")
def update_investigation(investigation_id: str, payload: dict = Body(...)):
    status = payload.get("status", "UNDER_REVIEW")
    hold_reason = payload.get("hold_reason")
    return investigation_service.update_status(investigation_id, status, hold_reason)

@app.post("/investigations/{investigation_id}/verify")
def verify_investigation(investigation_id: str):
    return investigation_service.update_status(investigation_id, "VERIFIED_VALID")

@app.post("/investigations/{investigation_id}/resolve")
def resolve_investigation(investigation_id: str):
    return investigation_service.update_status(investigation_id, "RESOLVED_CONFIRMED_RISK")

@app.post("/investigations/{investigation_id}/false-positive")
def mark_false_positive(investigation_id: str, payload: dict = Body(default={})):
    eco_id = payload.get("ecosystem_id", "ECO-00173")
    return investigation_service.mark_false_positive(investigation_id, eco_id)

# 7. Feedback & Learning APIs
@app.post("/feedback/outcome")
def record_outcome(payload: dict = Body(...)):
    app_id = payload.get("application_id", "APP-78287")
    state = payload.get("outcome_state", "Confirmed Fraud")
    notes = payload.get("notes", "Analyst confirmed shared device ring.")
    return feedback_service.record_outcome(app_id, state, notes)

@app.get("/feedback/events")
def get_feedback_events():
    return feedback_service.get_feedback_events()

# 8. Simulation & Golden Demo Controller
@app.post("/simulation/step")
async def step_simulation(payload: dict = Body(...)):
    stage = payload.get("stage", "Day 1")
    res = simulation_service.set_stage(stage)
    await broadcast_event(res)
    return res

@app.post("/simulation/run")
async def run_simulation():
    res = simulation_service.set_stage("Day 21")
    await broadcast_event({"type": "SIMULATION_RUN", "stage": "Day 21"})
    return res

@app.post("/simulation/event")
async def trigger_sim_event(payload: dict = Body(...)):
    await broadcast_event(payload)
    return {"status": "event_broadcasted", "payload": payload}

@app.post("/simulation/reset")
async def reset_simulation():
    res = simulation_service.reset_demo()
    await broadcast_event({"type": "RESET", "stage": "Day 1"})
    return res

# 9. Additional Business APIs (Dealers, Metrics)
@app.get("/dealers")
def get_dealers():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM dealers;")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    if not rows:
        return [
            {"id": "DLR-APEX_AUTO", "name": "Apex Auto", "pos_id": "POS-4021", "velocity_spike_multiplier": 4.2, "risk_level": "High", "connected_applications_count": 18},
            {"id": "DLR-ZENITH_MOTORS", "name": "Zenith Motors", "pos_id": "POS-1092", "velocity_spike_multiplier": 1.1, "risk_level": "Low", "connected_applications_count": 8},
            {"id": "DLR-VILLAGE_AGRO", "name": "Village Agro Motors", "pos_id": "POS-0017", "velocity_spike_multiplier": 1.0, "risk_level": "Low", "connected_applications_count": 12}
        ]
    return rows

@app.get("/metrics")
def get_metrics():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM applications;")
    total = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM applications WHERE ecosystem_risk >= 70;")
    high_risk = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM applications WHERE ecosystem_pattern LIKE '%Emerging%';")
    emerging = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM applications WHERE status LIKE '%Verification%' OR status LIKE '%Review%' OR status LIKE '%HOLD%';")
    under_investigation = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM applications WHERE decision_path LIKE '%FAST_TRACK%';")
    fast_tracked = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM applications WHERE ecosystem_risk < 45;")
    low = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM applications WHERE ecosystem_risk >= 45 AND ecosystem_risk < 70;")
    med = cursor.fetchone()[0]

    conn.close()

    return {
        "total_applications": total,
        "high_ecosystem_risk": high_risk,
        "emerging_ecosystems": emerging,
        "under_investigation": under_investigation,
        "fast_tracked": fast_tracked,
        "risk_distribution": {"low": low, "medium": med, "high": high_risk},
        "simulated_portfolio_impact": {
            "potential_exposure": "₹25 Lakh",
            "estimated_preventable_exposure": "₹8 Lakh",
            "active_interventions": 12,
            "protected_exposure": "₹3.2 Lakh",
            "disclaimer": "DEMO MODEL OUTPUT — SIMULATED IMPACT"
        }
    }
