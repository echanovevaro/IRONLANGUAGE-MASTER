const express = require('express');
const router  = express.Router();

const authRoutes = require('./auth.controller');
const collectionRoutes = require('./collections.controller');
const meetupsRoutes = require('./meetup.controller');
const profileRoutes = require('./profile.controller');

router.use('/', authRoutes);
router.use('/collections', collectionRoutes);
router.use('/meetups', meetupsRoutes);
router.use('/profiles', profileRoutes);

module.exports = router;
