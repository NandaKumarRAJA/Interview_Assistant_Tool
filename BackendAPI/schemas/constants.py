#----------------------------------------------------------------RESUME VALIDATION----------------------------------------------------------------------------------------
PROFILE_VALIDATOR_OPENAI_MODEL = "gpt-3.5-turbo"
PROFILE_VALIDATION_OPENSOURCE_MODEL = "meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3"
RESUME_VALIDATION_OUTPUT_FORMAT = """
{
    'match_percentage': [Percentage of match],
    'top_skills_matching': ["skill A", "skill B"],
    'missing_skills': ["skill C"],
    'is_candidate_selected': 'SELECTED', 'NOT SELECTED', 'CAN CONSIDER'
    'reason': [Clear reason for selection status, e.g., 'Fully qualified for the given JD']
}
"""

RESUME_VALIDATION_SYSTEM_DESCRIPTION = f"""
You're an AI job matching and analysis assistant. 
Your objective is to thoroughly evaluate a candidate's resume in comparison to a given job description.
throughly evaluate candidate's technical skills in various domains and provide the final output only in python dictionary format as {RESUME_VALIDATION_OUTPUT_FORMAT}.
Missing_skills should only have skills mentioned in the job description but missing in the candidate's resume.
Use skillsets only mentioned in the Job description and Profile, Do not hallucinate any new data.
Avoid including extra information apart from the output format required.
"""

RESUME_VALIDATION_OPENSOURCE_PROMPT = """compare these profile {} with this job description {}"""


RESUME_VALIDATION_OPENAI_PROMPT = """
    Resume = {}
    job_description = {}
    You are a helpful resume validator who compares the given resume with the job description and provides a profile match in percentage %.
    Your task is to do an in-depth analysis of the resume by checking the qualifications & mandatory skills required from the job description provided.
    Also, finally, suggest whether the given profile matches the job description.
    Note:
    1. Consider candidates if they expert in the in many skills and only lack in few other.
    2. Do an in-depth analysis of their practical project work for gaining insights.
    3. Top skill should contain only the matching skills present in both job description and candidate resume.
    4. Missign skill should only contain skill from the job description which are missing in the candidate's profile.
    5. strictly do not hallucinate any data.
    IMPORTANT: The output should be in a dictionary format  = {}
"""

#----------------------------------------------------------------Q&A GENERATION MODULE----------------------------------------------------------------------------------------
GEMINI_MODEL = "gemini-pro"

QA_PROMPT = """Generate 10 interview Q&A pairs for a candidate assessment in the following list of domains {} in nested json format with question_answers as key.
Finall generate 1 tricky scenario based question complexity based on the experience level of the candidate on any one of the domains provided.
The output should be in the form as output_structure :{}.
"""
QA_OUTPUT_FORMAT = """
"question_answers": [
    {
      "domain": "Domain 1",
      "question": "Question 1",
      "answer": "Answer 1"
    },
    {
      "domain": "Domain 2",
      "question": "Question 2",
      "answer": "Answer 2"
    },
    {
      "domain": "Scenario based question",
      "question": "Question 3",
      "answer": "Answer 3"
    }
]
"""
#----------------------------------------------------------------INTERVIEW VALIDATION MODULE----------------------------------------------------------------------------------------

INTERVIEW_VALIDATOR_SYSTEM_PROMPT = """you are the interview assistant for data science project your job is to help the interviewer to evaluate the candidate and give suggestion
 to move the candidate to next round of interview or reject the candidate by using the conversation between the interviewer and the candidate.
 * if overall_score is less than 3.25 reject the candidate
 * strictly do not take the self rating score from the candidate
 * reduce mark if candidate does not answer the questions"""

INTERVIEW_VALIDATOR_PROMPT = """{}
please evaluate the candidate based on the question and answer discussion and give the over all score to the candidate, the score to each Technical domain questions with maximum mark of 5 and separate Topic wise score with maximum mark of 5 and give final vedict of the candidate.
based on this discussion transcript:{}
* if overall_score is less than 3.25 reject the candidate
* strictly do not take the self rating score from the candidate
* strictly consider only proper and complete technical questions while extracting the questions_answer.
* reduce mark if candidate does not answer the questions
* verdict : ("accept","reject","can consider")
* strictly do not hallucinate
strictly generate report in json format:
sample output:
( "interviewer_name": "interviewer_name", "candidate_name": "candidate_name","overall_score": "score",
topics: [("topic_name": "topic_name", "topic_score": "topic_score","candidate_skill_rating_explaination":"candidate_skill_rating_explaination")],
"questions_answer":[("Topic":"Python", "question": "what is an array?", "answer": "an array is a data structure that stores a collection of items"m "score":5),
                    (("Topic":"Machine Learning", "question": "What is SVD in ML?", "answer": "Singular Value Decomposition (SVD) is a mathematical technique used in machine learning and other fields for dimensionality reduction, feature extraction, and matrix factorization", "score":5)
"interview_verdict":"verdict","overall_report":"report")
"""


