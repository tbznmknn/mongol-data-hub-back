const nodemailer = require("nodemailer");
const AppError = require("./AppError");

const sendEmail = async (options) => {
  const config = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    // tls: { secureProtocol: "TLSv1.2_method", servername: "https://agm.mn/" },
    tls: {
      rejectUnauthorized: true,
      minVersion: "TLSv1.2",
    },
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };

  // console.log("config: ", config);

  var transporter = await nodemailer.createTransport(config);

  let info = await transporter
    .sendMail({
      from: `${options.from} <${process.env.SMTP_FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    })
    .then((resp) => {
      console.log(resp);
    })
    .catch((err) => {
      console.log("ERRRRR", err);
      throw new AppError("confirm_error_Email", 404); //Мэйл илгээхэд алдаа гарлаа
    });

  // console.log("Message sent: ", options)
};

module.exports = sendEmail;
