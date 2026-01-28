const router = require('express').Router();
const controller = require('../controllers/category.controller');
const auth = require('../utils/auth.middleware');
const isAdmin = require('../utils/admin.middleware');

router.get('/', controller.getAll);
router.get('/:id', controller.getOne);


router.post('/', auth, isAdmin, controller.create);
router.put('/:id', auth, isAdmin, controller.update);
router.delete('/:id', auth, isAdmin, controller.delete);

module.exports = router;