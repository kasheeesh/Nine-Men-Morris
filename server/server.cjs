const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const http = require("http"); 

const setupSocket = require("./socket.cjs");
const { Console } = require("console");

const SECRET_KEY = "your_secret_key"; 
const app = express();
const server = http.createServer(app);


app.use(cors());
app.use(bodyParser.json());
app.use(express.json());


const MONGO_URI = "mongodb://localhost:27017";
const DATABASE_NAME = "gameDB";
const COLLECTION_NAME = "players";
const LEADERBOARD_COLLECTION = "leaderboards";
const LEXIQUEST_LEADERBOARD = "leaderboardlexi";
const MINISWEEPER_LEADERBOARD = "leaderboardmini";
const GAME_STATS_COLLECTION = "gameStats";

let db;
const PORT = 5000;

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

   // Check if token is blacklisted
   if (blacklistedTokens.has(token)) {
    return res.status(401).json({ error: "Token is no longer valid." });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token." });
    }

    req.user = user; // Attach the user data to the request
    next();
  });
};

const blacklistedTokens = new Set(); // In-memory token blacklist (consider using Redis in production)

// Logout API
app.post("/logout", authenticateToken, (req, res) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    
    // Blacklist the token
    blacklistedTokens.add(token);

    res.status(200).json({ message: "Logout successful!" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Internal server error during logout." });
  }
});


// Add this to your server.cjs file

