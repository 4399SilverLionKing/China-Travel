from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from app.api.route import api_router

app = FastAPI()

app.include_router(api_router)
