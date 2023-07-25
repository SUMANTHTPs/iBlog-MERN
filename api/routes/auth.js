const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const secret = 'Louda#Louda';

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const userDoc = await User.findOne({ email });
        if (!userDoc || !bcrypt.compareSync(password, userDoc.password)) {
            return res.status(400).json('Invalid credentials');
        }

        const token = jwt.sign(
            { username: userDoc.username, id: userDoc._id },
            secret,
            {}
        );

        res.cookie('token', token).json('ok');
    } catch (error) {
        console.error(error);
        res.status(500).json('Server error');
    }
});

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ error: "Sorry a user with this email already exists" })
    }
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const userDoc = await User.create({
            username,
            email,
            password: hashedPassword,
        });
        res.json(userDoc);
    } catch (e) {
        res.status(400).json({ error: e });
    }
});

router.get('/profile', async (req, res) => {
    const { token } = req.cookies;

    try {
        const decodedToken = await jwt.verify(token, secret);
        res.json(decodedToken);
    } catch (error) {
        console.error('Verification Error:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie('token').json('ok');
});

module.exports = router