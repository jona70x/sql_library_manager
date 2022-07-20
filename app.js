const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

//importing routes
const indexRouter = require("./routes/index");

const app = express();

//Requering sequelize and models
const sequelize = require("./models/index").sequelize;
const Book = require("./models").Book;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use("/", indexRouter);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been stablished succesfully");
    await sequelize.sync();
  } catch (error) {
    throw error;
  }
})();

//Error handlers
// catch 404
app.use(function (req, res, next) {
  const error = new Error();
  error.message =
    "Oops! It seems that the webpage you are trying to get does not exist";
  error.status = 404;
  res.render("page-not-found", { error });
});

// global error handler
app.use(function (err, req, res, next) {
  err.status = 500;
  err.message = "An error has ocurred. Let us fix it for you";
  res.render("error", { err });
});

module.exports = app;
