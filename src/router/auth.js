const express = require('express');
const bcrypt = require('bcrypt');
const { validationForSignup } = require('../utils/validators')
const Users = require('../models/users')

const authRouter = express.Router();

authRouter.post('/signUp', async(req, res) => {
    try {
        // Validation of data
        validationForSignup(req);

        const { firstName, lastName, email, password, gender, age, skills } = req.body || {};
        const checkExistingUser = await Users.findOne({ email: email });

        if(checkExistingUser) {
            throw new Error("User Already exist");
        }

        //Encrypt Passward

        const passwordHash = await bcrypt.hash(password, 10)
        const user = new Users({
            firstName,
            lastName,
            email,
            gender,
            age,
            skills,
            password: passwordHash
        });
        await user.save();
        res.send('User Added Successfully');
    } catch(err) {
       res.status(400).send('User not saved:' + err.message)
    }
})

authRouter.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body || {};
        const user = await Users.findOne({ email: email });
        if (!user) {
            throw new Error("Email Id not found");
        }
        const isValidPassward = await user.validatePassword(password);
        if (isValidPassward) {
            // create JWT token
            const token = await user.getJWT();

            // Add the token to cookie and send back the response to user
            res.cookie('token', token, {
                expires: new Date(Date.now() + 10 * 3600000)
            });
            res.send('Login Successfully!!');
        } else {
            throw new Error("Invalid Credentials");
        }
    } catch(err) {
       res.status(400).send('Login Failed:' + err.message)
    }
})

authRouter.post('/logout', async(req, res) => {
    try {
        res.cookie('token', null, {
            expires: new Date(Date.now())
        });
        res.send('Logout Successfully!!');
    } catch(err) {
       res.status(400).send('Logout Failed:' + err.message)
    }
})

module.exports = authRouter;