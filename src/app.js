const express = require('express');
const { userAuthentication } = require('./middleware/auth')
const connectDB = require('./config/database');
const Users = require('./models/users')
const { validationForSignup } = require('./utils/validators')
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json()); // convert JSON to js Obj (kind of bodyParser)
app.use(cookieParser());

app.post('/signUp', async(req, res) => {
    try {
        // Validation of data
        validationForSignup(req);

        const { firstName, lastName, email, password, gender } = req.body || {};

        //Encrypt Passward

        const passwordHash = await bcrypt.hash(password, 10)
        const user = new Users({
            firstName,
            lastName,
            email,
            gender,
            password: passwordHash
        });
        await user.save();
        res.send('User Added Successfully');
    } catch(err) {
       res.status(400).send('User not saved:' + err.message)
    }
})

app.post('/login', async(req, res) => {
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

app.get('/profile', userAuthentication, async(req, res) => {
    try {
       const loginUser = req.user;
       res.send(loginUser);
    } catch(err) {
       res.status(400).send('Something went wrong:' + err.message)
    }
})

app.post('/sendConnectionRequest', userAuthentication, async(req, res) => {
    try {
       const loginUser = req.user;
       res.send(loginUser);
    } catch(err) {
       res.status(400).send('Something went wrong:' + err.message)
    }
})

app.get('/user', async (req, res) => {
    const userEmail = req.body.email;
    try {
        const userData = await Users.find({ email: userEmail });
        if (userData.length === 0) {
            res.status(404).send('User Not Found')
        }
        res.send(userData);
    } catch(err) {
        res.status(400).send('Something Went Wrong')
    }
})

app.delete('/user', async (req, res) => {
    const userId = req.body.userId;
    try {
        const userData = await Users.findByIdAndDelete({ _id: userId });
        res.send("User deleted Successfully");
    } catch(err) {
        res.status(400).send('Something Went Wrong')
    }
})

app.patch('/user/:userId', async (req, res) => {
    const userId = req.params?.userId;
    const userData = req.body;
    try {
        const Allowed_fields = ['gender', 'photoURL', 'description', 'skills'];
        if(!Object.keys(userData).every(key => Allowed_fields.includes(key))){
           throw new Error("User cannot updated");
           
        }
        const data = await Users.findByIdAndUpdate({ _id: userId }, userData, {
            returnDocument: 'after',
            runValidators: true
        });
        res.send("User Updated Successfully");
    } catch(err) {
        res.status(400).send('Something Went Wrong:' + err.message)
    }
})

app.get('/feed', async (req, res) => {
    try {
        const usersData = await Users.find({});
        if (usersData.length === 0) {
            res.status(404).send('User Not Found')
        }
        res.send(usersData);
    } catch(err) {
        res.status(400).send('Something Went Wrong')
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

