const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 587,
      secure: false,
      auth: {
        user: 'e265ff7c8c563c',
        pass: '338339d2f2d8d1',
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
