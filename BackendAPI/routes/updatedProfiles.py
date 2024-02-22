from config.db import conn
from fastapi import APIRouter
from models.updatedProfiles import UpdateData, PersonalInfo

updatedProfiles = APIRouter()

@updatedProfiles.get("/clustered_candidated")
async def get_all_clustered_candidates():
    results =conn.Interview_Assistent.Clustered_Resume.find({}, {"_id": 0})
    resume = list(results)
    return {"candidates": resume}

@updatedProfiles.put("/update_clustered_profile")
async def update_data(email:str,update_data: UpdateData):
    
    jobs_data = conn.Interview_Assistent.Clustered_Resume.find({"personal_info.email": email}, {"_id": 0})
    # Update personal_info if provided
    for job_data in jobs_data:
        job_data["personal_info"].update(update_data["personal_info"])
        await conn.Interview_Assistent.Clustered_Resume.update_one(
            {"_id": job_data["_id"]},
            {"$set": {"personal_info": job_data["personal_info"]}}
    )
    # Update summary if provided
    if update_data.summary:
        jobs_data["summary"] = update_data.summary

    # Update education if provided
    if update_data.education:
        jobs_data["education"] = update_data.education

    # Update work_experience if provided
    if update_data.work_experience:
        jobs_data["work_experience"] = update_data.work_experience

    # Update skills if provided
    if update_data.skills:
        jobs_data["skills"] = update_data.skills

    # Update certifications if provided
    if update_data.certifications:
        jobs_data["certifications"] = update_data.certifications

    # Update projects if provided
    if update_data.projects:
        jobs_data["projects"] = update_data.projects

    # Update languages if provided
    if update_data.languages:
        jobs_data["languages"] = update_data.languages

    return {"message": "Data updated successfully", "updated_data": jobs_data}