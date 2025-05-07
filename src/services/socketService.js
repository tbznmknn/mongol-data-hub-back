const ioClient = require("socket.io-client");
const db = require("../utils/prismaClient");
const securityServices = require("../services/securityServices");
// Initialize Prisma client

/**
 * Initializes the connection to the external socket server and logs received data.
 */
const startSocketConnection = () => {
  const ENDPOINT = "https://bdsec.mn/tradedata"; // Use the same endpoint as the frontend
  // const ENDPOINT = "http://localhost:1032/tradedata"; // Use the same endpoint as the frontend
  const socket = ioClient(ENDPOINT, {
    path: "/socket",
    withCredentials: true,
    reconnection: false,
    extraHeaders: {
      "my-custom-header": "bdsec",
    },
  });
  // Event handlers for socket connection
  socket.on("connect", () => {
    console.log("Connected to external socket server:", ENDPOINT);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from external socket server.");
  });

  socket.on("databaseChanges", async (data) => {
    console.log("Received data from socket:", data.length, data[0].Symbol);
    // console.log(data[0]);
    securityServices.createMultipleSecurityTradingStatus(data);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err.message);
  });
};

module.exports = { startSocketConnection };
