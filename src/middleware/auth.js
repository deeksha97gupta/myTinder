const Users = require('../models/users');
const jwt = require('jsonwebtoken');

const userAuthentication  = async(req, res, next) => {
    try {
           const { token } = req.cookies;
           if (!token) {
                throw new Error("Token not found!!!");
            }
           const decodedMessage = jwt.verify(token, 'MY@TINDER#9712');
           const { _id } = decodedMessage || {};
           const loginUser = await Users.findById(_id);
           if (!loginUser) {
                throw new Error("User Not found!!");
           }
           req.user = loginUser;
           next();
        } catch(err) {
           res.status(400).send('Authentication Failed:' + err.message)
        }
}

module.exports = {
    userAuthentication
}