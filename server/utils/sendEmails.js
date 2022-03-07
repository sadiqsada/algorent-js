const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host:  "smtp.mailtrap.io",
            port: 587,
            secure: false,
            auth: {
                user: "f582cc584b008b",
                pass: "a3ecaa0e9aca7c"
            },
        });

        await transporter.sendMail({
            from: 'algorent@algorent.com',
            to: email,
            subject: subject,
            html: html,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;