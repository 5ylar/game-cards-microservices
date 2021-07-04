from pydantic import BaseModel, Field

class PickCard(BaseModel):
    match_id: str = Field(..., alias='matchId')
    position: int
    
