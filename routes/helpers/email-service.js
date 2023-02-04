const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

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
    partialsDir: path.resolve("../../views/"),
    defaultLayout: false,
  },
  viewPath: path.resolve("../../views/"),
};

transporter.use("compile", hbs(handlebarOptions));

let mailOptions = {
  from: "nodemailer69420e@gmail.com",
  to: "paramrkothari@gmail.com",
  subject: "Testing",
  text: "First mail",
  template: "email",
  context: {
    header: "FACE SPIT presents to you", // replace {{name}} with Adebola
    committeeLogo: "https://face.spit.ac.in/assets/images/logo_icon.png",
    eventName: "FACE CUP",
    eventBanner: "https://face.spit.ac.in/assets/images/logo_icon.png",
    eventDescription: "",
    eventDate: "13 Oct, 2023",
    eventLink: "" 
  },
};

transporter.sendMail(mailOptions, function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent successfully!");
  }
});
