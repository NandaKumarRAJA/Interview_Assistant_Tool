import json
from typing import List, Dict
from fastapi import APIRouter, Depends, File, Form, HTTPException, Query,UploadFile
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from config.db import conn, filter
from routes.createResume import convert_docx_to_pdf
from schemas.candidate import CandidateEntity, CandidatesEntity
from docx import Document
from models.candidate import CreateCandidate 
from fpdf import FPDF
# import canvas
from schemas.Login import has_roles
 
 
Candidate = APIRouter()



@Candidate.get('/Details' )
async def find_all_candidates():
    """
    Retrieve details of all candidates.
    This endpoint fetches and returns details of all candidates from the Candidate_Details collection.
    Returns:
        - JSONResponse: A JSON response containing the details of all candidates.
    Raises:
        - None.
    """
    cursor = conn.Interview_Assistent.Candidate_Details.find()
    candidates = CandidatesEntity(cursor)
    return JSONResponse(content=candidates)
 
 
@Candidate.get("/candidates/")
async def get_candidate_details(candidateID: str, FirstName: str):
    """
    Retrieve details of a candidate based on provided criteria.
 
    This endpoint allows querying candidate details based on optional parameters such as CandidateID and FirstName.
    Args:
        - candidateID (str, optional): Unique identifier for the candidate.
        - FirstName (str, optional): First name of the candidate.
    Returns:
        - JSONResponse: A JSON response containing details of the matching candidate.
    Raises:
        - HTTPException:
            - Status Code 404: Raised if no candidate is found based on the provided criteria.
    """
    query = {}
 
    if candidateID:
        query["CandidateID"] = candidateID
 
    if FirstName:
        query["FirstName"] = FirstName
 
    candidate = conn.Interview_Assistent.Candidate_Details.find_one(query, {"_id": 0})
 
    if candidate:
        return JSONResponse(content=candidate)
    else:
        raise HTTPException(status_code=404, detail="Candidate not found")
 
 
 
@Candidate.get("/candidates/{candidate_id}", response_model=CandidateEntity)
async def get_candidate_by_id(candidate_id: str):
    """
    Retrieve details of a candidate by their unique identifier.
    This endpoint retrieves and returns details of a candidate based on the CandidateID.
    Args:
        - candidate_id (str): Unique identifier for the candidate.
    Returns:
        - JSONResponse: A JSON response containing details of the specified candidate.
    Raises:
        - HTTPException:
            - Status Code 404: Raised if no candidate is found with the provided unique identifier.
    """
    # Retrieve candidate from MongoDB based on CandidateID
    candidate = conn.Interview_Assistent.Candidate_Details.find_one({"CandidateID": candidate_id}, {"_id": 0})
 
    if candidate:
        return JSONResponse(content=candidate)
    else:
        raise HTTPException(status_code=404, detail="Candidate not found")
 
 
 
# def convert_docx_to_pdf(docx_path, pdf_path):
#     doc = Document(docx_path)
#     # pdf = canvas.Canvas(pdf_path)
#     pdf.save()
 
def convert_txt_to_pdf(txt_path, pdf_path):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.set_font("Arial", size=12)
 
    with open(txt_path, encoding="utf-8") as txt_file:
        for line in txt_file:
            pdf.cell(200, 10, txt=line, ln=True)
 
    pdf.output(pdf_path)
 
@Candidate.post("/process_candidate", response_model=None, dependencies=[Depends(has_roles(["admin"]))])
async def process_candidate(
    CandidateID: str = Form(...),
    FirstName: str = Form(...),
    LastName: str = Form(...),
    TotalExperience: int = Form(...),
    DOB: str = Form(...),
    JobId:str = Form(...),
    Email: str = Form(...),
    PhoneNO: str = Form(...),
    CurrentLocation: str = Form(...),
    Address: str = Form(...),
    LinkinID: str = Form(...),
    Resume: UploadFile = File(...),
):
    """
    Process and store details of a candidate.
 
    This endpoint allows processing and storing details of a candidate by providing information such as CandidateID, FirstName, etc.
    The candidate details are submitted via form data, including an uploaded resume.
 
    Args:
        - CandidateID (str): Unique identifier for the candidate.
        - FirstName (str): First name of the candidate.
        - LastName (str): Last name of the candidate.
        - TotalExperience (int): Total years of experience of the candidate.
        - DOB (str): Date of birth of the candidate.
        - JobId (str): Unique identifier for the job associated with the candidate.
        - Email (str): Email address of the candidate.
        - PhoneNO (str): Phone number of the candidate.
        - CurrentLocation (str): Current location of the candidate.
        - Address (str): Address of the candidate.
        - LinkinID (str): LinkedIn ID of the candidate.
        - Resume (UploadFile): Uploaded resume file.
 
    Returns:
        - None.
 
    Raises:
        - None.
    """
    # Candidate data
    candidate_data = {
        "CandidateID": CandidateID,
        "FirstName": FirstName,
        "LastName": LastName,
        "TotalExperience": TotalExperience,
        "DOB": DOB,
        "JobId":JobId,
        "Email": Email,
        "PhoneNO": PhoneNO,
        "CurrentLocation": CurrentLocation,
        "Address": Address,
        "LinkinID": LinkinID,
        "Resume": f"{FirstName}.pdf",
    }
 
 
    # If a file is provided, convert it to PDF
    if Resume:
        resume_filename = Resume.filename
        pdf_path = f"{FirstName}.pdf"
        uploaded_resume_path = f"uploads/{pdf_path}"
 
        # Save the uploaded file
        with open(uploaded_resume_path, "wb") as resume_file:
            resume_file.write(Resume.file.read())
 
        # Convert different file types to PDF (e.g., DOCX)
        if resume_filename.endswith(".docx"):
            convert_docx_to_pdf(uploaded_resume_path, pdf_path)
        elif resume_filename.endswith(".txt"):
            convert_txt_to_pdf(uploaded_resume_path, pdf_path)
        # Add more conditions for other file types if needed
 
        # Save data to MongoDB
        try:
            conn.Interview_Assistent.Candidate_Details.insert_one(candidate_data)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to save data to MongoDB: {str(e)}")
 
        return {"message": "Candidate details processed and saved to MongoDB successfully."}
 
    return {"message": "Candidate details processed successfully (without Resume conversion)."}
 
