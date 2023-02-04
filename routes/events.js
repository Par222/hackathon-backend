const express = require('express');
const eventsControllers = require('./controllers/events');
const router = express.Router();

router.post('/', eventsControllers.createEvent);
router.get('/', eventsControllers.getEvents);
router.delete('/', eventsControllers.deleteEvent);
router.patch('/', eventsControllers.updateEvent);
router.post('/venues', eventsControllers.getRooms);
router.get('/v', eventsControllers.addVenue);
router.get('/venues', eventsControllers.getVenue);
router.get('/requests', eventsControllers.getRequests);

module.exports = router;
