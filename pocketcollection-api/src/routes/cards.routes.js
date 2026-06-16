const express = require("express");
const router = express.Router();

const {
  getCards,
  searchCards,
  getCardByTcgdexId,
} = require("../controllers/cards.controller");

router.get("/", getCards);
router.get("/search", searchCards);
router.get("/:tcgdexId", getCardByTcgdexId);

module.exports = router;