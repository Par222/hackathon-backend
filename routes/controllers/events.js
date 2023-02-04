const mongoose = require('mongoose');
const Event = require('../../models/events');
const db = require('../helpers/Mongo');

const eventsControllers = {};

eventsControllers.createEvent = async (req, res) => {
  const { name, committee, date, description } = req.body;
  const payload = {
    name,
    committee,
    date,
    description,
  };
  const result = await db.postField(Event, payload);
  res.json(result);
};

eventsControllers.getEvents = async (req, res) => {
  const id = req.body.id;
  const { usertype } = req.body;
  const { domain } = req.query;
  let keys = {};
  if (usertype == 'student') {
    keys.status = 'approved';
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

module.exports = eventsControllers;
