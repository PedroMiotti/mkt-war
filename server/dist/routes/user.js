"use strict";
const express = require("express");
const UserController = require("../controllers/user.controller");
const router = express.Router();
// --> Register user
router.post("/register", async (req, res) => {
    await UserController.CreateUser(req, res);
});
// --> Login
router.post("/login", async (req, res) => {
    await UserController.LoginUser(req, res);
});
// User information
router.get("/profile/:id", async (req, res) => {
    await UserController.UserProfile(req, res);
});
// Logout
router.delete("/logout/:id", async (req, res) => {
    await UserController.Logout(req, res);
});
module.exports = router;
//# sourceMappingURL=user.js.map