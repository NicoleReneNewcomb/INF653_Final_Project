const fs = require('fs').promises;
const path = require('path');
const States = require('../models/States');
const { STATES } = require('mongoose');

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
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

// get single state entry
const getState = async (req, res) => {
    try {
        const state = await getStateData(req.params.stateCode);
        
        if (!state) {
            res.status(400).json({ "message": "Invalid state abbreviation parameter" });
        }
        else {
        res.json(state);
        }
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// helper function to get single state data
const getStateData = async (stateCode) => {
    const data = await fs.readFile(path.join(__dirname, '..', 'statesData.json'), 'utf8');
    const states = JSON.parse(data);
    const state = states.find(state => state.code === stateCode.toUpperCase());
    if (!state) {
        throw new Error('Invalid state abbreviation parameter');
    }
    return state;
};

// get state capital
const getStateCapital = async (req, res) => {
    const state = await getStateData(req.params.stateCode);
    if (!state) {
        return res.status(400).json({ "message": "Invalid state abbreviation parameter" });
    }
    res.json({ "state": state.state, "capital": state.capital_city });
};

// get state nickname
const getStateNickname = async (req, res) => {
    const state = await getStateData(req.params.stateCode);
    if (!state) {
        return res.status(400).json({ "message": "Invalid state abbreviation parameter" });
    }
    res.json({ "state": state.state, "nickname": state.nickname });
};

// get state population
const getStatePopulation = async (req, res) => {
    const state = await getStateData(req.params.stateCode);
    if (!state) {
        return res.status(400).json({ "message": "Invalid state abbreviation parameter" });
    }
    const formattedPopulation = state.population.toLocaleString('en-US');
    res.json({ "state": state.state, "population": formattedPopulation });
};

// get state admission date
const getStateAdmission = async (req, res) => {
    const state = await getStateData(req.params.stateCode);
    if (!state) {
        return res.status(400).json({ "message": "Invalid state abbreviation parameter" });
    }
    res.json({ "state": state.state, "admitted": state.admission_date });
};

// get single state entry
const getFunFact = async (req, res) => {
    try {
        const stateCode = req.params.stateCode.toUpperCase();
        const state = await States.findOne({ stateCode });
    
        if (!state || !state.funfacts || state.funfacts.length === 0) {
            return res.status(404).json({ 'message': 'No fun facts found for this state' });
        }
    
        const randomIndex = Math.floor(Math.random() * state.funfacts.length);
        const funFact = state.funfacts[randomIndex];
    
        res.json({ funFact });
    } 
    catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// create new fun fact
const createNewFunFact = async (req, res) => {
    const funfact = req.body.funfact;
    const stateCode = req.params.stateCode.toUpperCase();

    if (!funfact || !funfact.length === 0) {
        return res.status(400).json({ 'message': 'State fun facts value required' });
    }

    try {
        const updatedState = await States.findOneAndUpdate(
            { stateCode }, 
            { $push: { funfacts: { $each: funfact } } },
            { new: true, upsert: true }
        );

        if (!updatedState) {
            return res.status(404).json({ 'message': 'State not found' });
        }

        res.status(200).json(updatedState);
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllStates,
    getState,
    getFunFact,
    createNewFunFact,
    getStatePopulation,
    getStateAdmission,
    getStateNickname,
    getStateCapital
};