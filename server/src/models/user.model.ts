"use strict";

// IMPORTS
// Express
import express = require("express");
//Dotenv
require("dotenv").config();
// SQL
import Sql = require("../infra/sql");

import AppError = require("../utils/appError");

interface IDefaultResponse {
  statusCode: number;
  data?: any;
}

interface IUserLogin {
  player_id: string;
  player_username: string;
  player_password: string;
}

interface IPlayerInfoOnMatchEnd {
  total_games: number;
  total_wins: number;
  total_losses: number;
  total_ties: number;
  max_trophies: number;
  trophies: number;
  coins: number;
}

class UserModel {
  public id: number;
  public name: string;
  public username: string;
  public password: string;
  public trophies: number;
  public avatar: number;
  public coins: number;

  public static readonly COINS_MATCH_WINNED = 50;
  public static readonly TROPHIES_MATCH_WINNED = 10;
  public static readonly COINS_MATCH_LOST = 10;
  public static readonly TROPHIES_MATCH_LOST = 4;

  public static async UserConnected(
    userId: number,
    socketId: string
  ): Promise<void> {
    await Sql.conectar(async (sql: Sql) => {
      let isUserConnected = await sql.scalar(
        "SELECT online_player_id FROM online_players WHERE online_player_id = ?",
        [userId]
      );

      if (isUserConnected)
        await sql.query(
          "UPDATE online_players SET online_player_socketId = ? WHERE online_player_id = ?",
          [socketId, userId]
        );
      else
        await sql.query(
          "INSERT INTO online_players (online_player_id, online_player_socketId) VALUES (?, ?)",
          [userId, socketId]
        );
    });
  }

  // --> Efetuar login
  public static async login(
    username: string,
    password: string
  ): Promise<IUserLogin> {
    let row: IUserLogin;

    await Sql.conectar(async (sql: Sql) => {
      let resp = await sql.query(
        "SELECT player_id, player_username, player_password FROM player WHERE player_username = ? ",
        [username]
      );

      row = resp[0];
    });

    return row ? row : null;
  }

  // --> Criar usuario
  public static async createUser(
    username: string,
    name: string,
    hashedPassword: string
  ): Promise<string | number> {
    let res: string | number = null;

    await Sql.conectar(async (sql: Sql) => {
      try {
        await sql.query(
          "INSERT INTO player (player_name, player_password, player_username, player_trophies, player_avatar, player_coins) VALUES( ?, ?, ?, ?, ?, ?)",
          [name, hashedPassword, username, 0, 1, 0]
        );

        res = sql.lastInsertedId;

        await sql.query(
          "INSERT INTO player_stats (stats_player_id, stats_total_games, stats_max_trophies, stats_total_wins, stats_total_losses, stats_total_ties) VALUES( ?, ?, ?, ?, ?, ?)",
          [res, 0, 0, 0, 0, 0]
        );

      } catch (e) {
        if (e.code) {
          res = e.code;
        } else {
          throw e;
        }
      }
    });

    return res;
  }

  public static async UpdateUserAvatar(avatarId: number, userId: number): Promise<void>{
    await Sql.conectar(async (sql: Sql) => {
      await sql.query(
        "UPDATE player SET player_avatar = ? WHERE player_id = ?",
        [avatarId, userId]
      );
    });
  } 

