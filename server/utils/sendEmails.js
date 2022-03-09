const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host:  "smtp.mailtrap.io",
            port: 2525,
            secure: false,
            auth: {
                user: "b4d56e8ca4e4b3",
                pass: "9a378ae29e6478"
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