
from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
import jwt
from pydantic import BaseModel
import requests
from config.db import conn

interviewSchedule = APIRouter()

class InterviewData(BaseModel):
    JobId: str
    CandidateID: str
    InterviewStatus: str
    InterviewDate: str
    InterviewID: str
    Description: str
    Attendees: list
    fromTime: str
    toTime:str
    Platform:str


@interviewSchedule.post("/interviews/")
async def create_interview(data: InterviewData):
    """
    Create and schedule an interview by storing interview data in MongoDB.
    Args:
        - data (InterviewData): Pydantic model representing interview information.
    Returns:
        - dict: A dictionary containing the result message indicating the successful addition of interview data.
    Raises:
        - HTTPException:
            - Status Code 500: Raised if there is an exception during the insertion process.
    """
    try:
        result = conn.Interview_Assistent.TopicAndQA.find_one({"CandidateID": data.CandidateID})
    
        if result is None:
            raise HTTPException(status_code=404, detail="Question and Answer is not found for the specified candidateId")

        if result.get("QAGenerationStatus") != "Generated":
            raise HTTPException(status_code=400, detail="Q&A is not generated for this candidate. Generate Q&A first.")

        # Insert the interview data into MongoDB
        result = conn.Interview_Assistent.Interview_Status.insert_one(data.dict())

        return {"message": "Interview data added successfully"}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))