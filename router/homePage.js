const express = require("express");
const router = new express.Router();

//Get the Home Login Page
router.get("/", async(req, res) => {
    res.render("homePage1");
});

module.exports = router;