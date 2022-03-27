const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        loggedIn: false,
        user: null,
        errorMessage: 'Unauthorized',
      });
    }

    const verified = await jwt.verify(token, 'token');
    req.userId = verified.userId;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      errorMessage: 'Unauthorized',
    });
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.token;
  
  if (token) {
    jwt.verify(token, 'token', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      }
      else {
        const user = User.findById(decodedToken.userId);
        res.locals.user = user;
        next();
      }
    })
  }

  res.locals.user = null;
};

module.exports = { auth, checkUser };
