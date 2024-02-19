import logging
import google.generativeai as genai

from schemas.utils import to_markdown, parse_json_string, generate_json
from typing import List
from fastapi import APIRouter, File, HTTPException, Path, UploadFile
from fastapi.responses import FileResponse, JSONResponse
import schemas.constants as cst
from decouple import config

import pdfkit
import fitz
from docx import Document 
from uuid import uuid4
from pydantic import BaseModel
import os
from config.db import conn
from typing import Optional
from orchestration.dataingestion import extract_text_from_docx,extract_text_from_pdf,dataingestionflow
from orchestration.resume_extraction import resume_format_extraction_flow
from config.db import MongoDBConnector
from schemas.clusteredResumeSchema import ClusteredResumeEntity
from orchestration.clustering import Clustering_unique_resumes

dataingestion = APIRouter()
db_client=MongoDBConnector("mongodb://localhost:27017")


# class Resume(BaseModel):
#     uuid: Optional[str]
#     filename: str
#     text: Optional[dict]




@dataingestion.post("/resume_ingestion/")
async def ingest_resumes(batch_id: str):
    folder_path = f'C:/Users/NandaKumarRaja/source/Interview-Assistant-Project/Interview-validation-Assistant/BackendAPI/uploads/{batch_id}'
    extracted_resumes = dataingestionflow(folder_path,batch_id)
    processed_resumes = resume_format_extraction_flow(extracted_resumes)
    # print(processed_resumes)
    await db_client.insert(db_name=cst.DATABASE_NAME, collection_name=cst.RESUME_COLLECTION, data=processed_resumes)
    print("unique resume function calling ---------------")
    clustered_resumes=[]
    if len(processed_resumes) > 0:
        clustered_resumes= Clustering_unique_resumes(processed_resumes)
        await db_client.insert(db_name=cst.DATABASE_NAME, collection_name=cst.UNIQUE_RESUME_COLLECTION, data=clustered_resumes)
        print(clustered_resumes)
    print("clustering function is finished------------------------")
    return clustered_resumes
   






# @dataingestion.post("/unique_resume_filtering")
# async def unique_resume(resume: List[dict]):
#     try:
        
#         unique_resumes = []
#         email_set = set()  
#         for resume_data in resume:
#             personal_info = resume_data.get("personal_info")
#             if personal_info and personal_info.get("email"):
#                 email = personal_info["email"]
#                 if email not in email_set:
#                     # If email is unique, add the resume to the list and update the set
#                     unique_resumes.append(resume_data)
#                     email_set.add(email)

#         genai.configure(api_key=config('API_KEY'))
#         model = genai.GenerativeModel(cst.GEMINI_MODEL)
#         if unique_resumes:
#             updated_prompt = cst.Unique_Filter_prompt.format(unique_resumes,cst.Output_Format)
#             print(updated_prompt)
#             print(type(updated_prompt))
#             response = model.generate_content(updated_prompt)
#             print(response.text)
#             string_text = to_markdown(response.text)
#             print(string_text)
#             json_data = parse_json_string(string_text.data)
#             print(json_data)


#         return json_data
#     except Exception as e:
#         # Handle exceptions and return appropriate response
#         raise HTTPException(status_code=500, detail=str(e))


# @dataingestion.post("/unique_resume_filtering")
# async def unique_resume(resume_list:List[dict]):
#     try:
#         print("clustering ------------------------------------------------------------")
#         print(resume_list)
#         genai.configure(api_key=config('API_KEY'))
#         model = genai.GenerativeModel(cst.GEMINI_MODEL)
#         JD = list(conn.Interview_Assistent.Job_Description.find())
#         unique_resumes = []
#         email_set = set()

#         # Fetch email addresses from the database and check for uniqueness
#         for resume_text in conn.Interview_Assistent.Clustered_Resume.find({}, {"personal_info.email": 1}):
#             email = resume_text.get("personal_info", {}).get("email")
#             if email:
#                 email_set.add(email)

#         # Process resumes from the list
#         for resume_data in resume_list:
#             personal_info = resume_data.get("personal_info")
#             if personal_info and personal_info.get("email"):
#                 email = personal_info["email"]
#                 if email not in email_set:
#                     unique_resumes.append(resume_data)
#                     email_set.add(email)
#             else:
#                 print("Candidate already exists!!!")

#         # Process unique resumes
#         results = []
#         for resume_data in unique_resumes:
#             try:
#                 updated_prompt = cst.Unique_Filter_prompt.format(resume_data, JD, cst.Output_Format)
#                 response = model.generate_content(updated_prompt)
#                 string_text = to_markdown(response.text)
#                 json_data = parse_json_string(string_text.data)
#                 results.append(json_data)
#                 try:
#                     for document in results:
#                         print(document)
#                         conn.Interview_Assistent.Clustered_Resume.insert_one(document)
#                     # conn.Interview_Assistent.Clustered_Resume.insert_many(results)
#                 except Exception as e:
#                     print(f"Error while inserting into Database : {str(e)}")
#                     # raise e
#             except Exception as e:
#                 print(f"Error processing resume: {str(e)}")
#                 # raise e

#         return resume_data

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    
# @dataingestion.get('/clustered_resumes' )
# async def find_all_clustered_resumes():
#     """
#     Retrieve details of all candidates.
#     This endpoint fetches and returns details of all candidates from the Candidate_Details collection.
#     Returns:
#         - JSONResponse: A JSON response containing the details of all candidates.
#     Raises:
#         - None.
#     """
#     cursor = conn.Interview_Assistent.Clustered_Resume.find({},{ "_id": 0})
#     candidates = ClusteredResumeEntity(cursor)
#     return JSONResponse(content=candidates)