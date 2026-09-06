from app.services.risk_service import risk_service
from app.services.ml_service import ml_service
import logging

logger = logging.getLogger(__name__)

class CounterfactualService:
    def evaluate_scenario(self, app_id: str, modified_features: dict) -> dict:
        """
        Evaluate what the risk would be if certain features were modified or absent.
        E.g., remove shared device links.
        """
        # Get actual base features from graph
        base_features = risk_service.extract_graph_features(app_id)
        
        # Calculate baseline risk
        base_result = ml_service.predict_risk(base_features)
        baseline_risk = base_result["risk_score"]
        
        # Apply scenario modifications
        new_features = base_features.copy()
        scenario_description = []
        for k, v in modified_features.items():
            if k in new_features:
                new_features[k] = v
                scenario_description.append(f"Set {k} to {v}")
                
        scenario_str = ", ".join(scenario_description)
        
        # Rerun ML inference on modified features
        new_result = ml_service.predict_risk(new_features)
        new_risk = new_result["risk_score"]
        
        risk_delta = new_risk - baseline_risk
        
        return {
            "application_id": app_id,
            "scenario": scenario_str,
            "baseline_risk": baseline_risk,
            "new_risk": new_risk,
            "risk_delta": risk_delta,
            "confidence": new_result["confidence"],
            "modified_features": new_features
        }

counterfactual_service = CounterfactualService()
