const { Router } = require("express");
const authController = require("../controllers/authControllers");

const router = Router(); 

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);
router.get('/profile', authController.profile);
router.get('/update', authController.update_get);
router.post('/update', authController.update_post);
router.post('/remove', authController.remove_post);
router.get('/remove', authController.remove_get);

module.exports = router;