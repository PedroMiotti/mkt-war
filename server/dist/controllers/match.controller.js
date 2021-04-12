"use strict";
const MatchService = require("../services/match.service");
class MatchController {
    static async CreateMatch(req, res) {
        let owner_id = parseInt(req.params.ownerId);
        let result = await MatchService.CreateMatch(owner_id);
        if (typeof result === "number")
            return res.status(201).send(result);
        return res.status(400).send(result.data);
    }
}
module.exports = MatchController;
//# sourceMappingURL=match.controller.js.map