const { Router } = require('express');
const controller = require('./controller');
const router = Router();

router.get('/', controller.getLibraries);
router.get('/Authors', controller.getAllAuthorsInDB);
router.get('/:id', controller.getLibrariesById);
router.get('/:id/Books', controller.showBooksInaLibrary);
router.get('/:id/noBooks', controller.getNoBooksFromLibrary);
router.get('/:ISBN/Describe', controller.getBookDataByISBN);
router.get('/:ISBN/Authors', controller.getBookAuthors);
router.get('/:ISBN/:id', controller.checkBookExistsinLibrary);
router.get('/:ISBN/:id/number',controller.GetNumberOfBooksInLibrary);

router.post('/bookAddCopies', controller.addBookToLibraryWithCopies);
router.post('/bookAddNoCopies', controller.addBookToLibraryWithoutCopies);

router.patch('/BookCopyUpdate', controller.increaseNumberOfBookCopies);

router.delete('/RemoveBook', controller.removeBookFromLibrary);



module.exports = router;