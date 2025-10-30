const mongoose = require('mongoose');

const connectDB = async() => {
    await mongoose.connect(
        'mongodb+srv://deeksha97gupta_db_user:ha50bpoaIn1cTOic@deekshanodemongodb.vlvvspm.mongodb.net/myTinder'
    );
};

module.exports = connectDB;

