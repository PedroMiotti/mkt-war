"use strict";
const express = require("express");
const MatchController = require("../controllers/match.controller");
const router = express.Router();
// --> Create Match
router.post('/create', async (req, res) => {
    await MatchController.CreateMatch(req, res);
});
// --> Join Match
router.put('/join/:userId/:matchId', async (req, res) => {
    await MatchController.JoinMatch(req, res);
});
module.exports = router;
//# sourceMappingURL=match.js.map