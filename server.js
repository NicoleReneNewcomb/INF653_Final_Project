require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const corsOptions = require('./config/corsOptions');
// const { logger } = require('./middleware/logEvents');
// const errorHandler = require('./middleware/errorHandler');
// const verifyJWT = require('./middleware/verifyJWT');
// const cookieParser = require('cookie-parser');
// const credentials = require('./middleware/credentials');


// sets default port to 3500 if no environment variable provided
const PORT = process.env.PORT || 3500;

// connect to MongoDB database
connectDB();

// create custom middleware logger that shows all requests
// built-in middleware doesn't need next, but custom does
// logger inside logEvents.js file in middleware
// contains anonymous function 
// (req, res, next) => {
//     logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`,
//     'reqLog.txt');
//     console.log(`${req.method} ${req.path}`);
//     next();
// }
// could alternatively enter anonymous function here instead
// app.use(logger);


// app.use generally used for middleware
// app.use used to not accept REGEX, but it does in new versions
// app.all generally used for routing - applies to all HTTP methods
// app.all does accept REGEX like app.get
app.use(cors(corsOptions));

// bult-in middleware to handle urlencoded data
// in other words, form data:
// 'content-type: application/x-www-form-urlencoded'
// being above the other routes means this is applied to all routes below
// app.use(express.urlencoded({ extended: false }));

// built-in middleware for json data
// applied to all routes below this part (waterfall processing)
app.use(express.json());

//middleware for cookies
// app.use(cookieParser());

// serve static files - searches public directory prior to other routes
// by default, not providing '/' still defaults to '/'
app.use(express.static(path.join(__dirname, '/public')));
// this allows accessing of public docs from /subdir
// app.use('/subdir', express.static(path.join(__dirname, '/public')));

// use routes from external route files
app.use('/states', require('./routes/statesRoutes'));
app.use('/', require('./routes/rootRoutes'));

// app.all('/public', (req, res) => {
//     console.log("/public endpoint");
// });
// app.use('/public', require('./routes/publicRoutes'));
// app.use('/subdir', require('./routes/subdir'));
// app.use('/register', require('./routes/register'));
// app.use('/auth', require('./routes/auth'));
// app.use('/refresh', require('./routes/refresh'));
// app.use('/logout', require('./routes/logout'));
// app.use(verifyJWT);
// app.use('/employees', require('./routes/api/employees'));


// create routes - some moved to routes.js
// '/' will match any loading of the root directory
// However, to allow /index.html to load from same root, 
// use ^/$|/index.html - ^(starts with (slash)) $(ends with (slash))
// | OR is /index.html where ()? makes it optional
// app.get('^/$|/index(.html)?', (req, res) => {
//     // res.sendFile('./views/index.html', { root: __dirname });
//     res.sendFile(path.join(__dirname, 'views', 'index.html'));
// });

// route handlers (here anonymous functions) can be chained
// next allows the handler to move to the next handler
// this logs the console message then shows HW message on page
app.get('/hello(.html)?', (req, res, next) => {
    console.log('attempted to load hello.html');
    next();
}, (req, res) => {
    res.send('Hello World!');
});

// // chaining route handlers
// const one = (req, res, next) => {
//     console.log('one');
//     next();
// }
// const two = (req, res, next) => {
//     console.log('two');
//     next();
// }
// const three = (req, res, next) => {
//     console.log('three');
//     res.send('Finished!');
// }

// // this calls all three handlers from above
// app.get('/chain(.html)?', [one, two, three]);

// default match if no other routes match
// app.get('/*', (req, res) => {
//     // serve custom 404 page when pages not found
//     res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
// });
// alternative 404 with app.all approach
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

// error handling - here using function from errorHandler.js
// app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});