const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { Schema, model } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        validate(value) {
            console.log('validator.isEmail(value)', validator.isEmail(value));
            if(!validator.isEmail(value)){
                throw new Error("Invalid email:" + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        required: true,
        validate(value) {
            if(!['male', 'female', 'other'].includes(value)){
                throw new Error("not a valid gender");
            }
        }
    },
    photoURL: {
        type: String,
        default: 'https://weimaracademy.org/wp-content/uploads/2021/08/dummy-user.png'
    },
    description: {
        type: String,
        default: ' default description'
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true
});

// Schema Methods
userSchema.methods.getJWT = async function() {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, 'MY@TINDER#9712', {
            expiresIn: '1d'
        }
    );
    return token;
}

userSchema.methods.validatePassword = async function(loginUserPassword) {
    const user = this;
    const hashPassword = user.password;
    const isValidPassward = await bcrypt.compare(loginUserPassword, hashPassword);
    return isValidPassward;
}



module.exports = model('Users', userSchema);