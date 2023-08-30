const express = require("express");
const router = new express.Router();
const Admin = require("../models/admin");
const Bud = require("../models/Bud");
const Buddy = require("../models/Buddy");
const adminAuth = require("../middleware/adminAuth");
const Event = require("../models/eventsSchema");
const fs = require('fs');
const path = require('path');
const { json } = require("body-parser");
const dirName = require("../dirName");

// Admin Registration Starts \\
router.get("/admin-register", async (req, res) => {
  res.render("Admin/adminRegister");
});

router.post("/admin-register", async (req, res) => {
  const admin = new Admin(req.body);

  try {
    await admin.save();
    const token = await admin.generateAuthToken();
    res.cookie('admin_token', token)
    req.flash("success", "Registered successfully");
    res.redirect("/admin-dashboard")
  } catch (e) {
    req.flash("error", e.toString());
    res.redirect("/admin-register");
  }
});
// Admin Registration Ends \\

// Admin Login Starts \\
router.get("/admin-login", async (req, res) => {
  res.render("Admin/adminLogin");
});

router.post("/admin-login", async (req, res) => {
  try {
    const admin = await Admin.findAdminByCredentials(req.body.adminUsername,req.body.adminPassword);
    const token = await admin.generateAuthToken();
    res.cookie('admin_token', token)
    req.flash("success", "Logged in successfully");
    res.redirect("/admin-dashboard");
  } catch (e) {
    req.flash("error", e.toString());
    res.redirect("/admin-login");
  }
});
// Admin Login Ends \\

// Dashboard \\
router.get("/admin-dashboard",adminAuth,async(req,res)=>{
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

  // Buddy Count
  const countBuddy = await Buddy.count();
  const BuddyBCom = await Buddy.count({ BuddyStream: "BCom" });
  const BuddyBAF = await Buddy.count({ BuddyStream: "BAF" });
  const BuddyBBI = await Buddy.count({ BuddyStream : "BBI" });
  const BuddyBFM = await Buddy.count({ BuddyStream : "BFM" });
  const BuddyBMS = await Buddy.count({ BuddyStream: "BMS" });
  const BuddyBA = await Buddy.count({ BuddyStream: "BA" });
  const BuddyBAMMC = await Buddy.count({ BuddyStream : "BAMMC" });
  const BuddyBAFTNMP = await Buddy.count({ BuddyStream : "BAFTNMP" });
  const BuddyBSc = await Buddy.count({ BuddyStream: "BSc" });
  const BuddyBScBiotech = await Buddy.count({ BuddyStream: "BSc(Biotechnology)" });
  const BuddyBScCS = await Buddy.count({ BuddyStream : "BSc(CS)" });
  const BuddyBScIT = await Buddy.count({ BuddyStream : "BSc(IT)" });
  const BuddyBScDS = await Buddy.count({ BuddyStream: "BSc(Data Science & BA)" });
  const BuddyBVocSp = await Buddy.count({ BuddyStream : "BVoc(Sports & Entertainment Management)" });
  const BuddyBVocWeb = await Buddy.count({ BuddyStream : "BVoc(Web Technologies)" });
  const BuddyFY = await Buddy.count({ BuddyYear: "FY" });
  const BuddySY = await Buddy.count({ BuddyYear: "SY" });
  const BuddyTY = await Buddy.count({ BuddyYear: "TY" });

  res.render("Admin/adminDashboard", {
    adminUsername: req.user.adminUsername,
    countBud, BudsBScIT, BudsBMS, BudsBAMMC, BudsBAFTNMP, BudsBCom, 
    BudsBAF, BudsBBI,BudsBFM, BudsBA, BudsBSc, BudsBScBiotech, BudsBScCS,
    BudsBScDS, BudsBVocSp, BudsBVocWeb, BudsFY, BudsSY, BudsTY,
    countBuddy, BuddyBScIT, BuddyBMS, BuddyBAMMC, BuddyBAFTNMP, BuddyBCom, 
    BuddyBAF, BuddyBBI,BuddyBFM, BuddyBA, BuddyBSc, BuddyBScBiotech, BuddyBScCS,
    BuddyBScDS, BuddyBVocSp, BuddyBVocWeb, BuddyFY, BuddySY, BuddyTY
  });
})
// Dashboard ends \\

// Admin Profile \\
router.get("/admin-profile",adminAuth, async (req, res) => {
  res.render("Admin/adminProfile",{adminUsername:req.user.adminUsername,adminNumber:req.user.adminNumber
    ,adminEmail:req.user.adminEmail,adminStream:req.user.adminStream});
});

router.post("/admin-profile-edit",adminAuth,async (req, res) => {
  try{
    const admin = await Admin.findOneAndUpdate({_id:req.user._id},req.body)
    await admin.save();
    req.flash("success", "Updated Successfully");
    res.redirect("/admin-profile");
  }catch(e){
    req.flash("error", e.toString());
    res.redirect("/admin-profile");
  }
});

router.post("/admin-profile-password-change",adminAuth,async(req,res)=>{
  try{
    req.user.adminPassword = req.body.adminPassword
    await req.user.save();
    req.flash("success", "Updated Successfully");
    res.redirect("/admin-profile");
  }catch(e){
    req.flash("error", e.toString());
    res.redirect("/admin-profile");
  }
});
// Admin Profile Ends\\

// Logout starts \\
router.get("/admin-logout", adminAuth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.clearCookie("admin_token");
    req.flash("success", "Logged Out Successfully");
    res.redirect("/");
  } catch (e) {
    res.status(500).send();
  }
});
// Logout ends \\


module.exports = router;
