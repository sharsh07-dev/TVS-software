from typing import Dict, Any, List
from app.database import get_db

class EvolutionService:
    def get_ecosystem_evolution(self, ecosystem_id: str = "ECO-1024") -> Dict[str, Any]:
        """
        Ecosystem Evolution Timeline & Maturity Calculation
        Stages:
        - Day 1: Stage 0 (Isolated / Genesis) -> 1 borrower, 1 device, 1 dealer -> Risk: 18
        - Day 7: Stage 1 (Initial Linkage) -> 2 borrowers, same device, same dealer -> Risk: 37
        - Day 14: Stage 2 (Velocity Acceleration) -> 4 borrowers, 2 devices, repeated guarantor -> Risk: 64
        - Day 21: Stage 3 (Coordinated Ring) -> Payment anomaly, high velocity -> Risk: 84
        """
        timeline_stages = [
            {
                "day": "Day 1",
                "stage_name": "Stage 0 — Genesis",
                "borrowers_count": 1,
                "devices_count": 1,
                "dealers_count": 1,
                "risk_score": 18,
                "maturity": "Stage 0",
                "new_relationships": ["Application APP-78287 submitted via Apex Auto"],
                "new_evidence": "First-time applicant on DEV-9810"
            },
            {
                "day": "Day 7",
                "stage_name": "Stage 1 — Initial Linkage",
                "borrowers_count": 2,
                "devices_count": 1,
                "dealers_count": 1,
                "risk_score": 37,
                "maturity": "Stage 1",
                "new_relationships": ["Second borrower K. Rao linked via DEV-9810"],
                "new_evidence": "Shared hardware signature within 7 days"
            },
            {
                "day": "Day 14",
                "stage_name": "Stage 2 — Velocity Acceleration",
                "borrowers_count": 4,
                "devices_count": 2,
                "dealers_count": 1,
                "risk_score": 64,
                "maturity": "Stage 2",
                "new_relationships": ["Repeated Guarantor GNT-8890 co-signed multiple loans"],
                "new_evidence": "Dealer Apex Auto velocity spike 4.2x above baseline"
            },
            {
                "day": "Day 21",
                "stage_name": "Stage 3 — Coordinated Ring",
                "borrowers_count": 6,
                "devices_count": 3,
                "dealers_count": 1,
                "risk_score": 84,
                "maturity": "Stage 3",
                "new_relationships": ["UPI settlement VPA pay-apex@icici anomaly detected"],
                "new_evidence": "Synchronized payment bounce across connected applications"
            }
        ]

        trajectory_projection = [
            {"day": "Day 1", "historical": 18, "projected_lower": 15, "projected_upper": 22},
            {"day": "Day 7", "historical": 37, "projected_lower": 30, "projected_upper": 45},
            {"day": "Day 14", "historical": 64, "projected_lower": 55, "projected_upper": 72},
            {"day": "Day 21", "historical": 84, "projected_lower": 78, "projected_upper": 92},
            {"day": "Day 30 (Projected)", "historical": None, "projected_lower": 88, "projected_upper": 98, "label": "Prototype Projection"}
        ]

        return {
            "ecosystem_id": ecosystem_id,
            "current_stage": "Stage 3 — Coordinated Ring",
            "growth_velocity": "+34%",
            "timeline": timeline_stages,
            "trajectory": trajectory_projection
        }

evolution_service = EvolutionService()
