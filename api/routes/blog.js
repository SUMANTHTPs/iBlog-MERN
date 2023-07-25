const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Post = require('../models/posts');
const cloudinary = require('cloudinary').v2;

const secret = 'Louda#Louda';
cloudinary.config({
    cloud_name: 'do3pfvs5g',
    api_key: '337455988461172',
    api_secret: 'XNB5xCFDsN_zwzaCtVCupgrexh4'
});


router.post('/post', async (req, res) => {
    const { tempFilePath } = req.files.file;
    const { token } = req.cookies;
    let information = null;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        information = info;
    });

    cloudinary.uploader.upload(tempFilePath, async (err, result) => {
        console.log(result);
        const { title, summary, content } = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: result.url,
            author: information.id,
        });
        res.json(postDoc);
    })
});

router.get('/post', async (req, res) => {
    res.json(
        await Post.find()
            .populate('author', ['username'])
            .sort({ createdAt: -1 })
            .limit(20)
    );
});

router.put("/post", async (req, res) => {
    let newPath = '';
    if (req.files && req.files.file) {
        const { tempFilePath } = req.files.file;
        try {
            const result = await cloudinary.uploader.upload(tempFilePath);
            newPath = result.url;
        } catch (err) {
            console.error('Error uploading image:', err);
            return res.status(500).json('Unable to upload image');
        }
    }

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { id, title, summary, content } = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
            return res.status(400).json('You are not authorized to edit this post');
        }
        await postDoc.updateOne({
            title,
            summary,
            content,
            cover: newPath ? newPath : postDoc.cover,
        });
        res.json(postDoc);
    });
});


/**
 * populate is used for ref attributes. It will fetch linked auther <--> user details instead of id. 
 * ['username'] mentions that we need to fetch username only.
 */
router.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
});

module.exports = router