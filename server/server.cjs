const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const http = require("http"); 

const setupSocket = require("./socket.cjs");

const SECRET_KEY = "your_secret_key"; 
const app = express();
const server = http.createServer(app);


app.use(cors());
app.use(bodyParser.json());
app.use(express.json());


const MONGO_URI = "mongodb://192.168.0.111:27017";
const DATABASE_NAME = "gameDB";
const COLLECTION_NAME = "players";
const LEADERBOARD_COLLECTION = "leaderboards";
const LEXIQUEST_LEADERBOARD = "leaderboardlexi";
const GAME_STATS_COLLECTION = "gameStats";

let db;

// Connect to MongoDB
MongoClient.connect(MONGO_URI)
  .then((client) => {
    console.log("Connected to MongoDB");
    db = client.db(DATABASE_NAME);

    // Setup Socket.IO with the existing server and pass the db instance
    setupSocket(server, db);

    // Start the server after everything is set up
    server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });


// Signup API
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingUser = await db.collection(COLLECTION_NAME).findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection(COLLECTION_NAME).insertOne({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
});

// Login API
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const player = await db.collection(COLLECTION_NAME).findOne({ email });
    if (!player) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, player.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign({ username: player.username }, SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful!", token });
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token." });
    }

    req.user = user; // Attach the user data to the request
    next();
  });
};

