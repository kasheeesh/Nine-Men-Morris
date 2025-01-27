const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors({
    origin: 'http://localhost:5173/games/ninemenmorris', // Replace with your frontend URL if different
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const rooms = {}; // Object to store game rooms and players

// Serve static files for the client (if needed)
app.use(express.static('public'));

// Handle player connection
io.on('connection', (socket) => {
  console.log('A player connected:', socket.id);

  // Handle creating/joining game rooms
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`Player ${socket.id} joined room ${roomId}`);

    // If the room doesn't exist, create it
    if (!rooms[roomId]) {
      rooms[roomId] = {
        players: [],
        gameState: null, // You can store the game state here
      };
    }

    // Add player to the room
    rooms[roomId].players.push(socket.id);

    // Emit the updated room details to all clients in the room
    io.to(roomId).emit('roomInfo', rooms[roomId]);
  });

  // Handle player actions (like making a move)
  socket.on('makeMove', (roomId, moveData) => {
    console.log(`Player ${socket.id} made a move in room ${roomId}`);

    // Update game state (you can handle the actual game logic here)
    if (rooms[roomId]) {
      rooms[roomId].gameState = moveData;

      // Emit the updated game state to all clients in the room
      io.to(roomId).emit('gameStateUpdate', rooms[roomId].gameState);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A player disconnected:', socket.id);

    // Remove player from rooms
    for (const roomId in rooms) {
      const room = rooms[roomId];
      room.players = room.players.filter((id) => id !== socket.id);

      if (room.players.length === 0) {
        delete rooms[roomId]; // Remove empty rooms
      } else {
        io.to(roomId).emit('roomInfo', room);
      }
    }
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
