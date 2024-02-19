import os
from uuid import uuid4
from fastapi import APIRouter, File, UploadFile, HTTPException, Path
from pydantic import BaseModel
from config.db import conn
from models.candidate import CreateCandidate
from docx import Document
from fpdf import FPDF
from typing import List
from fastapi.responses import JSONResponse


Resume = APIRouter()

def convert_docx_to_pdf(docx_path, pdf_path):
    doc = Document(docx_path)
    pdf = FPDF()
    # Add pages from the docx to the pdf
    for page in doc:
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        pdf.cell(200, 10, txt=page.text, ln=True)
    pdf.output(pdf_path)

@Resume.post("/process_resume", response_model=None)
async def process_resume(Resumes: List[UploadFile] = File(...)):
    """
    Process and store details of multiple candidates.
 
    Args:
        - Resumes (List[UploadFile]): List of uploaded resume files.
 
    Returns:
        - None.
 
    Raises:
        - HTTPException: If there is an error during processing.
    """
    batch_id = str(uuid4())
    upload_path = f"uploads/{batch_id}/"
    os.mkdir(upload_path)
    # Iterate through each uploaded resume
    for resume in Resumes:
        resume_filename = resume.filename
        resume_id = str(uuid4())
        # Generate a unique ID for the resume
        pdf_path = f"{upload_path}{resume_filename}"
        uploaded_resume_path = f"{upload_path}{resume_filename}"
        # Save the uploaded file
        with open(uploaded_resume_path, "wb") as resume_file:
            resume_file.write(resume.file.read())
 
        # Convert different file types to PDF (e.g., DOCX)
        if resume_filename.endswith(".docx"):
            convert_docx_to_pdf(uploaded_resume_path, pdf_path)
        # Add more conditions for other file types if needed
 
        # Save data to MongoDB
        try:
            # Save resume data to MongoDB
            conn.Interview_Assistent.Resume_collection.insert_one({
                "BatchId" : batch_id,
                "ResumeId": resume_id,
                "Resume": pdf_path,
                # Add other fields if needed
            })
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to save data to MongoDB: {str(e)}")
 
    return {"batchId": batch_id}

@Resume.post("/process_resume_folder", response_model=None)
async def process_resume(Resumes: List[UploadFile] = File(...)):
    """
    Process and store details of multiple candidates.
 
    Args:
        - Resumes (List[UploadFile]): List of uploaded resume files.
 
    Returns:
        - None.
 
    Raises:
        - HTTPException: If there is an error during processing.
    """
    batch_id = str(uuid4())
    upload_path = f"uploads/{batch_id}/"
    os.mkdir(upload_path)
    # Iterate through each uploaded resume
    for resume in Resumes:
        resume_filename = resume.filename
        resume_filename_arr = resume_filename.split('/')
        resume_filename = resume_filename_arr[-1]
        resume_id = str(uuid4())
        # Generate a unique ID for the resume
        pdf_path = f"{upload_path}{resume_filename}"
        uploaded_resume_path = f"{upload_path}{resume_filename}"
        # Save the uploaded file
        with open(uploaded_resume_path, "wb") as resume_file:
            resume_file.write(resume.file.read())
 
        # Convert different file types to PDF (e.g., DOCX)
        if resume_filename.endswith(".docx"):
            convert_docx_to_pdf(uploaded_resume_path, pdf_path)
        # Add more conditions for other file types if needed
 
        # Save data to MongoDB
        try:
            # Save resume data to MongoDB
            conn.Interview_Assistent.Resume_collection.insert_one({
                "BatchId" : batch_id,
                "ResumeId": resume_id,
                "Resume": pdf_path,
                # Add other fields if needed
            })
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to save data to MongoDB: {str(e)}")
 
    return {"batchId": batch_id}


@Resume.get("/get_resumes_by_batch/{batch_id}")
async def get_resumes_by_batch_id(batch_id: str):
    """
    Get all resumes with a specific BatchId.

    Args:
        - batch_id (str): The BatchId to search for.

    Returns:
        - List[dict]: List of resumes with the specified BatchId.

    Raises:
        - HTTPException 404: If no resumes are found with the specified BatchId.
    """
    # Query MongoDB to find all resumes with the specified BatchId
    resumes = list(conn.Interview_Assistent.Resume_collection.find({"BatchId": batch_id}))

    # If no resumes are found, raise HTTPException with status code 404
    if not resumes:
        raise HTTPException(status_code=404, detail=f"No resumes found with BatchId {batch_id}")

    # Convert ObjectId to string in each resume dictionary
    for resume in resumes:
        resume['_id'] = str(resume['_id'])

    return JSONResponse(content=resumes)
