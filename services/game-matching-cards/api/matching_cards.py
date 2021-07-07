from fastapi import APIRouter, Depends, Header, Request, Response, status, HTTPException
from internal import matching_cards
from . import matching_cards_model as model
from typing import Optional

router = APIRouter()

class ReqCtx:
    user_id: str

    def __init__(self, user_id: Optional[str] = Header(None)):
        self.user_id = user_id
        
        if self.user_id is None or self.user_id.strip() == "":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        
        if len(self.user_id) > 100:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Too long user id")

@router.post("/")
def create_match(ctx = Depends(ReqCtx)):
    match_id = matching_cards.create_match(ctx.user_id)
    return { "match_id": match_id }

@router.get("/current-match")
def get_current_match(ctx = Depends(ReqCtx)):
    match_id = matching_cards.get_current_match(ctx.user_id)
    return {"match_id": match_id}

@router.post("/pick-card")
def pick_card(data: model.PickCard, ctx = Depends(ReqCtx)):
    card_number = matching_cards.pick_card(data.match_id, data.position, ctx.user_id)
    return { "card_number": card_number }

@router.get("/{match_id}")
def get_match_session_state(match_id: str ,ctx = Depends(ReqCtx)):
    return matching_cards.get_match_session_state(match_id, ctx.user_id)

