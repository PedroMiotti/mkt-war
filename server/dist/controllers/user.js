"use strict";
const UserModel = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//Dotenv
require('dotenv').config();
module.exports = class User {
    static genToken(key) {
        const token = jwt.sign({ key }, process.env.JWT_SECRET, {
            expiresIn: 86400,
        });
        return token;
    }
    // Register User
    static async registerUser(u) {
        const { username } = u;
        try {
            if (await UserModel.findOne({ username }))
                return { statusCode: 400, message: "Usuario ja existe" };
            const user = await UserModel.create(u);
            return { statusCode: 200, message: "Usuario Criado" };
        }
        catch (e) {
            return { statusCode: 400, message: `Registro de usuario falhou. error: ${e}` };
        }
    }
    // Login
    static async login(username, password) {
        const errorObj = { statusCode: 400, message: "Usuario ou senha incorretos" };
        try {
            if (!username || !password)
                return errorObj;
            const user = await UserModel.findOne({ username }).select("+password");
            if (!user)
                return errorObj;
            if (!await bcrypt.compare(password, user.password))
                return errorObj;
            return { statusCode: 200, token: User.genToken(user.id) };
        }
        catch (e) {
            return { statusCode: 400, message: `Ops ! Algo deu errado. error: ${e}` };
        }
    }
    // Get user profile
    static async getProfile(id) {
        const errorObj = { statusCode: 400, message: "Usuario nao encontrado" };
        let user = null;
        try {
            if (!id)
                return errorObj;
            user = await UserModel.findOne({ _id: id });
            if (!user)
                return errorObj;
            return { statusCode: 201, u: user };
            ;
        }
        catch (e) {
            return { statusCode: 400, message: `Ops ! Algo deu errado. error : ${e}` };
        }
    }
    // Leaderboard
    static async getLeaderboard() {
        let list = null;
        try {
            list = UserModel.find({}).sort({ trophies: -1 });
            if (!list)
                return { statusCode: 400, message: 'Nada foi encontrado' };
            return list;
        }
        catch (e) {
            return { statusCode: 400, message: `Ops ! Algo deu errado. error : ${e}` };
        }
    }
};
//# sourceMappingURL=user.js.map