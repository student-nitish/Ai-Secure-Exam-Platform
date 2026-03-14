const express = require("express");

const router = express.Router();

const {
  getGlobalLeaderboard, 
} = require("../controllers/leaderBoard");

router.get("/global", getGlobalLeaderboard);

module.exports = router;