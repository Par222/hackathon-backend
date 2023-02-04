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
      date: { type: Date },
    },
  ],
});

module.exports = VenueSchema;
