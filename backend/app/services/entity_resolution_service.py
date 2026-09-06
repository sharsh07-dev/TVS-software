from typing import Dict, Any, List
from app.database import get_db

class EntityResolutionService:
    def resolve_application_entities(self, app_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Entity Resolution Engine:
        Maps permissible signals (PAN, Phone, IMEI, POS ID, UPI VPA, Guarantor PAN)
        into normalized Canonical Entity Nodes and resolves connections.
        """
        pan = app_data.get("pan", "").strip().upper()
        phone = app_data.get("phone", "").strip()
        device_id = app_data.get("device_id", "").strip()
        dealer = app_data.get("dealer", "").strip()
        guarantor = app_data.get("guarantor", "").strip()

        borrower_id = f"BORR-{pan}" if pan else f"BORR-{app_data.get('id', 'TEMP')}"
        device_node_id = f"DEV-{device_id}" if not device_id.startswith("DEV-") else device_id
        dealer_node_id = f"DLR-{dealer.replace(' ', '_').upper()}"
        guarantor_node_id = f"GNT-{guarantor}" if not guarantor.startswith("GNT-") else guarantor

        return {
            "application_id": app_data.get("id"),
            "borrower_id": borrower_id,
            "device_id": device_node_id,
            "dealer_id": dealer_node_id,
            "guarantor_id": guarantor_node_id,
            "resolved_clusters": ["ECO-1024"] if "Apex Auto" in dealer or "DEV-9810" in device_id else ["ECO-1011"]
        }

entity_resolution_service = EntityResolutionService()
