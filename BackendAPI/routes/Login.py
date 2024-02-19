from fastapi import FastAPI, Form, HTTPException, Depends, status, APIRouter
from datetime import  timedelta
from config.db import conn
from models.Login import User,UserLogin,Token
from schemas.Login import create_user,verify_password,get_user_by_email,ACCESS_TOKEN_EXPIRE_MINUTES ,create_access_token,has_roles
 
 
 
login = APIRouter()
 
 
@login.post("/signup", response_model=User)
async def signup(user: User):
    """
    User signup endpoint for registering a new user.
 
    This endpoint allows users to sign up by providing email, username and password.
    It checks if the provided username or email is already registered and raises an error if a duplicate is found.
    Upon successful signup, it returns the user details.
    Args:
        - user (User): Represents user information including email and username.
    Returns:
        - User: Represents the registered user.
    Raises:
        - HTTPException:
            - Status Code 400: Raised if the provided username or email is already registered.
    """
    existing_user = conn.Interview_Assistent.User_SignUp.find_one({"email": user.email})
 
    if existing_user and user.username in existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
   
    if conn.Interview_Assistent.User_SignUp.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
   
    return create_user(conn.Interview_Assistent.User_SignUp, user)
 
# Route for user signup
@login.post("/token", response_model=Token)
async def Userlogin(username: str = Form(...), password: str = Form(...)):
    """
    User login endpoint for obtaining an access token.
 
    This endpoint allows users to log in by providing their email and password.
    It verifies the credentials, and if valid, issues an access token for authentication.
    Args:
        - login (UserLogin): Model representing user login information including email and password.
    Returns:
        - Token: Model representing the access token and its type.
    Raises:
        - HTTPException:
            - Status Code 401: Raised if the provided credentials are invalid.
    """
    user = get_user_by_email(username)
    if not user or not verify_password(password, user['password']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
   
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
   
    # Pass user roles when creating the access token
    access_token = create_access_token(
        data={"sub": user['email'], "roles": user.get("roles", [])},
        expires_delta=access_token_expires
    )
   
    response_data = {
        "access_token": access_token,
        "token_type": "bearer",
        "email": username,
        "roles": user.get("roles", [])
    }
   
    return response_data
 
 
 
 