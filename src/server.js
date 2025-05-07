const dotenv = require("dotenv");
dotenv.config();
const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on: ${PORT} with ${process.env.NODE_ENV}`);
});
process.on("uncaughtException", (err) => {
  // logger.error("Uncaught Exception!", err.stack);
  console.log("unhandledRejection err: ", err);
});

process.on("unhandledRejection", (err) => {
  // logger.error("Unhandled Rejection!", err.stack);
  console.log("unhandledRejection err: ", err);
});
