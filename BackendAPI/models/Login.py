from typing import  List
from pydantic import BaseModel

class User(BaseModel):
    userid: str
    username: str
    email: str
    password: str
    roles: List[str] = []

class Token(BaseModel):
    access_token: str
    token_type: str
    email: str
    roles: List[str]

class UserLogin(BaseModel):
    email: str
    password: str