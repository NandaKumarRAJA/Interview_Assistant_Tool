import re
import json
import pathlib
import textwrap
import google.generativeai as genai
from IPython.display import display
from IPython.display import Markdown
import uuid
from datetime import datetime

# def to_markdown(text):
#   text = text.replace('•', '  *')
#   return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))

# def parse_json_string(json_string_with_formatting):

#     json_string = json_string_with_formatting.replace('> ', '').replace('```', '').replace('\n', '').replace('',"")

#     try:
#         # Try parsing the JSON string
#         parsed_json = json.loads(json_string)
#     except json.JSONDecodeError as e:
#         print(f"Error decoding JSON: {e}")
#         print(f"Problematic JSON string: {json_string}")
#         # Handle the error gracefully, possibly by logging it or returning a default value
#         return {}  # Return an empty dictionary as a default value
    
#     return parsed_json
#     # # Remove formatting characters
#     # json_string = json_string_with_formatting.replace('> ', '').replace('```', '').replace('\n', '')

#     # # Initialize parsed_json as None
#     # parsed_json = None

    
#     # try:
#     #     # Try parsing the JSON string
#     #     parsed_json = json.loads(json_string)
#     # except json.JSONDecodeError as e:
#     #     print(f"Error decoding JSON: {e}")
#     #     # Handle the error gracefully, possibly by logging it or returning a default value
#     #     parsed_json = {}  # Return an empty dictionary as a default value
#     # return parsed_json
#     # # Access the data
#     # questions_and_answers = parsed_json.get('question_answers', [])
#     # return parsed_json

def to_markdown(text):
    text = text.replace('•', ' * ')
    return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))

def parse_json_string(json_string_with_formatting):
    # Remove formatting characters
    json_string = json_string_with_formatting.replace('> ', '').replace('```', '').replace('\n', '')

    # Initialize parsed_json as None
    parsed_json = None

    try:
        # Try parsing the JSON string
        parsed_json = json.loads(json_string)
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        raise  # Re-raise the exception

    # Access the data
    questions_and_answers = parsed_json.get('question_answers', [])
    return parsed_json


def generate_json(parsed_Json):
    # Create a JSON file
    with open('parsed_data.json', 'w') as json_file:
        json.dump(parsed_Json, json_file, indent=2)
        print("Parsed data saved to 'parsed_data.json'.")


def generate_profile_validator_response(response, candidate_id, job_id):
    response_dictionary = {
            "_id" : str(uuid.uuid4()),
            "ValidationRunId": int(datetime.now().timestamp()),
            "CandidateID": candidate_id,
            "Timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "ValidationResultScore": response['match_percentage'],
            "Explanation": response['reason'],
            "ValidationStatus": response['is_candidate_selected'],
            "top_skills_matching": response['top_skills_matching'],
            "job_id": job_id,
            "missing_skills": response['missing_skills']
    }
    return response_dictionary


def process_openai_raw_response(raw_data):
    processed_data = raw_data.replace("'", '"')
    processed_data = processed_data.replace("\n", "")
    return processed_data