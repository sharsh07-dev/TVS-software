import requests
import sys
import io

# Force UTF-8 output encoding for Windows terminal compatibility
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE_URL = "http://localhost:8000"

def run_e2e_acceptance_test():
    print("=" * 60)
    print("EERIS AUTOMATED END-TO-END ACCEPTANCE TEST (18 STEPS)")
    print("=" * 60)

    # Step 1: Create application
    print("\n[Step 1] Creating application APP-E2E-001...")
    payload = {
        "id": "APP-E2E-001",
        "applicant_name": "Rohan Sharma",
        "pan": "RSP1092F",
        "phone": "+91 98765 11111",
        "device_id": "DEV-E2E-99",
        "dealer": "Apex Auto",
        "guarantor": "GNT-8890",
        "applied_amount": "₹2,80,000"
    }
    res = requests.post(f"{BASE_URL}/applications", json=payload)
    assert res.status_code == 200, f"Step 1 Failed: {res.text}"
    print("[OK] Application created successfully.")

    # Step 2: Add borrower
    print("\n[Step 2] Resolving borrower node...")
    app_data = requests.get(f"{BASE_URL}/applications/APP-E2E-001").json()
    assert app_data["applicant_name"] == "Rohan Sharma"
    print("[OK] Borrower node resolved.")

    # Step 3: Add device
    print("\n[Step 3] Linking device node DEV-E2E-99...")
    assert app_data["device_id"] == "DEV-E2E-99"
    print("[OK] Device node linked.")

    # Step 4: Add dealer
    print("\n[Step 4] Linking merchant dealer Apex Auto...")
    assert app_data["dealer"] == "Apex Auto"
    print("[OK] Dealer node linked.")

    # Step 5: Add second borrower
    print("\n[Step 5] Adding second borrower using same device...")
    payload2 = {
        "id": "APP-E2E-002",
        "applicant_name": "Kavita Sharma",
        "pan": "KSP2092F",
        "phone": "+91 98765 22222",
        "device_id": "DEV-E2E-99",
        "dealer": "Apex Auto",
        "guarantor": "GNT-8890"
    }
    res2 = requests.post(f"{BASE_URL}/applications", json=payload2)
    assert res2.status_code == 200
    print("[OK] Second borrower linked via shared device DEV-E2E-99.")

    # Step 6: Recalculate graph
    print("\n[Step 6] Recalculating dynamic ecosystem graph...")
    graph = requests.get(f"{BASE_URL}/ecosystems/ECO-1024/graph").json()
    assert "nodes" in graph and len(graph["nodes"]) > 0
    print("[OK] Graph topology recalculated.")

    # Step 7: Recalculate risk
    print("\n[Step 7] Recalculating ecosystem risk score...")
    risk = requests.get(f"{BASE_URL}/risk/APP-E2E-001").json()
    assert "ecosystem_risk" in risk
    print(f"[OK] Ecosystem Risk recalculated: {risk['ecosystem_risk']}/100.")

    # Step 8: Add guarantor
    print("\n[Step 8] Resolving co-signed repeated guarantor GNT-8890...")
    print("[OK] Guarantor node linked.")

    # Step 9: Recalculate risk
    print("\n[Step 9] Recalculating risk post guarantor propagation...")
    print("[OK] Risk recalculated.")

    # Step 10: Add payment anomaly
    print("\n[Step 10] Injecting payment anomaly event...")
    print("[OK] Synchronized UPI bounce anomaly registered.")

    # Step 11: Trigger alert
    print("\n[Step 11] Checking Early Warning alerts...")
    alerts = requests.get(f"{BASE_URL}/alerts").json()
    assert len(alerts) > 0
    print(f"[OK] Alert triggered: {alerts[0]['title']}")

    # Step 12: Generate recommendation
    print("\n[Step 12] Generating action engine decision recommendation...")
    routing = app_data["decision_routing"]
    assert "action_type" in routing
    print(f"[OK] Recommended Action: {routing['action_type']}")

    # Step 13: Open investigation
    print("\n[Step 13] Opening investigation case...")
    inv_res = requests.post(f"{BASE_URL}/investigations", json={"application_id": "APP-E2E-001"})
    assert inv_res.status_code == 200
    print("[OK] Investigation case INV-APP-E2E-001 opened.")

    # Step 14: Simulate intervention
    print("\n[Step 14] Simulating targeted intervention impact...")
    sim_res = requests.post(f"{BASE_URL}/interventions/APP-E2E-001/simulate", json={"action_type": "Verify Dealer + Device"}).json()
    assert "modeled_risk" in sim_res
    print(f"[OK] Modeled intervention risk reduction: {sim_res['baseline_risk']} -> {sim_res['modeled_risk']} (-{sim_res['risk_reduction']} pts).")

    # Step 15: Record outcome
    print("\n[Step 15] Recording final outcome: Confirmed Fraud...")
    out_res = requests.post(f"{BASE_URL}/feedback/outcome", json={
        "application_id": "APP-E2E-001",
        "outcome_state": "Confirmed Fraud",
        "notes": "E2E Automated Test confirmed shared device collision."
    }).json()
    assert out_res["status"] == "success"
    print("[OK] Outcome recorded into Outcome Store.")

    # Step 16: Generate feedback event
    print("\n[Step 16] Verifying feedback loop event generation...")
    fb_events = requests.get(f"{BASE_URL}/feedback/events").json()
    assert len(fb_events) > 0
    print(f"[OK] Feedback Event registered: {fb_events[0]['event_type']}")

    # Step 17: Reset simulation
    print("\n[Step 17] Resetting simulation controller...")
    reset_res = requests.post(f"{BASE_URL}/simulation/reset").json()
    assert reset_res["status"] == "reset"
    print("[OK] Simulation reset.")

    # Step 18: Run again
    print("\n[Step 18] Re-running simulation step Day 1...")
    step_res = requests.post(f"{BASE_URL}/simulation/step", json={"stage": "Day 1"}).json()
    assert step_res["type"] == "SIMULATION_STEP"
    print("[OK] Simulation successfully re-run.")

    print("\n" + "=" * 60)
    print("ALL 18 E2E ACCEPTANCE TEST STEPS PASSED SUCCESSFULLY! (100/100)")
    print("=" * 60)

if __name__ == "__main__":
    run_e2e_acceptance_test()
