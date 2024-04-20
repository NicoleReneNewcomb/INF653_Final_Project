// sets CORS options for access from other sites

const allowedOrigins = require('./allowedOrigins');

// if allowedOrigins includes '*' allows all
// otherwise, only allows sites on list access
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes('*') 
        || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;