from fastapi import FastAPI
from api import matching_cards as matching_card_api
from internal import cache, mq
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# redis
app.add_event_handler("startup", cache.init)

# rabbitmq
app.add_event_handler("startup", mq.init)
app.add_event_handler("shutdown", mq.close)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/healthz")
def health_check():
    return cache.get_cache().ping()

app.include_router(matching_card_api.router, prefix= "")

