import logging
import google.generativeai as genai
from pydantic import BaseModel
from schemas.utils import to_markdown, parse_json_string, generate_json
from typing import List
from fastapi import APIRouter, File, HTTPException, Path, UploadFile
from fastapi.responses import FileResponse, JSONResponse
import schemas.constants as cst
from decouple import config
from config.db import conn
import pdfkit

InterviewValidation = APIRouter()

# Configure logging
logging.basicConfig(level=logging.INFO)


class Candidate(BaseModel):
    CandidateID: str
    FirstName: str
    JobId: str
    Performance_score: float
    interview_verdict: str
    interview_report: str
    interview_topics:list
    interviewer:str
    interview_question: list
  
class Result(BaseModel):
    message: str
    id: str


def final_verdict(transcript):
    """
    Function generates final verdict based on analyzing the interview perfomance of the candidate.
    Args:
        - transcript (.vvt) : Interview transcript.
    Returns:
       - response: returns final verdict based on the candidate perfomance in the interview.
       - Sample output: 
                {
                "interviewer_name": "interviewer_name", 
                "candidate_name": "candidate_name",
                "overall_score": "score",
                "topics": [(
                    "topic_name": "topic_name", "topic_score": "topic_score",
                    "candidate_skill_rating_explaination":"candidate_skill_rating_explaination"
                    )],
                    "questions_answer":[("Topic":"Python", "question": "what is an array?", "answer": "an array is a data structure that stores a collection of items"m "score":5)],
                    "interview_verdict":"verdict","overall_report":"report"
                }
    Raises:
       - Exception: None.
    """
    genai.configure(api_key=config('API_KEY'))
    model = genai.GenerativeModel(cst.GEMINI_MODEL)
    updated_prompt = cst.INTERVIEW_VALIDATOR_PROMPT.format(cst.INTERVIEW_VALIDATOR_SYSTEM_PROMPT, transcript)
    response = model.generate_content(updated_prompt)
    string_text = to_markdown(response.text)
    json_data = parse_json_string(string_text.data)
    logging.info("Final verdict generated")
    return JSONResponse(content=json_data, status_code=200)
    


@InterviewValidation.post("/Generate_final_verdict/")
async def final_verdict_creation(CandidateId: str, JobId: str, files: List[UploadFile] = File(...)):
    """
    Interview validator and verdict generation api:
    1. The API analyze the candidate interview perfomance by analysing the interview transcript and generates final verdict.
    2. Each question carries max of 5 points.
    3. The candidate will be selected only if the overall points scored is greater than 3.5.
    Args:
        - files (File) : Interview transcript.
        - CandidateId : candidate's unique id which is used for saving the results.
        - JobId : unique job id for vacant positions.
    Returns:
       - response: returns final verdict to FE.
    Raises:
       - Exception: if Failed to generate final verdict.
    """
    try:
        # Check if interview schedule status is "Generated"
        interview_schedule = conn.Interview_Assistent.Interview_Status.find_one({"CandidateID": CandidateId})
        if interview_schedule is None or interview_schedule.get("InterviewStatus") != "Scheduled":
            raise HTTPException(status_code=400, detail="Interview schedule not generated for the specified CandidateId. Generate interview schedule first.")

        results = []  # Initialize a list to store results for each file
        result = None  # Initialize result outside the loop

        for file in files:
            if file.filename.endswith('.txt') or file.filename.endswith('.vtt'):
                contents = await file.read()
                content_string = contents.decode("utf-8")
                try:
                    logging.info("Starting final_verdict generation...")
                    result = final_verdict(content_string)
                except Exception as e:
                    logging.error(f"Failed to generate final verdict: {str(e)}")
                    results.append(None)  # Append None if an exception occurs

            else:
                logging.info(f"Invalid file format: {file.filename}")

        return result

    except HTTPException as he:
        raise he
    except Exception as e:
        logging.error(f"Failed to generate final verdict: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate final verdict.")

@InterviewValidation.post("/Interview_Verdict_report/", response_model=Result)
async def create_candidate(candidate: Candidate):
    """
    Create candidate and store interview verdict report in MongoDB.
    Args:
        - candidate (Candidate): Pydantic model representing candidate information.
    Returns:
        - dict: A dictionary containing the result message and the ID of the newly inserted document.
            Sample output: {"message": "Candidate created successfully", "id": "inserted_document_id"}
    Raises:
        - HTTPException:
            - Status Code 500: Raised if there is an exception during the insertion process.
    """
    try:
        # Convert Pydantic model to dict
        candidate_data = candidate.dict()

        # Insert data into MongoDB
        result = conn.Interview_Assistent.Result.insert_one(candidate_data)

        # Respond with the ID of the newly inserted document
        return {"message": "Candidate created successfully", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

