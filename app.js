const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");


// CORS error handling
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use(bodyParser.json());


app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Invalid request" });
});
mongoose
  .connect(
    ""
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((error) => {
    console.log(error);
  });
