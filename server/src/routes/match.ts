"use strict";

import express = require('express');

import MatchController = require('../controllers/match.controller');

import MatchModel = require('../models/match.model');

const router = express.Router();


// --> Create Match
router.post('/create', async (req: express.Request, res: express.Response) => {

  await MatchController.CreateMatch(req, res);

});

// --> Join Match
router.put('/join/:userId/:matchId', async (req: express.Request, res: express.Response) => {

  await MatchController.JoinMatch(req, res);

});

export = router;
