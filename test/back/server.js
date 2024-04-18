const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    const filename = file.originalname.replace(path.extname(file.originalname), '') + '-' + Date.now() + '.jpg';
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));


// MongoDB connection
mongoose.connect('mongodb+srv://gbarbariani:RVEtv9Bm6DBzzcun@cluster0.c7lq6uh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected!'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  birthDate: { type: String },
  gender: { type: String },
  profilePhoto: { type: String }
});

const User = mongoose.model('User', userSchema);

app.post('/register', upload.single('profilePhoto'), async (req, res) => {
  const { name, email, password, birthDate, gender } = req.body;
  const profilePhoto = req.file;
  
  try {
    const newUser = new User({ 
      name, 
      email, 
      password, 
      birthDate, 
      gender,
      profilePhoto: profilePhoto ? profilePhoto.path : null 
    });
    await newUser.save();
    res.status(201).send("User created successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'No valid data' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (user && user.password === password) {
      res.status(200).json({ message: "Logged in successfully", user: user });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/users/:id', upload.single('profilePhoto'), async (req, res) => {
  const { name, password } = req.body;
  const profilePhoto = req.file;
  
  try {
    const updatedData = { name, password }; // Hash the password before storing it

    if (profilePhoto) {
      updatedData.profilePhoto = profilePhoto.path;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true }).lean();
    if (user) {
      res.status(200).json({ message: "User updated successfully", user: user });
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});



app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
