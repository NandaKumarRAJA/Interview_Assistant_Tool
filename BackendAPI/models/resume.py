from typing import Optional 
from fastapi import File
from fastapi import UploadFile
from pydantic import BaseModel
from typing import List

class Resume(BaseModel):
    _id: str
    BatchId : str
    ResumeId: str
    Resume: str

class CreateResume(BaseModel):
    BatchId : str
    ResumeId: str
    Resume: str