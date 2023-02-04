const express = require('express');
const eventsControllers = require('./controllers/events');
const facultyControllers = require('./controllers/faculty');
const router = express.Router();

router.post('/', facultyControllers.createFaculty);
router.put('/', facultyControllers.updateFaculty);
router.get('/', facultyControllers.getFaculty);
module.exports = router;
