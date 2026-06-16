const express = require("express");
const router = express.Router();

const { getSets } = require("../controllers/sets.controller");

router.get("/", getSets);

module.exports = router;