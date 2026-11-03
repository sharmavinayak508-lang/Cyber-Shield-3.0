from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from jose import jwt
import database, auth

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
SECRET_KEY="cyber-shield-secret-123"; ALGORITHM="HS256"
database.init_db()

@app.get("/")
def home(): return {"backend":"connected"}

@app.post("/register")
def register(username: str, password: str):
    if database.get_user(username): raise HTTPException(400, "User exists")
    database.create_user(username, auth.get_password_hash(password))
    return {"message":"Registered"}

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user=database.get_user(form_data.username)
    if not user or not auth.verify_password(form_data.password, user['password']):
        raise HTTPException(401, "Invalid")
    token=jwt.encode({"sub":form_data.username,"exp":datetime.utcnow()+timedelta(hours=24)}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token":token,"token_type":"bearer"}

@app.get("/dashboard")
def dashboard(token: str):
    try:
        payload=jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"user":payload.get("sub"),"security_score":85,"url_checks":database.get_url_count(payload.get("sub")),"files_analyzed":database.get_file_count(payload.get("sub"))}
    except: raise HTTPException(401, "Invalid token")

@app.get("/scan-url")
def scan_url(url: str, token: str):
    database.log_activity(token, "url", url)
    return {"url":url,"result":"safe"}

@app.get("/analyze-file")
def analyze_file(token: str):
    database.log_activity(token, "file", "uploaded")
    return {"result":"clean"}
