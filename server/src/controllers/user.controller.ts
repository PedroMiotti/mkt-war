import UserService = require('../services/user.service');

// Express
import express = require('express');

class UserController{


  public static async LoginUser(req: express.Request, res: express.Response){
    const { username, password } = req.body;

    const result = await UserService.LoginUser(username, password);

    if(typeof result === "string"){
      return res.cookie("_token", result, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: false,
        path: "/",
        secure: true,
        sameSite: "none",
      }).send(result);
    }

    return res.status(400).send(result.data);

  }

  public static async CreateUser(req: express.Request, res: express.Response){

    let { username, name, password } = req.body;

    const result = await UserService.CreateUser(username, name, password);

    if(typeof result === "string")
      return res.cookie("_token", result, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: false,
        path: "/",
        secure: true,
        sameSite: "none",
      }).send(result);

      return res.status(400).send(result.data);

  }

  public static async UserProfile(req: express.Request, res: express.Response){

    let user_id: number = parseInt(req.params.id);

    const result = await UserService.UserProfile(user_id);

    if(!result.errorCode)
      return res.status(200).send(result);

    return res.status(400).send(result.data);

  }

}


export = UserController;
