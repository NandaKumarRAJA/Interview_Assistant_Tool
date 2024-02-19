from typing import List, Dict


def ClusteredResumeEntity(cursor: List[Dict]) -> List[Dict]:
    clusteredResumes = []
    for item in cursor:
        resume = {
            "_id": item.get("_id", ""),
            "personal_info": item.get("personal_info", ""),
            "jobs": item.get("jobs", ""),
            "summary": item.get("summary", ""),
            "education": item.get("education", ""),
            "work_experience": item.get("work_experience", ""),
            "skills": item.get("skills", ""),
            "certifications": item.get("certifications", ""),
            "projects": item.get("projects", ""),
            "languages": item.get("languages", "")
        }
        clusteredResumes.append(resume)
    return clusteredResumes