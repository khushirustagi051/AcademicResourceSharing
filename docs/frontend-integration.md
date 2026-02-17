# Frontend Integration Notes (React)

Base URL:
http://localhost:8000

---

## Auth token storage
After login:
localStorage.setItem("token", token)

Get token:
const token = localStorage.getItem("token");

---

## Axios default setup
Recommended: create a file `client/src/services/api.js`

import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:8000"
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

---

## Upload resource (multipart)
POST /resources/upload

Use FormData:
const fd = new FormData();
fd.append("title", title);
fd.append("description", description);
fd.append("subject", subject);
fd.append("semester", semester);
fd.append("rtype", type);   // backend field name must match
fd.append("year", year);
fd.append("tags", tags);
fd.append("file", file);

API.post("/resources/upload", fd)

---

## List resources with filters
GET /resources?subject=DBMS&semester=4&type=QP&sort=rating

---

## Add review
POST /reviews/{resourceId}
Body JSON:
{ rating: 5, comment: "Good" }

---

## Bookmarks
POST /bookmarks/{resourceId}
DELETE /bookmarks/{resourceId}
GET /bookmarks

---

## Leaderboard
GET /leaderboard
