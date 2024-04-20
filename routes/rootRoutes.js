// routes for the base directory of the app at '/'

const express = require('express');
const router = express.Router();
const path = require('path');

// serves index page at root
router.get('^/$|/index(.html)?', (req, res) => {
    res.status(201).sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

module.exports = router;