// Save Score API
app.post("/save-score", authenticateToken, async (req, res) => {
  try {
    const { score } = req.body;

    if (typeof score !== "number") {
      return res.status(400).json({ error: "Invalid input data." });
    }

    const username = req.user.username;

    const existingRecord = await db.collection(LEADERBOARD_COLLECTION).findOne({ username });

    if (existingRecord) {
      // Update the score only if the new score is higher
      if (score > existingRecord.highestScore) {
        await db.collection(LEADERBOARD_COLLECTION).updateOne(
          { username },
          { $set: { highestScore: score } }
        );
      }
    } else {
      // Create a new record for the user
      await db.collection(LEADERBOARD_COLLECTION).insertOne({
        username,
        highestScore: score,
      });
    }

    res.status(200).json({ message: "Score saved successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
});

app.post("/save-score-lexi", authenticateToken, async (req, res) => {
  try {
    const { totalScore } = req.body;
    console.log(req.body);
    // console.log(score)

    if (typeof totalScore !== "number") {
      return res.status(400).json({ error: "Invalid input data." });
    }

    const username = req.user.username;

    const existingRecord = await db.collection(LEXIQUEST_LEADERBOARD).findOne({ username });

    if (existingRecord) {
      // Update the score only if the new score is higher
      if (totalScore > existingRecord.highestScore) {
        await db.collection(LEXIQUEST_LEADERBOARD).updateOne(
          { username },
          { $set: { highestScore: totalScore } }
        );
      }
    } else {
      // Create a new record for the user
      await db.collection(LEXIQUEST_LEADERBOARD).insertOne({
        username,
        highestScore: totalScore,
      });
    }

    res.status(200).json({ message: "Score saved successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
});

// Get Leaderboard API
app.get("/leaderboard", async (req, res) => {
  try {
    const leaderboard = await db
      .collection(LEADERBOARD_COLLECTION)
      .find({})
      .sort({ highestScore: -1 }) // Sort by score in descending order
      .toArray();

    res.status(200).json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
});
app.get("/leaderboardlexi", async (req, res) => {
  try {
    // const today = new Date();
    // today.setHours(0, 0, 0, 0); // Set to the start of the day

    const leaderboardlexi = await db
      .collection(LEXIQUEST_LEADERBOARD)
      .find({}) // Fetch today's records only
      .sort({ highestScore: -1 })
      .toArray();

    res.status(200).json(leaderboardlexi);
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
});

app.post("/update-game-stats", authenticateToken, async (req, res) => {
  try {
    const { gameName, score } = req.body;
    const username = req.user.username;
    console.log(username);

    if (!gameName || typeof score !== "number") {
      return res.status(400).json({ error: "Invalid input data." });
    }

    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

    // Determine the correct leaderboard collection
    let leaderboardCollection;
    if (gameName === "Space Shooter") {
      leaderboardCollection = "leaderboards";
    } else if (gameName === "LexiQuest") {
      leaderboardCollection = "leaderboardlexi";
    } else {
      return res.status(400).json({ error: "Invalid game name." });
    }

    // Fetch leaderboard score for the current user from the correct collection
    const leaderboardEntry = await db.collection(leaderboardCollection).findOne({ username });
    console.log(leaderboardEntry);
    const leaderboardScore = leaderboardEntry ? leaderboardEntry.highestScore : 0; // Default to 0 if not found

    // Check if user stats exist
    const existingStats = await db.collection(GAME_STATS_COLLECTION).findOne({ username });

    if (existingStats) {
      // Update game count, total games, and activity history
      await db.collection(GAME_STATS_COLLECTION).updateOne(
        { username },
        {
          $inc: { [`gamesPlayed.${gameName}`]: 1, totalGamesPlayed: 1 },
          $set: { 
            [`activityHistory.${today}`]: (existingStats.activityHistory?.[today] || 0) + 1,
            [`leaderboardScores.${gameName}`]: leaderboardScore // Update leaderboard score for the specific game
          }
        }
      );
    } else {
      // Create a new document if it doesn't exist
      await db.collection(GAME_STATS_COLLECTION).insertOne({
        username,
        gamesPlayed: { [gameName]: 1 },
        totalGamesPlayed: 1,
        leaderboardScores: { [gameName]: leaderboardScore }, // Initialize with the fetched leaderboard score
        activityHistory: { [today]: 1 }
      });
    }

    res.status(200).json({ message: "Game stats updated successfully!" });
  } catch (err) {
    console.error("Error updating game stats:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});


/* ---------------------- API to Retrieve Player Stats ---------------------- */
app.get("/player-stats", authenticateToken, async (req, res) => {
  try {
    const username = req.user.username;
    const playerStats = await db.collection(GAME_STATS_COLLECTION).findOne({ username });

    if (!playerStats) {
      return res.status(404).json({ error: "Player stats not found." });
    }

    res.status(200).json(playerStats);
  } catch (err) {
    console.error("Error fetching player stats:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

/* ---------------------- API to Retrieve Heatmap Data ---------------------- */
app.get("/heatmap-data", authenticateToken, async (req, res) => {
  try {
    const username = req.user.username;
    const playerStats = await db.collection(GAME_STATS_COLLECTION).findOne({ username });

    if (!playerStats) {
      return res.status(404).json({ error: "Player stats not found." });
    }

    res.status(200).json(playerStats.activityHistory || {});
  } catch (err) {
    console.error("Error fetching heatmap data:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

/* ---------------------- API to Retrieve Player Rank and Highest Score ---------------------- */
app.get("/player-rank", authenticateToken, async (req, res) => {
  try {
    const username = req.user.username;

    // Fetch player's highest score from leaderboards
    const playerScores = await db.collection(GAME_STATS_COLLECTION).findOne({ username });
    if (!playerScores) {
      return res.status(404).json({ error: "No records found." });
    }

    const leaderboard1 = await db.collection(LEADERBOARD_COLLECTION).find().sort({ highestScore: -1 }).toArray();
    const leaderboard2 = await db.collection(LEXIQUEST_LEADERBOARD).find().sort({ highestScore: -1 }).toArray();

    const getRank = (leaderboard, username) => {
      return leaderboard.findIndex(entry => entry.username === username) + 1 || null;
    };

    const response = {
      highestScores: playerScores.leaderboardScores,
      rank: {
        "Space Shooter": getRank(leaderboard1, username),
        "Lexiquest": getRank(leaderboard2, username)
      }
    };

    res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching player rank:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

const PORT = 5000;
// server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
