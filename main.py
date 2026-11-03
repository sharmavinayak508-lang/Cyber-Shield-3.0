# main.py - Your Backend Server
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from jose import jwt
import database
import auth

app = FastAPI(title="CYBER SHIELD 3.0 API")

# Allow your GitHub Page to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # change to your github.io URL after testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "change-this-to-any-random-string-123"
ALGORITHM = "HS256"

# Create tables on start
database.init_db()

@app.get("/")
def home():
    return {"status": "CYBER SHIELD Backend is Running", "backend": "connected"}

@app.post("/register")
def register(username: str, password: str):
    if database.get_user(username):
        raise HTTPException(status_code=400, detail="User already exists")
    hashed = auth.get_password_hash(password)
    database.create_user(username, hashed)
    return {"message": "User registered successfully"}

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = database.get_user(form_data.username)
    if not user or not auth.verify_password(form_data.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    expire = datetime.utcnow() + timedelta(hours=24)
    token = jwt.encode({"sub": form_data.username, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}

@app.get("/dashboard")
def get_dashboard_data(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        return {
            "user": username,
            "security_score": 75,
            "url_checks": database.get_url_check_count(username),
            "files_analyzed": database.get_file_count(username),
            "alerts": 0
        }
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
