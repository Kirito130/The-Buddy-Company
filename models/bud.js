const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")

const BudSchema = new mongoose.Schema({
  BudName: {
    type: String,
    required: true,
  },
  BudEmail: {
    type: String,
    required: true,
    unique: true,
  },
  BudContactNumber: {
    type: String,
    required: true,
    trim: true,
    maxlength: 10,
  },
  BudStream: {
    type: String,
    required: true,
  },
  BudYear: {
    type: String,
    required: true,
  },
  BudID: {
    type: String,
    required: true,
    unique: true,
  },
  BudPassword: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
  },
  BudProfile_pic: {
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

BudSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "thisisBudsecret");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  // console.log("Token created!")
  return token;
};

BudSchema.statics.findBudByCredentials = async (id,password) => {
  const bud = await Bud.findOne({BudID:id});

  if(!bud){
      throw new Error("Bud not found!");
  }

  if(bud.BudPassword != password){
      throw new Error("PAssword is incorrect!");
  }

  return bud;
};

const Bud = mongoose.model("Bud", BudSchema);

module.exports = Bud;