RESUME_EXTRACTION_SYSTEM_PROMPT="""you are the resume format expert you need to extract Named entity and all information about the candidate from the given summary and return
required information in JSON format\n\n if the required data is not present in the summary do not return key value pair for that data
\n\n
## sample json example ##
{
  "personal_info": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "linkedin": "linkedin.com/in/johndoe",
    "github": "github.com/johndoe",
    "address": "123 Main St, City, Country"
  },
  "summary": "Experienced software engineer with a strong background in developing scalable applications using Python and JavaScript. Proven ability to lead teams and manage projects from conception to completion.",
  "education": [
    {
      "degree": "Master of Science in Computer Science",
      "institution": "University of Technology",
      "year": 2020,
      "location": "City, Country"
    },
    {
      "degree": "Bachelor of Science in Information Technology",
      "institution": "Institute of Science and Technology",
      "year": 2018,
      "location": "City, Country"
    }
  ],
  "work_experience": [
    {
      "position": "Senior Software Engineer",
      "company": "Tech Solutions Inc.",
      "duration": "Jan 2022 - Present",
      "location": "City, Country",
      "responsibilities": [
        "Lead the development of a new SaaS platform, increasing customer satisfaction by 20%.",
        "Mentor junior developers, providing guidance on best practices in software development."
      ]
    },
    {
      "position": "Software Engineer",
      "company": "Innovative Tech Ltd.",
      "duration": "Feb 2020 - Dec 2021",
      "location": "City, Country",
      "responsibilities": [
        "Developed and maintained high-traffic web applications.",
        "Collaborated with cross-functional teams to define, design, and ship new features."
      ]
    }
  ],
  "skills": [
    "Python", "JavaScript", "React", "Node.js", "Docker", "Kubernetes", "SQL", "NoSQL", "Git"
  ],
  "certifications": [
    {
      "title": "Certified Kubernetes Administrator",
      "issuer": "The Linux Foundation",
      "year": 2021
    },
    {
      "title": "AWS Certified Solutions Architect",
      "issuer": "Amazon Web Services",
      "year": 2020
    }
  ],
  "projects": [
    {
      "name": "Project Management Tool",
      "description": "A web application for managing software development projects, featuring a real-time collaboration board.",
      "technologies": ["React", "Node.js", "MongoDB"],
      "year": 2021
    }
  ],
  "languages": [
    {
      "language": "English",
      "proficiency": "Native"
    },
    {
      "language": "Spanish",
      "proficiency": "Fluent"
    }
  ]
  
}


 """

RESUME_EXTRACTION_PROMPT= """{}\n\n
generate resume details from the given extraction data\n\n
## if not able to find particular key value return as "not avaialabe" ##\n\n
## only return json data ##\n\n
{}
\n\n
"""


## database constants
DATABASE_NAME='Interview_Assistent'
RESUME_COLLECTION="resume_test"
UNIQUE_RESUME_COLLECTION ="Clustered_Resume"



Unique_Filter_prompt = """You're an AI assistant and you have to analyze the compatibility of a resumes {} with multiple job descriptions {} and determine the top 3 matching job descriptions along with their respective matching percentages.Give the output in {} that i provided"""
Output_Format="""{
 
  "jobs": [
    {
      
      "top_3": [
        {"job_title": "Data Scientist", "percentage": "85%"},
        {"job_title": "Full Stack Developer", "percentage": "60%"},
        {"job_title": "Technical Lead", "percentage": "55%"}
      ]
    }
  ],

  "personal_info": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "linkedin": "linkedin.com/in/johndoe",
    "github": "github.com/johndoe",
    "address": "123 Main St, City, Country"
  },
  "summary": "Experienced software engineer with a strong background in developing scalable applications using Python and JavaScript. Proven ability to lead teams and manage projects from conception to completion.",
  "education": [
    {
      "degree": "Master of Science in Computer Science",
      "institution": "University of Technology",
      "year": 2020,
      "location": "City, Country"
    },
    {
      "degree": "Bachelor of Science in Information Technology",
      "institution": "Institute of Science and Technology",
      "year": 2018,
      "location": "City, Country"
    }
  ],
  "work_experience": [
    {
      "position": "Senior Software Engineer",
      "company": "Tech Solutions Inc.",
      "duration": "Jan 2022 - Present",
      "location": "City, Country",
      "responsibilities": [
        "Lead the development of a new SaaS platform, increasing customer satisfaction by 20%.",
        "Mentor junior developers, providing guidance on best practices in software development."
      ]
    },
    {
      "position": "Software Engineer",
      "company": "Innovative Tech Ltd.",
      "duration": "Feb 2020 - Dec 2021",
      "location": "City, Country",
      "responsibilities": [
        "Developed and maintained high-traffic web applications.",
        "Collaborated with cross-functional teams to define, design, and ship new features."
      ]
    }
  ],
  "skills": [
    "Python", "JavaScript", "React", "Node.js", "Docker", "Kubernetes", "SQL", "NoSQL", "Git"
  ],
  "certifications": [
    {
      "title": "Certified Kubernetes Administrator",
      "issuer": "The Linux Foundation",
      "year": 2021
    },
    {
      "title": "AWS Certified Solutions Architect",
      "issuer": "Amazon Web Services",
      "year": 2020
    }
  ],
  "projects": [
    {
      "name": "Project Management Tool",
      "description": "A web application for managing software development projects, featuring a real-time collaboration board.",
      "technologies": ["React", "Node.js", "MongoDB"],
      "year": 2021
    }
  ],
  "languages": [
    {
      "language": "English",
      "proficiency": "Native"
    },
    {
      "language": "Spanish",
      "proficiency": "Fluent"
    }],
  "uuid":"b7ff212d-7e2f-4e44-94b6-4800c538e3e5",
  "batch_id":"6430c895-cac9-433d-bf3a-a53965487653"

}"""
