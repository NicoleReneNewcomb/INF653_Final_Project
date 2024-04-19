const fs = require('fs').promises;
const path = require('path');
const States = require('../models/States');

// get all state entries
const getAllStates = async (req, res) => {
    try {
        // load state data from JSON file
        const data = await fs.readFile(path.join(__dirname, '..', 'statesData.json'), 'utf8');
        const states = JSON.parse(data);

        // check for contiq url query parameter
        if (req.query.contig !== undefined) {
            // array of non-contiguous state codes
            const nonContiguousStates = ['AK', 'HI'];

            const contig = req.query.contig.toLowerCase() === 'true';
            const filteredStates = states.filter(state => {
                const isContiguous = !nonContiguousStates.includes(state.code);
                return isContiguous === contig;
            });
            return res.json(filteredStates);
        }
        else {
            return res.json(states);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

// get single state entry
const getState = async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, '..', 'statesData.json'), 'utf8');
        const states = JSON.parse(data);
        const state = states.find(state => state.code === req.params.stateCode.toUpperCase());
    if (!state) {
        return res.status(400).json({ "message": "Invalid state abbreviation parameter" });
    }
    res.json(state);
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// create new fun fact
const createNewFunFact = async (req, res) => {
    const { funfacts } = req.body.funfacts;
    const state = req.params.stateCode.toUpperCase();

    if (!funfacts || !funfacts.length === 0) {
        return res.status(400).json({ 'message': 'State fun facts value required' });
    }

    try {
        const updatedState = await State.findOneAndUpdate(
            { stateCode }, 
            { $push: { funfacts: { $each: funfacts } } },
            { new: true, upsert: true }
        );

        if (!updatedState) {
            return res.status(404).json({ 'message': 'State not found' });
        }

        res.status(200).json(updatedState);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllStates,
    getState,
    createNewFunFact
};