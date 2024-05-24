const { Router } = require('express');
const controller = require('./controller');
const router = Router();

/* GET */
router.get('/users', controller.getUsers);
router.get('/transactions',controller.getTransactions)
router.get('/users/:id',controller.getUsersById)
router.get('/transactions/:id',controller.getTransactionsById)

/* POST */


module.exports = router;
