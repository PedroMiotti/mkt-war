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

class UserModel {
  public id: number;
  public name: string;
  public username: string;
  public password: string;
  public trophies: number;
  public avatar: number;
  public coins: number;


  public static async UserConnected(userId: number, socketId: string): Promise<void>{

    await Sql.conectar(async (sql: Sql) => {
      await sql.query("INSERT INTO online_players (online_player_id, online_player_socketId) VALUES (?, ?)", [userId, socketId]);

    })

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
  // @param u = { username, name, password }
  public static async createUser(
    username: string,
    name: string,
    hashedPassword: string,
  ): Promise<string | number> {
    let res: string | number = null;

    await Sql.conectar(async (sql: Sql) => {
      try {
        await sql.query(
          "INSERT INTO player (player_name, player_password, player_username, player_trophies, player_avatar, player_coins) VALUES( ?, ?, ?, ?, ?, ?)",
          [name, hashedPassword, username, 0, 1, 0]
        );

        res = sql.lastInsertedId;
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

  // --> Info Usuario
  public static async profile(id: number): Promise<UserModel | any> {
    let user: UserModel;

    await Sql.conectar(async (sql: Sql) => {
      let resp = await sql.query("SELECT * FROM player WHERE player_id = ?", [
        id,
      ]);

      let row = resp[0];

      if(row){
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

  public static async GetUserSocketIdById(userId: number):Promise<string> {
    let user_socketId: string;

    await Sql.conectar(async (sql: Sql) => {
      let res: any[];

      res = await sql.query("SELECT online_player_socketid FROM online_players WHERE online_player_id = ?", [userId]);

      user_socketId = res[0].online_player_socketid;
      
    })

    return user_socketId;

  }

  public static async Logout(userId: number): Promise<string>{

    let res: string;

    await Sql.conectar(async (sql: Sql) => {

      await sql.query("DELETE FROM online_players WHERE online_player_id = ?", [userId]);

      res = sql.linhasAfetadas.toString();

    });

    return res;


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
