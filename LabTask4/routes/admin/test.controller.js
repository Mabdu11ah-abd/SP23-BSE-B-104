const dotenv = require("dotenv");
const express = require("express");
let router = express.Router();
const upload = require("../../multer");

router.get('/test', (req, res) => {
   res.render('test')
});

router.post('/upload', upload.single('file'), (req, res) => {
    if (req.file) {
        res.send(
            `File uploaded successfully! View it <a href="${req.file.path}" target="_blank">here</a>.`
        );
    } else {
        res.status(400).send('File upload failed.');
    }
}, (err, req, res, next) => {
    console.error(err);
    res.status(500).send('An error occurred while uploading the file.');
});

module.exports = router;