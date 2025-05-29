const express = require('express');
const { createSeason, getSeason, updateSeason, deleteSeason, getSeasonsBySeries } = require('../controller/seasonController');
const ValidateObjectId = require('../middleware/ValidateObjectId');
const { createSeasonValidation } = require('../validation/seasonValidation');

const router = express.Router();

router.route('/')
    .post(createSeasonValidation, createSeason);

router.route('/seasons/:seriesId')
    .get(getSeasonsBySeries);

router.route('/:id')
    .get(ValidateObjectId, getSeason)
    .put(ValidateObjectId, updateSeason)
    .delete(ValidateObjectId, deleteSeason);

module.exports = router;