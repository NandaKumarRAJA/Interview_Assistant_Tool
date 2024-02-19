import os
from fastapi import APIRouter
import uuid
import google.generativeai as genai
from pyresparser import ResumeParser
from schemas.utils import to_markdown, parse_json_string, generate_json
from config.db  import conn
from fastapi import APIRouter, FastAPI, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse
import uvicorn
import schemas.constants as cst
from decouple import config
import json
import fitz


resume = APIRouter()




# @resume.post("/resumeextracion")
# async def extract_candidate_details(resume_filename: str):
#     try:
#         # Define the path where the resume will be saved
#         uploaded_resume_path = f"uploads/{resume_filename}"
#         # Extract data from the resume using resume_parser
#         data = ResumeParser(uploaded_resume_path).get_extracted_data()
#         # Print extracted data for debugging
#         print(data)
#         # Create the updated prompt with extracted data
#         updated_prompt = f"{cst.Resume_extraction_Prompt}\n\n{json.dumps(data)}"
#         # Print updated prompt for debugging
#         print(updated_prompt)
#         # Configure and use the generative model to generate content
#         genai.configure(api_key=config('API_KEY'))
#         model = genai.GenerativeModel(cst.GEMINI_MODEL)
#         response = model.generate_content(updated_prompt)
#         string_text = to_markdown(response.text)
#         json_data = parse_json_string(string_text.data)
#         #Return both the extracted data and the generated JSON data
#         return json_data
#     except Exception as e:
#         # Raise an exception with the error details if any exception occurs
#         raise RuntimeError(str(e))



# @resume.post("/resumeextracion")
# async def extract_candidate_details(resume_filename: str):
#     try:
#         doc = fitz.open(f"uploads/{resume_filename}")
 
#         # Initialize a list to hold each page's text
#         pages_text = []
 
#         # Extract text from each page
#         for page in doc:
#             pages_text.append(page.get_text())
 
#         # Close the document
#         doc.close()
 
#         # Convert the list of texts to a JSON format
#         pdf_json = json.dumps({"pages": pages_text}, ensure_ascii=False)
#         updated_prompt = cst.Resume_extraction_Prompt.format(pdf_json,cst.Resume_extraction_format,cst.job_titles)
#         print(updated_prompt)

#         genai.configure(api_key=config('API_KEY'))
#         model = genai.GenerativeModel(cst.GEMINI_MODEL)
#         response = model.generate_content(updated_prompt)
#         print(response)
#         string_text = to_markdown(response.text)
#         json_data = parse_json_string(string_text.data)

#         # Insert JSON data into the collection
#         # conn.Interview_Assistent.Resume_Extracted_data.insert_one(json_data)

#         return json_data
#     except Exception as e:
#         # Log the error for debugging purposes
#         print(f"An error occurred: {str(e)}")
#         return {"error": "An unexpected error occurred"}
    
@resume.post("/resumeextracion")
async def extract_candidate_details(resume_filename: str):
    try:
        doc = fitz.open(f"uploads/{resume_filename}")
 
        # Initialize a list to hold each page's text
        pages_text = []
 
        # Extract text from each page
        for page in doc:
            pages_text.append(page.get_text())
 
        # Close the document
        doc.close()
 
        # Convert the list of texts to a JSON format
        pdf_json = json.dumps({"pages": pages_text}, ensure_ascii=False)
        updated_prompt = cst.Resume_extraction_Prompt.format(pdf_json,cst.Resume_extraction_format,cst.job_titles)
        print(updated_prompt)

        genai.configure(api_key=config('API_KEY'))
        model = genai.GenerativeModel(cst.GEMINI_MODEL)
        response = model.generate_content(updated_prompt)
        print(response)
        string_text = to_markdown(response.text)
        json_data = parse_json_string(string_text.data)

        conn.Interview_Assistent.Resume_Extracted_data.insert_one(json_data)


        return json_data
    except Exception as e:
        # Log the error for debugging purposes
        print(f"An error occurred: {str(e)}")
        return {"error": "An unexpected error occurred"}

# #Return both the extracted data and the generated JSON data
        # try:
        #     conn.Interview_Assistent.Resume_Extracted_data.insert_one(json_data)
        # except Exception as e:
        #     return {"error": "An unexpected error occurred"}
    
# @resume.post("/resume_extraction")
# async def extract_candidate_details(resume_file: UploadFile = File(...)):
#     try:
#         # Save the uploaded resume to a temporary file
#         with open(f"uploads/{resume_file.filename}", "wb") as resume_data:
#             resume_data.write(await resume_file.read())

#         #Process the uploaded resume using the ResumeParser
#         parser = ResumeParser(f"uploads/{resume_file.filename}")

#         # Extract all raw data from the resume
#         extracted_data = parser.get_extracted_data_as_text()
#         # print("Extracted data:", extracted_data)  # Debug print

#         # Convert the extracted text data to JSON format
#         # extracted_data_json = parse_resume(f"uploads/{resume_file.filename}")
#         # print("Extracted data JSON:", extracted_data_json)  # Debug print

#         # Add error handling for missing data
#         if not extracted_data:
#             return {"error": "No data extracted from the resume"}

#         updated_prompt = cst.Resume_extraction_Prompt.format(extracted_data,cst.Resume_extraction_format)
#         print(updated_prompt)
#         #response = model.generate_content(updated_prompt)

#         # Configure and use the generative model to generate content
#         genai.configure(api_key=config('API_KEY'))
#         model = genai.GenerativeModel(cst.GEMINI_MODEL)
#         response = model.generate_content(updated_prompt)

#         # Access the generated text from the response object
#         generated_text = response.text

#         # Convert the generated text to JSON format
#         json_data = json.loads(generated_text)

#         # Return the generated JSON data
#         return json_data

#     except FileNotFoundError:
#         return {"error": "File not found"}

#     except json.JSONDecodeError:
#         return {"error": "Error decoding JSON data"}

#     except Exception as e:
#         # Log the error for debugging purposes
#         print(f"An error occurred: {str(e)}")
#         return {"error": "An unexpected error occurred"}

#     finally:
#         # Clean up: delete the temporary uploaded file
#         if os.path.exists(f"uploads/{resume_file.filename}"):
#             os.remove(f"uploads/{resume_file.filename}")

