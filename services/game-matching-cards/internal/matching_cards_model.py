from typing import List
from pydantic import BaseModel
from datetime import datetime


class Card(BaseModel):
    number: int
    position: int = None   # 1 - 12
    is_activated: bool = False


class Match(BaseModel):
    user_id: str
    previous_pickup_card: Card = None
    cards: List[Card] = []
    click_times: int = 0

class MatchSessionState(BaseModel):
    match_id: str
    click_times: int = 0
    previous_pickup_card: Card = None
    activated_cards: List[Card] = []


class MatchResult(BaseModel):
    match_id: str
    user_id: str
    click_times: int = 0
    end_time: datetime
