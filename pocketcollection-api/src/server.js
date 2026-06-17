const express = require("express");
const cors = require("cors");
require("dotenv").config();

const setsRoutes = require("./routes/sets.routes");
const healthRoutes = require("./routes/health.routes");
const seriesRoutes = require("./routes/series.routes");
const importRoutes = require("./routes/import.routes");
const cardsRoutes = require("./routes/cards.routes");
const authRoutes = require("./routes/auth.routes");
const collectionsRoutes = require("./routes/collections.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/series", seriesRoutes);
app.use("/api/import", importRoutes);
app.use("/api/sets", setsRoutes);
app.use("/api/cards", cardsRoutes);
app.use("/api", authRoutes);
app.use("/api/collections", collectionsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`PocketCollection API running on port ${PORT}`);
});