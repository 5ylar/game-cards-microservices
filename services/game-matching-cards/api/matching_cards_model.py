from typing import List

from pydantic import BaseModel

class PickCard(BaseModel):
    match_id: str
    position: int




