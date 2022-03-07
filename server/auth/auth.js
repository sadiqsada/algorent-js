const jwt = require("jsonwebtoken")

const auth = async (req, res, next) => {
    try {
      const token = req.cookies.token;
  
      if (!token) {
        return res.status(401).json({
            loggedIn: false,
            user: null,
            errorMessage: "Unauthorized"
        })
    }

    const verified = jwt.verify(token, 'token')
    req.userId = verified.userId;
  
    next()
    } catch (error) {
      console.log(error)
      return res.status(401).json({
        errorMessage: "Unauthorized"
      });
    }
}
  
module.exports = auth;