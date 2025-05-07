const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
// const generateConfirmationNumber = () => {
//   const confimationNumber = Math.floor(Math.random() * 999999);

//   this.confirmationToken = crypto
//     .createHash("sha256")
//     .update(JSON.stringify(confimationNumber))
//     .digest("hex");
//   this.confirmationTokenExpire = moment().add(2, "h").utc(😎.format();

//   return confimationNumber;
// };
exports.generateSixDigitNumber = () => {
  const min = 100000;
  const max = 999999;
  const sixDigitNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return sixDigitNumber;
};
exports.generateVerificationToken = () => {
  const token = uuidv4();
  return token;
};
