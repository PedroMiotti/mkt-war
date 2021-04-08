"use strict";
//JWT
const jwt = require("jsonwebtoken");
//Dotenv
require("dotenv").config();
//BcryptJs
const bcrypt = require("bcryptjs");
// SQL
const Sql = require("../infra/sql");
class User {
    // --> Gerar token
    static genToken(key) {
        const token = jwt.sign({ key }, process.env.JWT_SECRET, {
            expiresIn: 31536000,
        });
        return token;
    }
    // --> Efetuar login
    static async login(username, password, res) {
        let data;
        let statusCode;
        if (!username || !password)
            return { statusCode: 400, data: 'Usuário ou senha inválidos !' };
        await Sql.conectar(async (sql) => {
            let resp = await sql.query("SELECT player_id, player_username, player_password FROM player WHERE player_username = ? ", [username]);
            let row = resp[0];
            if (!resp || !resp.length) {
                statusCode = 400;
                data = "Usuário ou senha inválidos !";
                return;
            }
            const validPassword = await bcrypt.compare(password, row.player_password);
            if (!validPassword) {
                statusCode = 400;
                data = "Usuário ou senha inválidos !";
                return;
            }
            data = User.genToken(parseInt(row.player_id));
            statusCode = 200;
        });
        return { statusCode, data };
    }
    // --> Criar usuario
    // @param u = { username, name, password }
    static async createUser(u) {
        let data;
        let statusCode;
        await Sql.conectar(async (sql) => {
            try {
                let hash = bcrypt.hashSync(u.password, parseInt(process.env.SALT_ROUNDS));
                await sql.query("INSERT INTO player (player_name, player_password, player_username, player_trophies, player_avatar, player_coins) VALUES( ?, ?, ?, ?, ?, ?)", [u.name, hash, u.username, 0, 1, 0]);
                data = User.genToken(sql.lastInsertedId);
                statusCode = 200;
            }
            catch (e) {
                if (e.code && e.code === "ER_DUP_ENTRY") {
                    statusCode = 400;
                    data = `Ops ! o usuario :  ${u.username} já está em uso, deseja fazer login ou recuperar sua senha ?`;
                    return;
                }
                else {
                    throw e;
                }
            }
        });
        return { statusCode, data };
    }
    // --> Excluir conta
    static async deleteProfile(id, res) {
        if (!id)
            res.status(400).send("Usuário não encontrado !");
        await Sql.conectar(async (sql) => {
            await sql.query("DELETE FROM player WHERE player_id = ? ", [id]);
            if (sql.linhasAfetadas === 0)
                res.status(400).send("Usuário não encontrado !");
            res.status(200).send("Usuário excluido com successo !");
        });
    }
    // --> Info Usuario
    static async profile(id) {
        let user;
        let data;
        let statusCode;
        if (!id) {
            data = "Usuário não encontrado !";
            statusCode = 400;
            return;
        }
        await Sql.conectar(async (sql) => {
            let resp = await sql.query("SELECT * FROM player WHERE player_id = ?", [
                id,
            ]);
            let row = resp[0];
            if (!resp || !resp.length) {
                data = "Usuário não encontrado !";
                statusCode = 400;
                return;
            }
            else {
                user = new User();
                user.name = row.player_name;
                user.username = row.player_username;
                user.trophies = row.player_trophies;
                user.avatar = row.player_avatar;
                user.coins = row.player_coins;
            }
            data = user;
            statusCode = 201;
        });
        return { statusCode, data };
    }
    // --> Editar Usuario
    static async updateProfile(id, u, res) {
        let token;
        if (!id)
            res.status(400).send("Usuário não encontrado !");
        await Sql.conectar(async (sql) => {
            let resp = await sql.query("UPDATE player SET player_name = ?, player_username = ?, player_avatar= ? WHERE player_id = ?", [u.name, u.username, u.avatar, id]);
            if (!resp || !resp.length)
                res.status(400).send("Usuário não encontrado !");
            token = User.genToken(id);
            res.cookie("_token", token, {
                maxAge: 365 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                path: "/",
                secure: true,
                sameSite: "none",
            });
        });
    }
    // --> Leaderboard
    static async getLeaderboard() {
        let list;
        let res;
        await Sql.conectar(async (sql) => {
            list = await sql.query("SELECT * FROM player ORDER BY player_trophies ASC");
            if (!list || !list.length)
                res = "Erro ao listar players";
        });
        return list || res;
    }
}
module.exports = User;
//# sourceMappingURL=user.js.map