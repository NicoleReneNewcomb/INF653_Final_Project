const express = require('express');
const router = express.Router();
const statesController = require('../controllers/statesController');

// returns all state data at /states/
router.get('/', statesController.getAllStates);

// functions for fun facts for particular state
router.route('/:stateCode/funfact')
    .get(statesController.getFunFact)
    .post(statesController.createNewFunFact);

// returns the state capital
router.get('/:stateCode/capital', 
    statesController.getStateCapital);

// returns the state nickname
router.get('/:stateCode/nickname', 
    statesController.getStateNickname);

// returns the state population
router.get('/:stateCode/population', 
    statesController.getStatePopulation);

// returns the state admission date
router.get('/:stateCode/admission', 
    statesController.getStateAdmission);

// pulling parameters from url
router.route('/:stateCode')
    .get(statesController.getState);



// // .route() allows for chaining of different HTTP method types
// router.route('/')
// .get(employeesController.getAllEmployees)
// .post(employeesController.createNewEmployee)
// .put(employeesController.updateEmployee)
// .delete(employeesController.deleteEmployee);

module.exports = router;