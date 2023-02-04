const studentController = require("./controllers/student");
const express = require("express");
const router = express.Router();

router.get("/", studentController?.fetchAllStudents);

router.get("/:studentID", studentController?.fetchAStudent);

router.post("/", studentController?.addStudent);

router.patch("/:studentID", studentController?.addStudentDetails);

module.exports = router;