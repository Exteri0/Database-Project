const { Router } = require('express');
const controller = require('./controller');
const router = Router();

/* GET */
router.get('/', controller.getUsers);
router.get('/transactions',controller.getTransactions)
router.get('/:id',controller.getUsersById)
router.get('/transactions/:id',controller.getTransactionsById)
router.get('/all/:id',controller.getUsersAllBorrowed)
router.get('/current/:id',controller.getUsersCurrentBorrowed)
router.get('/all/number/:id',controller.getNumberUsersAllBorrowed)
router.get('/current/number/:id',controller.getNumberUsersCurrentBorrowed)
router.get('/tags/:id',controller.getUsersTags)
router.get('/recommended/:id',controller.getRecommendedBooks)

/* POST */
// Add new user
router.post('/add',controller.addUser);
router.post('/Return',controller.returnBook);
router.post('/Membership',controller.updateMembership);
//router.post('/Borrow',controller.BorrowBook);
module.exports = router;
