"use strict";

import MatchService = require('../services/match.service');

import express = require('express');

class MatchController{


  public static async CreateMatch(req: express.Request, res: express.Response){

    let owner_id = parseInt(req.body.ownerId);

    let result = await MatchService.CreateMatch(owner_id);

    if(typeof result === "number")
      return res.status(201).send(result);

    return res.status(400).send(result.data);
  
  }
}

export = MatchController;
