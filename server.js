/* External Modules */
const express = require("express");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
// protection
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
// logging
const morgan = require("mongoose-morgan");

const authRequired = require("./middleware/authRequired");

/* Internal Modules */
const controllers = require("./controllers");

/* Instanced Modules */
const app = express();

/* Configuration */
// allow use of .env
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const LIMIT = rateLimit({
  max: 10000, // max requests
  windowMs: 24 * 60 * 60 * 1000, // 1 day
  message: "Too many requests",
});

app.set("view engine", "ejs");

const options = {
  origin: [`*`], //NOTE will be open till deployment
  optionsSuccessStatus: 200, // some legacy browsers choke on status 204
};

app.use(cors(options));
// adding morgan to log HTTP requests

/* 
app.use(
  morgan(
    {
      connectionString: process.env.MONGODB_URI,
    },
    {},
    "dev"
  )
);
 */

/* middleware */
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "Multiverse Venture CYOA App",
    store: new MongoStore({
      url: "mongodb://localhost:27017/multiverse_venture_cyoa_db",
      }),
    cookie: {
      // milliseconds
      // 1000 (one second) * 60 (one minute) * 60 (one hour) * 24 (one day) * 7 (one week) * 2
      maxAge: 1000 * 60 * 60 * 24 * 7 * 2,
    },
  })
);

app.use(LIMIT); // rate limit

app.use(helmet()); // headers protection

app.use(mongoSanitize()); // cleans data to prevent database injection

// const authRequired = function (req, res, next) {
//   if (!req.session.currentUser) {
//     return res.redirect("/login");
//   }
//   next();
// };

// middleware to add user to all ejs views
app.use(function (req, res, next) {
  res.locals.user = req.session.currentUser; // adds the user to all ejs views
  next();
});

/* Routes */

// view routes
app.get("/", function (req, res) {
  // render("file", context)
  res.render("index");
});


// Auth Routes

app.use("/", controllers.auth);

// Author Routes

// app.use("/authors", authRequired, controllers.author);

// Story Routes

app.use("/story", authRequired, controllers.story);


/* Server Listener */
app.listen(PORT, function () {
  console.log(`Server is live and listening at ${PORT}`);
});
