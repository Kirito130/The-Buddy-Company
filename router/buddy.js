const express = require("express");
const router = new express.Router();
const Buddy = require("../models/Buddy");
const Bud = require("../models/Bud");
const BuddyAuth = require("../middleware/BuddyAuth");
const multer = require("multer");
const Event = require("../models/eventsSchema");

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

// Buddy Homepage \\
router.get("/home-buddy", BuddyAuth, async(req, res) => {
  try {
      const files = await Event.find({});
      res.render("Buddy/buddyHomePage",{
      BuddyName: req.user.BuddyName, files
      });
  } catch (error) {
      req.flash("error", error.toString());
      res.redirect("/");
  }
});

// Buddy About Us \\
router.get("/Buddy-about-us", BuddyAuth, async(req, res) => {
  try {
      const files = await Event.find({});
      res.render("Buddy/buddyAboutUS",{
        BuddyName: req.user.BuddyName, files
      });
  } catch (error) {
      req.flash("error", error.toString());
      res.redirect("/");
  }
});

// Buddy Profile \\
// router.get("/Buddy-profile", BuddyAuth, async (req, res) => {
//   res.render("Buddy/buddyProfile", {
//     BuddyName: req.user.BuddyName,
//     BuddyID: req.user.BuddyID,
//     BuddyStream: req.user.BuddyStream,
//     BuddyYear: req.user.BuddyYear,
//     BuddyContactNumber: req.user.BuddyContactNumber,
//     BuddyEmail: req.user.BuddyEmail,
//   });
// });

// router.post("/Buddy-profile-edit", BuddyAuth, async (req, res) => {
//   try {
//     const Buddy = await Buddy.findOneAndUpdate(
//       { _id: req.user._id },
//       req.body
//     );
//     console.log(req.body)
//     await Buddy.save();
//     req.flash("success", "Updated Successfully");
//     res.redirect("/Buddy-profile");
//   } catch (e) {
//     req.flash("error", e.toString());
//     res.redirect("/Buddy-profile");
//   }
// });

// router.post(
//   "/Buddy-profile-password-change",
//   BuddyAuth,
//   async (req, res) => {
//     try {
//       req.user.BuddyPassword = req.body.BuddyPassword;
//       await req.user.save();
//       req.flash("success", "Updated Successfully");
//       res.redirect("/Buddy-profile");
//     } catch (e) {
//       req.flash("error", e.toString());
//       res.redirect("/Buddy-profile");
//     }
//   }
// );


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


module.exports = router;
