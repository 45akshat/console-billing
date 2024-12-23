const jwt = require('jsonwebtoken');
const loginService = require('../services/loginService');

// Secret key for signing JWT tokens
const JWT_SECRET = "aksh_"; // Replace with a strong, secure secret key

const verifyJwt = async (req, res, next) => {
  try {
    // Extract the token from the cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    // Verify the token
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
      }

      // Attach decoded information to the request object
      req.user = decoded;
      console.log(req.user);

      // Check if the Location_Id and password are correct using loginService
      const { Location_Id, password } = req.user;
      const verificationResult = await loginService.verifyUser(Location_Id, password);

      if (!verificationResult.success) {
        return res.status(403).json({ success: false, message: 'Invalid user credentials.' });
      }

      next(); // Proceed to the next middleware or route handler
    });
  } catch (error) {
    console.error('Error in verifyJwt middleware:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = verifyJwt;
