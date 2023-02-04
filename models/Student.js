const mongoose = require("mongoose");

const StudentSchema = new mongoose.model({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  uid: {
    type: String,
  },
  year: {
    type: Number,
  },
  branch: {
    type: String,
  },
  committees: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Committee",
    },
  ],
  registered_events: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Event",
    },
  ],
});

module.exports = mongoose.model("Student", StudentSchema);
