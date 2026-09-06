from app.database import get_db, Feedback, AuditLog, Application, Ecosystem
from app.neo4j_driver import neo4j_driver
from app.services.entity_resolution_service import entity_resolution_service
from datetime import datetime
import json
import logging

logger = logging.getLogger(__name__)

class FeedbackService:
    def record_outcome(self, app_id: str, outcome_state: str, notes: str, recorded_by: str = "Arjun Mehta"):
        db = next(get_db())
        try:
            timestamp = datetime.utcnow()
            feedback = Feedback(
                id=f"FBE-{app_id}-{int(timestamp.timestamp())}",
                case_id=f"CASE-{app_id}",
                ecosystem_id="ECO-1024", # Dummy or query from app
                outcome=outcome_state,
                analyst=recorded_by,
                notes=notes
            )
            db.add(feedback)
            
            audit = AuditLog(
                id=f"AUD-{app_id}-{int(timestamp.timestamp())}",
                user=recorded_by,
                action="RECORD_OUTCOME",
                case_id=f"CASE-{app_id}",
                reason=outcome_state
            )
            db.add(audit)
            
            db.commit()
            return {"status": "success", "application_id": app_id, "outcome_state": outcome_state}
        except Exception as e:
            db.rollback()
            logger.error(f"Error saving feedback: {e}")
            return {"status": "error", "message": str(e)}
        finally:
            db.close()

    def get_feedback_events(self):
        db = next(get_db())
        try:
            events = db.query(Feedback).order_by(Feedback.timestamp.desc()).all()
            return [{"id": e.id, "outcome": e.outcome, "timestamp": e.timestamp.isoformat()} for e in events]
        finally:
            db.close()

class SimulationService:
    def __init__(self):
        self.current_stage = "Day 21"

    def set_stage(self, stage: str):
        self.current_stage = stage
        
        # In a full simulation, this would sequentially ingest the apps for the target stage.
        # Here we just mock the payload for the websocket broadcast since real ingestion happens via POST /applications
        event = {
            "type": "SIMULATION_STEP",
            "stage": stage,
            "timestamp": datetime.utcnow().isoformat(),
            "message": f"Simulation stepped to {stage}"
        }
        return event

    def reset_demo(self):
        self.current_stage = "Day 1"
        # Wipe neo4j graph
        neo4j_driver.wipe_database()
        
        # Wipe relational DB (using sqlalchemy if needed, but for now we just return state)
        
        return {"status": "reset", "stage": "Day 1"}

    def run_deterministic_scenario(self, stage: str):
        """
        Runs the Golden End-to-End Demo Scenario.
        """
        db = next(get_db())
        
        if stage == "Day 1":
            app = {
                "id": "APP-B12",
                "applicant_name": "Ramesh Singh",
                "pan": "B12PAN0001",
                "phone": "+91 9999900012",
                "device_id": "DEV-X",
                "dealer": "Dealer D17",
                "guarantor": "GNT-B12",
                "applied_amount": "50000",
                "submitted_time": "2024-01-01T10:00:00Z"
            }
            entity_resolution_service.resolve_application_entities(app)
            
        elif stage == "Day 7":
            app = {
                "id": "APP-B31",
                "applicant_name": "Suresh Kumar",
                "pan": "B31PAN0002",
                "phone": "+91 9999900031",
                "device_id": "DEV-X",
                "dealer": "Dealer D17",
                "guarantor": "GNT-B31",
                "applied_amount": "60000",
                "submitted_time": "2024-01-07T12:00:00Z"
            }
            entity_resolution_service.resolve_application_entities(app)
            
        elif stage == "Day 14":
            app = {
                "id": "APP-B44",
                "applicant_name": "Amit Sharma",
                "pan": "B44PAN0003",
                "phone": "+91 9999900044",
                "device_id": "DEV-X",
                "dealer": "Dealer D99",
                "guarantor": "GNT-G8",
                "applied_amount": "55000",
                "submitted_time": "2024-01-14T09:00:00Z"
            }
            entity_resolution_service.resolve_application_entities(app)
            
        elif stage == "Day 21":
            # Add payment anomaly event via neo4j query directly
            query = """
            MATCH (a:Application {id: 'APP-B12'})
            MERGE (a)-[r:PAYMENT_EVENT {status: 'ANOMALY', timestamp: '2024-01-21T10:00:00Z'}]->(p:Payment {id: 'PAY-1'})
            """
            neo4j_driver.execute_write(query)
            
        db.close()
        self.current_stage = stage
        return self.set_stage(stage)

feedback_service = FeedbackService()
simulation_service = SimulationService()
