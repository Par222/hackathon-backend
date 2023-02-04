const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

async function sendEmail(config) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "nodemailer69420@gmail.com",
      pass: "aefj xelt ziln xhvx",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const handlebarOptions = {
    viewEngine: {
      partialsDir: path.resolve("views/"),
      defaultLayout: false,
    },
    viewPath: path.resolve("views/"),
  };

  transporter.use("compile", hbs(handlebarOptions));

  let mailOptions = {
    from: "nodemailer69420e@gmail.com",
    ...config,
  };

  transporter.sendMail(mailOptions, function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent successfully!");
    }
  });
}

module.exports.sendEmail = sendEmail;
