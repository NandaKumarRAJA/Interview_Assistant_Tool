from typing import List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from config.db import conn

interviewVerdict = APIRouter()

class CandidateDetails(BaseModel):
    candidate_id: str
    first_name: str
    job_id: str
    job_title: str
    Resume_validation_status : str
    QandA_generation: str
    Interview_generation_status:str
    Interview_Verdict: str


@interviewVerdict.get('/InterviewVerdict/AllCandidates/', response_model=List[CandidateDetails])
async def find_all_candidates_verdict():
    
    candidates = conn.Interview_Assistent.Candidate_Details.find({})

    all_candidates_details = []
    for candidate in candidates:
        # Find job details based on candidate ID
        job = conn.Interview_Assistent.Job_Description.find_one({"jobId": candidate["JobId"]})

        if job is None:
            raise HTTPException(status_code=404, detail=f"Job details not found for candidate {candidate['CandidateID']}")

        resume = conn.Interview_Assistent.Resume_Validation.find_one({"CandidateID": candidate["CandidateID"]})
        QandA = conn.Interview_Assistent.TopicAndQA.find_one({"CandidateID": candidate["CandidateID"]})
        interview_schedule = conn.Interview_Assistent.Interview_Status.find_one({"CandidateID": candidate["CandidateID"]})
        interview_verdict = conn.Interview_Assistent.Result.find_one({"CandidateID": candidate["CandidateID"]})

        if interview_verdict is not None:
        # Check if interview_verdict["interview_verdict"] is None
            if interview_verdict.get("interview_verdict") is None:
                interview_verdict_status = "rejected"
            else:
                # Check the value of interview_verdict["interview_verdict"]
                if interview_verdict["interview_verdict"].lower()== "accept":
                    interview_verdict_status = "accept"
                elif interview_verdict["interview_verdict"].lower() == "can consider":
                    interview_verdict_status = "can consider"
                elif interview_verdict["interview_verdict"].lower() == "reject":
                    interview_verdict_status = "rejected"
                else:
                    interview_verdict_status = "Not Available"
        else:
            # Handle the case when interview_verdict is None
            interview_verdict_status = "Not Available"


        
        # Create the response model
        response_model = CandidateDetails(
            candidate_id=candidate["CandidateID"],
            first_name=candidate["FirstName"],
            job_id=job["jobId"],
            job_title=job["jobTitle"],
            Resume_validation_status = (
                "Not Available" if resume is None else
                "Selected" if resume["ValidationStatus"] == "SELECTED" else
                "Rejected" if resume["ValidationStatus"] == "REJECTED" else
                "Can Consider" if resume["ValidationStatus"] == "CAN CONSIDER" else
                "Not Available"
            ),
            QandA_generation=QandA["QAGenerationStatus"] if QandA else "Not Available",
            Interview_generation_status=interview_schedule["InterviewStatus"] if interview_schedule else "Not Available",
            Interview_Verdict=interview_verdict_status,
        )

        all_candidates_details.append(response_model)

    return all_candidates_details