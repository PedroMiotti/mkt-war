"use strict";
//Dotenv
require("dotenv").config();
// SQL
const Sql = require("../infra/sql");
class UserModel {
    static async UserConnected(userId, socketId) {
        await Sql.conectar(async (sql) => {
            let isUserConnected = await sql.scalar("SELECT online_player_id FROM online_players WHERE online_player_id = ?", [userId]);
            if (isUserConnected)
                await sql.query("UPDATE online_players SET online_player_socketId = ? WHERE online_player_id = ?", [socketId, userId]);
            else
                await sql.query("INSERT INTO online_players (online_player_id, online_player_socketId) VALUES (?, ?)", [userId, socketId]);
        });
    }
    // --> Efetuar login
    static async login(username, password) {
        let row;
        await Sql.conectar(async (sql) => {
            let resp = await sql.query("SELECT player_id, player_username, player_password FROM player WHERE player_username = ? ", [username]);
            row = resp[0];
        });
        return row ? row : null;
    }
    // --> Criar usuario
    // @param u = { username, name, password }
    static async createUser(username, name, hashedPassword) {
        let res = null;
        await Sql.conectar(async (sql) => {
            try {
                await sql.query("INSERT INTO player (player_name, player_password, player_username, player_trophies, player_avatar, player_coins) VALUES( ?, ?, ?, ?, ?, ?)", [name, hashedPassword, username, 0, 1, 0]);
                res = sql.lastInsertedId;
            }
            catch (e) {
                if (e.code) {
                    res = e.code;
                }
                else {
                    throw e;
                }
            }
        });
        return res;
    }
    // --> Info Usuario
    static async profile(id) {
        let user;
        await Sql.conectar(async (sql) => {
            let resp = await sql.query("SELECT * FROM player WHERE player_id = ?", [
                id,
            ]);
            let row = resp[0];
            if (row) {
                user = new UserModel();
                user.id = row.player_id;
                user.name = row.player_name;
                user.username = row.player_username;
                user.trophies = row.player_trophies;
                user.avatar = row.player_avatar;
                user.coins = row.player_coins;
            }
        });
        return user ? user : null;
    }
    static async GetUserSocketIdById(userId) {
        let user_socketId;
        await Sql.conectar(async (sql) => {
            let res;
            res = await sql.query("SELECT online_player_socketid FROM online_players WHERE online_player_id = ?", [userId]);
            user_socketId = res[0].online_player_socketid;
        });
        return user_socketId;
    }
    static async Logout(userId) {
        let res;
        await Sql.conectar(async (sql) => {
            await sql.query("DELETE FROM online_players WHERE online_player_id = ?", [
                userId,
            ]);
            res = sql.linhasAfetadas.toString();
        });
        return res;
    }
    static async OnlinePlayers() {
        let users;
        await Sql.conectar(async (sql) => {
            users = await sql.query("SELECT player_id, player_username, player_name, player_trophies, player_avatar FROM player, online_players WHERE player.player_id = online_players.online_player_id");
        });
        return users;
    }
}
module.exports = UserModel;
//# sourceMappingURL=user.model.js.map