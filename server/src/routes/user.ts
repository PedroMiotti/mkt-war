import express = require("express");

import UserController = require("../controllers/user.controller");

const router = express.Router();

interface IDefaultResponse {
  statusCode: number;
  data?: any;
}

// --> Register user
router.post("/register", async (req: express.Request, res: express.Response) => {
    await UserController.CreateUser(req, res);
  }
);

// --> Login
router.post("/login", async (req: express.Request, res: express.Response) => {
  await UserController.LoginUser(req, res);
});

// User information
router.get("/profile/:id", async (req: express.Request, res: express.Response) => {
    await UserController.UserProfile(req, res);
  }
);

// Logout
router.delete("/logout/:id", async (req: express.Request, res: express.Response) => {
    await UserController.setUserOffline(req, res);
  }
);

// Online users
router.get("/online", async (req: express.Request, res: express.Response) => {
  await UserController.OnlinePlayers(req, res);
});

// Online users
router.put("/avatar/:id/:avatar", async (req: express.Request, res: express.Response) => {
  await UserController.UpdateUserAvatar(req, res);
});

// Leaderboard
router.get("/leaderboard", async (req: express.Request, res: express.Response) => {
  await UserController.Leaderboard(req, res);
});

// // Delete User
// router.delete("/:id", async (req: express.Request, res: express.Response) => {
//   const user_id: number = parseInt(req.params.id);

//   await User.deleteProfile(user_id, res);
// });

// // Update User
// router.put("/:id", async (req: express.Request, res: express.Response) => {
//   const user_id: number = parseInt(req.params.id);
//   const user_info: User = req.body;

//   await User.updateProfile(user_id, user_info, res);
// });



export = router;
