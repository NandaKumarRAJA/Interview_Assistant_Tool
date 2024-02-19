from datetime import datetime
import logging
import uuid
import google.generativeai as genai
from schemas.utils import to_markdown, parse_json_string, generate_json
from config.db  import conn
from fastapi import APIRouter, FastAPI, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse
import uvicorn
import schemas.constants as cst
from decouple import config

QAGeneration = APIRouter()

# Configure logging
logging.basicConfig(level=logging.INFO)

def generate_qna(skill_list):
    """
    Function loads the LLM model and generates the Q&A:
       1. The Module uses Gemini as a base model to generate Q&A.
       2. The Module generates combination 10 Q&A, considering all the skillsets provided.
    Args:
        - skill_list (list) : List of candidate's matching skillset with the JD provided.
    Returns:
       - response: returns 10 Q&A generated.
       - Sample output: 
                {
                "Q&A": {
                    "question_answers": [
                    {
                        "domain": "Python",
                        "question": "What is the syntax for creating a list in Python?",
                        "answer": "A list in Python is created using square brackets [], and elements are separated by commas."
                    }]}
                }
    Raises:
       - Exception: None.
    """
    genai.configure(api_key=config('API_KEY'))
    model = genai.GenerativeModel(cst.GEMINI_MODEL)
    updated_prompt = cst.QA_PROMPT.format(skill_list, cst.QA_OUTPUT_FORMAT)
    print(updated_prompt)
    response = model.generate_content(updated_prompt)
    string_text = to_markdown(response.text)
    json_data = parse_json_string(string_text.data)
    logging.info("QnA generation successful.")
    return json_data

@QAGeneration.post("/Generate_Q&A")
async def generate_questions(skillset: list[str], candidateID: str,job_id: str):
    """
    Question & Answer generation api:
    The API generates Q&A for the selected candidates based on the skill set passed.
        1. Checks if the candidate profile is selected from the results of module 1 stored in the DB.
        2. Proceeds with Q&A generation only if module 1 is passed.
    Args:
        - skillset (list) : List of candidate's matching skillset with the JD provided.
        - candidateID : candidate's unique id which is used for saving the results.
        - job_id : unique job id for vacant positions.
    Returns:
       - response: returns 10 Q&A generated to the FE.
    Raises:
       - Exception: if there is an error processing the resonse Json form the model.
    """
    try:
        # Query MongoDB to retrieve interview results for the specified candidateId
        result = conn.Interview_Assistent.Resume_Validation.find_one({"CandidateID": candidateID})
        
        if result is None:
            raise HTTPException(status_code=404, detail="Interview result not found for the specified candidateId")

        # Retrieve the 'selectstatus' from the interview result
        select_status = result.get('ValidationStatus', None)
        if select_status is not None:
            # Check the condition based on 'selectstatus'
            if select_status.lower() == 'selected' or select_status.lower() == 'can consider' :
                # If selectstatus is 'selected', proceed with Q&A generation
                logging.info("Starting QnA generation...")
                response = generate_qna(skillset)
                QandA_result = {
                    "_id": str(uuid.uuid4()),
                    "QAgenerationRunId": int(datetime.now().timestamp()),
                    "CandidateID": candidateID,
                    "Timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "job_id": job_id,
                    "skills": skillset,
                    "QAGenerationStatus": "Generated"
                }

                try:
                    conn.Interview_Assistent.TopicAndQA.insert_one(QandA_result)
                    logging.info("Document inserted successfully with ID:", QandA_result["_id"])
                except Exception as e:
                    logging.error("Error inserting document:", str(e))
                return JSONResponse(content={"Q&A": response}, status_code=200)
            else:
                # If selectstatus is not 'selected', return an appropriate response
                return JSONResponse(content={"message": "Q&A generation is not triggered because the candidate is not selected."}, status_code=404)
        else:
            # Handle the case where 'selectstatus' is not present in the result
            raise HTTPException(status_code=500, detail="Select status not found in interview result")

    except Exception as e:
        return JSONResponse(content={"message": f"An error occurred: {str(e)}"}, status_code=500)