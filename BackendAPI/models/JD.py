from pydantic import BaseModel

class JobDetails(BaseModel):
    jobId: str
    jobTitle: str
    Description: str
    Qualification: str
    Responsibilities: str
    Scope: str
    YouBringIn: str