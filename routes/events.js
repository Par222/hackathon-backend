const express = require('express');
const eventsControllers = require('./controllers/events');
const router = express.Router();

router.post('/', eventsControllers.createEvent);
router.get('/', eventsControllers.getEvents);
router.delete('/', eventsControllers.deleteEvent);
router.patch('/', eventsControllers.updateEvent);

module.exports = router;
