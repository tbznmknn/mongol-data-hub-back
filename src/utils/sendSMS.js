var axios = require("axios");
const MyError = require("./myError");

const sendSMS = async ({ phone, messageMn, messageEn }) => {
  var prefix = phone.substring(0, 2);

  var unitel_prefix = ["88", "86", "80", "89"];
  var mobicom_prefix = ["99", "85", "94", "95"];
  var gmobile_prefix = ["83", "93", "98", "97"];
  var skytel_prefix = ["91", "90", "96"];

  let url;

  if (unitel_prefix.includes(prefix)) {
    url = `http://sms.unitel.mn/sendSMS.php?uname=${process.env.unitel_username}&upass=${process.env.unitel_password}&sms=${messageMn}&from=${process.env.unitel_number}&mobile=${phone}`;
  } else if (mobicom_prefix.includes(prefix)) {
    url = `http://27.123.214.168/smsmt/mt?servicename=${process.env.mobicom_servicename}&username=${process.env.mobicom_username}&from=${process.env.mobicom_number}&to=${phone}&msg=${messageEn}`;
    // url = http://27.123.214.168/smsmt/mt?servicename=${process.env.mobicom_servicename}&username=${process.env.mobicom_username}&password=${process.env.mobicom_password}&from=${process.env.mobicom_number}&to=${phone}&msg=${message}`;
  } else if (gmobile_prefix.includes(prefix)) {
    url = `http://203.91.114.131/cgi-bin/sendsms?username=${process.env.gmobile_username}&password=${process.env.gmobile_password}&from=${process.env.gmobile_number}&to=${phone}&text=${messageEn}`;
  } else if (skytel_prefix.includes(prefix)) {
    url = `http://smsgw.skytel.mn:80/SMSGW-war/unicode?id=${process.env.skytel_number}&src=${process.env.skytel_username}&dest=${phone}&text=${messageMn}`;
  }

  var fixed_url = fixedEncodeURIComponent(url);

  console.log("FIXED_URL: ", fixed_url);

  await axios
    .get(fixed_url)
    .then((response) => {
      if (response.data === "Not sent: Authentication failed") {
        throw new MyError("Уг SMS илгээхэд алдаа гарлаа." + response.data, 400);
      } else if (response.data === "error2") {
        throw new MyError("Уг SMS илгээхэд алдаа гарлаа." + response.data, 400);
      } else if (response.data === "Not sent: Time limit exceeded") {
        throw new MyError("Хүсэлт илгээх хязгаар тул");
      }
      console.log("SMS RESPONSE: ", response);
    })
    .catch((err) => {
      throw new MyError("error_sending_messege" + err, 400); //Уг SMS илгээхэд алдаа гарлаа.
    });
};

function fixedEncodeURIComponent(str) {
  return encodeURI(str).replace(/%5B/g, "[").replace(/%5D/g, "]");
}

module.exports = sendSMS;
