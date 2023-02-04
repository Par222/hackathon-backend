const mongoose = require("mongoose");

const FacultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  committee: {
    type: String,
  },
  requests: Array,
  email: String,
  signature: {
    type: String,
  },
  image: {
    type: String,
  },
  designation: {
    type: String,
  },
});

module.exports = mongoose.model("Faculty", FacultySchema);
