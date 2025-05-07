const express = require("express");
const path = require("path");

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const memberTypeRoutes = require("./memberTypeRoutes");
const memberRoutes = require("./memberRoutes");
const companyRoutes = require("./companyRoutes");
const postsRoutes = require("./postsRoutes");
const occupationTypeRoutes = require("./occupationTypeRoutes");
const affiliationTypeRoutes = require("./affiliationTypeRoutes");
const timelineRoutes = require("./timelineRoutes");
const fileRoutes = require("./fileRoutes");
const staticDataRoutes = require("./staticDataRoutes");

const router = express.Router();

router.use("/auth", authRoutes); //++++++
router.use("/users", userRoutes); //++++++
router.use("/membertype", memberTypeRoutes); //++++++
router.use("/members", memberRoutes); //++++++
router.use("/company", companyRoutes); //++++++
router.use("/posts", postsRoutes); //++++++
router.use("/occupation", occupationTypeRoutes); //++++++
router.use("/affiliation", affiliationTypeRoutes); //++++++
router.use("/timeline", timelineRoutes); //++++++
router.use("/files", fileRoutes); //++++++
router.use("/staticData", staticDataRoutes); //++++++

console.log(path.join(__dirname, "../../uploads/products"));
if (process.env.NODE_ENV === "development") {
  router.use(
    "/uploads",
    express.static(path.join(__dirname, "../../uploads/products"))
  );
}

module.exports = router;
