const States = require('../models/States');

// get all state entries
const getAllStates = async (req, res) => {
    const states = await States.find();
    if (!states) return res.status(204).json({ 'message': 'No states Found.' });
    res.status(201).json(states);
}

module.exports = {
    getAllStates
};