/* ---------------------- API to Retrieve User Profile ---------------------- */
app.get("/user-profile", authenticateToken, async (req, res) => {
  try {
    const username = req.user.username;
    
    // Find the user by username, but don't include the password in the response
    const user = await db.collection(COLLECTION_NAME).findOne(
      { username },
      { projection: { password: 0 } } // Exclude password field
    );

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

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
    console.log("lexiquest lb");

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

app.get("/leaderboardmini", async (req, res) => {
  try {
    // const today = new Date();
    // today.setHours(0, 0, 0, 0); // Set to the start of the day
    console.log("minisweeper lb");
    const leaderboardmini = await db
      .collection(MINISWEEPER_LEADERBOARD)
      .find({}) // Fetch today's records only
      .sort({ highestScore: -1 })
      .toArray();

    res.status(200).json(leaderboardmini);
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
});


app.post("/handle-game-over", authenticateToken, async (req, res) => {
  try {

    const { score, gameName } = req.body;
    const username = req.user.username;
    
    console.log(`Starting game over sequence for ${gameName}`);
    console.log("User:", username, score !== undefined ? `Score: ${score}` : "No score (tracking only)");
    
    if (!gameName) {
      return res.status(400).json({ error: "Invalid input data." });
    }
    

const adjustForIST = (date) => {
  const istOffset = 330; // IST is UTC+5:30 = 330 minutes
  const localDate = new Date(date.getTime() + istOffset * 60 * 1000);
  return localDate.toISOString().split('T')[0];
};

const today = adjustForIST(new Date());
    const existingStats = await db.collection(GAME_STATS_COLLECTION).findOne({ username });
    
    // For MiniSweeper, we only track game count, not score
    // if (gameName === "NineMenMorris") {
    //   console.log("Processing MiniSweeper game (count only)");
    //   // Just update play count, no leaderboard
    //   if (existingStats) {
    //     console.log("Updating existing game stats for MiniSweeper");
    //     await db.collection(GAME_STATS_COLLECTION).updateOne(
    //       { username },
    //       {
    //         $inc: { [`gamesPlayed.${gameName}`]: 1, totalGamesPlayed: 1 },
    //         $set: { [`activityHistory.${today}`]: (existingStats.activityHistory?.[today] || 0) + 1 }
    //       }
    //     );
    //   } else {
    //     console.log("Creating new game stats entry for MiniSweeper");
    //     await db.collection(GAME_STATS_COLLECTION).insertOne({
    //       username,
    //       gamesPlayed: { [gameName]: 1 },
    //       totalGamesPlayed: 1,
    //       leaderboardScores: {},
    //       activityHistory: { [today]: 1 }
    //     });
    //   }
      
    //   res.status(200).json({
    //     message: `${gameName} play recorded successfully`
    //   });
    //   return;
    // }
    
    // For other games with scores, continue with existing logic
    if (typeof score !== "number") {
      return res.status(400).json({ error: "Score is required for this game." });
    }
    
    // Determine the correct leaderboard collection
    let leaderboardCollection;
    if (gameName === "Space Shooter") {
      leaderboardCollection = "leaderboards";
    } else if (gameName === "LexiQuest") {
      leaderboardCollection = "leaderboardlexi";
    } else if (gameName === "MiniSweeper") {
      leaderboardCollection = "leaderboardmini";
    } 
    else {
      return res.status(400).json({ error: "Invalid game name." });
    }
    
    console.log("Using leaderboard collection:", leaderboardCollection);
    
    // 1. STEP ONE: Update the leaderboard
    console.log("Step 1: Updating leaderboard...");
    const existingRecord = await db.collection(leaderboardCollection).findOne({ username });
    let highestScore = score;
    
    if (existingRecord) {
      console.log("Found existing leaderboard record with score:", existingRecord.highestScore);
      if (score > existingRecord.highestScore) {
        console.log("New score is higher, updating leaderboard");
        await db.collection(leaderboardCollection).updateOne(
          { username },
          { $set: { highestScore: score } }
        );
      } else {
        console.log("Existing score is higher, keeping it");
        highestScore = existingRecord.highestScore;
      }
    } else {
      console.log("No existing record, creating new leaderboard entry");
      await db.collection(leaderboardCollection).insertOne({
        username,
        highestScore: score,
      });
    }
    
    // Verify the leaderboard update
    const verifiedLeaderboard = await db.collection(leaderboardCollection).findOne({ username });
    console.log("Verified leaderboard entry:", JSON.stringify(verifiedLeaderboard));
    
    // 2. STEP TWO: Update game stats with the VERIFIED leaderboard score
    console.log("Step 2: Updating game stats with verified score:", verifiedLeaderboard.highestScore);
    
    if (existingStats) {
      console.log("Updating existing game stats");
      await db.collection(GAME_STATS_COLLECTION).updateOne(
        { username },
        {
          $inc: { [`gamesPlayed.${gameName}`]: 1, totalGamesPlayed: 1 },
          $set: { 
            [`activityHistory.${today}`]: (existingStats.activityHistory?.[today] || 0) + 1,
            [`leaderboardScores.${gameName}`]: verifiedLeaderboard.highestScore
          }
        }
      );
    } else {
      console.log("Creating new game stats entry");
      await db.collection(GAME_STATS_COLLECTION).insertOne({
        username,
        gamesPlayed: { [gameName]: 1 },
        totalGamesPlayed: 1,
        leaderboardScores: { [gameName]: verifiedLeaderboard.highestScore },
        activityHistory: { [today]: 1 }
      });
    }
    
    // 3. STEP THREE: Get the updated leaderboard if needed
    let leaderboard = null;
    if (gameName === "LexiQuest") { // Only fetch leaderboard for LexiQuest as it seems to need it immediately
      console.log("Fetching complete leaderboard for LexiQuest");
      leaderboard = await db.collection(leaderboardCollection)
        .find({})
        .sort({ highestScore: -1 })
        .toArray();
    }
    
    // Return the results
    res.status(200).json({
      message: `${gameName} game over sequence completed successfully`,
      updatedScore: verifiedLeaderboard.highestScore,
      leaderboard: leaderboard // Will be null for Space Shooter
    });
    
  } catch (err) {
    console.error(`Error in game over sequence:`, err);
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
    const leaderboard3 = await db.collection(MINISWEEPER_LEADERBOARD).find().sort({ highestScore: -1 }).toArray();
    const entry = await db.collection(LEXIQUEST_LEADERBOARD).findOne({ username });
    console.log(entry);
    const getRank = (leaderboard, username) => {
      return leaderboard.findIndex(entry => entry.username === username) + 1 || null;
    };

    const response = {
      highestScores: playerScores.leaderboardScores,
      rank: {
        "Space Shooter": getRank(leaderboard1, username),
        "Lexiquest": getRank(leaderboard2, username),
        "MiniSweeper": getRank(leaderboard3, username),
      }
    };

    res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching player rank:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

