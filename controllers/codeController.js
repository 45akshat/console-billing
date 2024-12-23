const codeService = require('../services/codeService');

// Controller to create a new code
const createCodeController = async (req, res) => {
  try {
    const codeData = req.body; // Expecting data to be sent in the body of the request
    const result = await codeService.createCode(codeData);

    if (result.success) {
      return res.status(201).json(result.code); // Return the newly created code
    } else {
      return res.status(400).json({ error: result.message });
    }
  } catch (error) {
    console.error('Error in createCodeController:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to get a code by its code value
const getCodeController = async (req, res) => {
  try {
    const { code } = req.params; // Expecting code to be passed as a route parameter
    const result = await codeService.getCodeByCode(code);

    if (result.success) {
      return res.status(200).json(result.code); // Return the code found
    } else {
      return res.status(404).json({ error: result.message });
    }
  } catch (error) {
    console.error('Error in getCodeController:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to get all codes by a specific user ID
const getCodesByUserController = async (req, res) => {
  try {
    const { userId } = req.params; // Expecting userId to be passed as a route parameter
    const result = await codeService.getCodesByUser(userId);

    if (result.success) {
      return res.status(200).json(result.codes); // Return list of codes for the user
    } else {
      return res.status(404).json({ error: result.message });
    }
  } catch (error) {
    console.error('Error in getCodesByUserController:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to update the reward and validity of a code
const updateCodeController = async (req, res) => {
  try {
    const { code } = req.params; // Code to be updated passed as a route parameter
    const updateData = req.body; // New data to update the code (e.g., Reward, Validity)

    const result = await codeService.updateCode(code, updateData);

    if (result.success) {
      return res.status(200).json(result.code); // Return the updated code
    } else {
      return res.status(404).json({ error: result.message });
    }
  } catch (error) {
    console.error('Error in updateCodeController:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to delete a code by its code value
const deleteCodeController = async (req, res) => {
  try {
    const { code } = req.params; // Code to be deleted passed as a route parameter
    const result = await codeService.deleteCode(code);

    if (result.success) {
      return res.status(200).json({ message: result.message }); // Return success message
    } else {
      return res.status(404).json({ error: result.message });
    }
  } catch (error) {
    console.error('Error in deleteCodeController:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to check if a code is valid or expired
const checkCodeValidityController = async (req, res) => {
  try {
    const { code } = req.params; // Code to check validity passed as a route parameter
    const result = await codeService.checkCodeValidity(code);

    if (result.success) {
      return res.status(200).json({ message: result.message }); // Return validity status
    } else {
      return res.status(404).json({ error: result.message });
    }
  } catch (error) {
    console.error('Error in checkCodeValidityController:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to update a code's validity to "Used"
const updateValidityController = async (req, res) => {
  try {
    const { code } = req.params; // Code whose validity is to be updated passed as a route parameter
    const result = await codeService.updateValidity(code);

    if (result.success) {
      return res.status(200).json({ message: 'Code validity updated to "Used"' }); // Success message
    } else {
      return res.status(404).json({ error: result.message });
    }
  } catch (error) {
    console.error('Error in updateValidityController:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Controller to check if the code belongs to a user and if it's valid
const checkCodeForUserController = async (req, res) => {
    try {
      const { code, userId } = req.params; // Expecting code and userId to be passed as route parameters
      const result = await codeService.checkCodeForUser(code, userId);
  
      if (result.success) {
        return res.status(200).json(result); // Return code details if valid
      } else {
        return res.status(400).json({ error: result.message }); // Return error message if not valid
      }
    } catch (error) {
      console.error('Error in checkCodeForUserController:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };

module.exports = {
  createCodeController,
  getCodeController,
  getCodesByUserController,
  updateCodeController,
  deleteCodeController,
  checkCodeValidityController,
  updateValidityController,
  checkCodeForUserController,
};
