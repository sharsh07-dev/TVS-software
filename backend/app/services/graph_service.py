from app.neo4j_driver import neo4j_driver
from datetime import datetime
import random
import logging

logger = logging.getLogger(__name__)

class GraphService:
    def get_ecosystem_graph(self, ecosystem_id: str, timeline_stage: str = "Current", timestamp: str = None):
        # We need to construct the graph by querying Neo4j.
        # For simplicity, we find all applications in this ecosystem and their connected entities.
        # Real logic uses the ecosystem_id (which could be the seed application ID).
        
        # Determine temporal cutoff
        cutoff = "9999-12-31" # far future
        if timestamp:
            cutoff = timestamp
        elif timeline_stage == "Day 1":
            cutoff = "2024-01-02" # just an example temporal boundary
        elif timeline_stage == "Day 7":
            cutoff = "2024-01-08"
        elif timeline_stage == "Day 14":
            cutoff = "2024-01-15"
        elif timeline_stage == "Day 21":
            cutoff = "2024-01-22"
            
        # Cypher to get subgraph where relationships occurred before cutoff
        query = """
        MATCH (a:Application)-[r]-(other)
        WHERE (a.id = $eco_id OR $eco_id = 'ECO-1024') 
          AND (r.timestamp IS NULL OR r.timestamp <= $cutoff)
        RETURN a, r, other
        """
        results = neo4j_driver.execute_read(query, eco_id=ecosystem_id.replace("ECO-", ""), cutoff=cutoff)
        
        nodes_dict = {}
        edges_list = []
        
        def add_node(n, n_type, label, subtitle=""):
            if n["id"] not in nodes_dict:
                nodes_dict[n["id"]] = {
                    "id": n["id"],
                    "type": n_type,
                    "position": {"x": random.randint(100, 800), "y": random.randint(100, 600)},
                    "data": {"label": label, "subtitle": subtitle}
                }
                
        for row in results:
            app_node = row["a"]
            rel = row["r"]
            other_node = row["other"]
            
            add_node(app_node, "application", app_node["id"], "Application")
            
            other_type = "borrower"
            label = other_node["id"]
            subtitle = ""
            
            if "Borrower" in other_node.get("labels", []) or "BORR" in other_node["id"]:
                other_type = "borrower"
                label = other_node.get("name", label)
                subtitle = f"PAN: {other_node.get('pan', '')}"
            elif "Device" in other_node.get("labels", []) or "DEV" in other_node["id"]:
                other_type = "deviceNexus"
            elif "Dealer" in other_node.get("labels", []) or "DLR" in other_node["id"]:
                other_type = "dealer"
                label = other_node.get("name", label)
            elif "Guarantor" in other_node.get("labels", []) or "GNT" in other_node["id"]:
                other_type = "guarantor"
                
            add_node(other_node, other_type, label, subtitle)
            
            edge_id = f"{app_node['id']}-{other_node['id']}"
            edge = {
                "id": edge_id,
                "source": app_node["id"] if rel[1] == "SUBMITTED" else other_node["id"],
                "target": other_node["id"] if rel[1] == "SUBMITTED" else app_node["id"],
                "label": rel[1],
                "style": {"stroke": "#ef4444", "strokeWidth": 2}
            }
            # Add to edges if not already present
            if not any(e["id"] == edge_id for e in edges_list):
                edges_list.append(edge)
                
        # If no results (e.g. empty DB), fallback to mock or empty
        if not nodes_dict:
            return {"nodes": [], "edges": [], "ecosystem_id": ecosystem_id, "is_legitimate": False}
            
        # Layout adjustment could be done here (e.g. force-directed graph with networkx)
        # For this prototype, random positions are assigned during node addition, which React Flow handles.
        
        return {
            "nodes": list(nodes_dict.values()),
            "edges": edges_list,
            "ecosystem_id": ecosystem_id,
            "is_legitimate": False
        }

graph_service = GraphService()
