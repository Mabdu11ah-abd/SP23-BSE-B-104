require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


const router = express();

console.log(process.env.CLOUDINARY_CLOUD_NAME);
console.log(process.env.CLOUDINARY_API_KEY);
console.log(process.env.CLOUDINARY_API_SECRET);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer with Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Cloudinary folder name
    allowed_formats: ['jpg', 'png', 'jpeg'], // Restrict file types
  },
});

const upload = multer({ storage: storage });

// Set up EJS
router.set('view engine', 'ejs');

// Render the upload form
router.get('/test', (req, res) => {
  res.render('test');
});

// Handle file upload
router.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    res.send(
      `File uploaded successfully! View it <a href="${req.file.path}" target="_blank">here</a>.`
    );
  } else {
    res.send('File upload failed.');
  }
});

module.exports = router;