const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const sessionMiddleware = require("./middlewares/sessionMiddleware");
const { consoleEndpointLogger } = require("./utils/logger");
const morganMiddleware = require("./middlewares/loggerMiddleware");
const app = express();
const passport = require("passport");

require("colors");
// const { startSocketConnection } = require("./services/socketService");

// Middleware setup
app.use(morganMiddleware);
app.use(consoleEndpointLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(passport.initialize());

// Routes
app.use("/api/v2", routes);
// Error Handling
app.use(errorHandler);
// startSocketConnection(); // Start listening to the external socket

module.exports = app;
