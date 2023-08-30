const express = require("express");
const router = new express.Router();
const Buddy = require("../models/Buddy");
const Bud = require("../models/Bud");
const BuddyAuth = require("../middleware/BuddyAuth");
const multer = require("multer");

// Buddy Login \\
router.get("/Buddy-login", async (req, res) => {
  res.render("Buddy/buddyLogin");
});

router.post("/Buddy-login", async (req, res) => {
  try {
    const buddy = await Buddy.findBuddyByCredentials(
      req.body.BuddyID,
      req.body.BuddyPassword
    );
    const token = await buddy.generateAuthToken();
    res.cookie("Buddy_token", token);
    req.flash("success", "Logged in successfully");
    res.redirect("/home-Buddy");
  } catch (e) {
    req.flash("error", e.toString());
    res.redirect("/Buddy-login");
  }
});
// Buddy Login Ends \\

// Buddy Logout \\
router.get("/Buddy-logout", BuddyAuth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.clearCookie("Buddy_token");
    req.flash("success", "Logged Out Successfully");
    res.redirect("/Buddy-login");
  } catch (e) {
    res.status(500).send(e);
  }
});
// Buddy Logout Ends \\

// Buddy Dashboard \\
router.get("/Buddy-dashboard", BuddyAuth, async (req, res) => {
  
  // Buds Count
  const countBud = await Bud.count();
  const BudsBCom = await Bud.count({ BudStream: "BCom" });
  const BudsBAF = await Bud.count({ BudStream: "BAF" });
  const BudsBBI = await Bud.count({ BudStream : "BBI" });
  const BudsBFM = await Bud.count({ BudStream : "BFM" });
  const BudsBMS = await Bud.count({ BudStream: "BMS" });
  const BudsBA = await Bud.count({ BudStream: "BA" });
  const BudsBAMMC = await Bud.count({ BudStream : "BAMMC" });
  const BudsBAFTNMP = await Bud.count({ BudStream : "BAFTNMP" });
  const BudsBSc = await Bud.count({ BudStream: "BSc" });
  const BudsBScBiotech = await Bud.count({ BudStream: "BSc(Biotechnology)" });
  const BudsBScCS = await Bud.count({ BudStream : "BSc(CS)" });
  const BudsBScIT = await Bud.count({ BudStream : "BSc(IT)" });
  const BudsBScDS = await Bud.count({ BudStream: "BSc(Data Science & BA)" });
  const BudsBVocSp = await Bud.count({ BudStream : "BVoc(Sports & Entertainment Management)" });
  const BudsBVocWeb = await Bud.count({ BudStream : "BVoc(Web Technologies)" });
  const BudsFY = await Bud.count({ BudYear: "FY" });
  const BudsSY = await Bud.count({ BudYear: "SY" });
  const BudsTY = await Bud.count({ BudYear: "TY" });

  res.render("Buddy/buddyDashboard", {
    BuddyName: req.user.BuddyName, 
    countBud, BudsBScIT, BudsBMS, BudsBAMMC, BudsBAFTNMP, BudsBCom, 
    BudsBAF, BudsBBI,BudsBFM, BudsBA, BudsBSc, BudsBScBiotech, BudsBScCS,
    BudsBScDS, BudsBVocSp, BudsBVocWeb, BudsFY, BudsSY, BudsTY
  });
});
// Buddy Dashboard Ends \\

// Buddy Profile \\
router.get("/Buddy-profile", BuddyAuth, async (req, res) => {
  res.render("Buddy/buddyProfile", {
    BuddyName: req.user.BuddyName,
    BuddyID: req.user.BuddyID,
    BuddyStream: req.user.BuddyStream,
    BuddyYear: req.user.BuddyYear,
    BuddyContactNumber: req.user.BuddyContactNumber,
    BuddyEmail: req.user.BuddyEmail,
  });
});

router.post("/Buddy-profile-edit", BuddyAuth, async (req, res) => {
  try {
    const Buddy = await Buddy.findOneAndUpdate(
      { _id: req.user._id },
      req.body
    );
    console.log(req.body)
    await Buddy.save();
    req.flash("success", "Updated Successfully");
    res.redirect("/Buddy-profile");
  } catch (e) {
    req.flash("error", e.toString());
    res.redirect("/Buddy-profile");
  }
});

router.post(
  "/Buddy-profile-password-change",
  BuddyAuth,
  async (req, res) => {
    try {
      req.user.BuddyPassword = req.body.BuddyPassword;
      await req.user.save();
      req.flash("success", "Updated Successfully");
      res.redirect("/Buddy-profile");
    } catch (e) {
      req.flash("error", e.toString());
      res.redirect("/Buddy-profile");
    }
  }
);

module.exports = router;
