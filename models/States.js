const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statesSchema = new Schema({
    stateCode: {
        type: String,
        required: true,
        unique: true
    },
    funfacts: {
        type: [String]
    },
});

// States will result in mongoose looking for states in MongoDB
// by default, looks for lower-case, plural version of model name
module.exports = mongoose.model('States', statesSchema);