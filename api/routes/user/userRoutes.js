import express from 'express';
import userController from '../../controllers/user/userControllers.js';
import upload from '../../middlewares/multer.js';

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/edit', upload.single('avatar'), userController.updateUser);
router.get('/profile/:id', userController.getProfile);
router.get('/' , userController.findAllUsers);
router.get('/logout', userController.logout);

router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});




export default router;
