import xgboost as xgb
import shap
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import logging

logger = logging.getLogger(__name__)

class MLService:
    def __init__(self):
        # In a real production system, these models would be loaded from a registry (e.g., MLflow, S3)
        # For the demo, we initialize dummy models that we "train" on synthetic data on startup.
        self.risk_model = xgb.XGBClassifier(n_estimators=100, max_depth=4, learning_rate=0.1, random_state=42)
        self.explainer = None
        self.novelty_model = IsolationForest(contamination=0.05, random_state=42)
        self.is_trained = False
        self.model_version = "EERIS-RISK-v2.0"
        self._train_dummy_models()

    def _train_dummy_models(self):
        """
        Train on some synthetic data representing topological and entity features
        Features: [individual_risk, degree_centrality, shared_devices, dealer_velocity, guarantor_reuse, time_delta_hours]
        """
        try:
            # Synthetic normal data (low risk)
            X_normal = np.random.normal(loc=[30, 1, 0, 1, 0, 120], scale=[10, 0.5, 0, 0.5, 0, 40], size=(500, 6))
            y_normal = np.zeros(500)
            
            # Synthetic fraud data (high risk)
            X_fraud = np.random.normal(loc=[60, 5, 3, 4, 2, 12], scale=[15, 2, 1, 1, 1, 5], size=(100, 6))
            y_fraud = np.ones(100)
            
            X = np.vstack([X_normal, X_fraud])
            y = np.hstack([y_normal, y_fraud])
            
            self.feature_names = ['individual_risk', 'degree_centrality', 'shared_devices', 'dealer_velocity', 'guarantor_reuse', 'time_delta_hours']
            
            df = pd.DataFrame(X, columns=self.feature_names)
            
            # Train XGBoost
            self.risk_model.fit(df, y)
            
            # Initialize SHAP explainer
            self.explainer = shap.TreeExplainer(self.risk_model)
            
            # Train Novelty (Isolation Forest) on normal data only
            self.novelty_model.fit(X_normal)
            
            self.is_trained = True
            logger.info("ML Models initialized and trained.")
        except Exception as e:
            logger.error(f"Failed to train ML models: {e}")

    def predict_risk(self, features: dict):
        if not self.is_trained:
            return {"risk_score": 50, "confidence": 0.5, "drivers": []}
            
        df = pd.DataFrame([features])
        df = df[self.feature_names] # Ensure correct order
        
        # Predict probability
        prob = self.risk_model.predict_proba(df)[0][1]
        risk_score = int(prob * 100)
        
        # SHAP attribution
        shap_values = self.explainer.shap_values(df)
        
        # In binary classification for XGBoost, shap_values might be a list (for each class) or array.
        # TreeExplainer on XGBClassifier typically returns a matrix for the positive class or log-odds.
        if isinstance(shap_values, list):
            contributions = shap_values[1][0]
        else:
            contributions = shap_values[0]
            
        drivers = []
        for i, col in enumerate(self.feature_names):
            contribution = float(contributions[i])
            val = float(df.iloc[0, i])
            # Normalize contribution to a rough percentage of the total absolute sum
            total_abs_contrib = np.sum(np.abs(contributions))
            normalized_contrib = (abs(contribution) / total_abs_contrib * 100) if total_abs_contrib > 0 else 0
            
            direction = "increases" if contribution > 0 else "decreases"
            
            if abs(contribution) > 0.1: # Only include significant drivers
                drivers.append({
                    "feature": col.replace("_", " ").title(),
                    "raw_value": val,
                    "normalized_value": val,
                    "contribution": normalized_contrib,
                    "direction": direction,
                    "evidence": f"Model detected {col.replace('_', ' ')} value of {val:.1f}",
                    "supporting_entities": []
                })
                
        # Sort drivers by contribution
        drivers = sorted(drivers, key=lambda x: x["contribution"], reverse=True)
        
        # Compute confidence based on tree variance or distance from training distribution
        # For simplicity, base it on the max probability distance from decision boundary
        confidence = float(0.5 + abs(prob - 0.5))
        
        return {
            "risk_score": risk_score,
            "confidence": confidence,
            "drivers": drivers[:4], # top 4 drivers
            "model_version": self.model_version
        }

    def detect_novelty(self, features: dict):
        if not self.is_trained:
            return {"score": 0.5, "status": "Unknown"}
            
        df = pd.DataFrame([features])
        df = df[self.feature_names]
        
        score = self.novelty_model.decision_function(df)[0]
        # Normalize score to 0-1 range (roughly)
        novelty_score = float(1.0 - (1.0 / (1.0 + np.exp(-score)))) 
        
        if novelty_score > 0.7:
            status = "Emerging"
        elif novelty_score < 0.3:
            status = "Unknown"
        else:
            status = "Known"
            
        return {
            "score": novelty_score,
            "status": status
        }

ml_service = MLService()
