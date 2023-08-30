const jwt = require("jsonwebtoken");
const Buddy = require("../models/Buddy")

const BuddyAuth = async ( req,res,next) => {

    try{
        const token = req.cookies['Buddy_token'];
        const decode = jwt.verify(token,'thisisBuddysecret');
        const user = await Buddy.findOne({_id:decode._id});
        if(!user){
            throw new Error();
        }
        req.user = user;
        req.token = token;
        next()
    }catch(e){
        res.status(400).send({error:'Please authenticate!'})
    }
    

}

module.exports = BuddyAuth;