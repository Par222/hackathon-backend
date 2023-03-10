const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  committee: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    // required: true,
  },
  endTime: {
    type: String,
    // required: true,
  },
  registrations: [
    {
      type: mongoose.Types.ObjectId,
      // ref: "Student",
    },
  ],

  venue: {
    type: mongoose.Types.ObjectId,
    ref: "Venue",
  },
  description: {
    type: String,
    required: true,
  },
  banner: {
    type: String,
    default: null,
  },
  request: {
    type: mongoose.Types.ObjectId,
    default: null,
    // ref: 'ApprovalRequest',
  },
  attendance: {
    default: [],
    // type: Array,
  },
  doubts: [
    {
      question: { type: String },
      answer: { type: String },
    },
  ],
  speakers: {
    type: Array,
    default: [],
  },
  domain: String,
  status: {
    type: String,
    default: "pending",
  },
  approved_document: {
    type: String,
  },
  permission_documents: [
    {
      type: String,
    },
  ],
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
