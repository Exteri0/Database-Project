const { Router } = require('express');
const controller = require('./controller');
const router = Router();

router.get('/', controller.getLibraries);
router.get('/:id', controller.getLibrariesById);
router.get('/:id/noBooks', controller.getNoBooksFromLibrary);
router.get('/:ISBN/Describe', controller.getBookDataByISBN);
router.get('/:ISBN/Authors', controller.getBookAuthors);


module.exports = router;