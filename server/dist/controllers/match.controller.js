"use strict";
const MatchService = require("../services/match.service");
class MatchController {
    static async CreateMatch(req, res) {
        let owner_id = parseInt(req.body.ownerId);
        let result = await MatchService.CreateMatch(owner_id);
        if (!result.errorCode)
            return res.status(201).send(result.toString());
        return res.status(400).send(result.data);
    }
    static async JoinMatch(req, res) {
        let user_id = parseInt(req.params.userId);
        let match_id = parseInt(req.params.matchId);
        let result = await MatchService.JoinMatch(user_id, match_id);
        return res.status(201).send('Opponent joined');
    }
}
module.exports = MatchController;
//# sourceMappingURL=match.controller.js.map