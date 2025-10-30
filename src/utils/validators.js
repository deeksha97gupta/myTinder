const validator = require('validator');

const validationForSignup = (req) => {
   const data = req.body;
    if(!data.firstName || !data.lastName) {
        throw new Error("Name is required");
    }
    if(!data.email || !validator.isEmail(data?.email)){
        throw new Error("Invalid email");
    }
    if(!['male', 'female', 'other'].includes(data?.gender)){
        throw new Error("not a valid gender");
    }
}

const validateEditProfileData = (req) => {
    const data = req.body;
    const allowedEditFields = [
        'firstName',
        'lastName',
        'age',
        'gender',
        'photoURL',
        'description',
        'skills'
    ];
    const isValidData = Object.keys(data).every(key => allowedEditFields.includes(key));
    return isValidData;
}

module.exports = {
    validationForSignup,
    validateEditProfileData
}