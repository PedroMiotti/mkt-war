import express = require("express");

import User = require("../models/user.js");

const router = express.Router();

interface IDefaultResponse{
  statusCode: number,
  data?: any
}

// --> Register user
router.post(
  "/register",
  async (req: express.Request, res: express.Response) => {
    let u: User = req.body as User;

    let response: IDefaultResponse = await User.createUser(u);
    if(response.statusCode !== 400) {
      res.cookie("_token", response.data, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: false,
        path: "/",
        secure: true,
        sameSite: "none",
      }).send(response.data);
    }
    else{
      res.status(response.statusCode).send({ message: response.data });
    }
  }
);

// --> Login
router.post("/login", async (req: express.Request, res: express.Response) => {
  const { username, password } = req.body;

    let response: IDefaultResponse = await User.login(username, password, res);

    if(response.statusCode !== 400) {
      res.cookie("_token", response.data, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: false,
        path: "/",
        secure: true,
        sameSite: "none",
      }).send(response.data);
    }
    else{
      res.status(response.statusCode).send({ message: response.data });
    }
});

// User information
router.get(
  "/profile/:id",
  async (req: express.Request, res: express.Response) => {
    const user_id: number = parseInt(req.params.id);

    let response: IDefaultResponse = await User.profile(user_id);
    if(response.statusCode !== 400) {
      res.status(response.statusCode).send(response.data);
    }
    else{
      res.status(response.statusCode).send({ message: response.data });
    }
  }
);

// Delete User
router.delete("/:id", async (req: express.Request, res: express.Response) => {
  const user_id: number = parseInt(req.params.id);

  await User.deleteProfile(user_id, res);
});

// Delete User
router.put("/:id", async (req: express.Request, res: express.Response) => {
  const user_id: number = parseInt(req.params.id);
  const user_info: User = req.body;

  await User.updateProfile(user_id, user_info, res);
});

// Leaderboard
router.get(
  "/leaderboard",
  async (req: express.Request, res: express.Response) => {
    let response = await User.getLeaderboard();
    res.send(response || null);
  }
);

export = router;
