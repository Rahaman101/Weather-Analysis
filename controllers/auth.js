const User = require("../models/user.js");
const bcryptjs = require("bcryptjs");
const ip = require("ip");
const uuid = require("uuid");
const mail = require("../utils/mailer.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async(req, res) => {
    try {
        const {email} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser){
            existingUser.requestStatus = 101;
            await existingUser.save()
        }else{
            const newUser = new User({
                email,
                approveTime: new Date(),
                requestStatus: 101,
            });
            await newUser.save();
        }
        res.status(200).json({"msg": "Request Sent", code: 102})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "server error"})
    }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({email});
    console.log(email, password, existingUser)
    if (existingUser) {
        if(existingUser.password != null){
            const passCheck = await bcryptjs.compare(password, existingUser.password);
            if(passCheck){
                console.log(process.env.SALT);
                let token = jwt.sign(existingUser.email, process.env.SALT);
                res
                  .status(200)
                  .json({ msg: "Logged in", code: 102, token });
            
            }else{
                res.status(403).json({ msg: "Invalid Credintials" });
            }
        }else{
            res.status(403).json({ msg: "Access Pending" });
        }
    } else {
        res.status(404).json({ msg: "Access Denied" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "server error" });
}
};

const isLogged = async(req, res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ msg: "server error" });
    }
}

const approveRequest = async(req, res) => {
    try {
        const {id} = req.params;
        const ext_user = await User.findById(id);
        if (ext_user) {
            const password = Array(12).fill(0).map(() => '!@#$%^&*0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.random()*75|0]).join('');
            let hash = await bcryptjs.hash(password, 12);
            ext_user.password = hash;
            ext_user.lastLogin = new Date();
            ext_user.requestStatus = 102;
            ext_user.save();
            await mail(
              "Vignan's Weather link Access Approved!",
              `
                    <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Weather Link Access Approval</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .container {
                            border: 1px solid #ddd;
                            border-radius: 5px;
                            padding: 20px;
                            background-color: #f9f9f9;
                        }
                        .password {
                            font-size: 18px;
                            font-weight: bold;
                            color: #007bff;
                            background-color: #e6f2ff;
                            padding: 10px;
                            border-radius: 3px;
                            margin: 10px 0;
                        }
                        .note {
                            font-style: italic;
                            color: #666;
                            margin-top: 15px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>Vignan's Weather Link Access Approval</h2>
                        <p>Your access request for ${ext_user.email} has been approved. Please use the following password to log in:</p>
                        <div class="password">${password}</div>
                        <p class="note">Note: This password is valid for 24 hours from the approval time.</p>
                    </div>
                </body>
                </html>
                `,
              ext_user.email
            );
            res.status(200).json({ msg: "Request Approved", code: 103});
        } else {
          res.status(404).json({ msg: "user not found" });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "server error" });
    }
}

const discardRequest = async(req, res) => {
    try {
        const {id} = req.params;
        const ext_user = await User.findById(id);
        if (ext_user) {
            ext_user.requestStatus = 104;
            ext_user.password = null;
            ext_user.approvedTime = "";
            ext_user.save();
            res.status(200).json({ msg: "Request Cancelled", code: 103});
        } else {
          res.status(404).json({ msg: "user not found" });
        }
    } catch (error) {
        res.status(500).json({ msg: "server error" });
    }
}


const getAllUsers = async(req, res) => {
    try {
        const users = (await User.find()).map((user) => {
            user.password = "";
            return user
        });
        res.status(200).json({"msg": users});     
    } catch (error) {
        res.status(500).json({ msg: "server error" });
    }
}


module.exports = { register, login, isLogged, getAllUsers, discardRequest, approveRequest };