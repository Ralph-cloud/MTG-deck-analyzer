const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const { parseInput } = require("./parser");
const points = require("./points.json");

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "../client")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

const normalize = (str) => str.toLowerCase().trim();

function scoreDeck(cards) {
  let total = 0;
  let matches = [];

  cards.forEach(card => {
    Object.keys(points).forEach(ref => {
      if (normalize(card) === normalize(ref)) {
        total += points[ref];
        matches.push({ card, points: points[ref] });
      }
    });
  });

  return { total, matches };
}

app.post("/analyze", async (req, res) => {
  try {
    const cards = await parseInput(req.body.input);
    const result = scoreDeck(cards);

    res.json({ ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Running on port 3000"));
