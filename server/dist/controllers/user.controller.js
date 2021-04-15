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
}
module.exports = UserController;
//# sourceMappingURL=user.controller.js.map