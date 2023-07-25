const mongoose = require('mongoose');

const connectToMongoDB = async() => {
    await mongoose
        .connect('mongodb+srv://sumanthTP:SMLZTX8TVzxMSj7w@cluster0.e4jo1hh.mongodb.net/?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((err) => {
            console.error('MongoDB connection error:', err);
        });
}

module.exports = connectToMongoDB;