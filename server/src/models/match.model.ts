"use strict";

// SQL
import Sql = require("../infra/sql");

class MatchModel {
  public match_id: number;
  public match_status: string;
  public round: number;
  public last_question: string;

  public owner_id: number;
  public opponent_id: number;

  public owner_ready: boolean;
  public opponent_ready: boolean;

  public owner_last_answer: number;
  public opponent_last_answer: number;

  public owner_score: number;
  public opponent_score: number;

  public owner_disconnected: number;
  public opponent_disconnected: number;

  // Times in MS
  public static readonly TOTAL_ROUNDS: number = 5;
  public static readonly ROUND_COUNTDOWN_TIME: number = 15;
  public static readonly TIME_BEFORE_START_MATCH: number = 1000;
  public static readonly TIME_BEFORE_START_FIRST_ROUND: number = 3500;
  public static readonly TIME_BEFORE_COUNTDOWN: number = 1000;
  public static readonly TIME_BEFORE_NEW_ROUND: number = 3000;
  public static readonly TIME_BEFORE_SEND_QUESTION: number = 4000;

  public static async CreateMatch(ownerId: number): Promise<number> {
    let res: number;

    await Sql.conectar(async (sql: Sql) => {
      await sql.query(
        "INSERT INTO _match (owner_id, match_status, round) VALUES (?, ?, ?)",
        [ownerId, 1, 0]
      );

      res = sql.lastInsertedId;
    });

    return res;
  }

  public static async JoinMatch(
    matchId: number,
    userId: number
  ): Promise<void> {
    await Sql.conectar(async (sql: Sql) => {
      await sql.query(
        "UPDATE _match SET opponent_id = ?, match_status = ? WHERE match_id = ?",
        [userId, 2, matchId]
      );
    });
  }

  public static async UpdateMatchStatus(matchId: number, matchStatus: number): Promise<void> {
    await Sql.conectar(async (sql: Sql) => {
      await sql.query(
        "UPDATE _match SET match_status = ? WHERE match_id = ?",
        [matchStatus, matchId]
      );
    });

  }

  public static async GetMatchById(matchId: number): Promise<MatchModel> {
    let matchInfo: MatchModel;

    await Sql.conectar(async (sql: Sql) => {
      let res: any[];

      res = await sql.query("SELECT * FROM _match WHERE match_id = ?", [
        matchId,
      ]);

      matchInfo = res[0];
    });

    return matchInfo;
  }

  public static async SetUserReady(
    userId: number,
    matchId: number,
    isOwner: boolean
  ): Promise<void> {
    await Sql.conectar(async (sql: Sql) => {
      if (isOwner) {
        await sql.query(
          "UPDATE _match SET owner_ready = 1 WHERE match_id = ?",
          [matchId]
        );
      } else {
        await sql.query(
          "UPDATE _match SET opponent_ready = 1 WHERE match_id = ?",
          [matchId]
        );
      }
    });
  }

  public static async UpdateMatchRound(
    matchId: number,
    status: number,
    round: number,
    owner_last_answer: number,
    opponent_last_answer: number,
    last_question: string
  ): Promise<void> {
    await Sql.conectar(async (sql: Sql) => {
      await sql.query(
        "UPDATE _match SET match_status = ?, round = ?, owner_last_answer = ?, opponent_last_answer = ?, last_question = ? WHERE match_id = ? ",
        [
          status,
          round,
          owner_last_answer,
          opponent_last_answer,
          last_question,
          matchId,
        ]
      );
    });
  }

  public static async PlayerAnswerQuestion(
    isOwner: boolean,
    match_id: number,
    score: number,
    lastAnswer: number
  ): Promise<void> {
    await Sql.conectar(async (sql: Sql) => {
      if (isOwner) {
        await sql.query(
          "UPDATE _match SET owner_last_answer = ?, owner_score =? WHERE match_id = ?",
          [lastAnswer, score, match_id]
        );
      } else {
        await sql.query(
          "UPDATE _match SET opponent_last_answer = ?, opponent_score =? WHERE match_id = ?",
          [lastAnswer, score, match_id]
        );
      }
    });
  }

  public static async GetMatchByPlayerId(userId: number): Promise<MatchModel> {
    let matchInfo: MatchModel;

    await Sql.conectar(async (sql: Sql) => {
      let res: any[];

      res = await sql.query(
        "SELECT * FROM _match WHERE owner_id = ? || opponent_id = ? AND match_status != 5",
        [userId, userId]
      );

      matchInfo = res[0];
    });

    return matchInfo;
  }

  public static async DeleteMatch(matchId: number): Promise<void> {

    await Sql.conectar(async (sql: Sql) => {

      await sql.query("DELETE FROM _match WHERE match_id = ?", [matchId]);

    })

  }

  public static async UpdateMatchOpponent(matchId: number): Promise<void> {

    await Sql.conectar(async (sql: Sql) => {

      await sql.query("UPDATE _match SET opponent_ready = ?, opponent_id = ? WHERE match_id = ?", [0, null, matchId]);

    })

  }

  public static async PlayerLeftMatch(isMatchOwner: boolean, matchId: number): Promise<void> {

    await Sql.conectar(async (sql: Sql) => {

      if (isMatchOwner)
        await sql.query("UPDATE _match SET owner_disconnected = ?, match_status = ? WHERE match_id = ? ", [0, 4, matchId]);

      else
        await sql.query("UPDATE _match SET opponent_disconnected = ? , match_status = ? WHERE match_id = ?", [0, 4, matchId]);

    })
  }

}

export = MatchModel;
