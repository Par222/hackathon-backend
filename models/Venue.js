const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
  name: {
    type: 'String',
  },
  location: {
    type: 'String',
  },
  capacity: {
    type: Number,
  },
  allotments: [
    {
      date: { type: String },
      eid: { type: String },
    },
  ],
});

const Venue = mongoose.model('Venue', VenueSchema);

module.exports = Venue;
