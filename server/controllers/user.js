const bcrypt = require('bcryptjs')
const User = require('../models/userModel')
const jwt = require("jsonwebtoken")

register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, passwordVerify, accountType } = req.body;
        if (!firstName || !lastName || !email || !password || !passwordVerify || !accountType) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName, lastName, email, passwordHash, accountType
        });
        const savedUser = await newUser.save();

        // LOGIN THE USER
        const token = jwt.sign({
            userId: savedUser._id
            }, 'token', {expiresIn: '1h'});

        await res.cookie("token", token, {
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email,
                accountType: savedUser.accountType
            }
        }).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

login = async(req, res) => {
    try{
        const { email, password} = req.body;
        const existingUser = await User.findOne({ email: email });

        console.log(email)
        if (!existingUser) {
            return res
                .status(400)
                .json({ errorMessage: "Your username or password is incorrect" });
        }
        
        const match = await bcrypt.compare(password, existingUser.passwordHash)

        if (!match){
            return res
            .status(400)
            .json({ errorMessage: "Your username or password is incorrect" });
        }

        if(match){
            const token = jwt.sign({
                userId: existingUser._id
                }, 'token', {expiresIn: '1h'});
            await res.cookie("token", token, {
                secure: true,
                sameSite: "none"
            }).status(200).json({
                success: true,
                user: {
                    firstName: existingUser.firstName,
                    lastName: existingUser.lastName,
                    email: existingUser.email,
                    accountType: existingUser.accountType
                }
            }).send();
        }
    }catch (err){
        console.error(err);
        res.status(500).send;
    }
}

logout = async (req,res) =>{
    res.clearCookie("token").status(200).json({success:true})
}

module.exports = {
    register,
    login,
    logout
}