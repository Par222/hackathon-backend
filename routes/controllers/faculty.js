const mongoose = require('mongoose');
const Event = require('../../models/events');
const UserType = require('../../models/UserType');
const Venue = require('../../models/Venue');
const Faculty = require('../../models/Faculty');
const db = require('../helpers/Mongo');
const moment = require('moment');

const facultyControllers = {};

facultyControllers.createFaculty = async (req, res) => {
  const result = await db.postField(Faculty, { ...req.body });
  res.json(result);
};

facultyControllers.updateFaculty = async (req, res) => {
  const result = await db.putField(
    Faculty,
    { _id: req.body.id },
    { ...req.body }
  );
  res.json(result);
};

facultyControllers.getFaculty = async (req, res) => {
  const keys = {};
  if (req.query.id) {
    keys._id = req.query.id;
  }
  let result = await db.getFields(Faculty, keys);
  res.json(result);
};

module.exports = facultyControllers;
