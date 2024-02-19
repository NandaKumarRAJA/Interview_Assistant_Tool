from typing import Optional 
from fastapi import File
from fastapi import UploadFile
from pydantic import BaseModel
from typing import List

class Candidate(BaseModel):
    _id: str
    CandidateID: str
    FirstName: str
    LastName: str
    TotalExperience: int
    DOB: str
    DOJ: Optional[str] = None 
    Email: str
    PhoneNO: str
    CurrentLocation: str
    Address: str
    LinkinID: str
    Resume: str
    JobTitle: str
    JobId: str

class CreateCandidate(BaseModel):
    CandidateID: str
    FirstName: str
    LastName: str
    TotalExperience: int
    DOB: str
    DOJ: str = ""
    Email: str
    PhoneNO: str
    CurrentLocation: str
    Address: str
    LinkinID: str
    Resume: UploadFile
    JobTitle: str
    JobId: str

class CandidateFilter(BaseModel):
    jobId: List[str] = None  
    city: List[str] = None  
    experience: List[str] = None 