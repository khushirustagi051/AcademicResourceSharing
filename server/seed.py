import os
import json
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017")
DB_NAME = os.getenv("DB_NAME", "campusvault")

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MOCK_DIR = os.path.join(ROOT_DIR, "mock-data")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

users_col = db["users"]
resources_col = db["resources"]
reviews_col = db["reviews"]
bookmarks_col = db["bookmarks"]

def load_json(filename):
    path = os.path.join(MOCK_DIR, filename)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def now_iso():
    return datetime.utcnow()

def reset_db():
    users_col.delete_many({})
    resources_col.delete_many({})
    reviews_col.delete_many({})
    bookmarks_col.delete_many({})

def seed_users():
    users = load_json("users.json")
    inserted = []

    for u in users:
        doc = {
            "name": u["name"],
            "email": f'{u["name"].replace(" ", "").lower()}@campus.com',
            "password": "seeded",  # backend can ignore for demo
            "department": u.get("department", ""),
            "semester": u.get("semester", 1),
            "points": u.get("points", 0),
            "uploadsCount": u.get("uploadsCount", 0),
            "createdAt": now_iso()
        }
        res = users_col.insert_one(doc)
        inserted.append((u["id"], str(res.inserted_id)))

    return dict(inserted)  # maps mock userId -> mongoId

def seed_resources(user_map):
    resources = load_json("resources.json")
    inserted = []

    # map uploaderName -> mongoId (best-effort)
    name_to_user_id = {}
    for mock_id, mongo_id in user_map.items():
        user_doc = users_col.find_one({"_id": mongo_id})
        if user_doc:
            name_to_user_id[user_doc["name"]] = mongo_id

    for r in resources:
        uploader_name = r.get("uploaderName", "Demo User")
        uploader_id = name_to_user_id.get(uploader_name)

        doc = {
            "title": r["title"],
            "description": r.get("description", ""),
            "subject": r.get("subject", ""),
            "semester": r.get("semester", 1),
            "type": r.get("type", "Notes"),
            "year": r.get("year"),
            "tags": r.get("tags", []),
            "filePath": r.get("filePath", "uploads/demo.pdf"),
            "uploaderId": uploader_id,
            "uploaderName": uploader_name,
            "avgRating": float(r.get("avgRating", 0)),
            "reviewsCount": int(r.get("reviewsCount", 0)),
            "downloadsCount": int(r.get("downloadsCount", 0)),
            "isVerified": bool(r.get("isVerified", False)),
            "createdAt": now_iso()
        }
        res = resources_col.insert_one(doc)
        inserted.append((r["_id"], str(res.inserted_id)))

    return dict(inserted)  # maps mock resourceId -> mongoId

def seed_reviews(resource_map, user_map):
    reviews = load_json("reviews.json")

    for rev in reviews:
        doc = {
            "resourceId": resource_map.get(rev["resourceId"]),
            "userId": None,
            "userName": rev.get("userName", "Anonymous"),
            "rating": int(rev.get("rating", 5)),
            "comment": rev.get("comment", ""),
            "createdAt": now_iso()
        }
        reviews_col.insert_one(doc)

def recalc_resource_stats():
    for r in resources_col.find({}):
        resource_id = str(r["_id"])
        revs = list(reviews_col.find({"resourceId": resource_id}))
        count = len(revs)
        avg = 0
        if count:
            avg = sum([x["rating"] for x in revs]) / count

        is_verified = (avg >= 4.2 and count >= 5)

        resources_col.update_one(
            {"_id": r["_id"]},
            {"$set": {
                "avgRating": round(avg, 2),
                "reviewsCount": count,
                "isVerified": is_verified
            }}
        )

def main():
    print("Seeding database...")
    print("Mongo URI:", MONGO_URI)
    print("DB:", DB_NAME)
    print("Mock dir:", MOCK_DIR)

    reset_db()
    user_map = seed_users()
    resource_map = seed_resources(user_map)
    seed_reviews(resource_map, user_map)
    recalc_resource_stats()

    print("Done.")
    print("Users:", users_col.count_documents({}))
    print("Resources:", resources_col.count_documents({}))
    print("Reviews:", reviews_col.count_documents({}))

if __name__ == "__main__":
    main()
