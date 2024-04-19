const express = require('express');
const router = express.Router();
const statesController = require('../controllers/statesController');

router.get('/', statesController.getAllStates);

// catch all for any non-existing directories/files
router.all('*', (req, res) => {
    // serve custom 404 page when pages not found
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, '..', 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ error: "404 Not Found"});
    } else {
        res.type('txt').send('404 Not Found');
    }
});

module.exports = router;