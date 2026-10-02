const express = require("express");
const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

app.use(cors());

app.use(express.json());


app.get("/", (req, res) => {
  res.json({
    message: "Event Management API is running"
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/events", eventRoutes);

app.use("/api/registrations", registrationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use((err, req, res, next) => {
  console.error("=================================");
  console.error("BACKEND ERROR:");
  console.error(err);
  console.error("=================================");

  res.status(500).json({
    message: err.message || "Internal Server Error",
    error: err,
  });
});

module.exports = app;
