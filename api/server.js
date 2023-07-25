const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');
const Post = require('./models/posts');

const saltRounds = 10;
const secret = 'Louda#Louda';

app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());

mongoose
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

app.post("/login", async (req, res) => {
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

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

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

app.get('/profile', async (req, res) => {
  const { token } = req.cookies;

  try {
    const decodedToken = await jwt.verify(token, secret);
    res.json(decodedToken);
  } catch (error) {
    console.error('Verification Error:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie('token').json('ok');
});

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path + '.' + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });

});

app.get('/post', async (req, res) => {
  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

app.put("/post", uploadMiddleware.single('file'), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
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
})

/**
 * populate is used for ref attributes. It will fetch linked auther <--> user details instead of id. 
 * ['username'] mentions that we need to fetch username only.
 */
app.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
});

app.listen(4000, () => {
  console.log('Running server');
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

