const Code = require('../models/Code');


// Fetch all codes
async function fetchAllCodes() {
  try {
    const codes = await Code.find({});
    console.log('All Codes:', codes);
    return codes;
  } catch (error) {
    console.error("Error fetching codes:", error);
    return [];
  }
}



// Create a new code
const createCode = async (codeData) => {
  try {
    const newCode = new Code(codeData);
    await newCode.save();
    return { success: true, code: newCode };
  } catch (error) {
    console.error('Error creating code:', error);
    return { success: false, message: error.message };
  }
};

// Get a code by its unique code value
const getCodeByCode = async (code) => {
  try {
    const foundCode = await Code.findOne({ Code: code });
    if (!foundCode) {
      return { success: false, message: 'Code not found' };
    }
    return { success: true, code: foundCode };
  } catch (error) {
    console.error('Error fetching code by code:', error);
    return { success: false, message: error.message };
  }
};

// Get all codes for a specific user
const getCodesByUser = async (userId) => {
  try {
    const codes = await Code.find({ UserID: userId });
    return { success: true, codes };
  } catch (error) {
    console.error('Error fetching codes by user:', error);
    return { success: false, message: error.message };
  }
};

// Update a code's reward and validity
const updateCode = async (code, updateData) => {
  try {
    const updatedCode = await Code.findOneAndUpdate(
      { Code: code },
      updateData,
      { new: true }
    );
    if (!updatedCode) {
      return { success: false, message: 'Code not found' };
    }
    return { success: true, code: updatedCode };
  } catch (error) {
    console.error('Error updating code:', error);
    return { success: false, message: error.message };
  }
};

// Delete a code by its code value
const deleteCode = async (code) => {
  try {
    const deletedCode = await Code.findOneAndDelete({ Code: code });
    if (!deletedCode) {
      return { success: false, message: 'Code not found' };
    }
    return { success: true, message: 'Code deleted successfully' };
  } catch (error) {
    console.error('Error deleting code:', error);
    return { success: false, message: error.message };
  }
};

// Check if the code is still valid based on its date and validity
const checkCodeValidity = async (code) => {
  try {
    const foundCode = await Code.findOne({ Code: code });
    if (!foundCode) {
      return { success: false, message: 'Code not found' };
    }
    
    const currentDate = new Date();
    const expiryDate = new Date(foundCode.Date);
    const validityPeriod = parseInt(foundCode.Validity.split(' ')[0], 10);
    
    expiryDate.setDate(expiryDate.getDate() + validityPeriod); // Adding validity period to the original date
    
    if (currentDate > expiryDate) {
      return { success: false, message: 'Code has expired' };
    }
    
    return { success: true, message: 'Code is valid' };
  } catch (error) {
    console.error('Error checking code validity:', error);
    return { success: false, message: error.message };
  }
};

// Update the Validity field to "Used"
const updateValidity = async (code) => {
  try {
    const updatedCode = await Code.findOneAndUpdate(
      { Code: code },
      { Validity: 'Used' },
      { new: true }
    );
    if (!updatedCode) {
      return { success: false, message: 'Code not found' };
    }
    return { success: true, code: updatedCode };
  } catch (error) {
    console.error('Error updating validity:', error);
    return { success: false, message: error.message };
  }
};



// Check if the code belongs to the specified user and if it's still valid
const checkCodeForUser = async (code, userId) => {
    try {
      // Fetch the code by its value
      const foundCode = await Code.findOne({ Code: code, UserID: userId });
  
      // If the code doesn't exist or doesn't belong to the user, return an error
      if (!foundCode) {
        return { success: false, message: 'Code does not belong to this user or does not exist' };
      }
  
      // Check if the code is valid based on its validity date
      const currentDate = new Date();
      const expiryDate = new Date(foundCode.Date);
      const validityPeriod = parseInt(foundCode.Validity.split(' ')[0], 10); // Extract validity period (e.g., 7 days)
  
      expiryDate.setDate(expiryDate.getDate() + validityPeriod); // Add validity period to the original date
  
      if (currentDate > expiryDate) {
        return { success: false, message: 'Code has expired' };
      }
  
      // If the code is valid, return success with code details
      return { success: true, message: 'Code is valid', code: foundCode };
  
    } catch (error) {
      console.error('Error checking code for user:', error);
      return { success: false, message: error.message };
    }
  };
  

module.exports = {
  createCode,
  getCodeByCode,
  getCodesByUser,
  updateCode,
  deleteCode,
  checkCodeValidity,
  updateValidity,  // Add this method to the exports
  checkCodeForUser,
  fetchAllCodes
};
