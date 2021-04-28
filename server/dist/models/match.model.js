"use strict";
// SQL
const Sql = require("../infra/sql");
class MatchModel {
    static async CreateMatch(ownerId) {
        let res;
        await Sql.conectar(async (sql) => {
            await sql.query("INSERT INTO _match (owner_id, match_status, round) VALUES (?, ?, ?)", [ownerId, 1, 0]);
            res = sql.lastInsertedId;
        });
        return res;
    }
    static async JoinMatch(matchId, userId) {
        await Sql.conectar(async (sql) => {
            await sql.query("UPDATE _match SET opponent_id = ?, match_status = ? WHERE match_id = ?", [userId, 2, matchId]);
        });
    }
    static async UpdateMatchStatus(matchId, matchStatus) {
        await Sql.conectar(async (sql) => {
            await sql.query("UPDATE _match SET match_status = ? WHERE match_id = ?", [matchStatus, matchId]);
        });
    }
    static async GetMatchById(matchId) {
        let matchInfo;
        await Sql.conectar(async (sql) => {
            let res;
            res = await sql.query("SELECT * FROM _match WHERE match_id = ?", [
                matchId,
            ]);
            matchInfo = res[0];
        });
        return matchInfo;
    }
    static async SetUserReady(userId, matchId, isOwner) {
        await Sql.conectar(async (sql) => {
            if (isOwner) {
                await sql.query("UPDATE _match SET owner_ready = 1 WHERE match_id = ?", [matchId]);
            }
            else {
                await sql.query("UPDATE _match SET opponent_ready = 1 WHERE match_id = ?", [matchId]);
            }
        });
    }
    static async UpdateMatchRound(matchId, status, round, owner_last_answer, opponent_last_answer, last_question) {
        await Sql.conectar(async (sql) => {
            await sql.query("UPDATE _match SET match_status = ?, round = ?, owner_last_answer = ?, opponent_last_answer = ?, last_question = ? WHERE match_id = ? ", [
                status,
                round,
                owner_last_answer,
                opponent_last_answer,
                last_question,
                matchId,
            ]);
        });
    }
    static async PlayerAnswerQuestion(isOwner, match_id, score, lastAnswer) {
        await Sql.conectar(async (sql) => {
            if (isOwner) {
                await sql.query("UPDATE _match SET owner_last_answer = ?, owner_score =? WHERE match_id = ?", [lastAnswer, score, match_id]);
            }
            else {
                await sql.query("UPDATE _match SET opponent_last_answer = ?, opponent_score =? WHERE match_id = ?", [lastAnswer, score, match_id]);
            }
        });
    }
    static async GetMatchByPlayerId(userId) {
        let matchInfo;
        await Sql.conectar(async (sql) => {
            let res;
            res = await sql.query("SELECT * FROM _match WHERE owner_id = ? || opponent_id = ? AND match_status != 5", [userId, userId]);
            matchInfo = res[0];
        });
        return matchInfo;
    }
    static async DeleteMatch(matchId) {
        await Sql.conectar(async (sql) => {
            await sql.query("DELETE FROM _match WHERE match_id = ?", [matchId]);
        });
    }
    static async UpdateMatchOpponent(matchId) {
        await Sql.conectar(async (sql) => {
            await sql.query("UPDATE _match SET opponent_ready = ?, opponent_id = ? WHERE match_id = ?", [0, null, matchId]);
        });
    }
    static async PlayerLeftMatch(isMatchOwner, matchId) {
        await Sql.conectar(async (sql) => {
            if (isMatchOwner)
                await sql.query("UPDATE _match SET owner_disconnected = ?, match_status = ? WHERE match_id = ? ", [0, 4, matchId]);
            else
                await sql.query("UPDATE _match SET opponent_disconnected = ? , match_status = ? WHERE match_id = ?", [0, 4, matchId]);
        });
    }
}
// Times in MS
MatchModel.TOTAL_ROUNDS = 10;
MatchModel.ROUND_COUNTDOWN_TIME = 10;
MatchModel.TIME_BEFORE_START_MATCH = 1000;
MatchModel.TIME_BEFORE_START_FIRST_ROUND = 3500;
MatchModel.TIME_BEFORE_COUNTDOWN = 1000;
MatchModel.TIME_BEFORE_NEW_ROUND = 3000;
MatchModel.TIME_BEFORE_SEND_QUESTION = 4000;
module.exports = MatchModel;
//# sourceMappingURL=match.model.js.map