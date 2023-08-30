const express = require("express");
const router = new express.Router();
const Admin = require("../models/admin");
const Bud = require("../models/Bud");
const Buddy = require("../models/Buddy");
const adminAuth = require("../middleware/adminAuth");
const BudAuth = require("../middleware/BudAuth");
const BuddyAuth = require("../middleware/BuddyAuth");
const Event = require("../models/eventsSchema");


//Get the Home Login Page
router.get("/", async(req, res) => {
    res.render("homePage1");
});

// Get Home Page
router.get("/home", async(req, res) => {
    try {
        const files = await Event.find({});
        res.render("homePage",{
            files
        });
    } catch (error) {
        req.flash("error", error.toString());
        res.redirect("/");
    }
});

module.exports = router;