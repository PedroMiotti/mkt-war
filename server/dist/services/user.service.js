"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logout = exports.OnlinePlayers = exports.UserConnected = exports.GetUserSocketIdById = exports.UserProfile = exports.CreateUser = exports.LoginUser = void 0;
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
const LoginUser = async (username, password) => {
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
exports.LoginUser = LoginUser;
const CreateUser = async (username, name, password) => {
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
exports.CreateUser = CreateUser;
const UserProfile = async (id) => {
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
exports.UserProfile = UserProfile;
const GetUserSocketIdById = async (userId) => {
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
exports.GetUserSocketIdById = GetUserSocketIdById;
const UserConnected = async (userId, socketId) => {
    await UserModel.UserConnected(parseInt(userId), socketId);
};
exports.UserConnected = UserConnected;
const OnlinePlayers = async () => {
    let users;
    users = await UserModel.OnlinePlayers();
    return users;
};
exports.OnlinePlayers = OnlinePlayers;
const Logout = async (userId) => {
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
exports.Logout = Logout;
//# sourceMappingURL=user.service.js.map