const express = require('express');
const { userAuthentication } = require('../middleware/auth');
const connectionRequest = require('../models/connectionRequest');
const Users = require('../models/users');

const userRouter = express.Router();

const SAFE_STRING = 'firstName lastName photoURL age gender';

userRouter.get('/user/request/received', userAuthentication, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const requestReceived = await connectionRequest.find({ 
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate('fromUserId', SAFE_STRING);
        res.json({ message: 'Data fetch Successfully',
            data: requestReceived
        })
    } catch(err) {
        res.status(400).send('Something went wrong' + err.message);
    }
});

userRouter.get('/user/connections', userAuthentication, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequestData = await connectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: 'accepted'},
                { toUserId: loggedInUser._id, status: 'accepted'}
            ]
        }).populate('fromUserId', SAFE_STRING).populate('toUserId', SAFE_STRING)
        const finalConnections = connectionRequestData.map(data => {
            if (data.fromUserId._id.equals(loggedInUser._id)) {
                return data.toUserId;
            }
            return data.fromUserId;
        });
        res.json({
            message: 'Connections fetch successfully',
            data: finalConnections
        })
    } catch(err) {
        res.status(400).send('Something went wrong' + err.message)
    }
})

userRouter.get('/user/feed', userAuthentication, async (req, res) => {
    const loggedInUser = req.user;
    const allConectionRequests = await connectionRequest.find({
        $or: [
            {fromUserId: loggedInUser._id},
            {toUserId: loggedInUser._id}
        ]
    }).select('fromUserId toUserId');
    const hideInUserIds = new Set();
    allConectionRequests.forEach(request => {
        hideInUserIds.add(request.fromUserId);
        hideInUserIds.add(request.toUserId);
    })
    const finalUserList = await Users.find({
        $and: [
            {_id: { $nin: Array.from(hideInUserIds)}},
            {_id: { $ne: loggedInUser._id}}
        ]
    }).select(SAFE_STRING);
    res.json({
        message: 'Feed List fetch successfully',
        data: finalUserList 
    })
})

module.exports = userRouter;