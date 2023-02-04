const mongoose = require("mongoose");

const CommitteeSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  events: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Event",
    },
  ],
  description: {
    type: String,
  },
  members: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Student",
    },
  ],
  logo: {
    type: String,
  },
  faculty_coordinatorID: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Faculty",
    },
  ],
  type: {
    type: String,
  },
  positions: [
    {
      title: {
        type: String,
      },
      name: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("Committee", CommitteeSchema);
