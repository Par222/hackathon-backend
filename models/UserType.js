const mongoose = require("mongoose");

const UserTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  user_type: {
    type: String,
    required: true,
  },
  facultyID: {
    type: mongoose.Types.ObjectId,
    ref: "Faculty",
  },
  committeeID: {
    type: mongoose.Types.ObjectId,
    ref: "Committee",
  },
  studentID: {
    type: mongoose.Types.ObjectId,
    ref: "Student",
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("UserType", UserTypeSchema);
