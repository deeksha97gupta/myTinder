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

module.exports = {
    validationForSignup
}