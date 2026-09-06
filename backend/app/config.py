import os

class Settings:
    PROJECT_NAME: str = "EERIS - Evolving Ecosystem Risk Intelligence System"
    VERSION: str = "2.0.0"
    
    # Provider Settings
    ACTIVE_DATA_PROVIDER: str = "SyntheticProvider"  # Options: SyntheticProvider, BenchmarkProvider, ProductionProvider
    
    # Decision Routing Risk Thresholds
    FAST_TRACK_ECOSYSTEM_THRESHOLD: int = 45
    INVESTIGATION_ECOSYSTEM_THRESHOLD: int = 70
    DIVERGENCE_ALERT_THRESHOLD: int = 40
    
    # Maturity Thresholds
    MATURITY_STAGE_0_NODES: int = 3
    MATURITY_STAGE_1_NODES: int = 6
    MATURITY_STAGE_2_NODES: int = 10
    
    # Roles
    ROLES = ["Risk Analyst", "Underwriter", "Fraud Investigator", "Operations Manager", "Admin"]

settings = Settings()
