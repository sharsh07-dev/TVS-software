import sqlite3
import json
import time
from app.database import get_db

class FeedbackService:
    def record_outcome(self, app_id: str, outcome_state: str, notes: str, recorded_by: str = "Arjun Mehta"):
        conn = get_db()
        cursor = conn.cursor()
        timestamp_ms = int(time.time() * 1000)
        cursor.execute("""
        INSERT INTO outcomes (id, application_id, outcome_state, notes, recorded_by)
        VALUES (?, ?, ?, ?, ?);
        """, (f"OUT-{app_id}-{timestamp_ms}", app_id, outcome_state, notes, recorded_by))

        cursor.execute("""
        INSERT INTO feedback_events (id, event_type, ecosystem_id, application_id, outcome_state, model_weight_adjustment)
        VALUES (?, 'OUTCOME_RECORDED', 'ECO-1024', ?, ?, 'Pattern feedback stored for model re-weighting');
        """, (f"FBE-{app_id}-{timestamp_ms}", app_id, outcome_state))

        conn.commit()
        conn.close()
        return {"status": "success", "application_id": app_id, "outcome_state": outcome_state}

    def get_feedback_events(self):
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM feedback_events ORDER BY timestamp DESC;")
        rows = cursor.fetchall()
        conn.close()
        return [dict(r) for r in rows]

class SimulationService:
    def __init__(self):
        self.current_stage = "Day 21"
        self.listeners = []

    def set_stage(self, stage: str):
        self.current_stage = stage
        event = {
            "type": "SIMULATION_STEP",
            "stage": stage,
            "timestamp": "10:01:41",
            "message": f"Simulation stepped to {stage}"
        }
        return event

    def reset_demo(self):
        self.current_stage = "Day 1"
        return {"status": "reset", "stage": "Day 1"}

feedback_service = FeedbackService()
simulation_service = SimulationService()
