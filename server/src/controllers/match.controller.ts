"use strict";

import MatchService = require('../services/match.service');

import express = require('express');

class MatchController{


  public static async CreateMatch(req: express.Request, res: express.Response){

    let owner_id = parseInt(req.body.ownerId);

    let result = await MatchService.CreateMatch(owner_id);


    if(!result.errorCode)
      return res.status(201).send(result.toString());

    return res.status(400).send(result.data);
  
  }

  public static async JoinMatch(req: express.Request, res: express.Response){

    let user_id = parseInt(req.params.userId);
    let match_id = parseInt(req.params.matchId);

    let result = await MatchService.JoinMatch(user_id, match_id);

    return res.status(201).send('Opponent joined');

  }
}

export = MatchController;
