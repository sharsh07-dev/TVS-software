from typing import Dict, Any, List
from app.neo4j_driver import neo4j_driver
from app.services.ml_service import ml_service
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class RiskService:
    def extract_graph_features(self, app_id: str) -> dict:
        """
        Extracts topological features from Neo4j for the given application.
        """
        # Query for degree centrality and specific path counts
        query = """
        MATCH (a:Application {id: $app_id})
        
        // 1. Individual Risk (Mocked base attribute for now, or extracted from Borrower node)
        OPTIONAL MATCH (b:Borrower)-[:SUBMITTED]->(a)
        WITH a, b, coalesce(b.bureau_risk, 30) AS ind_risk
        
        // 2. Degree Centrality (Total connections to the app's ecosystem)
        OPTIONAL MATCH (a)-[*1..3]-(related)
        WITH a, ind_risk, count(DISTINCT related) AS degree_centrality
        
        // 3. Shared Devices Count
        OPTIONAL MATCH (a)-[:FROM_DEVICE]->(dev:Device)<-[:FROM_DEVICE]-(other_app)
        WITH a, ind_risk, degree_centrality, count(DISTINCT other_app) AS shared_devices
        
        // 4. Dealer Velocity (Apps per dealer)
        OPTIONAL MATCH (a)-[:AT_DEALER]->(dlr:Dealer)<-[:AT_DEALER]-(other_app2)
        WITH a, ind_risk, degree_centrality, shared_devices, count(DISTINCT other_app2) AS dealer_velocity
        
        // 5. Guarantor Reuse
        OPTIONAL MATCH (a)-[:GUARANTEED_BY]->(gnt:Guarantor)<-[:GUARANTEED_BY]-(other_app3)
        WITH a, ind_risk, degree_centrality, shared_devices, dealer_velocity, count(DISTINCT other_app3) AS guarantor_reuse
        
        RETURN ind_risk, degree_centrality, shared_devices, dealer_velocity, guarantor_reuse
        """
        
        result = neo4j_driver.execute_read(query, app_id=app_id)
        
        if result and len(result) > 0:
            row = result[0]
            features = {
                "individual_risk": float(row.get("ind_risk", 30)),
                "degree_centrality": float(row.get("degree_centrality", 1)),
                "shared_devices": float(row.get("shared_devices", 0)),
                "dealer_velocity": float(row.get("dealer_velocity", 0)),
                "guarantor_reuse": float(row.get("guarantor_reuse", 0)),
                "time_delta_hours": 24.0 # Simplified temporal feature
            }
        else:
            features = {
                "individual_risk": 30.0,
                "degree_centrality": 1.0,
                "shared_devices": 0.0,
                "dealer_velocity": 0.0,
                "guarantor_reuse": 0.0,
                "time_delta_hours": 24.0
            }
            
        return features

    def determine_maturity(self, features: dict, risk_score: int) -> str:
        degree = features["degree_centrality"]
        if risk_score > 75 and degree > 10:
            return "Stage 3 — Coordinated Pattern"
        elif risk_score > 60 and degree > 5:
            return "Stage 2 — Emerging Cluster"
        elif degree > 3:
            return "Stage 1 — Anomalous Activity"
        return "Stage 0 — Normal"

    def calculate_risk(self, app_id: str) -> Dict[str, Any]:
        logger.info(f"Calculating risk for {app_id}")
        
        # 1. Extract Features from Real Graph
        features = self.extract_graph_features(app_id)
        
        # 2. Run ML Inference (XGBoost + SHAP)
        risk_result = ml_service.predict_risk(features)
        ecosystem_risk = risk_result["risk_score"]
        confidence = risk_result["confidence"]
        drivers = risk_result["drivers"]
        
        # 3. Novelty Detection (Isolation Forest)
        novelty_result = ml_service.detect_novelty(features)
        
        # 4. Maturity Rules
        maturity = self.determine_maturity(features, ecosystem_risk)
        
        ind_risk = int(features["individual_risk"])
        divergence = ecosystem_risk - ind_risk
        
        missing_data = []
        if features["shared_devices"] == 0 and features["dealer_velocity"] == 0:
            missing_data.append("Limited Ecosystem Metadata")
            
        return {
            "application_id": app_id,
            "individual_risk": ind_risk,
            "individual_risk_level": "High" if ind_risk > 60 else "Medium" if ind_risk > 35 else "Low",
            "ecosystem_risk": ecosystem_risk,
            "ecosystem_risk_level": "High" if ecosystem_risk > 70 else "Medium" if ecosystem_risk > 45 else "Low",
            "divergence": divergence,
            "confidence": confidence,
            "missing_data": missing_data,
            "novelty_score": novelty_result["score"],
            "novelty_status": novelty_result["status"],
            "maturity_state": maturity,
            "model_version": risk_result["model_version"],
            "prediction_timestamp": datetime.utcnow().isoformat(),
            "risk_drivers": drivers
        }

risk_service = RiskService()
