from prefect import flow ,task
import fitz
from docx import Document 
import os
from pathlib import Path as PathLibPath
from fastapi import APIRouter, File, HTTPException, Path, UploadFile
from typing import Optional
from docx import Document 
from uuid import uuid4
from typing import List, Optional
from pydantic import BaseModel, EmailStr, HttpUrl, Field
import google.generativeai as genai
import schemas.constants as cst
import logging
from decouple import config
import schemas.constants as cst
from schemas.utils import to_markdown, parse_json_string, generate_json
# Configure logging
logging.basicConfig(level=logging.INFO)

# Helper function to replace None with "not available"
def replace_none_with_not_available(item):
    if isinstance(item, dict):
        return {k: replace_none_with_not_available(v) for k, v in item.items()}
    elif isinstance(item, list):
        return [replace_none_with_not_available(v) for v in item]
    else:
        return item if item is not None else "not available"

class PersonalInfo(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    address: Optional[str] = None

class Education(BaseModel):
    degree: Optional[str] = None
    institution: Optional[str] = None
    year: Optional[str] = None
    location: Optional[str] = None

class WorkExperience(BaseModel):
    position: Optional[str] = None
    company: Optional[str] = None
    duration: Optional[str] = None
    location: Optional[str] = None
    responsibilities: Optional[List[str]] = None

class Certification(BaseModel):
    title: Optional[str] = None
    issuer: Optional[str] = None
    year: Optional[str] = None

class Project(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    technologies: Optional[List[str]] = None
    year: Optional[str] = None

class Language(BaseModel):
    language: Optional[str] = None
    proficiency: Optional[str] = None

# Main Resume model
class Resume(BaseModel):
    personal_info: Optional[PersonalInfo] = None
    summary: Optional[str] = None
    education: Optional[List[Education]] = None
    work_experience: Optional[List[WorkExperience]] = None
    skills: Optional[List[str]] = None
    certifications: Optional[List[Certification]] = None
    projects: Optional[List[Project]] = None
    languages: Optional[List[Language]] = None

    def dict(self, **kwargs):
        # Override the .dict() method to replace None values
        original_dict = super().dict(**kwargs)
        return replace_none_with_not_available(original_dict)


@task(name="load_gemini_pro_model")
def load_gemini_pro_model_task():
    genai.configure(api_key=config('API_KEY'))
    model = genai.GenerativeModel(cst.GEMINI_MODEL)
    return model

@task(name="Gemini ai call",retries=5)
def gemini_llm_call(model,resume):
    updated_prompt = cst.RESUME_EXTRACTION_PROMPT.format(cst.RESUME_EXTRACTION_SYSTEM_PROMPT,resume)
    response = model.generate_content(updated_prompt)
    string_text = to_markdown(response.text)
    json_data = parse_json_string(string_text.data)
    logging.info("resume formatted successfully")
    return json_data

    

@flow(name="resume format extraction",retries=4)
def resume_format_extraction_flow(resumes):
    model = load_gemini_pro_model_task()
    processed_resumes = []
    for resume_dict in resumes:
        resume_data=resume_dict['text']
        processed_resume = gemini_llm_call(model=model,resume=resume_data)
        
        if processed_resume:
            #formated_resume= Resume(**processed_resume)
            processed_resume['uuid']=resume_dict['uuid']
            processed_resume['batch_id']=resume_dict['batch_id']
            processed_resumes.append(processed_resume)
            print(f"Processed resume: {processed_resume}")
    return processed_resumes

