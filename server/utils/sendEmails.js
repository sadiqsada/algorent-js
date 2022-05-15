const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.REACT_APP_EMAIL,
        pass: process.env.REACT_APP_EMAIL_PASS,
      },  
    });

    await transporter.sendMail({
      from: 'algorent@algorent.com',
      to: email,
      subject: subject,
      html: html,
    });

    console.log('email sent sucessfully');
  } catch (error) {
    console.log(error, 'email not sent');
  }
};

module.exports = sendEmail;
