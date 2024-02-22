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
   




