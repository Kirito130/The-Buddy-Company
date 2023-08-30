const jwt = require("jsonwebtoken");
const Bud = require("../models/Bud")

const BudAuth = async ( req,res,next) => {

    try{
        const token = req.cookies['Bud_token'];
        const decode = jwt.verify(token,'thisisBudsecret');
        const user = await Bud.findOne({_id:decode._id});
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

module.exports = BudAuth;