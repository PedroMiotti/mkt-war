"use strict";

// SQL
import Sql = require('../infra/sql');

class MatchModel{

  public id: number;
  public owner_id: number;
  public opponent_id: number;
  public status: string;


  public static async CreateMatch(ownerId: number): Promise<number>{
    let res: number;

    await Sql.conectar(async (sql: Sql) => {

      await sql.query("INSERT INTO _match (owner_id, match_status) VALUES (?, ?)", [ownerId, 1]);

      res = sql.lastInsertedId;

    });

    return res;


  }


  public static async JoinMatch(matchId: number, userId: number): Promise<void> {

    await Sql.conectar(async (sql: Sql) => {
      await sql.query("UPDATE _match SET opponent_id = ?, match_status = ? WHERE match_id = ?", [userId, 2, matchId ]);

    });

  }


  public static async GetMatchById(matchId: number): Promise<MatchModel>{

    let matchInfo: MatchModel;

    await Sql.conectar(async (sql: Sql) => {

      let res: any[];

      res = await sql.query("SELECT * FROM _match WHERE match_id = ?", [matchId]);

      matchInfo = res[0];

    })

    return matchInfo;

  }

}


export = MatchModel;
