const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")

const BuddySchema = new mongoose.Schema({
  BuddyName: {
    type: String,
    required: true
  },
  BuddyEmail: {
    type: String,
    required: true,
    unique: true
  },
  BuddyContactNumber: {
    type: String,
    required: true,
    trim: true,
    maxlength: 10
  },
  BuddyStream: {
    type: String,
    required: true
  },
  BuddyYear: {
    type: String,
    required: true,
  },
  BuddyID: {
    type: String,
    required: true,
    unique: true
  },
  BuddyPassword: {
    type: String,
    required: true,
    trim: true,
    minlength: 8
  },
  BuddyProfile_pic: {
    type: Buffer
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
});

BuddySchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, "thisisBuddysecret");
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
  }

  BuddySchema.statics.findBuddyByCredentials = async (id,password) => {
    const buddy = await Buddy.findOne({BuddyID:id});

    if(!buddy){
        throw new Error("Buddy not found!");
    }

    if(buddy.BuddyPassword != password){
        throw new Error("Password is incorrect!");
    }

    return buddy;
};

const Buddy = mongoose.model('Buddy',BuddySchema)

module.exports = Buddy