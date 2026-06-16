// import "dotenv/config";
// import app from "./src/app.js";

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`API running on port ${PORT}`);
// });

import "dotenv/config";
import http from "http";

import app from "./src/app.js";
import { initSocket } from "./src/config/socket.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});