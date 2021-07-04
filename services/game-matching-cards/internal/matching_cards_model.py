import json
from pydantic import BaseModel, Field
from datetime import datetime

class Match:
    user_id: str
    previous_pickedup_card_position: int
    card_states: dict  # dict of MatchCard
    click_times: int

    def __init__(self, user_id: str, previous_pickedup_card_position: int = None, card_states={}, click_times=0):
        self.user_id = user_id
        self.previous_pickedup_card_position = previous_pickedup_card_position
        self.card_states = card_states
        self.click_times = click_times

    def to_json(self):
        return json.dumps(self, default=lambda o: o.__dict__)

    @staticmethod
    def from_json(j: str):
        match = Match(**json.loads(j))
        for k in match.card_states:
            match.card_states[k] = MatchCard(**match.card_states[k])
        return match


class MatchCard:
    card_number: int
    is_activated: bool

    def __init__(self, card_number: int, is_activated=False):
        self.card_number = card_number
        self.is_activated = is_activated


class CardMappingPosition:
    def __init__(self, position = None, card_number = None):
        self.position = position
        self.card_number = card_number


class MatchSessionState:
    def __init__(
        self,
        match_id,
        click_times=0,
        previous_pickedup_card=None,
        activated_cards=[],
    ):
        self.match_id = match_id
        self.click_times = click_times
        self.previous_pickedup_card = previous_pickedup_card
        self.activated_cards = activated_cards


class MatchResult(BaseModel):
    match_id: str = Field(alias="matchId")
    user_id: str = Field(alias="userId")
    click_times: int = Field(alias="clickTimes")
    end_time: datetime = Field(alias="endTime")
    
    def __init__(self, match_id, user_id, click_times, end_time):
        self.match_id = match_id
        self.user_id = user_id
        self.click_times = click_times
        self.end_time = end_time
