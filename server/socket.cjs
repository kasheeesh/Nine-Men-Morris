const { Server } = require("socket.io");
const { validateMove, createInitialGameState, updateGameState } = require('./gameLogic.cjs');

function setupSocket(server, db) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const games = new Map();
  const GAMES_COLLECTION = "game_history";

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("createRoom", async ({ username, roomId }) => {
      try {
        if (games.has(roomId)) {
          socket.emit("roomError", "Room already exists");
          return;
        }

        const initialState = createInitialGameState(roomId, {
          id: socket.id,
          username
        });

        games.set(roomId, initialState);
        socket.join(roomId);
        socket.emit("roomCreated", { roomId, role: "player1" });

        await db.collection(GAMES_COLLECTION).insertOne({
          gameId: roomId,
          startTime: new Date(),
          status: "created",
          player1: username
        });
      } catch (error) {
        console.error("Error creating room:", error);
        socket.emit("roomError", "Failed to create room");
      }
    });

    socket.on("joinRoom", async ({ username, roomId }) => {
      try {
        const game = games.get(roomId);
        
        if (!game) {
          socket.emit("roomError", "Room not found");
          return;
        }

        if (game.players.length >= 2) {
          socket.emit("roomError", "Room is full");
          return;
        }

        game.players.push({ id: socket.id, username, role: "player2" });
        socket.join(roomId);
        
        socket.emit("roomJoined", { roomId, role: "player2" });
        io.to(roomId).emit("gameStart", game);

        await db.collection(GAMES_COLLECTION).updateOne(
          { gameId: roomId },
          { 
            $set: { 
              player2: username,
              status: "in_progress",
              gameStartTime: new Date()
            }
          }
        );
      } catch (error) {
        console.error("Error joining room:", error);
        socket.emit("roomError", "Failed to join room");
      }
    });

    socket.on("makeMove", async ({ roomId, move }) => {
      try {
        const game = games.get(roomId);
        if (!game) {
          socket.emit("roomError", "Game not found");
          return;
        }

        // Find player role
        const player = game.players.find(p => p.id === socket.id);
        if (!player) {
          socket.emit("roomError", "Player not found in game");
          return;
        }

        // Validate move
        if (!validateMove(game, move, player.role)) {
          socket.emit("roomError", "Invalid move");
          return;
        }

        // Update game state
        const updatedGame = updateGameState(game, move);
        games.set(roomId, updatedGame);

        // Save move to database
        await db.collection(GAMES_COLLECTION).updateOne(
          { gameId: roomId },
          { 
            $push: { 
              moves: {
                player: player.role,
                board: move.board,
                timestamp: new Date()
              }
            }
          }
        );

        // Check for game end
        if (move.winner) {
          await db.collection(GAMES_COLLECTION).updateOne(
            { gameId: roomId },
            { 
              $set: { 
                status: "completed",
                winner: move.winner,
                endTime: new Date()
              }
            }
          );
        }

        // Broadcast updated game state
        io.to(roomId).emit("gameUpdate", updatedGame);
      } catch (error) {
        console.error("Error processing move:", error);
        socket.emit("roomError", "Failed to process move");
      }
    });

    socket.on("disconnect", async () => {
      try {
        for (const [roomId, game] of games.entries()) {
          if (game.players.some(p => p.id === socket.id)) {
            io.to(roomId).emit("playerLeft", "Opponent disconnected");
            
            await db.collection(GAMES_COLLECTION).updateOne(
              { gameId: roomId },
              { 
                $set: { 
                  status: "abandoned",
                  endTime: new Date(),
                  endReason: "player_disconnected"
                }
              }
            );

            games.delete(roomId);
          }
        }
      } catch (error) {
        console.error("Error handling disconnection:", error);
      }
    });
  });

  return io;
}

module.exports = setupSocket;