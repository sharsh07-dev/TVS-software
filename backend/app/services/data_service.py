from typing import Dict, Any, List, Optional
from app.database import get_db
from app.config import settings

class BaseDataProvider:
    def get_applications(self, search: str = "", risk_filter: str = "All Profiles") -> List[Dict[str, Any]]:
        raise NotImplementedError
        
    def get_application(self, app_id: str) -> Optional[Dict[str, Any]]:
        raise NotImplementedError

class SyntheticProvider(BaseDataProvider):
    def get_applications(self, search: str = "", risk_filter: str = "All Profiles") -> List[Dict[str, Any]]:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM applications ORDER BY created_at DESC;")
        rows = [dict(r) for r in cursor.fetchall()]
        conn.close()
        return rows

    def get_application(self, app_id: str) -> Optional[Dict[str, Any]]:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM applications WHERE LOWER(id) = LOWER(?);", (app_id,))
        row = cursor.fetchone()
        conn.close()
        return dict(row) if row else None

class BenchmarkProvider(BaseDataProvider):
    def get_applications(self, search: str = "", risk_filter: str = "All Profiles") -> List[Dict[str, Any]]:
        return []

    def get_application(self, app_id: str) -> Optional[Dict[str, Any]]:
        return None

class ProductionProvider(BaseDataProvider):
    """Placeholder provider for future TVS Credit Production Data Integration"""
    def get_applications(self, search: str = "", risk_filter: str = "All Profiles") -> List[Dict[str, Any]]:
        return []

    def get_application(self, app_id: str) -> Optional[Dict[str, Any]]:
        return None

class DataService:
    def __init__(self):
        self.providers = {
            "SyntheticProvider": SyntheticProvider(),
            "BenchmarkProvider": BenchmarkProvider(),
            "ProductionProvider": ProductionProvider()
        }

    @property
    def current_provider(self) -> BaseDataProvider:
        return self.providers.get(settings.ACTIVE_DATA_PROVIDER, self.providers["SyntheticProvider"])

    def get_applications(self, search: str = "", risk_filter: str = "All Profiles") -> List[Dict[str, Any]]:
        return self.current_provider.get_applications(search, risk_filter)

    def get_application(self, app_id: str) -> Optional[Dict[str, Any]]:
        return self.current_provider.get_application(app_id)

data_service = DataService()
# For backward compatibility
data_provider = data_service
