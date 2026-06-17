const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/auth.middleware");
const { register, login } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/login", login);

router.get("/users/me", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, created_at FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Error users/me:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

module.exports = router;