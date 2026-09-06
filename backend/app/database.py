import sqlite3
import os
import json
import random

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "eeris.db")

def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # 1. applications
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS applications (
        id TEXT PRIMARY KEY,
        applicant_name TEXT NOT NULL,
        pan TEXT NOT NULL,
        phone TEXT NOT NULL,
        device_id TEXT NOT NULL,
        dealer TEXT NOT NULL,
        guarantor TEXT NOT NULL,
        location TEXT NOT NULL,
        status TEXT NOT NULL,
        ecosystem_pattern TEXT NOT NULL,
        individual_risk INTEGER NOT NULL,
        individual_risk_level TEXT NOT NULL,
        ecosystem_risk INTEGER NOT NULL,
        ecosystem_risk_level TEXT NOT NULL,
        novelty REAL NOT NULL,
        ecosystem_id TEXT NOT NULL,
        applied_amount TEXT NOT NULL,
        submitted_time TEXT NOT NULL,
        case_id TEXT NOT NULL,
        rail TEXT NOT NULL,
        maturity_state TEXT NOT NULL,
        coordinated_pattern TEXT NOT NULL,
        decision_path TEXT NOT NULL,
        decision_reason TEXT NOT NULL,
        target_entities TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 2. borrowers
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS borrowers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        pan TEXT NOT NULL,
        phone TEXT NOT NULL,
        bureau_score INTEGER NOT NULL,
        history_length TEXT NOT NULL,
        is_thin_file INTEGER NOT NULL DEFAULT 0
    );
    """)

    # 3. dealers
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS dealers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        pos_id TEXT NOT NULL,
        velocity_spike_multiplier REAL NOT NULL,
        risk_level TEXT NOT NULL,
        connected_applications_count INTEGER NOT NULL
    );
    """)

    # 4. devices
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS devices (
        id TEXT PRIMARY KEY,
        imei_hash TEXT NOT NULL,
        concurrent_apps_count INTEGER NOT NULL,
        risk_tag TEXT NOT NULL
    );
    """)

    # 5. mobiles
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS mobiles (
        id TEXT PRIMARY KEY,
        phone_number TEXT NOT NULL,
        linked_borrowers_count INTEGER NOT NULL
    );
    """)

    # 6. accounts
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY,
        upi_vpa TEXT NOT NULL,
        account_type TEXT NOT NULL
    );
    """)

    # 7. guarantors
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS guarantors (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        pan TEXT NOT NULL,
        co_signed_apps_count INTEGER NOT NULL,
        familial_relation TEXT NOT NULL
    );
    """)

    # 8. locations
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS locations (
        id TEXT PRIMARY KEY,
        zone_name TEXT NOT NULL,
        pin_code TEXT NOT NULL
    );
    """)

    # 9. payments
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS payments (
        id TEXT PRIMARY KEY,
        application_id TEXT NOT NULL,
        upi_vpa TEXT NOT NULL,
        status TEXT NOT NULL,
        is_anomaly INTEGER NOT NULL DEFAULT 0
    );
    """)

    # 10. ecosystems
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ecosystems (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        status TEXT NOT NULL,
        risk_score INTEGER NOT NULL,
        novelty REAL NOT NULL,
        maturity TEXT NOT NULL,
        growth TEXT NOT NULL,
        nodes_count INTEGER NOT NULL,
        edges_count INTEGER NOT NULL,
        detected_pattern TEXT NOT NULL,
        is_legitimate INTEGER NOT NULL DEFAULT 0
    );
    """)

    # 11. ecosystem_members
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ecosystem_members (
        id TEXT PRIMARY KEY,
        ecosystem_id TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_label TEXT NOT NULL
    );
    """)

    # 12. ecosystem_events
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ecosystem_events (
        id TEXT PRIMARY KEY,
        ecosystem_id TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        event_type TEXT NOT NULL,
        description TEXT NOT NULL,
        risk_after INTEGER NOT NULL
    );
    """)

    # 13. risk_assessments
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS risk_assessments (
        id TEXT PRIMARY KEY,
        application_id TEXT NOT NULL,
        individual_risk INTEGER NOT NULL,
        ecosystem_risk INTEGER NOT NULL,
        divergence INTEGER NOT NULL,
        confidence REAL NOT NULL,
        evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 14. risk_drivers
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS risk_drivers (
        id TEXT PRIMARY KEY,
        application_id TEXT NOT NULL,
        title TEXT NOT NULL,
        contribution_percent INTEGER NOT NULL,
        risk_level TEXT NOT NULL,
        details TEXT NOT NULL,
        tags TEXT NOT NULL
    );
    """)

    # 15. alerts
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS alerts (
        id TEXT PRIMARY KEY,
        ecosystem_id TEXT NOT NULL,
        application_id TEXT NOT NULL,
        severity TEXT NOT NULL,
        growth_velocity TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        recommended_action TEXT NOT NULL,
        is_acknowledged INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 16. interventions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS interventions (
        id TEXT PRIMARY KEY,
        application_id TEXT NOT NULL,
        ecosystem_id TEXT NOT NULL,
        action_type TEXT NOT NULL,
        priority TEXT NOT NULL,
        target_entities TEXT NOT NULL,
        reason TEXT NOT NULL,
        baseline_risk INTEGER NOT NULL,
        modeled_risk INTEGER NOT NULL,
        status TEXT NOT NULL,
        owner TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 17. investigations
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS investigations (
        id TEXT PRIMARY KEY,
        case_id TEXT NOT NULL,
        application_id TEXT NOT NULL,
        borrower_name TEXT NOT NULL,
        ecosystem_id TEXT NOT NULL,
        individual_risk INTEGER NOT NULL,
        ecosystem_risk INTEGER NOT NULL,
        divergence INTEGER NOT NULL,
        status TEXT NOT NULL,
        priority TEXT NOT NULL,
        assignee TEXT NOT NULL,
        hold_reason TEXT,
        is_false_positive INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 18. investigation_notes
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS investigation_notes (
        id TEXT PRIMARY KEY,
        investigation_id TEXT NOT NULL,
        author TEXT NOT NULL,
        note_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 19. outcomes
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS outcomes (
        id TEXT PRIMARY KEY,
        application_id TEXT NOT NULL,
        outcome_state TEXT NOT NULL,
        notes TEXT NOT NULL,
        recorded_by TEXT NOT NULL,
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 20. feedback_events
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS feedback_events (
        id TEXT PRIMARY KEY,
        event_type TEXT NOT NULL,
        ecosystem_id TEXT NOT NULL,
        application_id TEXT NOT NULL,
        outcome_state TEXT NOT NULL,
        model_weight_adjustment TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 21. model_runs
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS model_runs (
        id TEXT PRIMARY KEY,
        model_version TEXT NOT NULL,
        run_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        accuracy_metric REAL NOT NULL,
        status TEXT NOT NULL
    );
    """)

    # 22. audit_logs
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        user TEXT NOT NULL,
        action TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        details TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    conn.commit()

    # Seed Database if empty
    cursor.execute("SELECT COUNT(*) FROM applications;")
    count = cursor.fetchone()[0]
    if count == 0:
        seed_data(conn)

    conn.close()

def seed_data(conn):
    cursor = conn.cursor()

    # Seed Ecosystems
    cursor.execute("""
    INSERT INTO ecosystems (id, name, status, risk_score, novelty, maturity, growth, nodes_count, edges_count, detected_pattern, is_legitimate)
    VALUES 
    ('ECO-1024', 'Synthetic Ring #4029', 'Critical Topology', 84, 0.92, 'Stage 3', '+34%', 14, 19, 'Detected: Rapid multi-applicant device collision with synchronized UPI sweep pattern', 0),
    ('ECO-1033', 'Dealer Burst Cluster #12', 'Elevated Velocity', 78, 0.81, 'Stage 2', '+22%', 9, 11, 'Detected: Apex Auto merchant velocity spike with thin-file applicants', 0),
    ('ECO-1045', 'Emerging Hardware Cluster', 'Stage 2 Growth', 68, 0.65, 'Stage 2', '+15%', 7, 8, 'Detected: Shared IMEI across regional PIN codes', 0),
    ('ECO-00173', 'Legitimate Rural Community Cluster', 'Verified Stable', 28, 0.22, 'Stage 1', '0%', 12, 16, 'Dense village cluster: Shared household tablet & family guarantors with clean repayment', 1);
    """)

    # Hero Application APP-78287
    cursor.execute("""
    INSERT INTO applications (
        id, applicant_name, pan, phone, device_id, dealer, guarantor, location, status,
        ecosystem_pattern, individual_risk, individual_risk_level, ecosystem_risk, ecosystem_risk_level,
        novelty, ecosystem_id, applied_amount, submitted_time, case_id, rail, maturity_state,
        coordinated_pattern, decision_path, decision_reason, target_entities
    ) VALUES (
        'APP-78287', 'Sunita Verma', 'ABCPS9182F', '+91 98765 43210', 'DEV-9810', 'Apex Auto', 'GNT-8890',
        'North Zone • Delhi NCR', 'Targeted Verification Required', 'High Ecosystem Risk',
        31, 'Low', 84, 'High', 0.92, 'ECO-1024', '₹2,40,000', '3.2 hours ago', '8849-0192-A',
        'Auto Loan Underwriting Rail • Regional Cluster North', 'Stage 3', 'Coordinated Pattern',
        'TARGETED_VERIFICATION', 'High ecosystem risk (84) divergent from individual risk (31)',
        '["Dealer Apex Auto", "Device DEV-9810", "Guarantor GNT-8890"]'
    );
    """)

    # Seed Hero Drivers
    cursor.execute("""
    INSERT INTO risk_drivers (id, application_id, title, contribution_percent, risk_level, details, tags)
    VALUES
    ('driver-1', 'APP-78287', 'Shared Device', 22, 'High', 'IMEI 863920194827 associated with 8 applications.', '["Hardware Signature Match"]'),
    ('driver-2', 'APP-78287', 'Dealer Concentration', 18, 'High', 'Apex Auto 4.2x velocity spike in first-time buyers.', '["Merchant Velocity"]'),
    ('driver-3', 'APP-78287', 'Guarantor Reuse', 14, 'Medium', 'Guarantor GNT-8890 co-signed 5 pending loans.', '["Unrelated Co-sign"]');
    """)

    # Seed Hero Alert & Intervention & Investigation
    cursor.execute("""
    INSERT INTO alerts (id, ecosystem_id, application_id, severity, growth_velocity, title, description, recommended_action, is_acknowledged)
    VALUES ('ALT-901', 'ECO-1024', 'APP-78287', 'HIGH', 'HIGH (+34%)', 'EMERGING ECOSYSTEM DETECTED', 'Rapid multi-applicant device collision with synchronized UPI pattern', 'Verify Dealer Apex Auto + Device DEV-9810', 0);
    """)

    cursor.execute("""
    INSERT INTO interventions (id, application_id, ecosystem_id, action_type, priority, target_entities, reason, baseline_risk, modeled_risk, status, owner)
    VALUES ('INT-78287', 'APP-78287', 'ECO-1024', 'TARGETED_VERIFICATION', 'HIGH', '["Dealer Apex Auto", "Device DEV-9810"]', 'Highest contributing ecosystem relationships', 84, 62, 'OPEN', 'Unassigned');
    """)

    cursor.execute("""
    INSERT INTO investigations (id, case_id, application_id, borrower_name, ecosystem_id, individual_risk, ecosystem_risk, divergence, status, priority, assignee)
    VALUES ('INV-78287', '8849-0192-A', 'APP-78287', 'Sunita Verma', 'ECO-1024', 31, 84, 53, 'OPEN', 'High', 'Arjun Mehta');
    """)

    # Seed 99 additional synthetic apps
    first_names = ['Amit', 'Priya', 'Rajesh', 'Vikram', 'Sneha', 'Suresh', 'Ananya', 'Rohan', 'Kavita', 'Deepak', 'Meera', 'Arjun', 'Pooja', 'Sanjay', 'Neha']
    last_names = ['Sharma', 'Kumar', 'Nair', 'Malhotra', 'Kulkarni', 'Patel', 'Iyer', 'Gupta', 'Reddy', 'Singh', 'Joshi', 'Deshmukh', 'Chawla', 'Mehta']
    dealers = ['Apex Auto', 'Zenith Motors', 'Royal Wheels', 'Velocity Auto', 'Metro Motors', 'Bharat Mobiles', 'Sunrise Retailers']

    random.seed(4029)
    for i in range(2, 101):
        app_id = f"APP-{78287 + i - 1}"
        name = f"{random.choice(first_names)} {random.choice(last_names)}"
        pan = f"ABCPS{1000 + i * 12}F"
        phone = f"+91 98765 {10000 + i * 37}"
        dev_id = f"DEV-{9800 + (i % 15)}"
        dealer = random.choice(dealers)
        guarantor = f"GNT-{8800 + (i % 10)}"

        pattern_rnd = i % 10
        if pattern_rnd in [6, 7]:
          pattern = 'High Ecosystem Risk'
          ind_risk = random.randint(20, 38)
          eco_risk = random.randint(72, 90)
          path = 'INVESTIGATION_REQUIRED'
          status = 'Targeted Verification Required'
        elif pattern_rnd in [4, 5]:
          pattern = 'Medium Risk'
          ind_risk = random.randint(40, 58)
          eco_risk = random.randint(50, 68)
          path = 'TARGETED_VERIFICATION'
          status = 'Under Review'
        elif pattern_rnd == 9:
          pattern = 'Benign Dense Ecosystem'
          ind_risk = random.randint(15, 30)
          eco_risk = random.randint(22, 40)
          path = 'FAST_TRACK'
          status = 'Standard Approval'
        else:
          pattern = 'Low Risk'
          ind_risk = random.randint(12, 32)
          eco_risk = random.randint(15, 38)
          path = 'FAST_TRACK'
          status = 'Standard Approval'

        novelty = round(0.1 + (eco_risk / 100) * 0.8, 2)
        eco_id = 'ECO-1024' if pattern == 'High Ecosystem Risk' else ('ECO-00173' if pattern == 'Benign Dense Ecosystem' else 'ECO-1011')

        cursor.execute("""
        INSERT INTO applications (
            id, applicant_name, pan, phone, device_id, dealer, guarantor, location, status,
            ecosystem_pattern, individual_risk, individual_risk_level, ecosystem_risk, ecosystem_risk_level,
            novelty, ecosystem_id, applied_amount, submitted_time, case_id, rail, maturity_state,
            coordinated_pattern, decision_path, decision_reason, target_entities
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            app_id, name, pan, phone, dev_id, dealer, guarantor,
            'North Zone • Regional Cluster', status, pattern,
            ind_risk, 'Low' if ind_risk < 40 else 'Medium',
            eco_risk, 'High' if eco_risk >= 70 else ('Medium' if eco_risk >= 45 else 'Low'),
            novelty, eco_id, f"₹{random.randint(120, 450)},000", f"{round(0.5 + i * 0.3, 1)} hours ago",
            f"8849-0{200+i}-A", "Auto Loan Underwriting Rail", "Stage 2" if eco_risk > 50 else "Stage 1",
            "Coordinated Pattern" if eco_risk > 70 else "Normal Cluster", path,
            f"Decision routed via EERIS Action Engine ({path})", f"[\"Dealer {dealer}\", \"Device {dev_id}\"]"
        ))

    conn.commit()
