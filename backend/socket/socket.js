const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
      ],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Register user room
    socket.on("registerUser", (userId) => {
      socket.join(userId); // each user has their own room
      console.log(`User ${userId} joined room`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { initSocket, getIO };