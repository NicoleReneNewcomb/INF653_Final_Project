const express = require('express');
const router = express.Router();
const statesController = require('../controllers/statesController');

// return all state data at /states/
router.get('/', statesController.getAllStates);

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