import pytest
from app.services.ml_service import ml_service
from app.services.counterfactual_service import counterfactual_service

def test_ml_pipeline_initialization():
    """
    Verifies that the ML model is initialized and trained on startup.
    """
    assert ml_service.is_trained == True
    assert ml_service.explainer is not None

def test_risk_prediction_logic():
    """
    Verifies that risk prediction outputs expected keys and SHAP drivers.
    """
    features = {
        "individual_risk": 50.0,
        "degree_centrality": 5.0,
        "shared_devices": 3.0,
        "dealer_velocity": 4.0,
        "guarantor_reuse": 2.0,
        "time_delta_hours": 12.0
    }
    
    result = ml_service.predict_risk(features)
    
    assert "risk_score" in result
    assert "confidence" in result
    assert "drivers" in result
    assert len(result["drivers"]) > 0
    assert result["drivers"][0]["contribution"] > 0

def test_novelty_detection():
    """
    Verifies open-set detection works.
    """
    features_normal = {
        "individual_risk": 20.0,
        "degree_centrality": 1.0,
        "shared_devices": 0.0,
        "dealer_velocity": 1.0,
        "guarantor_reuse": 0.0,
        "time_delta_hours": 120.0
    }
    result_normal = ml_service.detect_novelty(features_normal)
    
    features_anomaly = {
        "individual_risk": 99.0,
        "degree_centrality": 25.0,
        "shared_devices": 15.0,
        "dealer_velocity": 40.0,
        "guarantor_reuse": 12.0,
        "time_delta_hours": 0.5
    }
    result_anomaly = ml_service.detect_novelty(features_anomaly)
    
    # Anomaly should have a higher novelty score
    assert result_anomaly["score"] > result_normal["score"]
