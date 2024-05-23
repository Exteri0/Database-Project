const { Router } = require('express');
const controller = require('./controller');
const router = Router();

router.get('/', controller.getLibraries);
router.get('/:id', controller.getLibrariesById);

module.exports = router;