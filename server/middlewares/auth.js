const jwt = require('jsonwebtoken');
const auth = async (req, res, next) => {
  try {
    const token = req.header('x-auth-token');

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

module.exports = auth;
