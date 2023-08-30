//Requiring all the installed packages
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
var session = require("express-session");
const flash = require("connect-flash");
const messages = require("express-messages");
const Admin = require("./models/admin");
const Bud = require("./models/Bud");
const Buddy = require("./models/Buddy");
require('dotenv').config();

// Express Session Middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

// Express Messages Middleware
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Connect Flash Middleware
app.use(flash());

//Requiring the database
require("./db/mongoose");

// Using express utilities
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine','ejs');
app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/router`));

// Setting local variables for templates
app.use("*", async (req, res, next) => {
  if (req.body.adminUsername != undefined) {
    const admin = await Admin.findOne(
      { adminUsername: req.body.adminUsername },
      { tokens: 0 }
    );
    app.locals.adminUser = admin;
    res.locals.adminUser = admin;
  }
  if (req.body.BudID != undefined) {
    const bud = await Bud.findOne(
      { BudID: req.body.BudID },
      { tokens: 0 }
    );
    app.locals.BudUser = bud;
    res.locals.BudUser = bud;
  }
  if (req.body.BuddyID != undefined) {  
    const buddy = await Buddy.findOne(
      { BuddyID: req.body.BuddyID },
      { tokens: 0 }
    );
    app.locals.BuddyUser = buddy;
    res.locals.BuddyUser = buddy;
  }
  next();
});

//Requiring the routers
const homePageRouter = require("./router/homePage");
const adminRouter = require("./router/admin");
const BudRouter = require("./router/Bud");
const BuddyRouter = require("./router/Buddy");
const userAccessRouter = require("./router/userAccess");
const eventsRouter = require(("./router/events"));
const { json } = require("body-parser");
const { JSONCookie, JSONCookies } = require("cookie-parser");

//Using these routers
app.use(homePageRouter);
app.use(adminRouter);
app.use(BudRouter);
app.use(BuddyRouter);
app.use(userAccessRouter);
app.use(eventsRouter);


//Setting server to listen on port 3000 locally.
app.listen(3000,async(req,res)=>{
    console.log("Server is up and running!");
});

