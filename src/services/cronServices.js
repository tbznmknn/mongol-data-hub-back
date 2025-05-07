// const schedule = require("node-schedule");
// const { syncBonds } = require("../services/bondServices");
// const { syncTradingStatus } = require("../services/securityServices");
// const { syncAllOtcBond } = require("../controllers/cronController");
// schedule.scheduleJob("0 22 * * 1-5", async () => {
//   console.log(
//     "SYNC BONDS -- At 22:00 on every day-of-week from Monday through Friday.”"
//   );
//   await syncBonds();
// });
// schedule.scheduleJob("0 23 * * 1-5", async () => {
//   console.log(
//     "SYNC TRADING STATUS -- At 23:00 on every day-of-week from Monday through Friday.”"
//   );
//   await syncTradingStatus();
// });
// schedule.scheduleJob("0 21 * * 1-5", async () => {
//   console.log(
//     "SYNC OTC  -- At 21:00 on every day-of-week from Monday through Friday.”"
//   );
//   await syncAllOtcBond();
// });
