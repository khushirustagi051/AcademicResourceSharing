# Seed Plan (Demo Data)

Goal: Ensure the app is not empty during demo.

Minimum demo dataset:
- 8 resources
- 3 contributors
- 10 reviews total
- 5 bookmarks

Recommended subjects:
- Data Structures
- DBMS
- Computer Networks
- Operating Systems

Include:
- at least 2 question papers with year
- at least 2 verified resources
- at least 1 low-rated resource (shows rating system is real)

Approach options:
1) Manual upload during demo setup (fast, but time-consuming)
2) Backend seed script inserts mock JSON into MongoDB (best)
3) Backend inserts sample docs on startup if DB empty (hackathon shortcut)
