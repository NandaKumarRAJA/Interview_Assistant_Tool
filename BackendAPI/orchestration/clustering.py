from prefect import Flow, flow, task
import schemas.constants as cst
# from schemas.utils import to_markdown, parse_json_string, generate_json
import logging
import google.generativeai as genai
from decouple import config
from config.db import conn
from config.db import MongoDBConnector
db_client=MongoDBConnector("mongodb://localhost:27017")
from config.db import conn
import re
import json
import pathlib
import textwrap
from markdown import markdown

def to_markdown(text):
    text = text.replace('•', '  *')
    return markdown(textwrap.indent(text, '> ', predicate=lambda _: True))


def parse_json_string(json_string_with_formatting):
    try:
        json_string = re.search(r'{.*}', json_string_with_formatting, re.DOTALL).group(0)
        pattern = r'"_id":\s*ObjectId\([^)]*\),?'
        result = re.sub(pattern, "", json_string)

        json_result = f'''{result}'''
        # print("json ",result)
        # Attempt to parse the JSON string
        parsed_json = json.loads(json_result)
        return parsed_json
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        print(f"Problematic JSON string: {result}")
        raise
        # Handle the error gracefully, possibly by logging it or returning a default value
    

@task(name="Gemini ai call", retries=5)
def gemini_llm_call_for_clustering(model, resume):  # Define as async function
    JD = (list(conn.Interview_Assistent.Job_Description.find()))
    results=[]
    for resume_data in resume:
        try:
            updated_prompt = cst.Unique_Filter_prompt.format(resume_data, JD, cst.Output_Format)
            response = model.generate_content(updated_prompt)
            string_text = to_markdown(response.text)
            json_data = parse_json_string(string_text)
            print("----------------------------------------------------------")
            print(json_data)
            print("----------------------------------------------------------")

            results.append(json_data)
            
        except Exception as e:
                 print(f"Error processing resume: {str(e)}")
                 print(f"{resume_data.profile_info.email} is not processed")
                 raise
    return results
    


@task(name="Load Gemini Pro Model", retries=4)
def load_gemini_pro_model_task():  # Define as async function
    genai.configure(api_key=config('API_KEY'))
    model = genai.GenerativeModel(cst.GEMINI_MODEL)
    return model


# @task(name="Insert into Database", retries=5)
# def insert_into_database(resumes):  
#     try:
#         if resumes:
#             db_client.insert(db_name=cst.DATABASE_NAME, collection_name=cst.UNIQUE_RESUME_COLLECTION, data=resumes)
#             logging.info("Resumes inserted into the database successfully.")
#         return {"status": "success"}
#     except Exception as e:
#         logging.error(f"Error while inserting into Database: {str(e)}")
#         return {"status": "error", "message": str(e)}

# with Flow("Resume Ingestion Flow") as flow:
@task(name="unique resume filtering", retries=5)
def process_resumes(resume_list):
    unique_resumes = []
    email_set = set()

    # Fetch email addresses from the database and check for uniqueness
    for resume_text in conn.Interview_Assistent.Clustered_Resume.find({}, {"personal_info.email": 1}):
        email = resume_text.get("personal_info", {}).get("email")
        if email:
            email_set.add(email)

    # Process resumes from the list
    for resume_data in resume_list:
        personal_info = resume_data.get("personal_info")
        if personal_info and personal_info.get("email"):
            email = personal_info["email"]
            if email not in email_set:
                unique_resumes.append(resume_data)
                email_set.add(email)
        else:
            print("Candidate already exists!!!")

    return unique_resumes
        

@flow(name="clustering a resume", retries=4)
def Clustering_unique_resumes(processed_resumes):
    unqiue_resume = process_resumes(processed_resumes)
    model =load_gemini_pro_model_task()
    clustered_resumes = []
    clustered_resumes =gemini_llm_call_for_clustering(model=model,resume=unqiue_resume)
    return clustered_resumes
    