const bcrypt = require('bcryptjs')
const User = require('../models/userModel')
const jwt = require("jsonwebtoken")
const mail = require('../utils/sendEmails')

register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, passwordVerify } = req.body;
        if (!firstName || !lastName || !email || !password || !passwordVerify) {
            return res
                .status(400)
                .json({ message: "Please enter all required fields." });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    message: "Please enter a password of at least 8 characters."
                });
        }
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    message: "Please enter the same password twice."
                })
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "An account with this email address already exists."
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);

        const confirmationCode = jwt.sign({email:email}, "token")

        const newUser = new User({
            firstName, lastName, email, passwordHash, accountType, confirmationCode
        });
        const savedUser = await newUser.save();

        res.status(200).json({
            success: true,
            message: "User was registered successfully! Please check your email",
        });

        mail(email,"Email Confirmation",`<h1>Email Confirmation</h1>
            <p>Thank you for registering with AlgoRent. Please confirm your email by clicking on the following link</p>
            <a href=http://localhost:8000/verify/${confirmationCode}> Click here</a>
            </div>`)

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

login = async(req, res) => {
    try{
        const { email, password} = req.body;
        const existingUser = await User.findOne({ email: email });

        if (!existingUser) {
            return res
                .status(400)
                .json({ message: "Your username or password is incorrect" });
        }

        if (existingUser.status != "Active"){
            return res
                .status(400)
                .json({ message: "Please check your email for comfirmation" });
        }
        
        const match = await bcrypt.compare(password, existingUser.passwordHash)

        if (!match){
            return res
            .status(400)
            .json({ message: "Your username or password is incorrect" });
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

verify = async (req,res) =>{
    await User.findOne({confirmationCode: req.params.confirmationCode,}).then((user) => {
        if (!user) {
            return res.status(404).send({ message: "User Not Found" });
        }

        user.status = "Active";
        user.save((err) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        });

        //Login the user
        const token = jwt.sign({
            userId: user._id
            }, 'token', {expiresIn: '1h'});
        res.cookie("token", token, {
            secure: true,
        }).status(200).json({
            success: true,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                accountType: user.accountType,
                status: user.status
            }
        }).send();
    })
    .catch((e) => console.log("error", e));
}

forgotPassword = async (req,res) =>{
    const { email } = req.body;
    
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
        return res
            .status(400)
            .json({
                success: false,
                message: "This account is not registered yet"
            })
    }

    const resetCode = jwt.sign({email:email}, "token")
    existingUser.resetCode = resetCode
    existingUser.save((err) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Please check your email for password reset link",
        });

        mail(email,"Forgot Password",`<h1>Forgot Password</h1>
            <p>Please rest your password by clicking on the following link</p>
            <a href=http://localhost:8000/password-reset/${resetCode}> Click here</a>
            </div>`)
    })
}

resetPassword = async (req,res) =>{
    
}

module.exports = {
    register,
    login,
    logout,
    verify,
    forgotPassword,
    resetPassword
}