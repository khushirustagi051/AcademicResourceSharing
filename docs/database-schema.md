# Database Schema (MongoDB)

This document defines the MongoDB collections and fields used by CampusVault.

---

## 1) users

Stores registered users and contributor stats.

Example document:
{
  "_id": ObjectId,
  "name": "Demo User",
  "email": "demo@campus.com",
  "password": "<hashed_password>",
  "department": "CSE",
  "semester": 3,
  "points": 40,
  "uploadsCount": 3,
  "createdAt": ISODate
}

Indexes:
- email (unique)

---

## 2) resources

Stores uploaded resource metadata and file path.

Example document:
{
  "_id": ObjectId,
  "title": "DBMS QP 2023",
  "description": "End-sem paper",
  "subject": "DBMS",
  "semester": 4,
  "type": "QP",
  "year": 2023,
  "tags": ["dbms", "endsem"],
  "filePath": "uploads/dbms_2023.pdf",

  "uploaderId": "user_object_id_string",
  "uploaderName": "Demo User",

  "avgRating": 4.2,
  "reviewsCount": 7,
  "downloadsCount": 60,
  "isVerified": true,

  "createdAt": ISODate
}

Indexes:
- subject
- semester
- type
- year
- avgRating

---

## 3) reviews

Stores ratings and review comments.

Example document:
{
  "_id": ObjectId,
  "resourceId": "resource_object_id_string",
  "userId": "user_object_id_string",
  "userName": "Demo User",
  "rating": 5,
  "comment": "Very helpful",
  "createdAt": ISODate
}

Rules:
- One review per user per resource
  Enforced by unique index:
  (resourceId + userId)

Indexes:
- resourceId
- userId
- (resourceId, userId) unique

---

## 4) bookmarks

Stores saved resources for each user.

Example document:
{
  "_id": ObjectId,
  "userId": "user_object_id_string",
  "resourceId": "resource_object_id_string",
  "createdAt": ISODate
}

Rules:
- No duplicate bookmarks
  Enforced by unique index:
  (userId + resourceId)

Indexes:
- userId
- resourceId
- (userId, resourceId) unique
