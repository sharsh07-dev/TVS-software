import pytest
from fastapi.testclient import TestClient
from main import app
from app.neo4j_driver import neo4j_driver

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_teardown():
    # Setup
    neo4j_driver.wipe_database()
    yield
    # Teardown
    neo4j_driver.wipe_database()

def test_golden_scenario_deterministic():
    """
    Executes the golden deterministic E2E scenario specified in the requirements.
    """
    
    # 1. Reset simulation
    res = client.post("/simulation/reset")
    assert res.status_code == 200

    # 2. Ingest B12 (Day 1)
    res = client.post("/simulation/step", json={"stage": "Day 1"})
    assert res.status_code == 200
    
    # Fetch risk for B12
    risk_res = client.get("/api/risk/APP-B12")
    assert risk_res.status_code == 200
    risk_data = risk_res.json()
    assert risk_data["ecosystem_risk"] < 50  # Risk low on Day 1

    # 3. Ingest B31 (Day 7)
    res = client.post("/simulation/step", json={"stage": "Day 7"})
    
    risk_res = client.get("/api/risk/APP-B31")
    assert risk_res.status_code == 200
    assert risk_res.json()["ecosystem_risk"] > risk_data["ecosystem_risk"] # Risk increases

    # 4. Ingest B44 (Day 14)
    client.post("/simulation/step", json={"stage": "Day 14"})
    risk_res = client.get("/api/risk/APP-B44")
    assert risk_res.json()["ecosystem_risk"] > 50 # Risk increases further

    # 5. Payment Anomaly (Day 21)
    client.post("/simulation/step", json={"stage": "Day 21"})
    
    # Verify Ecosystem reaches high risk
    eco_risk_res = client.get("/api/ecosystems/ECO-APP-B12/risk")
    assert eco_risk_res.json()["ecosystem_risk"] > 70
    
    # 6. Check Novelty
    novelty_res = client.get("/api/ecosystems/ECO-APP-B12/novelty")
    assert novelty_res.status_code == 200
    assert "status" in novelty_res.json()

    # 7. Check Maturity
    maturity_res = client.get("/api/ecosystems/ECO-APP-B12/maturity")
    assert maturity_res.status_code == 200

    # 8. Counterfactual (What if we remove shared device)
    cf_res = client.post("/api/risk/APP-B12/counterfactual", json={"modified_features": {"shared_devices": 0}})
    assert cf_res.status_code == 200
    cf_data = cf_res.json()
    assert cf_data["new_risk"] < cf_data["baseline_risk"]  # Risk should drop

    # 9. Verify Feedback loop
    fb_res = client.post("/api/feedback", json={
        "case_id": "CASE-APP-B12",
        "ecosystem_id": "ECO-APP-B12",
        "outcome": "Confirmed Fraud",
        "analyst": "Test User",
        "notes": "Verified ring"
    })
    assert fb_res.status_code == 200
    assert fb_res.json()["status"] == "success"
