// this file contains the route for the public folder

const express = require('express');
const router = express.Router();
const path = require('path');

// route to the main css style file
router.get('/css/style(.css)?', (req, res) => {
    console.log("Inside PublicRoutes")
    res.status(201).sendFile(path.join(__dirname, '..', 'public', 'css', 'style.css'));
});

module.exports = router;