const express = require("express");
const userTypeController = require("./controllers/user-type");
const router = express.Router();

router.post("/signup", userTypeController?.userSignup);
router.post("/login", userTypeController?.userLogin);

module.exports = router;