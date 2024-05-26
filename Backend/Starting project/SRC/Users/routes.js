const { Router } = require('express');
const controller = require('./controller');
const router = Router();

/* GET */
router.get('/login',controller.getUserbyIDandPassword)
router.get('/', controller.getUsers);
router.get('/:id/library',controller.getUsersInLibrary)
router.get('/transactions',controller.getTransactions)
router.get('/:id',controller.getUsersById)
router.get('/:id/membership',controller.getUsersMembership)
router.get('/:id/transactions',controller.getTransactionsById)
router.get('/:id/all',controller.getUsersAllBorrowed)
router.get('/:id/current',controller.getUsersCurrentBorrowed)
router.get('/:id/all/number',controller.getNumberUsersAllBorrowed)
router.get('/:id/current/number',controller.getNumberUsersCurrentBorrowed)
router.get('/:id/tags',controller.getUsersTags)
router.get('/:id/recommended',controller.getRecommendedBooks)

/* POST */
// Add new user
router.post('/add',controller.addUser);
router.post('/Return',controller.returnBook);
router.post('/Membership',controller.updateMembership);
router.post('/Borrow',controller.BorrowBook);
module.exports = router;
