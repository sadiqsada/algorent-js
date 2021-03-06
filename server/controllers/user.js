const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const mail = require('../utils/sendEmails');
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId({ length: 4 });
const multer = require('multer');

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, passwordVerify } = req.body;
    if (!firstName || !lastName || !email || !password || !passwordVerify) {
      return res
        .status(400)
        .json({ message: 'Please enter all required fields.' });
    }
    if (password.length < 8) {
      return res.status(400).json({
        message: 'Please enter a password of at least 8 characters.',
      });
    }
    if (password !== passwordVerify) {
      return res.status(400).json({
        message: 'Please enter the same password twice.',
      });
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);

    const confirmationCode = jwt.sign({ email: email }, 'token');

    const newUser = new User({
      firstName,
      lastName,
      email,
      passwordHash,
      confirmationCode,
    });
    await newUser.save();

    res.status(200).json({
      success: true,
      message: 'User was registered successfully! Please check your email',
    });
    const webUrl = 'http://localhost:8000';
    mail(
      email,
      'Email Confirmation',
      `<h1>Email Confirmation</h1>
            <p>Thank you for registering with AlgoRent. Please confirm your email by clicking on the following link</p>
            <a href=${webUrl}/verify/${confirmationCode}> Click here</a>
            </div>`
    );
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      return res
        .status(400)
        .json({ message: 'Your username or password is incorrect' });
    }

    if (existingUser.status !== 'Active') {
      return res
        .status(400)
        .json({ message: 'Please check your email for confirmation' });
    }

    const match = await bcrypt.compare(password, existingUser.passwordHash);

    if (!match) {
      return res
        .status(400)
        .json({ message: 'Your username or password is incorrect' });
    }

    if (match) {
      const token = jwt.sign(
        {
          userId: existingUser._id,
        },
        'token',
        { expiresIn: '24h' }
      );

      return res
        .cookie('token', token, {
          sameSite: 'none',
          secure: true,
        })
        .status(200)
        .json({
          success: true,
          user: {
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            email: existingUser.email,
          },
        });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};

const logout = async (req, res) => {
  res.clearCookie('token').status(200).json({ success: true });
};

const verify = async (req, res) => {
  await User.findOne({ confirmationCode: req.params.confirmationCode })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User Not Found' });
      }

      user.status = 'Active';
      user.save((err) => {
        if (err) {
          return res.status(500).send({ message: err });
        }
      });

      // Login the user
      const token = jwt.sign(
        {
          userId: user._id,
        },
        'token',
        { expiresIn: '24h' }
      );
      res
        .cookie('token', token, {
          secure: true,
        })
        .status(200)
        .json({
          success: true,
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            status: user.status,
          },
        })
        .send();
    })
    .catch((e) => console.log('error', e));
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const webUrl = 'http://localhost:8000';

  const existingUser = await User.findOne({ email: email });
  if (!existingUser) {
    return res.status(400).json({
      success: false,
      message: 'This account is not registered yet',
    });
  }

  const resetCode = jwt.sign({ email: email }, 'token');
  existingUser.resetCode = resetCode;
  existingUser.save((err) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Please check your email for password reset link',
    });

    mail(
      email,
      'Forgot Password',
      `<h1>Forgot Password</h1>
            <p>Please rest your password by clicking on the following link</p>
            <a href=${webUrl}/password-reset/${resetCode}> Click here</a>
            </div>`
    );
  });
};

const resetPassword = async (req, res) => {
  const { password, passwordVerify } = req.body;

  if (password !== passwordVerify) {
    return res.status(400).json({
      message: 'Please enter the same password twice.',
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: 'Please enter a password of at least 8 characters.',
    });
  }

  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const passwordHash = await bcrypt.hash(password, salt);

  await User.findOne({ resetCode: req.params.resetCode })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User Not Found' });
      }

      const match = bcrypt.compare(password, user.passwordHash);
      if (match) {
        return res.status(400).json({
          message: 'Please enter a new password',
        });
      }

      user.passwordHash = passwordHash;
      user.save((err) => {
        if (err) {
          return res.status(500).send({ message: err });
        }

        return res.status(200).json({
          success: true,
          message: 'Password reset successfully',
        });
      });
    })
    .catch((e) => console.log('error', e));
};

const tokenIsValid = async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.json(false);

    const verified = jwt.verify(token, 'token');
    if (!verified) return res.json(false);

    const user = await User.findById(verified.userId);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUser = async (req, res) => {
  const user = await User.findById(req.userId);
  return res.json(user);
};

const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.userId);
  return res.json({ user });
};

const changeUsername = async (req, res) => {
  const { firstName, lastName, user } = req.body;
  if (user.firstName === firstName && user.lastName === lastName) {
    return res.json({
      success: false,
      message: 'Please change a different username',
    });
  }
  await User.findOneAndUpdate({ _id: user._id }, { firstName, lastName });
  return res.json({
    success: true,
    message: 'Your username has been successfully changed',
  });
};

const sendVerification = async (req, res) => {
  const { email, user } = req.body;
  if (user.email === email) {
    return res.json({
      success: false,
      message: 'Please change a different email',
    });
  }

  const existingUser = User.findOne({ email: email });
  if (existingUser) {
    return res.json({
      success: false,
      message: 'This email is assoicated with another account',
    });
  }

  const code = uid();
  mail(
    email,
    'Email Verification',
    `<h1>Change Password Comfirmation</h1>
        <p>Please use this code to verify your email: ${code}</p>`
  );
  console.log(code);
  return res.json({ success: true, code: code });
};

const changeEmail = async (req, res) => {
  const { email, user } = req.body;

  if (user.email === email) {
    return res.json({
      success: false,
      message: 'Please change a different email',
    });
  }

  await User.findOneAndUpdate({ _id: user._id }, { email });
  return res.json({ success: true });
};

const changePassword = async (req, res) => {
  const { oldPass, user, newPass } = req.body;

  const match = await bcrypt.compare(oldPass, user.passwordHash);
  if (match) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(newPass, salt);
    await User.findOneAndUpdate(
      { _id: user._id },
      { passwordHash: passwordHash }
    );
    return res.json({
      success: true,
      message: 'Password successfully changed',
    });
  } else {
    return res.json({ success: false, message: 'Incorrect password' });
  }
};

async function uploadFile(req, res) {
  return new Promise((resolve) => {
    const upload = multer({ storage: multer.memoryStorage() }).single('photo');
    upload(req, res, (err) => {
      if (err) console.log('error occurred during upload');
      if (req.file === undefined) {
        console.log(`no file`);
        return resolve([`You must select a file.`, null]);
      } else {
        console.log(req.file);
        return resolve([null, req.file.buffer]);
      }
    });
  }).catch((error) => {
    console.log(error);
  });
}

const uploadAvatar = async (req, res) => {
  const buffer = await uploadFile(req, res);
  await User.findOneAndUpdate(
    { _id: req.body.user },
    { avatar: buffer }
  ).exec();
  return res.json({ success: true, message: 'Photo changed successfully' });
};

module.exports = {
  register,
  login,
  logout,
  verify,
  forgotPassword,
  resetPassword,
  tokenIsValid,
  getUser,
  getCurrentUser,
  changeUsername,
  sendVerification,
  changeEmail,
  changePassword,
  uploadAvatar,
};
