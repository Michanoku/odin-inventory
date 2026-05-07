const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const path = require("path");

const indexRoutes = require("./routes/indexRoutes");
const gameRoutes = require("./routes/gameRoutes");
const devRoutes = require("./routes/devRoutes");
const genreRoutes = require("./routes/genreRoutes");
const platformRoutes = require("./routes/platformRoutes");


const app = express();

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware for logging, formdata and json
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRoutes);
app.use("/games", gameRoutes);
app.use("/developers", devRoutes);
app.use("/genres", genreRoutes);
app.use("/platforms", platformRoutes);

// 404
app.use((req, res) => {
  res.status(404).render("error", {
    title: "Not Found",
    errorTitle: 404,
    errorMessage: "This page does not exist.",
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  const status = err.status || 500;

  res.status(status).render("error", {
    title: "Error",
    errorTitle: status,
    errorMessage: err.message || "Something went wrong.",
  });
});

module.exports = app;
