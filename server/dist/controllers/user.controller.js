"use strict";
const UserService = require("../services/user.service");
class UserController {
    static async LoginUser(req, res) {
        const { username, password } = req.body;
        const result = await UserService.LoginUser(username, password);
        if (typeof result === "string") {
            return res.cookie("_token", result, {
                maxAge: 365 * 24 * 60 * 60 * 1000,
                httpOnly: false,
                path: "/",
            }).send(result);
        }
        return res.status(400).send(result.data);
    }
    static async CreateUser(req, res) {
        let { username, name, password } = req.body;
        const result = await UserService.CreateUser(username, name, password);
        if (typeof result === "string")
            return res.cookie("_token", result, {
                maxAge: 365 * 24 * 60 * 60 * 1000,
                httpOnly: false,
                path: "/",
            }).send(result);
        return res.status(400).send(result.data);
    }
    static async UserProfile(req, res) {
        let user_id = parseInt(req.params.id);
        const result = await UserService.UserProfile(user_id);
        if (!result.errorCode)
            return res.status(200).send(result);
        return res.status(400).send(result.data);
    }
    static async Logout(req, res) {
        let user_id = parseInt(req.params.id);
        const result = await UserService.Logout(user_id);
        if (typeof result === 'string')
            return res.status(200).send(result);
        return res.status(400).send(result.data);
    }
    static async OnlinePlayers(req, res) {
        let users;
        users = await UserService.OnlinePlayers();
        return res.status(200).send(users);
    }
    static async UpdateUserAvatar(req, res) {
        const avatar_id = parseInt(req.params.avatar);
        const user_id = parseInt(req.params.id);
        console.log(req.params.avatar);
        await UserService.UpdateUserAvatar(avatar_id, user_id);
        return res.status(200).send("Avatar updated");
    }
}
module.exports = UserController;
//# sourceMappingURL=user.controller.js.map