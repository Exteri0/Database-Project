const { Router } = require('express');
const controller = require('./controller');
const router = Router();

/* GET */
router.get('/users', controller.getUsers);
router.get('/transactions',controller.getTransactions)
router.get('/users/:id',controller.getUsersById)
router.get('/transactions/:id',controller.getTransactionsById)

router.get('/users/all/:id',controller.getUsersAllBorrowed)
router.get('/users/current/:id',controller.getUsersCurrentBorrowed)
router.get('/users/all/number/:id',controller.getNumberUsersAllBorrowed)
router.get('/users/current/number/:id',controller.getNumberUsersCurrentBorrowed)




/* POST */


module.exports = router;
