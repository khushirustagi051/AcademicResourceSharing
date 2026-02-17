# Judging Notes (Quick Q&A)

## What problem are we solving?
Academic resources are scattered across WhatsApp groups and drive links.
CampusVault centralizes them into a searchable and structured platform.

---

## What makes this better than WhatsApp sharing?
- Search + filters (subject, semester, type, year)
- Ratings and reviews for quality
- Verified badge for trusted resources
- Contributor leaderboard for recognition
- Bookmarks for saving resources

---

## How does verification work?
A resource is marked "Verified" if:
- avgRating >= 4.2
- reviewsCount >= 5

This creates trust and pushes quality uploads.

---

## How do points work?
- Upload resource = +10 points
- Verified resource = +20 bonus points
Optional: avgRating >= 4.5 = +10 bonus points

Leaderboard ranks by total points.

---

## Architecture summary
Frontend:
- React SPA (pages + filters + API integration)

Backend:
- FastAPI REST endpoints

Database:
- MongoDB stores users, resources, reviews, bookmarks

Storage:
- Hackathon mode: local file storage in /uploads

---

## Security and access control
- JWT authentication
- Protected routes for:
  - upload
  - review
  - bookmarks

---

## How do you prevent duplicate reviews?
Backend enforces:
- one review per user per resource
Returns 409 conflict if duplicate.

---

## What can be improved in production?
- Cloud storage (S3/Firebase/Cloudinary)
- Admin moderation panel
- Reporting system
- AI summarization and recommendations
