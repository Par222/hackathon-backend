const mongoose = require('mongoose');
const Event = require('../../models/events');
const Venue = require('../../models/Venue');
const db = require('../helpers/Mongo');
const moment = require('moment');

const eventsControllers = {};

eventsControllers.addVenue = async (req, res) => {
  const payload = {
    ...req.body,
  };
  //   const result = await db.putField(
  //     Venue,
  //     {},

  //   );
  res.json(result);
};

eventsControllers.createEvent = async (req, res) => {
  let { name, committee, date, description } = req.body;
  const payload = {
    ...req.body,
  };
  //   date = moment(date).format('DD/MM/YYYY');
  //   payload.date = date;
  //   date = moment(date).format('DD/MM/YYYY');
  //   payload.date = date;
  const result = await db.postField(Event, payload);
  if (req.body.venue) {
    await db.putField(
      Venue,
      { _id: req.body.venue },
      { $push: { allotments: { date, eid: result.id } } }
    );
    // Venue.findByIdAndUpdate(req.body.venue, {
    //   $push: { allotments: { date, eid: result.id } },
    // });
  }
  res.json(result);
};

eventsControllers.getEvents = async (req, res) => {
  const { usertype } = req.body;
  const { domain, keyword, id } = req.query;
  let keys = {};
  if (usertype == 'student') {
    keys.status = 'approved';
  }
  if (id) {
    keys._id = id;
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
  const event = await db.getField(Event, keys);
  const result = await db.deleteField(Event, keys);
  if (event.venue) {
    let venue = db.getField(Venue, { _id: event.venue });
    venue?.allotments.filter((e) => e.eid != event.id);
    await db.putField(Venue, { _id: event.venue }, { $set: { allotments } });
  }
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

  //   date = new Date(date);
  //   date = moment(date).format('DD/MM/YYYY');
  //   date = date.toISOString();
  //   console.log(date);
  let results = await db.getFields(Venue, {});
  results = results.map((e) => {
    if (!e.allotments?.find((ele) => date == ele.date)) {
      return e;
    }
  });
  var filtered = results.filter(function (el) {
    return el != null;
  });
  //   return results;
  res.json(filtered);
  //   const after = await db.getFields(Event, {
  //     date: { $gt: date },
  //   });
  //   const before = await db.getFields(Event, {
  //     date: { $lt: date },
  //   });
  //   res.json([...before, ...after]);
};

module.exports = eventsControllers;
