const committeeController = require("./controllers/committee");
const express = require("express");
const router = express.Router();

router.patch("/:committeeID", committeeController?.addCommitteeDetails);

router.get("/:committeeID", committeeController?.fetchCommitteeDetails);

module.exports = router;
