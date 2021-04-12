"use strict";
// SQL
const Sql = require("../infra/sql");
class MatchModel {
    static async CreateMatch(ownerId) {
        let res;
        await Sql.conectar(async (sql) => {
            await sql.query("INSERT INTO _match (owner_id, match_status) VALUES (?, ?)", [ownerId, 1]);
            res = sql.lastInsertedId;
        });
        return res;
    }
    static async JoinMatch(matchId, userId) {
        await Sql.conectar(async (sql) => {
            await sql.query("UPDATE _match SET opponent_id = ?, match_status = ? WHERE match_id = ?", [userId, 2, matchId]);
        });
    }
    static async GetMatchById(matchId) {
        let matchInfo;
        await Sql.conectar(async (sql) => {
            let res;
            res = await sql.query("SELECT * FROM _match WHERE match_id = ?", [matchId]);
            matchInfo = res[0];
        });
        return matchInfo;
    }
}
module.exports = MatchModel;
//# sourceMappingURL=match.model.js.map