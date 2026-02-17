const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, "..", "mock-data");

// Load mock JSON
let resources = JSON.parse(
  fs.readFileSync(path.join(dataDir, "resources.json"), "utf-8")
);

let leaderboard = JSON.parse(
  fs.readFileSync(path.join(dataDir, "leaderboard.json"), "utf-8")
);

let reviews = JSON.parse(
  fs.readFileSync(path.join(dataDir, "reviews.json"), "utf-8")
);

// In-memory auth + bookmarks (mock)
let users = [
  {
    id: "demo1",
    name: "Demo User",
    email: "demo@campus.com",
    password: "demo123",
    department: "CSE",
    semester: 3
  }
];

let bookmarks = {
  demo1: ["r1"] // demo user has r1 bookmarked initially
};

// Mock token system
function makeToken(userId) {
  return `mock-token-${userId}`;
}

function getUserFromToken(req) {
  const auth = req.headers.authorization;
  if (!auth) return null;
  const token = auth.split(" ")[1];
  if (!token || !token.startsWith("mock-token-")) return null;
  const userId = token.replace("mock-token-", "");
  return users.find((u) => u.id === userId);
}

// ---------------------- AUTH ----------------------

app.post("/auth/register", (req, res) => {
  const { name, email, password, department, semester } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const exists = users.find((u) => u.email === email);
  if (exists) {
    return res.status(409).json({ message: "Email already exists" });
  }

  const id = `u${users.length + 1}`;
  users.push({ id, name, email, password, department, semester });

  return res.status(201).json({ message: "Registered" });
});

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  return res.json({
    token: makeToken(user.id),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      department: user.department,
      semester: user.semester
    }
  });
});

// ---------------------- RESOURCES ----------------------

app.get("/resources", (req, res) => {
  let result = [...resources];

  // Filters
  const { subject, semester, type, year, verified, sort, search } = req.query;

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.subject.toLowerCase().includes(q) ||
        (r.tags || []).join(" ").toLowerCase().includes(q)
    );
  }

  if (subject) result = result.filter((r) => r.subject === subject);
  if (semester) result = result.filter((r) => String(r.semester) === String(semester));
  if (type) result = result.filter((r) => r.type === type);
  if (year) result = result.filter((r) => String(r.year) === String(year));
  if (verified) result = result.filter((r) => String(r.isVerified) === String(verified));

  // Sorting
  if (sort === "rating") {
    result.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
  } else if (sort === "year") {
    result.sort((a, b) => (b.year || 0) - (a.year || 0));
  } else {
    // newest default (based on createdAt)
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  res.json(result);
});

app.get("/resources/:id", (req, res) => {
  const r = resources.find((x) => x._id === req.params.id);
  if (!r) return res.status(404).json({ message: "Not found" });
  res.json(r);
});

// Fake download
app.get("/resources/:id/download", (req, res) => {
  const r = resources.find((x) => x._id === req.params.id);
  if (!r) return res.status(404).json({ message: "Not found" });

  r.downloadsCount = (r.downloadsCount || 0) + 1;
  res.json({ message: "Download simulated", downloadsCount: r.downloadsCount });
});

// ---------------------- REVIEWS ----------------------

app.get("/reviews/:resourceId", (req, res) => {
  const { resourceId } = req.params;
  const r = reviews.filter((x) => x.resourceId === resourceId);
  res.json(r);
});

app.post("/reviews/:resourceId", (req, res) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  const { resourceId } = req.params;
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be 1-5" });
  }

  const exists = reviews.find((x) => x.resourceId === resourceId && x.userName === user.name);
  if (exists) return res.status(409).json({ message: "Already reviewed" });

  reviews.push({
    _id: `rev${reviews.length + 1}`,
    resourceId,
    userName: user.name,
    rating,
    comment: comment || "",
    createdAt: new Date().toISOString()
  });

  res.status(201).json({ message: "Review added" });
});

// ---------------------- BOOKMARKS ----------------------

app.get("/bookmarks", (req, res) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  const ids = bookmarks[user.id] || [];
  const saved = resources.filter((r) => ids.includes(r._id));
  res.json(saved);
});

app.post("/bookmarks/:resourceId", (req, res) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  const { resourceId } = req.params;
  bookmarks[user.id] = bookmarks[user.id] || [];

  if (!bookmarks[user.id].includes(resourceId)) {
    bookmarks[user.id].push(resourceId);
  }

  res.json({ message: "Bookmarked" });
});

app.delete("/bookmarks/:resourceId", (req, res) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  const { resourceId } = req.params;
  bookmarks[user.id] = (bookmarks[user.id] || []).filter((id) => id !== resourceId);

  res.json({ message: "Removed" });
});

// ---------------------- LEADERBOARD ----------------------

app.get("/leaderboard", (req, res) => {
  res.json(leaderboard);
});

app.listen(8000, () => {
  console.log("Mock API running on http://localhost:8000");
});
