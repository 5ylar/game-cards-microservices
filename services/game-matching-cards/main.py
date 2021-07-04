import time
from fastapi import FastAPI, Request, Header, Response, status, HTTPException
from api import matching_cards as matching_card_api
# from internal import matching_cards
from internal import cache, mq
from typing import Optional


app = FastAPI()

app.add_event_handler("startup", cache.init)
app.add_event_handler("startup", mq.init)
app.add_event_handler("shutdown", mq.close)

app.include_router(matching_card_api.router, prefix= "")
