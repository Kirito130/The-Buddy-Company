const express = require("express");
const router = new express.Router();
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const excelToJson = require("convert-excel-to-json");
const Bud = require("../models/Bud");
const Buddy = require("../models/Buddy");
const adminAuth = require("../middleware/adminAuth");
const BudAuth = require("../middleware/BudAuth");
const BuddyAuth = require("../middleware/BuddyAuth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// router.use(bodyParser.urlencoded({ extended: false }));

//**************************************************Single Registration Starts*************************************/

//**************************************************Bud Registration Starts*************************************/

router.get("/Bud-register",adminAuth,async(req,res)=>{
  res.render("Admin/UserAccess/Register/BudRegister",{adminUsername:req.user.adminUsername});
})

//***********************Post Request:- Bud Registration******************/
router.post("/Bud-register", async (req, res) => {
  const bud = new Bud(req.body);

  try {
    await bud.save();
    req.flash("success", "Registered successfully");    
    res.redirect("/Bud-register");
  } catch (e) {
    req.flash("error", e.toString());
    res.redirect("/Bud-register");      
  }
});
//*******************************************Bud Registration Ends********************************************/


//**************************************************Buddy Registration Starts*************************************/

router.get("/Buddy-register",adminAuth,async(req,res)=>{
  res.render("Admin/UserAccess/Register/BuddyRegister",{adminUsername:req.user.adminUsername});
})

//***********************Post Request:- Buddy Registration******************/
router.post("/Buddy-register",async(req,res)=>{
    const buddy = new Buddy(req.body)
    
    try{
        await buddy.save()
        req.flash("success", "Registered successfully");
        res.redirect("/Buddy-register");
    } catch(e){
        req.flash("error", e.toString());
        res.redirect("/Buddy-register");
    }
});
//**************************************************Buddy Registration Ends*************************************/


//**************************************************Single Registration Ends*************************************/



//**************************************************Multiple Registration Starts*************************************/

//******************Multiple Buds Registration******************//
router.post(
  "/multiple-Buds-register",
  upload.single("uploadfile"),
  async (req, res) => {
    const filePath = "public/uploads/" + req.file.filename;
    const excelData = excelToJson({
      source: fs.readFileSync(filePath),
      sheets: [{ name: "Sheet1", header: { rows: 1 }, columnToKey: {"*": "{{columnHeader}}"}}]
    });
    const BudsData = excelData.Sheet1;
    var finalBudsData = [];
    BudsData.forEach((BudData) => {
      const finalObj = {
        BudName: BudData.budName,
        BudEmail: BudData.budEmail,
        BudContactNumber: BudData.budContactNumber,
        BudStream: BudData.budStream,
        BudYear: BudData.budYear,
        BudID: BudData.budID,
        BudPassword: BudData.budPassword
      };
      finalBudsData.push(finalObj);
    });

    try {
      await Bud.insertMany(finalBudsData, { ordered: true });
      req.flash("success", "Registered successfully");
      res.redirect("/Bud-register");
    } catch (e) {
      req.flash("error", e.toString());
      res.redirect("/Bud-register");
    }

    fs.unlinkSync(filePath);
  }
);

//******************Multiple Buds Registration End******************//

//******************Multiple  Registration******************//
router.post(
  "/multiple-Buddy-register",
  upload.single("uploadfile"),
  async (req, res) => {
    const filePath = "public/uploads/" + req.file.filename;
    const excelData = excelToJson({
      source: fs.readFileSync(filePath),
      sheets: [
        {
          name: "Sheet1",
          header: { rows: 1 },
          columnToKey: { "*": "{{columnHeader}}" },
        },
      ],
    });
    const BuddyData = excelData.Sheet1;
    var finalBuddyData = [];
    BuddyData.forEach((BuddyData) => {
      const finalObj = {
        BuddyName: BuddyData.buddyName,
        BuddyEmail: BuddyData.buddyEmail,
        BuddyContactNumber: BuddyData.buddyContactNumber,
        BuddyStream: BuddyData.buddyStream,
        BuddyYear: BuddyData.buddyYear,
        BuddyID: BuddyData.buddyID,
        BuddyPassword: BuddyData.buddyPassword,
      };

      finalBuddyData.push(finalObj);
    });

    try {
      await Buddy.insertMany(finalBuddyData, { ordered: true });
      req.flash("success", "Registered successfully");
      res.redirect("/Buddy-register");
    } catch (e) {
      req.flash("error", e.toString());
      res.redirect("/Buddy-register");
    }

    fs.unlinkSync(filePath);
  }
);
//******************Multiple Buddy Registration End******************//


//**************************************************Multiple Registration Ends*************************************/




//**************************************************Bud Unregistration Starts*************************************/
router.get("/Bud-unregister",adminAuth,async (req, res) => {
  res.render("Admin/UserAccess/Unregister/BudDelete",{adminUsername:req.user.adminUsername});
});

router.post("/Bud-unregister",async(req,res)=>{
  try{
    const bud = await Bud.findOneAndDelete({BudID:req.body.BudID})
    req.flash("success", "Deleted successfully");
    res.redirect("/Bud-unregister")
  }catch(e){
    req.flash("error", e.toString());
    res.redirect("/Bud-unregister")
  }
  
})
//*******************************************Bud Unregistration Ends********************************************/

//**************************************************Buddy Unregistration Starts*************************************/
router.get("/Buddy-unregister",adminAuth,async (req, res) => {
    res.render("Admin/UserAccess/Unregister/BuddyDelete",{adminUsername:req.user.adminUsername});
  });

router.post("/Buddy-unregister",async(req,res)=>{
  try{
    const buddy = await Buddy.findOneAndDelete({BuddyID:req.body.BuddyID})
    req.flash("success", "Deleted successfully");
    res.redirect("/Buddy-unregister")
  }catch(e){
    req.flash("error", e.toString());
    res.redirect("/Buddy-unregister");
  }
})
//**************************************************Buddy Unregistration Ends*************************************/

module.exports = router;