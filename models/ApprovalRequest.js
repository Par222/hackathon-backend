const mongoose = require("mongoose");

const ApprovalRequestSchema = new mongoose.Schema({
  eventID: {
    type: mongoose.Types.ObjectId,
    ref: "Event",
  },
  committeeID: {
    type: mongoose.Types.ObjectId,
    ref: "Committee",
  },
  status_level: {
    type: Number,
    default: 0,
  },
  permission_documents: [{ type: String }],
});

module.exports = mongoose.model("ApprovalRequest", ApprovalRequestSchema);
