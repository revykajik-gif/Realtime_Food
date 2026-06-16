import { Server } from "socket.io";
import { initializeSockets } from "../sockets/index.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin:
        process.env.CLIENT_URL ||
        "http://localhost:5173",
      methods: ["GET", "POST", "PATCH"],
    },
  });

  initializeSockets(io);
};

export const getIO = () => io;