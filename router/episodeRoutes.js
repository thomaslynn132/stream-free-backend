const express = require('express');
const { createEpisode, getEpisodeById, updateEpisode, deleteEpisode, getEpisodeByEpisodeNumber, downloadEpisode, } = require('../controller/episodeController');
const ValidateObjectId = require('../middleware/ValidateObjectId');

const router = express.Router();

router
    .route('/')
    .post(createEpisode);

router
    .route('/:id')
    .get(ValidateObjectId, getEpisodeById)
    .put(ValidateObjectId, updateEpisode)
    .delete(ValidateObjectId, deleteEpisode);

router.get("/:series/:season/:episodeNumber", getEpisodeByEpisodeNumber);
router.post("/download", downloadEpisode);

module.exports = router;