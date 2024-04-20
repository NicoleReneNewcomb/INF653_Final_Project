// this file contains the functions run at endpoints

const fs = require('fs').promises;
const path = require('path');
const State = require('../models/State');
const statesData = require('../statesData.json');

// checks validaty of passed state abbreviation parameter
const verifyStates = (req, res, next) => {
    // get state abbreviation parameter and values from json file
    const stateCode = req.params.stateCode.toUpperCase();
    const stateCodes = statesData.map(state => state.code);

    // check if state abbreviation exists in json file
    if (!stateCodes.includes(stateCode)) {
        return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
    }

    // add stateCode to request 
    req.stateCode = stateCode;
    next();
};

// get all state entries (json + fun facts)
const getAllStates = async (req, res) => {
    try {
        // load state data from JSON file
        const data = await fs.readFile(path.join(__dirname, '..', 'statesData.json'), 'utf8');
        const states = JSON.parse(data);

        // check for contiq url query parameter
        if (req.query.contig !== undefined) {
            // create array of non-contiguous state codes
            const nonContiguousStates = ['AK', 'HI'];

            // contig holds url query parameter
            const contig = req.query.contig.toLowerCase() === 'true';

            // filter states based on query parameter value
            const filteredStates = states.filter(state => {
                const isContiguous = !nonContiguousStates.includes(state.code);
                return isContiguous === contig;
            });

            // fetch fun facts for filtered states
            const funFactsPromises = filteredStates.map(state => getStateFunFacts(state.code));
            const allFunFacts = await Promise.all(funFactsPromises);

            // append fun facts to filtered states
            filteredStates.forEach((state, index) => {
                if (allFunFacts[index]) {
                    state.funfacts = allFunFacts[index];
                }
            });

            return res.json(filteredStates);
        }
        else {
            // fetch fun facts for all states
            const funFactsPromises = states.map(state => getStateFunFacts(state.code));
            const allFunFacts = await Promise.all(funFactsPromises);

            // append fun facts to states
            states.forEach((state, index) => {
                if (allFunFacts[index]) {
                    state.funfacts = allFunFacts[index];
                }
            });
            
            return res.json(states);
        }
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// get single state entry (json + fun facts)
const getState = async (req, res) => {
    try {
        // use helper function to return state based on passed parameter
        const state = await getStateData(req.stateCode);
        const funfacts = await getStateFunFacts(req.stateCode);
            
        // add fun facts to the state
        if (funfacts) {
            state.funfacts = funfacts;
        }
        res.json(state);
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// helper function to get single state data
const getStateData = async (stateCode) => {
    // read data from json file
    const data = await fs.readFile(path.join(__dirname, '..', 'statesData.json'), 'utf8');
    const states = JSON.parse(data);

    // find specific state entry in json file
    const state = states.find(state => state.code === stateCode.toUpperCase());
    return state || null;
};

// get state capital
const getStateCapital = async (req, res) => {
    // use helper function to retrieve state data
    const state = await getStateData(req.stateCode);
    res.json({ "state": state.state, "capital": state.capital_city });
};

// get state nickname
const getStateNickname = async (req, res) => {
    // use helper function to retrieve state data
    const state = await getStateData(req.stateCode);
    res.json({ "state": state.state, "nickname": state.nickname });
};

// get state population
const getStatePopulation = async (req, res) => {
    // use helper function to retrieve state data
    const state = await getStateData(req.stateCode);

    // convert population number to string with commas
    const formattedPopulation = state.population.toLocaleString('en-US');
    res.json({ "state": state.state, "population": formattedPopulation });
};

// get state admission date
const getStateAdmission = async (req, res) => {
    // use helper function to retrieve state data
    const state = await getStateData(req.stateCode);
    res.json({ "state": state.state, "admitted": state.admission_date });
};

// helper function to get fun facts for a state from MongoDB
const getStateFunFacts = async (stateCode) => {
    const state = await State.findOne({ stateCode: stateCode.toUpperCase() });
    return state ? state.funfacts : null;
};

// get single state fun fact entry
const getFunFact = async (req, res) => {
    try {
        // use helper functions to get fun facts from MongoDB and json data
        const funfacts = await getStateFunFacts(req.stateCode);
        const state = await getStateData(req.stateCode);
    
        // if there are no state fun facts, return error message
        if (!funfacts || funfacts.length === 0) {
            return res.status(404).json({ 'message': `No Fun Facts found for ${state.state}` });
        }
    
        // select random fun fact from available state fun facts
        const randomIndex = Math.floor(Math.random() * funfacts.length);
        const funfact = funfacts[randomIndex];
    
        res.json({ funfact });
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// create new fun fact
const createNewFunFact = async (req, res) => {
    // funfact value and state abbreviation parameter
    const funfact = req.body.funfacts;
    const stateCode = req.stateCode;

    // if there are no state fun facts, return error message
    if (!funfact || funfact.length === 0) {
        return res.status(400).json({ 'message': 'State fun facts value required' });
    }

    // if funfact value isn't an array, return error message
    if (!Array.isArray(funfact)) {
        return res.status(400).json({ 'message': 'State fun facts value must be an array' });
    }

    try {
        // update entry in MongoDB
        const updatedState = await State.findOneAndUpdate(
            { stateCode }, 
            { $push: { funfacts: { $each: funfact } } },
            { new: true, upsert: true }
        );

        // if no state found/returned, return error message
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

// update existing fun fact (PATCH request)
const updateFunFact = async (req, res) => {
    // funfact and index values and state abbreviation parameter
    const newFunFact = req.body.funfact;
    let index = req.body.index;
    const stateCode = req.stateCode;

    // if no index value passed in body, return error message
    if (!index) {
        return res.status(400).json({ 'message': 'State fun fact index value required' });
    }

    // if no funfact value passed in body, return error message
    if (!newFunFact) {
        return res.status(400).json({ 'message': 'State fun fact value required' });
    }

    try {
        // decrement index to convert to zero-based array indexing
        index = index - 1;
        // get state fun facts and json data (for full state name)
        const stateFunFacts = await getStateFunFacts(stateCode);
        const stateData = await getStateData(stateCode);

        // check if no fun facts exist for the state
        if (!stateFunFacts || stateFunFacts.length === 0) {
            return res.status(404).json({ 'message': `No Fun Facts found for ${stateData.state}` });
        }

        // if index isn't valid, return error message
        if (index < 0 || index >= stateFunFacts.length) {
            return res.status(404).json({ 'message': `No Fun Fact found at that index for ${stateData.state}` });
        }

        // update the state fun fact entry
        const state = await State.findOneAndUpdate(
            { stateCode: stateCode },
            { $set: { [`funfacts.${index}`]: newFunFact } },
            { new: true }
        );

        return res.status(200).json(state);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// delete existing fun fact (DELETE request)
const deleteFunFact = async (req, res) => {
    // assign index value and state abbreviation parameter
    let index = req.body.index;
    const stateCode = req.stateCode;

    // if no index value passed in body, return error message
    if (!index) {
        return res.status(400).json({ 'message': 'State fun fact index value required' });
    }

    try {
        // decrement index to convert to zero-based array indexing
        index = index - 1;
        // get state fun facts and json data (for full state name)
        const stateFunFacts = await getStateFunFacts(stateCode);
        const stateData = await getStateData(stateCode);

        // if there are no state fun facts, return error message
        if (!stateFunFacts || stateFunFacts.length === 0) {
            return res.status(404).json({ 'message': `No Fun Facts found for ${stateData.state}` });
        }

        // if index isn't valid, return error message
        if (index < 0 || index >= stateFunFacts.length) {
            return res.status(404).json({ 'message': `No Fun Fact found at that index for ${stateData.state}` });
        }

        // set fun fact at index to null
        await State.findOneAndUpdate(
            { stateCode: stateCode },
            { $unset: { [`funfacts.${index}`]: 1 } }
        );
        
        // remove fun fact previously set to null
        const state = await State.findOneAndUpdate(
            { stateCode: stateCode },
            { $pull: { funfacts: null } },
            { new: true }
        );

        return res.status(200).json(state);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    verifyStates,
    getAllStates,
    getState,
    getFunFact,
    createNewFunFact,
    getStatePopulation,
    getStateAdmission,
    getStateNickname,
    getStateCapital,
    updateFunFact,
    deleteFunFact
};