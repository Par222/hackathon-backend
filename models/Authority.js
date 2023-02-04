const mongoose = require("mongoose");

const AuthoritySchema = new mongoose.model({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  profile_image: {
    type: String,
  },
  designation: {
    type: String,
  },
  signature: {
    type: String,
  },
});

module.exports = mongoose.model("Authority", AuthoritySchema);
