const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Temporary in-memory storage.
// Records reset whenever the server restarts.
let registrations = [];
let nextId = 1;

// GET: Retrieve all event registrations
app.get("/api/events", (req, res) => {
  res.status(200).json(registrations);
});

// POST: Create a new event registration
app.post("/api/events", (req, res) => {
  const { name, section, event } = req.body || {};

  if (
    typeof name !== "string" || !name.trim() ||
    typeof section !== "string" || !section.trim() ||
    typeof event !== "string" || !event.trim()
  ) {
    return res.status(400).json({
      error: "Name, section, and event are required."
    });
  }

  if (name.trim().length > 80 ||
      section.trim().length > 20 ||
      event.trim().length > 100) {
    return res.status(400).json({
      error: "Name must be 80 characters or fewer, section 20 or fewer, and event 100 or fewer."
    });
  }

  const registration = {
    id: nextId++,
    name: name.trim(),
    section: section.trim(),
    event: event.trim()
  };

  registrations.push(registration);
  return res.status(201).json(registration);
});

// DELETE: Remove a registration by its ID
app.delete("/api/events/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "A valid registration ID is required." });
  }

  const index = registrations.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Registration not found." });
  }

  registrations.splice(index, 1);
  return res.status(204).send();
});

// JSON response for unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({ error: "API endpoint not found." });
});

// Handle malformed JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON request body." });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`Campus Event Registration System is running at http://localhost:${PORT}`);
});
