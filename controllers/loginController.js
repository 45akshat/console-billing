const loginService = require('../services/loginService');

// Controller for creating a user
const createUser = async (req, res) => {
  const { Location_Id, Password } = req.body;

  if (!Location_Id || !Password) {
    return res.status(400).json({ success: false, message: 'Location_Id and Password are required' });
  }

  const result = await loginService.createUser(Location_Id, Password);
  if (result.success) {
    return res.status(201).json(result);
  } else {
    return res.status(400).json(result);
  }
};


const renderCreateAccPage = async (req, res) => {
  try {
      return res.render('login/create');
  }catch(error){
      console.error('Error fetching login: ', error)
  }
};


const renderLoginPage = async (req, res) => {
  try {
      return res.render('login/login');
  }catch(error){
      console.error('Error fetching login: ', error)
  }
};

const renderChangePasswordPage = async (req, res) => {
  try {
      return res.render('login/change-password');
  }catch(error){
      console.error('Error fetching login: ', error)
  }
};




// Controller for verifying a user (login)
const verifyUser = async (req, res) => {
  const { Location_Id, Password } = req.body;

  if (!Location_Id || !Password) {
    return res.status(400).json({ success: false, message: 'Location_Id and Password are required' });
  }

  const result = await loginService.verifyUser(Location_Id, Password);

  console.log(result)
  

    // Send the JWT as an HTTP-only cookie
    res.cookie('token', result.token, {
      httpOnly: true, // Prevent access by JavaScript
      maxAge: 3600000, // 1 hour in milliseconds
    });


  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(401).json(result);
  }
};

// Controller for verifying a JWT token
const verifyToken = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the Authorization header

  if (!token) {
    return res.status(400).json({ success: false, message: 'Token is required' });
  }

  const result = loginService.verifyToken(token);
  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(401).json(result);
  }
};

// Controller for getting user information
const getUser = async (req, res) => {
  const { Location_Id } = req.params;

  if (!Location_Id) {
    return res.status(400).json({ success: false, message: 'Location_Id is required' });
  }

  const result = await loginService.getUser(Location_Id);
  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json(result);
  }
};

// Controller for updating user password
const updateUserPassword = async (req, res) => {
  const { Location_Id, newPassword } = req.body;

  if (!Location_Id || !newPassword) {
    return res.status(400).json({ success: false, message: 'Location_Id and newPassword are required' });
  }

  const result = await loginService.updateUserPassword(Location_Id, newPassword);
  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(400).json(result);
  }
};

const getCashInHandController = async (req, res) => {
  const { Location_Id } = req.params; // Extract Location_Id from request parameters

  try {
    if (!Location_Id) {
      return res.status(400).json({ error: 'Location_Id is required' });
    }

    const cashInHand = await loginService.getCashInHand(Location_Id);
    res.status(200).json({ Location_Id, cashInHand });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  verifyUser,
  verifyToken,
  getUser,
  updateUserPassword,
  renderLoginPage,
  renderChangePasswordPage,
  renderCreateAccPage,
  getCashInHandController
};
