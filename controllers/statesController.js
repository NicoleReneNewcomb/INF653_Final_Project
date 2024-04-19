const fs = require('fs').promises;
const path = require('path');
const States = require('../models/States');

// get all state entries
const getAllStates = async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'statesData.json'), 'utf8');
        const states = JSON.parse(data);
        res.json(states);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    getAllStates
};