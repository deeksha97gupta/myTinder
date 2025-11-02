const express = require('express');
const { userAuthentication } = require('../middleware/auth')
const ConnectionRequest = require('../models/connectionRequest');
const Users = require('../models/users');

const requestRouter = express.Router();

requestRouter.post('/request/send/:status/:userId',
   userAuthentication,
   async(req, res) => {
      try {
         const fromUserId = req.user._id;
         const toUserId = req.params.userId;
         const status = req.params.status;

         const allowedStatus = ['interested', 'ignored'];
         if (!allowedStatus.includes(status)) {
            return res.status(400).send('Invalid Status');
         }

         const existingUser = await Users.findById(toUserId);
         if (!existingUser) {
            return res.status(400).json({ message: 'User does not exist' });
         }

         const existingConnection = await ConnectionRequest.findOne({
            $or: [
               { fromUserId, toUserId },
               { fromUserId: toUserId, toUserId: fromUserId}
            ]
         })
         if (existingConnection) {
            res.status(400).send('Connection request already exist!!');
         }
         const connectionData = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
         });
         const data = await connectionData.save();
         res.json({
            message: 'connection request save successfully',
            data
         });
      } catch(err) {
         res.status(400).send('Something went wrong:' + err.message);
      }
});

requestRouter.post('/request/review/:status/:requestId', userAuthentication, async(req, res) => {
   try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ['accepted', 'rejected'];
      if (!allowedStatus.includes(status)) {
         return res.status(400).json({ message: 'Invalid Status'});
      }

      const connectionExits = await ConnectionRequest.findOne({ 
         _id: requestId, 
         toUserId: loggedInUser._id,
         status: 'interested' });
      if (!connectionExits) {
         return res.status(400).json({ message: 'request does not exist'});
      }

      connectionExits.status = status;
      const updatedData = await connectionExits.save();
      res.json({ message: 'status updated to ' + status,
         data: updatedData
      })
   } catch(err) {
     res.status(400).send('Something went wrong' + err.message);
   }
   
})

module.exports = requestRouter;