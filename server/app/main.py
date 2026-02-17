from fastapi import FastAPI, Depends, HTTPException, Form, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import FileResponse
from pymongo import MongoClient
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from bson import ObjectId
import os

app = FastAPI()

# =============================
# DATABASE
# =============================

MONGO_URI = "mongodb+srv://vebhavworks_db_user:FdxHy4fz6xaUd5VG@cluster0.9jx9cdf.mongodb.net/campus_db?appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client["campus_db"]

users_collection = db["users"]
resources_collection = db["resources"]
reviews_collection = db["reviews"]

# Ensure uploads folder exists
if not os.path.exists("uploads"):
    os.makedirs("uploads")

# =============================
# SECURITY
# =============================

SECRET_KEY = "supersecret"
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return ObjectId(payload["user_id"])
    except:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# =============================
# BASIC
# =============================

@app.get("/")
def home():
    return {"message": "Backend running"}

# =============================
# AUTH
# =============================

@app.post("/register")
def register(email: str, password: str):
    if users_collection.find_one({"email": email}):
        return {"message": "User already exists"}

    hashed_password = pwd_context.hash(password)

    users_collection.insert_one({
        "email": email,
        "password": hashed_password,
        "points": 0,
        "isVerified": False,
        "created_at": datetime.utcnow()
    })

    return {"message": "User registered successfully"}

@app.post("/login")
def login(email: str, password: str):
    user = users_collection.find_one({"email": email})

    if not user or not pwd_context.verify(password, user["password"]):
        return {"message": "Invalid credentials"}

    token = create_token({"user_id": str(user["_id"])})
    return {"access_token": token}

# =============================
# PROTECTED TEST
# =============================

@app.get("/protected")
def protected_route(user_id: ObjectId = Depends(verify_token)):
    return {"message": "Authenticated", "user_id": str(user_id)}

# =============================
# RESOURCES (UPLOAD + LIST)
# =============================

@app.post("/resources")
def create_resource(
    title: str = Form(...),
    subject: str = Form(...),
    semester: str = Form(...),
    description: str = Form(...),
    file: UploadFile = File(...),
    user_id: ObjectId = Depends(verify_token)
):
    file_location = f"uploads/{file.filename}"

    with open(file_location, "wb") as f:
        f.write(file.file.read())

    resource = {
        "title": title,
        "subject": subject,
        "semester": semester,
        "description": description,
        "file_path": file_location,
        "uploaded_by": user_id,
        "rating": 0,
        "review_count": 0,
        "downloads": 0,
        "created_at": datetime.utcnow()
    }

    result = resources_collection.insert_one(resource)

    # Give 10 points for upload
    users_collection.update_one(
        {"_id": user_id},
        {"$inc": {"points": 10}}
    )

    return {"message": "Resource uploaded", "id": str(result.inserted_id)}

@app.get("/resources")
def get_resources():
    resources = list(resources_collection.find())

    for r in resources:
        r["_id"] = str(r["_id"])
        r["uploaded_by"] = str(r["uploaded_by"])

    return resources

@app.get("/resources/{resource_id}")
def get_single_resource(resource_id: str):
    resource = resources_collection.find_one({"_id": ObjectId(resource_id)})

    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    resource["_id"] = str(resource["_id"])
    resource["uploaded_by"] = str(resource["uploaded_by"])
    return resource

# =============================
# DOWNLOAD
# =============================

@app.get("/resources/{resource_id}/download")
def download_resource(resource_id: str):
    resource = resources_collection.find_one({"_id": ObjectId(resource_id)})

    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    file_path = resource["file_path"]

    # Increment download count
    resources_collection.update_one(
        {"_id": ObjectId(resource_id)},
        {"$inc": {"downloads": 1}}
    )

    return FileResponse(path=file_path, filename=os.path.basename(file_path))

# =============================
# REVIEWS
# =============================

@app.post("/resources/{resource_id}/review")
def add_review(
    resource_id: str,
    rating: int = Form(...),
    comment: str = Form(...),
    user_id: ObjectId = Depends(verify_token)
):
    review = {
        "resource_id": ObjectId(resource_id),
        "user_id": user_id,
        "rating": rating,
        "comment": comment,
        "created_at": datetime.utcnow()
    }

    reviews_collection.insert_one(review)

    # Recalculate average rating
    all_reviews = list(reviews_collection.find({"resource_id": ObjectId(resource_id)}))
    avg_rating = sum(r["rating"] for r in all_reviews) / len(all_reviews)

    resources_collection.update_one(
        {"_id": ObjectId(resource_id)},
        {
            "$set": {"rating": avg_rating},
            "$inc": {"review_count": 1}
        }
    )

    return {"message": "Review added"}

# =============================
# LEADERBOARD
# =============================

@app.get("/leaderboard")
def leaderboard():
    users = list(users_collection.find().sort("points", -1))

    leaderboard_list = []
    for u in users:
        leaderboard_list.append({
            "email": u["email"],
            "points": u["points"],
            "isVerified": u["isVerified"]
        })

    return leaderboard_list
