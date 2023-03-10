const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const hbs = require("nodemailer-express-handlebars");

const authRoutes = require("./routes/auth-routes");
const committeeRoutes = require("./routes/committee");
const eventRoutes = require("./routes/events");
const approvalRequestRoutes = require("./routes/approval-request");
const facultyRoutes = require("./routes/faculty");
const studentRoutes = require("./routes/student");

// CORS error handling
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE,PUT");
  next();
});

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use("view engine", hbs);

app.use(`/api/auth/`, authRoutes);
app.use(`/api/committee/`, committeeRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/approval-request/", approvalRequestRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/student/", studentRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Invalid request" });
});

mongoose
  .connect(
    "mongodb+srv://parasMehta:para2222@cluster0.aaspp2v.mongodb.net/hackathon?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Listening");
    app.listen(5000);
  })
  .catch((error) => {
    console.log(error);
  });
