const committeeController = require("./controllers/committee");
const express = require("express");
const router = express.Router();

router.patch("/:committeeID", committeeController?.addCommitteeDetails);

module.exports = router;