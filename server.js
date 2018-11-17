"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const exphbs      = require("express-handlebars");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();
const cookieSession = require("cookie-session");
const methodOverride = require("method-override");

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');
const DataHelpers = require("./lib/data_helpers.js")(knex);


// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
const categoriesRoutes = require("./routes/categories");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow
//         for client error codes, cyan for redirection codes, and uncolored
//         for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

// Method Override
app.use(methodOverride('_method'));

// Initialize session cookies with dummie crypt and decrypt keys
app.use(cookieSession({
  name: 'session',
  keys: ['test1', 'test2']
}));

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

app.use(isAuthenticated);

// Mount all resource routes
app.use("/api/users", usersRoutes(DataHelpers));
app.use("/api/categories", categoriesRoutes(DataHelpers));

// Home page
app.get('/', (req, res) => {
  res.render('index', {
    showHeroImage: true,
  });
});

//Display login page
app.get("/login", (req, res) => {
    res.render('login');
});

//For logging in authenticated user
app.post("/login", (req, res) => {
  req.session.user_id = req.body.username;
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});

// Returns a boolean as to whether the user is logged in or not.
function isAuthenticated(req, res, next) {
  req.userAuthenticated = req.session.user_id ? 'true' : 'false';
  next();
}
