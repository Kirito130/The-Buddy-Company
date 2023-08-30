const jwt = require("jsonwebtoken");
const Admin = require("../models/admin")

const adminAuth = async ( req,res,next) => {

    try{
        const token = req.cookies['admin_token'];
        const decode = jwt.verify(token,'thisisadminsecret');
        const user = await Admin.findOne({_id:decode._id});
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

module.exports = adminAuth;