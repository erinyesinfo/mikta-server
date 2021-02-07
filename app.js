const express = require("express");
const helmet = require('helmet');
const cors = require("cors");
const session = require("express-session");
const mongoStore = require("connect-mongo")(session);
const app = express();

const router = require("./router");
const pageNotFound = require("./router/404");

app.enable('trust proxy'); // optional, not needed for secure cookies
let sessionOptions = session({
  key : 'sid',
  proxy : true, // add this when behind a reverse proxy, if you need secure cookies
  secret: process.env.MONGO_SECRET,
  store: new mongoStore({ client: require("./db") }),
  resave: false,
  saveUninitialized: false
});

let whitelist = [
  'https://mikta.netlify.com',
  'https://mikta.netlify.app'
];
let corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    // reflect (enable) the requested origin in the CORS response
    corsOptions = {
      credentials: true,
      origin: true,
      optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    }
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
};

app.use(helmet());
app.use(cors(corsOptionsDelegate));
app.use(sessionOptions);

app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("views");
app.set("view engine", "ejs");

app.use((req, res, next) => {
  if (req.session.user) { req.visitorId = req.session.user._id }
  else { req.visitorId = 0 }

  res.locals.user = req.session.user;
  next();
});

app.use(router);
app.use(pageNotFound);

module.exports = app;
