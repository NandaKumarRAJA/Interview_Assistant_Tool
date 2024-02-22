import logging
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from routes.InterviewValidation import InterviewValidation
# from routes.KaniniFormat import KaniniFormat
from routes.QAGeneration import QAGeneration
from routes.candidate import Candidate
from routes.Login import login
from routes.JD import Job_discription
from routes.resumeValidation import resumeValidator
from routes.interviewSchedule import interviewSchedule
from routes.InterviewVerdict import interviewVerdict
from routes.createResume import Resume
from routes.updatedProfiles import updatedProfiles

from routes.data_ingestion import dataingestion

app = FastAPI()
# security = HTTPBearer()
# @app.get('/')
# def main(authorization: str = Depends(security)):
#     return authorization.credentials

def custom_jsonable_encoder(obj, **kwargs):
    try:
        return jsonable_encoder(obj, **kwargs)
    except UnicodeDecodeError as decode_error:
        return f"Error decoding object: {str(decode_error)}"

# Use the custom encoder in your FastAPI application
app.jsonable_encoder = custom_jsonable_encoder

# Allow all origins, methods, and headers. Update these according to your requirements.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)


# Include your routers
app.include_router(Candidate)
app.include_router(login)
app.include_router(resumeValidator)
app.include_router(Job_discription)
app.include_router(QAGeneration)
app.include_router(InterviewValidation)
app.include_router(interviewVerdict)
app.include_router(interviewSchedule)
app.include_router(Resume)
app.include_router(updatedProfiles)
# app.include_router(KaniniFormat)

app.include_router(dataingestion)

# Configure logging
log_config = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"console": {"class": "logging.StreamHandler"}},
    "root": {"handlers": ["console"], "level": "DEBUG"},
}
logging.config.dictConfig(log_config)
