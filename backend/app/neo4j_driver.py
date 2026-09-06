import os
from neo4j import GraphDatabase
import logging

logger = logging.getLogger(__name__)

class Neo4jDriver:
    def __init__(self, uri, user, password):
        self._driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self._driver.close()

    def execute_write(self, query, **kwargs):
        with self._driver.session() as session:
            try:
                result = session.write_transaction(lambda tx: tx.run(query, **kwargs).data())
                return result
            except Exception as e:
                logger.error(f"Error executing write query: {e}")
                return []

    def execute_read(self, query, **kwargs):
        with self._driver.session() as session:
            try:
                result = session.read_transaction(lambda tx: tx.run(query, **kwargs).data())
                return result
            except Exception as e:
                logger.error(f"Error executing read query: {e}")
                return []

    def wipe_database(self):
        query = "MATCH (n) DETACH DELETE n"
        self.execute_write(query)

NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "eeris_password")

neo4j_driver = Neo4jDriver(NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD)
