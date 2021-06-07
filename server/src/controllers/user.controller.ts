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


  public static async setUserOffline(req: express.Request, res: express.Response){

    let user_id: number = parseInt(req.params.id);

    const result = await UserService.setUserOffline(user_id);
    
    if(typeof result === 'string')
      return res.status(200).send(result);

    return res.status(400).send(result.data);
  }

  public static async OnlinePlayers(req: express.Request, res: express.Response){
    let users: any[];

    users = await UserService.OnlinePlayers();

    return res.status(200).send(users);

  }


  public static async UpdateUserAvatar(req: express.Request, res: express.Response){
    const avatar_id: number = parseInt(req.params.avatar)
    const user_id: number = parseInt(req.params.id)
    console.log(req.params.avatar)

    await UserService.UpdateUserAvatar(avatar_id, user_id);

    return res.status(200).send("Avatar updated");

  }

  
  public static async Leaderboard(req: express.Request, res: express.Response){
    let leaderboard_list: any[];

    leaderboard_list = await UserService.Leaderboard();

    return res.status(200).send(leaderboard_list);

  }

}


export = UserController;
