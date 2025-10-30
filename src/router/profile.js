const express = require('express');
const { userAuthentication } = require('../middleware/auth')
const { validateEditProfileData } = require('../utils/validators')
const bcrypt = require('bcrypt');

const profileRouter = express.Router();

profileRouter.get('/profile/view', userAuthentication, async(req, res) => {
   try {
      const loginUser = req.user;
      res.send(loginUser);
   } catch(err) {
      res.status(400).send('Something went wrong:' + err.message)
   }
})

profileRouter.patch('/profile/edit', userAuthentication, async(req, res) => {
   try {
      if(!validateEditProfileData(req)){
         throw new Error("Invalid Entry");
      }
      const loginUser = req.user;
      Object.keys(req.body).forEach(key => loginUser[key] = req.body[key]);
      await loginUser.save();
      res.json({
         message: `${loginUser.firstName}, your profile is updated successfully`,
         data: loginUser
      });
   } catch(err) {
      res.status(400).send('Something went wrong:' + err.message)
   }
})

profileRouter.patch('/profile/password', userAuthentication, async(req, res) => {
   try {
      const loginUser = req.user;
      const passwordHash = await bcrypt.hash(req.body.password, 10)
      loginUser.password = passwordHash;
      await loginUser.save();
      res.cookie('token', null, {
         expires: new Date(Date.now())
      });
      res.json({
         message: `Please login again with new credentials`,
         data: loginUser
      });
   } catch(err) {
      res.status(400).send('Something went wrong:' + err.message)
   }
})

module.exports = profileRouter;