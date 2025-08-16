import express from 'express';
import userController from '../../controllers/userControllers.js';

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile/:id', userController.getProfile);
router.get('/' , userController.findAllUsers);

router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});




export default router;
