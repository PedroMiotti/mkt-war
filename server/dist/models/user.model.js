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
    static async createUser(username, name, hashedPassword) {
        let res = null;
        await Sql.conectar(async (sql) => {
            try {
                await sql.query("INSERT INTO player (player_name, player_password, player_username, player_trophies, player_avatar, player_coins) VALUES( ?, ?, ?, ?, ?, ?)", [name, hashedPassword, username, 0, 1, 0]);
                res = sql.lastInsertedId;
                await sql.query("INSERT INTO player_stats (stats_player_id, stats_total_games, stats_max_trophies, stats_total_wins, stats_total_losses, stats_total_ties) VALUES( ?, ?, ?, ?, ?, ?)", [res, 0, 0, 0, 0, 0]);
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
    static async UpdateUserAvatar(avatarId, userId) {
        await Sql.conectar(async (sql) => {
            await sql.query("UPDATE player SET player_avatar = ? WHERE player_id = ?", [avatarId, userId]);
        });
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
    static async GetUserIdBySocketId(socketId) {
        let user_id;
        await Sql.conectar(async (sql) => {
            let res;
            res = await sql.query("SELECT online_player_id FROM online_players WHERE online_player_socketid = ?", [socketId]);
            if (res[0])
                user_id = res[0].online_player_id;
        });
        return user_id;
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
    static async UpdatePlayerOnEndMatch(userId, trophies, coins, total_wins, total_losses, total_ties, max_trophies, total_games) {
        await Sql.conectar(async (sql) => {
            await sql.query("UPDATE player SET player_trophies = ?, player_coins = ? WHERE player_id = ?", [trophies, coins, userId]);
            await sql.query("UPDATE player_stats SET stats_total_games = ?, stats_max_trophies = ?, stats_total_wins = ?, stats_total_losses = ?, stats_total_ties = ? WHERE stats_player_id = ? ", [total_games, max_trophies, total_wins, total_losses, total_ties, userId]);
        });
    }
    static async GetPlayerInfoOnEndMatch(userId) {
        let res;
        let playerInfoOnEndMatch = {
            total_games: 0,
            total_wins: 0,
            total_losses: 0,
            total_ties: 0,
            max_trophies: 0,
            trophies: 0,
            coins: 0,
        };
        await Sql.conectar(async (sql) => {
            res = await sql.query("SELECT player_id, player_trophies, player_coins, stats_total_games, stats_max_trophies, stats_total_wins, stats_total_losses, stats_total_ties FROM player INNER JOIN player_stats ON player_stats.stats_player_id = player.player_id  WHERE player.player_id = ?; ", [userId]);
        });
        if (res && res[0]) {
            let row = res[0];
            playerInfoOnEndMatch.total_games = row.stats_total_games;
            playerInfoOnEndMatch.total_wins = row.stats_total_wins;
            playerInfoOnEndMatch.total_losses = row.stats_total_losses;
            playerInfoOnEndMatch.total_ties = row.stats_total_ties;
            playerInfoOnEndMatch.max_trophies = row.stats_max_trophies;
            playerInfoOnEndMatch.trophies = row.player_trophies;
            playerInfoOnEndMatch.coins = row.player_coins;
        }
        return playerInfoOnEndMatch;
    }
}
UserModel.COINS_MATCH_WINNED = 50;
UserModel.TROPHIES_MATCH_WINNED = 10;
UserModel.COINS_MATCH_LOST = 10;
UserModel.TROPHIES_MATCH_LOST = 4;
module.exports = UserModel;
//# sourceMappingURL=user.model.js.map