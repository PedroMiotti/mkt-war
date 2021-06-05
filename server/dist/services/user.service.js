"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel = require("../models/user.model");
//JWT
const jwt = require("jsonwebtoken");
//BcryptJs
const bcrypt = require("bcryptjs");
// --> Gerar token
const genToken = (key) => {
    const token = jwt.sign({ key }, process.env.JWT_SECRET, {
        expiresIn: 31536000,
    });
    return token;
};
exports.LoginUser = async (username, password) => {
    if (!username || !password)
        return {
            errorCode: 4,
            data: "Usuário ou senha inválidos !",
        };
    let existingUser = await UserModel.login(username, password);
    if (!existingUser) {
        return {
            errorCode: 4,
            data: "Usuário ou senha inválidos !",
        };
    }
    const validPassword = await bcrypt.compare(password, existingUser.player_password);
    if (!validPassword) {
        return {
            errorCode: 4,
            data: "Usuário ou senha inválidos !",
        };
    }
    let token = genToken(parseInt(existingUser.player_id));
    return token;
};
exports.CreateUser = async (username, name, password) => {
    if (!username || !name || !password)
        return {
            errorCode: 4,
            data: "Preencha todas os campos obrigatórios, Por Favor !",
        };
    let hash = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS));
    let newUser = await UserModel.createUser(username, name, hash);
    if (newUser === "ER_DUP_ENTRY")
        return {
            errorCode: 4,
            data: `Ops ! o usuario :  ${username} já está em uso, deseja fazer login ?`,
        };
    let token;
    if (typeof newUser === "number")
        token = genToken(newUser);
    return token;
};
exports.UserProfile = async (id) => {
    if (!id)
        return {
            errorCode: 4,
            data: "Usuário não encontrado !",
        };
    let userInfo = await UserModel.profile(id);
    if (!userInfo)
        return {
            errorCode: 4,
            data: "1Usuário não encontrado !",
        };
    return userInfo;
};
exports.GetUserSocketIdById = async (userId) => {
    if (!userId)
        return {
            errorCode: 4,
            data: "Usuário não encontrado !",
        };
    let socketId = await UserModel.GetUserSocketIdById(userId);
    if (!socketId)
        return {
            errorCode: 4,
            data: "Usuário não está online !",
        };
    return socketId;
};
exports.UserConnected = async (userId, socketId) => {
    await UserModel.UserConnected(parseInt(userId), socketId);
};
exports.UpdateUserAvatar = async (avatarId, userId) => {
    await UserModel.UpdateUserAvatar(avatarId, userId);
};
exports.OnlinePlayers = async () => {
    let users;
    users = await UserModel.OnlinePlayers();
    return users;
};
exports.Logout = async (userId) => {
    let result;
    if (!userId)
        return {
            errorCode: 4,
            data: "Usuário não encontrado !",
        };
    result = await UserModel.Logout(userId);
    if (!result)
        return {
            errorCode: 4,
            data: "Usuário não está online !",
        };
    return 'Usuario logout';
};
exports.Leaderboard = async () => {
    let leaderboard_list;
    leaderboard_list = await UserModel.Leaderboard();
    return leaderboard_list;
};
//# sourceMappingURL=user.service.js.map