from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime

class EntityPayload(BaseModel):
    id: str
    type: str
    attributes: Dict[str, Any]

class RiskDriverSchema(BaseModel):
    feature: str
    raw_value: float
    normalized_value: float
    contribution: float
    direction: str
    evidence: str
    supporting_entities: List[str]

class RiskResponseSchema(BaseModel):
    application_id: str
    individual_risk: int
    ecosystem_risk: int
    risk_band: str
    confidence: float
    missing_data: List[str]
    novelty_score: float
    novelty_status: str
    maturity_stage: str
    model_version: str
    prediction_timestamp: datetime
    drivers: List[RiskDriverSchema]

class CounterfactualRequestSchema(BaseModel):
    modified_features: Dict[str, Any]

class CounterfactualResponseSchema(BaseModel):
    scenario: str
    modified_features: Dict[str, Any]
    new_risk: int
    risk_delta: int
    confidence: float

class AlertSchema(BaseModel):
    alert_id: str
    ecosystem_id: str
    application_id: str
    severity: str
    type: str
    risk: int
    evidence: str
    created_at: datetime
    status: str

class FeedbackSchema(BaseModel):
    case_id: str
    ecosystem_id: str
    outcome: str
    analyst: str
    notes: Optional[str]
    evidence: Optional[str]

class TimelineEventSchema(BaseModel):
    timestamp: datetime
    event_type: str
    description: str
    node_growth: int
    edge_growth: int
    risk_velocity: float
