"use strict";
const express = require("express");
const MatchController = require("../controllers/match.controller");
const router = express.Router();
// --> Create Match
router.post('/create/:ownerId', async (req, res) => {
    await MatchController.CreateMatch(req, res);
});
module.exports = router;
//# sourceMappingURL=match.js.map