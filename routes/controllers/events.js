const mongoose = require('mongoose');
const Event = require('../../models/events');
const Venue = require('../../models/Venue');
const db = require('../helpers/Mongo');
const moment = require('moment');

const eventsControllers = {};

eventsControllers.createEvent = async (req, res) => {
  let { name, committee, date, description } = req.body;
  const payload = {
    ...req.body,
  };
  //   date = moment(date).format('DD/MM/YYYY');
  //   payload.date = date;
  const result = await db.postField(Event, payload);
  res.json(result);
};

eventsControllers.getEvents = async (req, res) => {
  const id = req.body.id;
  const { usertype } = req.body;
  const { domain, keyword } = req.query;
  let keys = {};
  if (usertype == 'student') {
    keys.status = 'approved';
  }
  if (keyword) {
    keys.name = { $regex: keyword, $options: 'i' };
  }
  if (domain) keys.domain = domain;
  const result = await db.getFields(Event, keys);
  res.json(result);
};

eventsControllers.deleteEvent = async (req, res) => {
  // const { name, committee, date, description } = req.body;
  const id = req.body.id;
  const keys = {
    id,
  };
  const result = await db.deleteField(Event, keys);
  res.json(result);
};

eventsControllers.updateEvent = async (req, res) => {
  const id = req.body.id;
  const data = req.body;
  const keys = {
    id,
  };
  const result = await db.putField(Event, keys, data);
  res.json(result);
};

eventsControllers.getRooms = async (req, res) => {
  let { date } = req.body;
  date = new Date(date);
  //   date = moment(date).format('DD/MM/YYYY');
  //   date = date.toISOString();
  //   console.log(date);
  const after = await db.getFields(Event, {
    date: { $gt: date },
  });
  const before = await db.getFields(Event, {
    date: { $lt: date },
  });
  res.json([...before, ...after]);
};

module.exports = eventsControllers;
