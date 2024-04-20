// this file contains the routes for the /states subdirectory
const express = require('express');
const router = express.Router();
const statesController = require('../controllers/statesController');

// returns all state data at /states/
router.get('/', statesController.getAllStates);

// functions for fun facts for particular state
router.route('/:stateCode/funfact')
    .all(statesController.verifyStates)
    .get(statesController.getFunFact)
    .post(statesController.createNewFunFact)
    .patch(statesController.updateFunFact)
    .delete(statesController.deleteFunFact);

// returns the state capital
router.get('/:stateCode/capital', 
    statesController.verifyStates,
    statesController.getStateCapital);

// returns the state nickname
router.get('/:stateCode/nickname', 
    statesController.verifyStates,
    statesController.getStateNickname);

// returns the state population
router.get('/:stateCode/population',
    statesController.verifyStates, 
    statesController.getStatePopulation);

// returns the state admission date
router.get('/:stateCode/admission',
    statesController.verifyStates,
    statesController.getStateAdmission);

// returns single state data
router.route('/:stateCode')
    .all(statesController.verifyStates)
    .get(statesController.getState);

module.exports = router;