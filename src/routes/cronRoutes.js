const express = require("express");
const {
  syncMseBonds,
  syncTradingStatus,
  syncAllOtcBond,
} = require("../controllers/cronController");
const validateRequest = require("../middlewares/validateRequests"); // Import the validation middleware
const { protect, authorize } = require("../middlewares/protect");
const {
  syncUBXPrices,
  syncUBXQuotes,
} = require("../controllers/externalController");
const router = express.Router();
router.route("/msebonds").post(syncMseBonds);
router.route("/syncUBXPrices").post(syncUBXPrices);
router.route("/syncUBXQuotes").post(syncUBXQuotes);
router.route("/syncOtc").post(syncAllOtcBond);
router.route("/securitytradingstatus").post(syncTradingStatus);
module.exports = router;
