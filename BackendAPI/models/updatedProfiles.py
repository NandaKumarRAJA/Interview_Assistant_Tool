from pydantic import BaseModel
from typing import Optional

class PersonalInfo(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    address: Optional[str] = None

class UpdateData(BaseModel):
    personal_info: Optional[PersonalInfo] = None
    summary: Optional[str] = None
    education: Optional[list] = None
    work_experience: Optional[list] = None
    skills: Optional[list] = None
    certifications: Optional[list] = None
    projects: Optional[list] = None
    languages: Optional[list] = None