from app.database import get_db

class EntityResolutionService:
    def resolve_application_entities(self, app_data: dict):
        # Resolves borrower, device, dealer, guarantor, location links
        return {
            "borrower_id": f"BORR-{app_data['pan']}",
            "device_id": app_data["device_id"],
            "dealer_id": f"DLR-{app_data['dealer'].replace(' ', '_')}",
            "guarantor_id": app_data["guarantor"],
            "location_id": f"LOC-{app_data['location'].split('•')[0].strip()}"
        }

class GraphService:
    def get_ecosystem_graph(self, ecosystem_id: str = "ECO-1024", timeline_stage: str = "Current"):
        if ecosystem_id == "ECO-00173":
            # Legitimate Rural Community Graph
            nodes = [
                {"id": "b-rural-1", "type": "borrower", "position": {"x": 250, "y": 60}, "data": {"label": "Ramesh Patel", "subtitle": "Village Farmer", "badge": "PAN: RMP1040"}},
                {"id": "b-rural-2", "type": "borrower", "position": {"x": 650, "y": 60}, "data": {"label": "Suresh Patel", "subtitle": "Household Member", "badge": "PAN: SMP2080"}},
                {"id": "app-rural-1", "type": "application", "position": {"x": 380, "y": 180}, "data": {"label": "APP-90112", "risk": "28", "subtitle": "Kisan Credit Loan"}},
                {"id": "app-rural-2", "type": "application", "position": {"x": 520, "y": 180}, "data": {"label": "APP-90113", "risk": "24", "subtitle": "Tractor Loan"}},
                {"id": "device-rural", "type": "deviceNexus", "position": {"x": 450, "y": 320}, "data": {"label": "DEV-RURAL-TAB", "tagline": "SHARED HOUSEHOLD DEVICE", "badge": "Family Shared Tablet"}},
                {"id": "dealer-rural", "type": "dealer", "position": {"x": 280, "y": 420}, "data": {"label": "Village Agro Motors", "subtitle": "Local Verified Dealer"}},
                {"id": "gnt-rural", "type": "guarantor", "position": {"x": 620, "y": 420}, "data": {"label": "Village Sarpanch", "subtitle": "Family Guarantor"}}
            ]
            edges = [
                {"id": "er1", "source": "b-rural-1", "target": "app-rural-1", "label": "Applicant", "style": {"stroke": "#93c5fd", "strokeWidth": 2}},
                {"id": "er2", "source": "b-rural-2", "target": "app-rural-2", "label": "Applicant", "style": {"stroke": "#93c5fd", "strokeWidth": 2}},
                {"id": "er3", "source": "app-rural-1", "target": "device-rural", "label": "Household Device", "style": {"stroke": "#10b981", "strokeWidth": 2}},
                {"id": "er4", "source": "app-rural-2", "target": "device-rural", "label": "Household Device", "style": {"stroke": "#10b981", "strokeWidth": 2}},
                {"id": "er5", "source": "dealer-rural", "target": "app-rural-1", "label": "Local Dealer", "style": {"stroke": "#cbd5e1", "strokeWidth": 1.5}},
                {"id": "er6", "source": "gnt-rural", "target": "app-rural-2", "label": "Family Guarantor", "style": {"stroke": "#a5b4fc", "strokeWidth": 1.5}}
            ]
            return {"nodes": nodes, "edges": edges, "ecosystem_id": ecosystem_id, "is_legitimate": True}

        # Default ECO-1024 Fraud Ring
        nodes = [
            {"id": "borrower-1", "type": "borrower", "position": {"x": 280, "y": 40}, "data": {"label": "Sunita Verma", "subtitle": "Borrower (APP-78287)", "badge": "PAN: ABCPS9182F"}},
            {"id": "app-78287", "type": "application", "position": {"x": 440, "y": 140}, "data": {"label": "APP-78287", "risk": "84", "subtitle": "Hero Application"}},
            {"id": "device-9810", "type": "deviceNexus", "position": {"x": 570, "y": 260}, "data": {"label": "DEV-9810", "tagline": "SHARED NEXUS", "badge": "4 Concurrently Active Loans"}},
            {"id": "app-78294", "type": "application", "position": {"x": 720, "y": 140}, "data": {"label": "APP-78294", "risk": "82", "subtitle": "Auto Loan"}},
            {"id": "borrower-2", "type": "borrower", "position": {"x": 840, "y": 40}, "data": {"label": "K. Rao", "subtitle": "Borrower", "badge": "PAN: XYZPS4401K"}},
            {"id": "dealer-apex", "type": "dealer", "position": {"x": 280, "y": 310}, "data": {"label": "Apex Auto", "subtitle": "Dealer (DL-4021)"}},
            {"id": "account-icici", "type": "account", "position": {"x": 320, "y": 460}, "data": {"label": "pay-apex@icici", "subtitle": "UPI Settlement Node"}},
            {"id": "app-78308", "type": "application", "position": {"x": 570, "y": 440}, "data": {"label": "APP-78308", "risk": "89", "subtitle": "Consumer Loan"}},
            {"id": "borrower-3", "type": "borrower", "position": {"x": 440, "y": 560}, "data": {"label": "M. Patel", "subtitle": "Borrower"}},
            {"id": "borrower-4", "type": "borrower", "position": {"x": 710, "y": 560}, "data": {"label": "A. Singh", "subtitle": "Borrower"}},
            {"id": "guarantor-8890", "type": "guarantor", "position": {"x": 860, "y": 310}, "data": {"label": "GNT-8890", "subtitle": "Repeated Guarantor"}}
        ]
        edges = [
            {"id": "e-b1-app1", "source": "borrower-1", "target": "app-78287", "label": "Applicant PAN", "style": {"stroke": "#93c5fd", "strokeWidth": 2}},
            {"id": "e-app1-dev", "source": "app-78287", "target": "device-9810", "label": "Shared IMEI (Primary)", "style": {"stroke": "#ef4444", "strokeWidth": 3}},
            {"id": "e-app2-dev", "source": "app-78294", "target": "device-9810", "label": "Shared IMEI (Secondary)", "style": {"stroke": "#ef4444", "strokeWidth": 2, "strokeDasharray": "4 4"}},
            {"id": "e-b2-app2", "source": "borrower-2", "target": "app-78294", "label": "Applicant PAN", "style": {"stroke": "#93c5fd", "strokeWidth": 2}},
            {"id": "e-dealer-app1", "source": "dealer-apex", "target": "app-78287", "label": "Sourced Dealer", "style": {"stroke": "#cbd5e1", "strokeWidth": 1.5}},
            {"id": "e-dealer-account", "source": "dealer-apex", "target": "account-icici", "label": "UPI routed", "style": {"stroke": "#10b981", "strokeWidth": 2}},
            {"id": "e-dev-app3", "source": "device-9810", "target": "app-78308", "label": "Device Reuse (+3h window)", "style": {"stroke": "#ef4444", "strokeWidth": 2}},
            {"id": "e-app3-b3", "source": "app-78308", "target": "borrower-3", "style": {"stroke": "#cbd5e1", "strokeWidth": 1.5}},
            {"id": "e-app3-b4", "source": "app-78308", "target": "borrower-4", "style": {"stroke": "#cbd5e1", "strokeWidth": 1.5}},
            {"id": "e-gnt-app2", "source": "guarantor-8890", "target": "app-78294", "label": "Listed Guarantor", "style": {"stroke": "#a5b4fc", "strokeWidth": 1.5}}
        ]

        if timeline_stage == "Before Alert" or timeline_stage == "Day 1":
            nodes = [n for n in nodes if n["id"] in ["borrower-1", "app-78287", "device-9810"]]
            active_ids = [n["id"] for n in nodes]
            edges = [e for e in edges if e["source"] in active_ids and e["target"] in active_ids]
        elif timeline_stage == "Alert" or timeline_stage == "Day 7" or timeline_stage == "Day 14":
            nodes = [n for n in nodes if n["id"] in ["borrower-1", "app-78287", "device-9810", "app-78294", "borrower-2", "dealer-apex", "guarantor-8890"]]
            active_ids = [n["id"] for n in nodes]
            edges = [e for e in edges if e["source"] in active_ids and e["target"] in active_ids]

        return {"nodes": nodes, "edges": edges, "ecosystem_id": ecosystem_id, "is_legitimate": False}

entity_resolution_service = EntityResolutionService()
graph_service = GraphService()
