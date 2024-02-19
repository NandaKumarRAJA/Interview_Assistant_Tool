from typing import List, Dict
import uuid


def CandidateEntity(item: Dict) -> Dict:
    return {
        "_id": str(uuid.uuid4()),
        "CandidateID": item.get("CandidateID", ""),
        "FirstName": item.get("FirstName", ""),
        "LastName": item.get("LastName", ""),
        "TotalExperience": str(item.get("TotalExperience", "")),
        "DOB": item.get("DOB", ""),
        "DOJ": item.get("DOJ", ""),
        "Email": item.get("Email", ""),
        "PhoneNO": item.get("PhoneNO", ""),
        "CurrentLocation": item.get("CurrentLocation", ""),
        "Address": item.get("Address", ""),
        "LinkinID": item.get("LinkinID", ""),
        "Resume": item.get("Resume", ""),
        "JobTitle": item.get("JobTitle", ""),
        "JobId": item.get("JobId", "")
}

def CandidatesEntity(cursor: List[Dict]) -> List[Dict]:
    candidates = []
    for item in cursor:
        candidate_data = {
            "CandidateID": item.get("CandidateID", ""),
            "FirstName": item.get("FirstName", ""),
            "LastName": item.get("LastName", ""),
            "TotalExperience": str(item.get("TotalExperience", "")),
            "DOB": item.get("DOB", ""),
            "DOJ": item.get("DOJ", ""),
            "Email": item.get("Email", ""),
            "PhoneNO": item.get("PhoneNO", ""),
            "CurrentLocation": item.get("CurrentLocation", ""),
            "Address": item.get("Address", ""),
            "LinkinID": item.get("LinkinID", ""),
            "Resume": item.get("Resume", ""),
            "JobTitle": item.get("JobTitle", ""),
            "JobId": item.get("JobId", "")
        }
        candidates.append(candidate_data)
    return candidates

