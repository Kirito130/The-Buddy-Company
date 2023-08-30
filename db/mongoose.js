const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose.connect('mongodb://localhost:27017/BudPortalDB', () => {
  console.log("Connected to MongoDB");
});

// let db = mongoose.connection;

// // Check connection
// db.once("open", () => {
//   console.log("Connected to mongodb");
// });