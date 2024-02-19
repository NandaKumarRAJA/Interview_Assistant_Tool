import json
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import JSONResponse
from pyresparser import ResumeParser
import replicate
from dotenv import find_dotenv, load_dotenv
import os
import nltk
from config.db import conn
from bson import ObjectId, json_util
from langchain.chat_models import ChatOpenAI  
from decouple import config
from langchain.schema import SystemMessage
import schemas.constants as cst
from schemas.utils import generate_profile_validator_response, process_openai_raw_response, parse_json_string
import logging
 
 
resumeValidator = APIRouter()
load_dotenv(find_dotenv())
 
nltk.download('maxent_ne_chunker')
nltk.download('words')
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('wordnet')
nltk.download('averaged_perceptron_tagger')
 
@resumeValidator.post("/ResumeValidationUsingLLAMA-2")
def compare_skills(Job_Description: str, resume_path:str, CandidateId : str , job_id: int):
    """
    Opensource resume validator api:
    The API validates the profile provided by comparing the resume with Job description provided.
    The process uses LLAMA-2 as a base model for profile validation.
    Args:
        - Job_Description (string) : Job details provided in string format.
        - resume_path : Location of the resume.
        - CandidateId : candidate's unique id which is used for saving the results.
    Returns:
       - Validation_result: The profile validation resules form the LLM model in Json format.
       - Sample output: 
                {
                    'match_percentage': [Percentage of match],
                    'top_skills_matching': ["skill A", "skill B"],
                    'missing_skills': ["skill C"],
                    'is_candidate_selected': 'SELECTED', 'NOT SELECTED', or 'CAN CONSIDER',
                    'reason': [Clear reason for selection status, e.g., 'Fully qualified for the given JD']
                }
    Raises:
       - Exception: if there is an error processing the provided profile or JD.
    """
    try:
        job_description_summary = json.loads(json_util.dumps(Job_Description))
        data = ResumeParser(f"uploads/{resume_path}").get_extracted_data()
        skills = data.get('skills', [])
        output = replicate.run(
            cst.PROFILE_VALIDATION_OPENSOURCE_MODEL,
            input={
                "debug": False,
                "top_k": 50,
                "top_p": 1,
                "prompt": cst.RESUME_VALIDATION_OPENSOURCE_PROMPT.format(skills, job_description_summary),
                "temperature": 0.5,
                "system_prompt": cst.RESUME_VALIDATION_SYSTEM_DESCRIPTION,
                "max_new_tokens": 500,
                "min_new_tokens": -1
            }
        )
        op_list = list(output)
        result = ''.join(op_list)
        response = parse_json_string(result)
        processed_response = generate_profile_validator_response(response)
        conn.Interview_Assistent.Resume_Validation.insert_one(processed_response)
        return processed_response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing skills comparison: {str(e)}")

@resumeValidator.get("/Get_resume_validation_result")
def resume_validation_result(Candidate_id:str):
    """
    Get resume validation result for a specific candidate.
    The response JSON format includes details of the validated result for the resume and JD of a candidate
    Args:
        - Candidate_id (str): Identifier for the candidate.
    Returns:
        - JSONResponse: JSON content containing the resume validation result for the specified candidate.
    Raises:
        - HTTPException:
            1. Status Code 404: Candidate not found.
    """
    candidate = conn.Interview_Assistent.Resume_Validation.find_one({"CandidateID": Candidate_id}, {"_id": 0})
    if candidate:
        return JSONResponse(content=candidate)
    else:
        raise HTTPException(status_code=404, detail="Candidate not found")
 
@resumeValidator.post("/Resume_Validation_OpenAI")
def compare_skills_using_openAI(job_data: str, resume_path:str,candidate_id : str, job_id: int):
    """
    OpenAI resume validator api:
    The API validates the profile provided by comparing the resume with Job description provided.
    The process uses GPT-3.5 as a base model for profile validation.
    Args:
        - job_data (string) : Job description provided in string format.
        - resume_path : Location of the uploaded resume.
    Returns:
       - processed_response: The profile validation resules form the LLM model in Json format.
       - Sample output: 
                {
                    'match_percentage': [Percentage of match],
                    'top_skills_matching': ["skill A", "skill B"],
                    'missing_skills': ["skill C"],
                    'is_candidate_selected': 'SELECTED', 'NOT SELECTED', or 'CAN CONSIDER',
                    'reason': [Clear reason for selection status, e.g., 'Fully qualified for the given JD']
                }
    Raises:
       - Exception:
                1. Error in processing the resonse Json structure. 
                2. Error in processing the provided profile or JD.
    """
    try:
        try:
            job_description_summary = json.loads(job_data)
        except json.JSONDecodeError:
            try:
                job_description_summary = json.loads(json_util.dumps(str(job_data)))
            except (json.JSONDecodeError, TypeError):
                raise HTTPException(status_code=400, detail="Invalid JSON format in job_data")
 
        data = ResumeParser(f"uploads/{resume_path}").get_extracted_data() 
        print(data)
        os.environ['OPENAI_API_KEY'] = config('OPENAI_API_KEY')
        llm_model = ChatOpenAI(model_name=cst.PROFILE_VALIDATOR_OPENAI_MODEL, temperature=0)
        updated_prompt = cst.RESUME_VALIDATION_OPENAI_PROMPT.format(data, job_description_summary, cst.RESUME_VALIDATION_OUTPUT_FORMAT)
        response = llm_model([SystemMessage(content=updated_prompt)])
        try:
            response_content =response.content
            response_raw_json = process_openai_raw_response(response_content)
            response_json = json.loads(response_raw_json)
            processed_response = generate_profile_validator_response(response_json, candidate_id, job_id)
            conn.Interview_Assistent.Resume_Validation.insert_one(processed_response)
            return processed_response
        except json.JSONDecodeError as e:
            logging.warning(f"JSON decode error: {e}")
            return JSONResponse(content=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing profile validation: {str(e)}")
 