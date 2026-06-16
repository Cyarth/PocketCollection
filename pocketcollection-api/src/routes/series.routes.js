const express = require("express");
const router = express.Router();

const { getSeries } = require("../controllers/series.controller");

router.get("/", getSeries);

module.exports = router;