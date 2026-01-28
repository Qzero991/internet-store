const router = require('express').Router();
const controller = require('../controllers/user.controller');
const auth = require('../utils/auth.middleware');


router.post('/register', controller.register);
router.post('/login', controller.login);


router.get('/me', auth, controller.getMe);
router.put('/me', auth, controller.updateMe);

module.exports = router;
