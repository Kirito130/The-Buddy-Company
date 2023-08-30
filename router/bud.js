const express = require("express");
const router = new express.Router();
const Bud = require("../models/Bud");
const adminAuth = require("../middleware/adminAuth");
const BudAuth = require("../middleware/BudAuth");
const Event= require("../models/eventsSchema")

// Bud Login \\
router.get("/Bud-login", async (req, res) => {
  res.render("Bud/budLogin");
});

router.post("/Bud-login", async (req, res) => {
  try {
    const bud = await Bud.findBudByCredentials(
      req.body.BudID,
      req.body.BudPassword
    );
    const token = await bud.generateAuthToken();
    res.cookie("Bud_token", token);
    req.flash("success", "Logged in successfully");
    res.redirect("/home");
  } catch (e) {
    req.flash("error", e.toString());
    res.redirect("/Bud-login");
  }
});
// Bud Login Ends \\

  // Bud Dashboard \\
  router.get("/Bud-dashboard", BudAuth, async (req, res) => {
    res.render("Bud/budDashboard", {BudName: req.user.BudName});
  });
  // Bud Dashboard Ends \\

// Bud Profile \\
router.get("/Bud-profile", BudAuth, async (req, res) => {
  res.render("Bud/budProfile", {
    BudName: req.user.BudName,
    BudID: req.user.BudID,
    BudYear: req.user.BudYear,
    BudStream: req.user.BudStream,
    BudContactNumber: req.user.BudContactNumber,
    BudEmail: req.user.BudEmail,
  });
});

router.post("/Bud-profile-edit", BudAuth,async (req, res) => {
  try{
    const Bud = await Bud.findOneAndUpdate({_id:req.user._id},req.body)
    // console.log(req.body)
    await Bud.save();
    req.flash("success", "Updated Successfully");
    res.redirect("/Bud-profile");
  }catch(e){
    req.flash("error", e.toString());
    res.redirect("/Bud-profile");
  }
});

router.post("/Bud-profile-password-change",BudAuth,async(req,res)=>{
  try{
    req.user.BudPassword = req.body.BudPassword
    await req.user.save();
    req.flash("success", "Updated Successfully");
    res.redirect("/Bud-profile");
  }catch(e){
    req.flash("error", e.toString());
    res.redirect("/Bud-profile");
  }
});
// Bud Profile Ends \\

// Bud Logout \\
router.get("/Bud-logout", BudAuth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.clearCookie("Bud_token");
    req.flash("success", "Logged Out Successfully");
    res.redirect("/Bud-login");
  } catch (e) {
    res.status(500).send();
  }
});
// Bud Logout Ends \\

module.exports = router;
