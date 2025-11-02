const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const authRouter = require('./router/auth')
const profileRouter = require('./router/profile')
const requestRouter = require('./router/request');
const userRouter = require('./router/user');

const app = express();

app.use(express.json()); // convert JSON to js Obj (kind of bodyParser)
app.use(cookieParser());

app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)
app.use('/', userRouter)


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

