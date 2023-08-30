const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const adminSchema = new mongoose.Schema({
  adminUsername: {
    type: String,
    required: true,
    unique: true,
    trim:true,
  },
  adminPassword: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
  },
  adminNumber: {
    type: Number,
    required: true,
    trim:true,
    unique:true,
    maxlength:10
  },
  adminEmail: {
    type: String,
    required: true,
    unique:true,
    trim:true
  },
  adminStream: {
    type: String,
    required: true,
    trim:true
  },
  profilePic: {
    type: Buffer,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

adminSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "thisisadminsecret");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  // console.log("Token created!")
  return token;
};

adminSchema.statics.findAdminByCredentials = async (username, password) => {
  const admin = await Admin.findOne({ adminUsername: username });

  if (!admin) {
    throw new Error("No such user found!");
  }

  if (admin.adminPassword != password) {
    throw new Error("Password is incorrect!");
  }

  return admin;
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
