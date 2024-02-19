from models.Login import User
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import JWTError 
from jose import jwt
import secrets
from datetime import datetime, timedelta
from config.db import conn
from fastapi import  HTTPException, Depends, status



# Replace these with your actual secret key and algorithm
SECRET_KEY = secrets.token_urlsafe(32)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# OAuth2PasswordBearer for handling token in headers
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Dependency to get the current user from the token
def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    return payload

# Function to create access token
def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire, "roles": data.get("roles", [])})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Function to verify password
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Function to get user by username
def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return User(**user_dict)

# Function to get user by email
def get_user_by_email(email: str):
    user = conn.Interview_Assistent.User_SignUp.find_one({"email": email})
    if user:
        return user

# Function to create user
def create_user(db, user: User):
    hashed_password = pwd_context.hash(user.password)
    db.insert_one({
        'userid': user.userid,
        'username': user.username,
        'email': user.email,
        'password': hashed_password,
        'roles': user.roles  # Updated to use 'roles' instead of 'role'
    })
    return user

# Decorator function to check if the user has required roles
def has_roles(roles: list = []):
    def wrapper(current_user: dict = Depends(get_current_user)):
        user_roles = current_user.get("roles", [])
        for role in roles:
            if role not in user_roles:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You don't have permission to access this resource",
                )
        return current_user
    return wrapper