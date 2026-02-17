# CampusVault API Contract (FastAPI)

Base URL (local):
http://localhost:8000

Auth:
All protected routes require:
Authorization: Bearer <token>

---

## 1) Auth

### POST /auth/register
Creates a new user.

Request (JSON):
{
  "name": "John Doe",
  "email": "john@campus.com",
  "password": "123456",
  "department": "CSE",
  "semester": 3
}

Responses:
- 201 Created
- 409 Conflict (email exists)

---

### POST /auth/login
Logs in user.

Request (JSON):
{
  "email": "john@campus.com",
  "password": "123456"
}

Response 200:
{
  "token": "<jwt_token>",
  "user": {
    "id": "mongo_id",
    "name": "John Doe",
    "email": "john@campus.com",
    "semester": 3,
    "department": "CSE",
    "points": 10
  }
}

Responses:
- 401 Unauthorized (wrong credentials)

---

## 2) Resources

### POST /resources/upload  (Protected)
Uploads a resource (multipart/form-data).

Form fields:
- title (string, required)
- description (string)
- subject (string, required)
- semester (int, required)
- type (string, required) => QP | Notes | Books | Reports | Solutions
- year (int, required only if type=QP)
- tags (string, comma separated)
- file (file, required)

Response 201:
{
  "message": "Uploaded",
  "resourceId": "mongo_id"
}

Responses:
- 400 Bad Request (missing year for QP)
- 401 Unauthorized

---

### GET /resources
Fetch all resources (supports filters and sorting).

Query params:
- subject
- semester
- type
- year
- verified (true/false)
- sort (newest | rating | year)

Response 200:
[
  {
    "_id": "mongo_id",
    "title": "DSA Unit 3 Notes",
    "description": "Complete notes",
    "subject": "Data Structures",
    "semester": 3,
    "type": "Notes",
    "year": null,
    "tags": ["dsa","unit3"],
    "filePath": "uploads/dsa.pdf",
    "uploaderId": "mongo_user_id",
    "uploaderName": "John Doe",
    "avgRating": 4.6,
    "reviewsCount": 12,
    "downloadsCount": 40,
    "isVerified": true,
    "createdAt": "ISO_DATE"
  }
]

---

### GET /resources/{resourceId}
Fetch resource details.

Response 200:
(same object as above)

---

### GET /resources/{resourceId}/download
Downloads the file.

Response:
- File download stream
- 404 Not found

---

## 3) Reviews

### POST /reviews/{resourceId}  (Protected)
Adds a review.

Request (JSON):
{
  "rating": 5,
  "comment": "Very helpful notes"
}

Responses:
- 201 Created
- 409 Conflict (already reviewed)

---

### GET /reviews/{resourceId}
Returns reviews for a resource.

Response 200:
[
  {
    "_id": "mongo_id",
    "resourceId": "mongo_id",
    "userId": "mongo_user_id",
    "userName": "Alice",
    "rating": 5,
    "comment": "Great",
    "createdAt": "ISO_DATE"
  }
]

---

## 4) Bookmarks

### POST /bookmarks/{resourceId}  (Protected)
Bookmarks a resource.

Response 200:
{ "message": "Bookmarked" }

---

### DELETE /bookmarks/{resourceId}  (Protected)
Removes bookmark.

Response 200:
{ "message": "Removed" }

---

### GET /bookmarks  (Protected)
Returns all bookmarked resources for current user.

Response 200:
[ ...resources[]... ]

---

## 5) Leaderboard

### GET /leaderboard
Returns top contributors.

Response 200:
[
  {
    "_id": "mongo_id",
    "name": "John Doe",
    "department": "CSE",
    "semester": 5,
    "points": 120,
    "uploadsCount": 8
  }
]
