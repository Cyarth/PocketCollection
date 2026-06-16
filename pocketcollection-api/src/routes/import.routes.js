const express = require("express");
const router = express.Router();

const {
  importSeries,
  importSets,
  importCardsBySet,
  importCardsBySerie,
} = require("../controllers/import.controller");

router.post("/series", importSeries);

router.post("/sets", importSets);

router.post("/cards/:setId", importCardsBySet);

router.post("/cards/series/:serieId", importCardsBySerie);

module.exports = router;