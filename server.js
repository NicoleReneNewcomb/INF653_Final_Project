// this file is the top-level app file that routes all requests

require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const corsOptions = require('./config/corsOptions');

// sets default port to 3500 if no environment variable provided
const PORT = process.env.PORT || 3500;

// connect to MongoDB database
connectDB();

// sets the CORS settings allowing outside site access
app.use(cors(corsOptions));

// built-in middleware for json data
app.use(express.json());

// serve static files
app.use(express.static(path.join(__dirname, '/public')));

// prevents caching of pages affecting response status codes
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  });

// use routes from external route files
app.use('/states', require('./routes/statesRoutes'));
app.use('/', require('./routes/rootRoutes'));

// serves 404 page for all other requests
app.all('*', (req, res) => {
    // serve custom 404 page when pages not found
    console.log("Not found from server.js file.");
    res.status(404)
    if (req.accepts('text/html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('application/json')) {
        res.json({ "error": "404 Not Found"});
    } else {
        res.type('txt').send('404 Not Found');
    }
});

// sets up MongoDB database listener
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});