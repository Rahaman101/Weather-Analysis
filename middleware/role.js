const jwt =  require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");

const checkRole = (role) => {
  return async(req, res, next) => {
    try {
        const token = req.headers.token;
        const email = jwt.decode(token, process.env.SALT);
        const user = await User.findOne({email});
        if(user){
            if (user.role == role) {
              next();
            } else {
              res.status(403).json({ msg: "Access Denied" });
            }
        }else{
            res.status(404).json({ msg: "User not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "server error" });
    }
  };
};


module.exports = checkRole;