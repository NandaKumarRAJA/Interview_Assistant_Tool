from prefect import flow ,task
import fitz
from docx import Document 
import os
from pathlib import Path as PathLibPath
from fastapi import APIRouter, File, HTTPException, Path, UploadFile
from typing import Optional
from docx import Document 
from uuid import uuid4
import re
import shutil
from pydantic import BaseModel, Field
class Resume(BaseModel):
    uuid: Optional[str]
    filename: str
    text: Optional[dict] 
    batch_id: Optional[str]

uuid_regex = re.compile(r'^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}_', re.IGNORECASE)

def is_uuid_named_file(filename: str) -> bool:
    """Check if the filename starts with a valid UUID."""
    return bool(uuid_regex.match(filename))

def get_new_filename(filename: str) -> str:
    """Generate a new filename with a UUID prefix."""
    uuid_prefix = str(uuid4())
    return f"{uuid_prefix}_{filename}"



@task(name="pdf file extraction",retries=4)
def extract_text_from_pdf(filepath: str) -> dict:
    with fitz.open(filepath) as doc:
        text = ""
        for page in doc:
            text += page.get_text()
    return {
        
        "text": text
    }

@task(name="docx extraction",retries=3)
def extract_text_from_docx(filepath: str) -> dict:
    doc = Document(filepath)
    full_text = [paragraph.text for paragraph in doc.paragraphs]
    return {
        
        "text": '\n'.join(full_text)
    }


@flow(name="load data from local storage", retries=4)
def dataingestionflow(folder_path: str,batch_id:str):
    if not os.path.isdir(folder_path):
        raise HTTPException(status_code=400, detail="Folder path is invalid or does not exist.")
    
    resume_files = [f for f in os.listdir(folder_path) if f.endswith(('.pdf', '.docx'))]
    if not resume_files:
        raise HTTPException(status_code=404, detail="No PDF or DOCX files found in the folder.")

    extracted_resumes = []
    for filename in resume_files:
        if is_uuid_named_file(filename):
            print(f"Skipping {filename}, already processed.")
            continue  # Skip processing this file
        
        original_file_path = PathLibPath(folder_path) / filename
        new_filename = get_new_filename(filename)
        new_file_path = original_file_path.parent / new_filename

        # Rename the file with a new UUID-prefixed filename
        shutil.move(str(original_file_path), str(new_file_path))
        
        # Extract text after renaming to avoid confusion
        if new_filename.endswith('.pdf'):
            text = extract_text_from_pdf(str(new_file_path))
        elif new_filename.endswith('.docx'):
            text = extract_text_from_docx(str(new_file_path))
        print(batch_id)
        resume = Resume(uuid=new_filename.split("_")[0],filename=new_filename,text=text,batch_id=batch_id  )
        print("Added Batch id---------------------------------")
        print(resume)
        print("-----------------------------------------------")
        """resume = {
            "uuid": new_filename.split("_")[0],  # UUID extracted from the new filename
            "filename": new_filename,  # Use the new filename
            "text": text
            "batch Id": folder batch id
        }"""
        extracted_resumes.append(resume.dict())

    return extracted_resumes

