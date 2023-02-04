const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  committee: {
    type: Array,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: Date,
    // required: true,
  },
  endTime: {
    type: Date,
    // required: true,
  },
  registrations: {
    type: Array,
    default: [],
  },
  venue: {
    type: mongoose.Types.ObjectId,
    // ref: 'Venue',
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
    // ref: 'Request',
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
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
