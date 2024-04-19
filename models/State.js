const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stateSchema = new Schema({
    stateCode: {
        type: String,
        required: true,
        unique: true
    },
    funfacts: {
        type: [String]
    },
});

// State will result in mongoose looking for states in MongoDB
// by default, looks for lower-case, plural version of model name
module.exports = mongoose.model('State', stateSchema);