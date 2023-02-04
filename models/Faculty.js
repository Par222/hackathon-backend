const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  committee: {
    type: String,
  },
  requests: Array,
});

module.exports = FacultySchema;
