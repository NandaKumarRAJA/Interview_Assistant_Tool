from unittest import skip
from fastapi import APIRouter, Depends, HTTPException
from httpx import Limits
from config.db import conn
from models.JD import JobDetails
from schemas.Login import has_roles


Job_discription = APIRouter()


@Job_discription.get('/Job_Details/{job_id}')
async def read_job(job_id: str):
    """
    Retrieve details of a job based on its unique identifier.
 
    This endpoint allows retrieving and returning details of a job based on the jobId.
    Args:
        - job_id (str): Unique identifier for the job.
    Returns:
        - dict: A dictionary containing details of the specified job.
    Raises:
        - HTTPException:
            - Status Code 404: Raised if no job is found with the provided unique identifier.
    """
    result =  conn.Interview_Assistent.Job_Description.find_one({"jobId": job_id}, {"_id": 0})

    if result is None:
        raise HTTPException(status_code=404, detail="Job not found")

    return result

@Job_discription.get('/Job_Description/{job_title}')
async def read_job(job_title: str):
    """
    Retrieve details of a job based on its title.
 
    This endpoint allows retrieving and returning details of a job based on the provided job title.
    Args:
        - job_title (str): Title of the job.
    Returns:
        - dict: A dictionary containing details of the specified job.
    Raises:
        - HTTPException:
            - Status Code 404: Raised if no job is found with the provided title.
    """
    result =  conn.Interview_Assistent.Job_Description.find_one({"jobTitle": job_title}, {"_id": 0})
 
    if result is None:
        raise HTTPException(status_code=404, detail="Job title not found")
 
    return result

@Job_discription.get('/Job_Details')
async def read_all_jobs():
    """
    Retrieve details of all jobs.
 
    This endpoint allows retrieving and returning details of all jobs available in the system.
    Returns:
        - list: A list containing dictionaries, each representing details of a job.
    Raises:
        - None.
    """
    results = conn.Interview_Assistent.Job_Description.find({}, {"_id": 0})

    job_list = list(results)

    return job_list


# List to store job details (replace with a database in a production environment)
job_details_list = []

@Job_discription.post("/job_description/", dependencies=[Depends(has_roles(["admin"]))])
async def create_job_description(job_details: JobDetails):
    """
    Create a new job description.
 
    This endpoint allows creating a new job description by providing details through the request body.
    The job details are submitted as a Pydantic model (JobDetails).
    Args:
        - job_details (JobDetails): Pydantic model representing the details of the job.
    Returns:
        - dict: A dictionary containing a message indicating the success of the job description creation
          and the ID of the newly inserted document.
    Raises:
        - HTTPException:
            - Status Code 400: Raised if the provided job ID already exists.
            - Status Code 500: Raised if there is an error during the creation process.
    """
    try:
        existing_job = conn.Interview_Assistent.Job_Description.find_one({"jobId": job_details.jobId})
        if existing_job:
            raise HTTPException(status_code=400, detail="Job ID already exists")

        # Convert Pydantic model to dict
        job_description_dict = job_details.dict()

        # Insert the data into MongoDB
        result = conn.Interview_Assistent.Job_Description.insert_one(job_description_dict)

        # Check if the insertion was successful
        if result:
            return {"message": "Job description created successfully", "job_id": str(result)}
        else:
            raise HTTPException(status_code=500, detail="Failed to create job description")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))