const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
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

// Cookies
app.use(cookieParser());

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Theme
app.use((req, res, next) => {
  res.locals.theme = req.cookies.theme || "light";
  next();
});

app.post("/theme/toggle", (req, res) => {
  const current = req.cookies.theme || "light";
  const next = current === "dark" ? "light" : "dark";

  res.cookie("theme", next, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  res.json({ theme: next });
});

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
