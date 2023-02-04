const Student = require("../../models/Student");
const HttpError = require("../errors/http-error");
const helper = require("../helpers/Mongo");

async function addStudent(req, res, err) {
  try {
    const newStudent = await helper?.postField(Student, req?.body);
    res.status(200);
    res.json({
      student: newStudent,
    });
  } catch (error) {
    console.log(error);
    throw new HttpError("Error creating student!", 500);
  }
}

async function addStudentDetails(req, res, err) {
  const studentID = req?.params?.requestID;
  try {
    const updatedStudent = await helper?.putField(Student, {
      id: studentID,
    });
    res.status(200);
    res.json({
      student: updatedStudent,
    });
  } catch (error) {
    console.log(error);
    throw new HttpError("Error adding student details!", 500);
  }
}

async function fetchAllStudents(req, res, err) {
  try {
    const students = await helper?.getFields(Student, req?.query);
    res.status(200);
    res.json({
      students: students,
    });
  } catch (error) {
    console.log(error);
    throw new HttpError("Error fetching students!", 500);
  }
}

async function fetchAStudent(req, res, err) {
  const studentID = req?.params?.studentID;
  try {
    const student = await helper?.getField(Student, { id: studentID });
    res.status(200);
    res.json({
      student: student,
    });
  } catch (error) {
    console.log(error);
    throw new HttpError("Error fetching the student!", 500);
  }
}

module.exports.fetchAStudent = fetchAStudent;
module.exports.fetchAllStudents = fetchAllStudents;
module.exports.addStudentDetails = addStudentDetails;
module.exports.addStudent = addStudent;