  // --> Info Usuario
  public static async profile(id: number): Promise<UserModel | any> {
    let user: UserModel;

    await Sql.conectar(async (sql: Sql) => {
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

  public static async GetUserSocketIdById(userId: number): Promise<string> {
    let user_socketId: string;

    await Sql.conectar(async (sql: Sql) => {
      let res: any[];

      res = await sql.query(
        "SELECT online_player_socketid FROM online_players WHERE online_player_id = ?",
        [userId]
      );

      user_socketId = res[0].online_player_socketid;
    });

    return user_socketId;
  }

  public static async GetUserIdBySocketId(socketId: string): Promise<string> {
    let user_id: string;

    await Sql.conectar(async (sql: Sql) => {
      let res: any[];

      res = await sql.query(
        "SELECT online_player_id FROM online_players WHERE online_player_socketid = ?",
        [socketId]
      );

      if (res[0])
        user_id = res[0].online_player_id;
    });

    return user_id;
  }

  public static async Logout(userId: number): Promise<string> {
    let res: string;

    await Sql.conectar(async (sql: Sql) => {
      await sql.query("DELETE FROM online_players WHERE online_player_id = ?", [
        userId,
      ]);

      res = sql.linhasAfetadas.toString();
    });

    return res;
  }

  public static async OnlinePlayers(): Promise<any[]> {
    let users: any[];

    await Sql.conectar(async (sql: Sql) => {
      users = await sql.query(
        "SELECT player_id, player_username, player_name, player_trophies, player_avatar FROM player, online_players WHERE player.player_id = online_players.online_player_id"
      );
    });

    return users;
  }

  public static async UpdatePlayerOnEndMatch(userId: number, trophies: number, coins: number, total_wins: number, 
    total_losses: number, total_ties: number, max_trophies: number, total_games: number): Promise<void> {

    await Sql.conectar(async (sql: Sql) => {
      await sql.query(
        "UPDATE player SET player_trophies = ?, player_coins = ? WHERE player_id = ?", [trophies, coins, userId]
      );

      await sql.query(
        "UPDATE player_stats SET stats_total_games = ?, stats_max_trophies = ?, stats_total_wins = ?, stats_total_losses = ?, stats_total_ties = ? WHERE stats_player_id = ? ", [total_games, max_trophies, total_wins, total_losses, total_ties, userId]
      );
    });

  }

  public static async GetPlayerInfoOnEndMatch(userId: number): Promise<IPlayerInfoOnMatchEnd> {
    let res: any[];
    let playerInfoOnEndMatch: IPlayerInfoOnMatchEnd = {
      total_games: 0,
      total_wins: 0,
      total_losses: 0,
      total_ties: 0,
      max_trophies: 0,
      trophies: 0,
      coins: 0,
    };

    await Sql.conectar(async (sql: Sql) => {
      res = await sql.query(
        "SELECT player_id, player_trophies, player_coins, stats_total_games, stats_max_trophies, stats_total_wins, stats_total_losses, stats_total_ties FROM player INNER JOIN player_stats ON player_stats.stats_player_id = player.player_id  WHERE player.player_id = ?; ", [userId]
      );
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

  

  // // --> Excluir conta
  // public static async deleteProfile(
  //   id: number,
  //   res: express.Response
  // ): Promise<void> {
  //   if (!id) res.status(400).send("Usuário não encontrado !");

  //   await Sql.conectar(async (sql: Sql) => {
  //     await sql.query("DELETE FROM player WHERE player_id = ? ", [id]);

  //     if (sql.linhasAfetadas === 0)
  //       res.status(400).send("Usuário não encontrado !");

  //     res.status(200).send("Usuário excluido com successo !");
  //   });
  // }

  // // --> Editar Usuario
  // public static async updateProfile(
  //   id: number,
  //   u: UserModel,
  //   res: express.Response
  // ): Promise<void> {
  //   let token: string;

  //   if (!id) res.status(400).send("Usuário não encontrado !");

  //   await Sql.conectar(async (sql: Sql) => {
  //     let resp = await sql.query(
  //       "UPDATE player SET player_name = ?, player_username = ?, player_avatar= ? WHERE player_id = ?",
  //       [u.name, u.username, u.avatar, id]
  //     );

  //     if (!resp || !resp.length)
  //       res.status(400).send("Usuário não encontrado !");

  //     token = UserModel.genToken(id);

  //     res.cookie("_token", token, {
  //       maxAge: 365 * 24 * 60 * 60 * 1000,
  //       httpOnly: true,
  //       path: "/",
  //       secure: true,
  //       sameSite: "none",
  //     });
  //   });
  // }

  // // --> Leaderboard
  // public static async getLeaderboard(): Promise<UserModel[] | string> {
  //   let list: UserModel[];
  //   let res: string;

  //   await Sql.conectar(async (sql: Sql) => {
  //     list = await sql.query(
  //       "SELECT * FROM player ORDER BY player_trophies ASC"
  //     );

  //     if (!list || !list.length) res = "Erro ao listar players";
  //   });

  //   return list || res;
  // }
}

export = UserModel;
