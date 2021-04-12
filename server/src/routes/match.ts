"use strict";

import express = require('express');

import MatchController = require('../controllers/match.controller');

import MatchModel = require('../models/match.model');

const router = express.Router();


// --> Create Match
router.post('/create', async (req: express.Request, res: express.Response) => {

  await MatchController.CreateMatch(req, res);

});


export = router;