@Candidate.put('/UpdateCandidate/{candidate_id}')
async def update_candidate(candidate_id: str, candidate: CreateCandidate):
    """
    Update details of a candidate based on their unique identifier.
 
    This endpoint allows updating details of a candidate by their CandidateID.
    Args:
        - candidate_id (str): Unique identifier for the candidate.
        - candidate (CreateCandidate): Pydantic model representing the updated candidate details.
    Returns:
        - dict: A dictionary containing a message indicating the success of the update.
    Raises:
        - HTTPException:
            - Status Code 404: Raised if no candidate is found with the provided unique identifier.
    """
    existing_candidate = conn.Interview_Assistent.Candidate_Details.find_one({"CandidateID": candidate_id})
    if existing_candidate:
        conn.Interview_Assistent.Candidate_Details.update_one({"CandidateID": candidate_id}, {"$set": candidate.dict()})
        return {"message": "Candidate updated successfully"}
    raise HTTPException(status_code=404, detail="Candidate not found")
 
@Candidate.delete('/DeleteCandidate/{candidate_id}')
async def delete_candidate(candidate_id: str):
    """
    Delete a candidate based on their unique identifier.
 
    This endpoint allows deleting a candidate identified by their unique identifier (CandidateID).
    Args:
        - candidate_id (str): Unique identifier for the candidate.
    Returns:
        - dict: A dictionary containing a message indicating the success of the deletion.
    Raises:
        - HTTPException:
            - Status Code 404: Raised if no candidate is found with the provided unique identifier.
    """
    result = conn.Interview_Assistent.Candidate_Details.delete_one({"CandidateID": candidate_id})
    if result.deleted_count == 1:
        return {"message": "Candidate deleted successfully"}
    raise HTTPException(status_code=404, detail="Candidate not found")
 


@Candidate.get("/filtered-candidates")
async def get_filtered_candidates(
    total_experience: int = Query(None, title="Total Experience", description="Total Experience"),
    job_id: str = Query(None, title="Job ID", description="Job ID"),
    current_location: str = Query(None, title="Current Location", description="Current Location")
):
    """
    Retrieve filtered details of candidates based on specified criteria.
 
    This endpoint allows querying and retrieving details of candidates based on optional filtering criteria.
    The optional filter criteria include Total Experience, Job ID, and Current Location.
    Args:
        - total_experience (int, optional): Filter candidates by total experience.
        - job_id (str, optional): Filter candidates by the associated job ID.
        - current_location (str, optional): Filter candidates by their current location.
    Returns:
        - JSONResponse: A JSON response containing the filtered details of matching candidates.
    Raises:
        - HTTPException:
            - Status Code 500: Raised if an error occurs during the filtering process.
    """
    try:
        # Construct filter criteria based on the provided query parameters
        filter_criteria = {"$and": []}
 
        if total_experience is not None:
            filter_criteria["$and"].append({"TotalExperience": total_experience})
        if job_id:
            filter_criteria["$and"].append({"JobId": job_id})
        if current_location:
            filter_criteria["$and"].append({"CurrentLocation": current_location})
 
        # Perform a find query with the constructed filter criteria
        cursor = filter.Interview_Assistent.Candidate_Details.find(filter_criteria ,{"_id": 0} )
 
        candidates_result = [document async for document in cursor]
 
        # Extracting only necessary fields from the data
        response_data = {"candidates": candidates_result}
 
        return JSONResponse(content=response_data)
 
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@Candidate.get("/filtered-candidates-for-multioption")
async def get_filtered_candidates_multioption(
    total_experience: List[int] = Query(None, title="Total Experience", description="Total Experience"),
    job_id: List[str] = Query(None, title="Job ID", description="Job ID"),
    current_location: List[str] = Query(None, title="Current Location", description="Current Location")
):
    try:
        # Construct filter criteria based on the provided query parameters
        filter_criteria = {"$and": []}

        if total_experience is not None:
            # If multiple total experiences are provided, use "$in" for OR condition, else use "$eq" for AND condition
            if len(total_experience) > 1:
                filter_criteria["$and"].append({"TotalExperience": {"$in": total_experience}})
            else:
                filter_criteria["$and"].append({"TotalExperience": {"$eq": total_experience[0]}})

        if job_id:
            # If multiple job IDs are provided, use "$in" for OR condition, else use "$eq" for AND condition
            if len(job_id) > 1:
                filter_criteria["$and"].append({"JobId": {"$in": job_id}})
            else:
                filter_criteria["$and"].append({"JobId": {"$eq": job_id[0]}})

        if current_location:
            # If multiple current locations are provided, use "$in" for OR condition, else use "$eq" for AND condition
            if len(current_location) > 1:
                filter_criteria["$and"].append({"CurrentLocation": {"$in": current_location}})
            else:
                filter_criteria["$and"].append({"CurrentLocation": {"$eq": current_location[0]}})

        # Perform a find query with the constructed filter criteria
        cursor = filter.Interview_Assistent.Candidate_Details.find(filter_criteria, {"_id": 0})

        candidates_result = [document async for document in cursor]

        # Extracting only necessary fields from the data
        response_data = {"candidates": candidates_result}

        return response_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))