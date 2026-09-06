import json
from app.database import get_db

class RiskService:
    def calculate_risk(self, app_id: str):
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM applications WHERE LOWER(id) = LOWER(?);", (app_id,))
        row = cursor.fetchone()
        conn.close()

        if not row:
            return {"individual_risk": 31, "ecosystem_risk": 84, "divergence": 53, "confidence": 0.87}

        app = dict(row)
        divergence = app["ecosystem_risk"] - app["individual_risk"]
        confidence = round(0.75 + (app["novelty"] * 0.2), 2)
        return {
            "individual_risk": app["individual_risk"],
            "ecosystem_risk": app["ecosystem_risk"],
            "divergence": divergence,
            "confidence": confidence,
            "novelty": app["novelty"],
            "maturity_state": app["maturity_state"]
        }

class ActionService:
    def route_decision(self, app_data: dict):
        eco_risk = app_data.get("ecosystem_risk", 30)
        ind_risk = app_data.get("individual_risk", 20)
        novelty = app_data.get("novelty", 0.3)

        if eco_risk >= 70 or (eco_risk - ind_risk) >= 40:
            return {
                "decision_path": "PATH_C_INVESTIGATION_REQUIRED",
                "action_type": "INVESTIGATION_REQUIRED",
                "priority": "HIGH",
                "target_entities": [f"Dealer {app_data.get('dealer', 'Apex Auto')}", f"Device {app_data.get('device_id', 'DEV-9810')}", f"Guarantor {app_data.get('guarantor', 'GNT-8890')}"],
                "reason": f"High ecosystem risk ({eco_risk}) with coordinated relationship pattern (+{eco_risk - ind_risk} divergence)",
                "customer_impact": "Application routed to risk investigation queue before further credit exposure",
                "status": "Hold / Investigation Required"
            }
        elif eco_risk >= 45:
            return {
                "decision_path": "PATH_B_TARGETED_VERIFICATION",
                "action_type": "TARGETED_VERIFICATION",
                "priority": "MEDIUM",
                "target_entities": [f"Dealer {app_data.get('dealer', 'Apex Auto')}", f"Device {app_data.get('device_id', 'DEV-9810')}"],
                "reason": f"Ecosystem risk ({eco_risk}) elevated due to merchant velocity & device signatures",
                "customer_impact": "Targeted verification requested for high-value entities only",
                "status": "Verification Required"
            }
        else:
            return {
                "decision_path": "PATH_A_FAST_TRACK",
                "action_type": "FAST_TRACK",
                "priority": "LOW",
                "target_entities": [],
                "reason": "Low risk + stable ecosystem network",
                "customer_impact": "Reduced verification friction, fast approval rail",
                "status": "Proceed"
            }

risk_service = RiskService()
action_service = ActionService()
