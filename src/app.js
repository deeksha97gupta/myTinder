const express = require('express');
// const { authentication } = require('./middleware/auth')
const connectDB = require('./config/database');
const Users = require('./models/users')

const app = express();

// app.get('/user/getData', authentication, (err, req, res, next) => {
//    res.send('get user data')
// })

app.post('/signUp', async(req, res) => {
    const user = new Users({
        firstName: 'Deeksha',
        lastName: 'Gupta',
        email: 'deeksha@gmail.com',
        password: 'deeksha123'
    });
    try {
        await user.save();
        res.send('User Added Successfully');
    } catch(err) {
       res.status(400).send('User not saved')
    }
})

app.use('/', (err, req, res) => {
    if (err) {
        res.status(500).send('something went wrong');
    }
    res.send("dashboard is running")
})

connectDB()
    .then(() => {
        console.log('DB connection Established');
        app.listen(3001, () => {
            console.log('server is running on 3001')
        })
    })
    .catch(() => {
        console.log('DB connection Failed');
    })

