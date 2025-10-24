import { Router } from 'express';
import * as viewController from '../controllers/viewsController.js';
import {checkUserMiddleware} from '../middlewares/authMiddleware.js'; // Exemplo de middleware que exige login

const router = Router();

router.get("/", viewController.getHomePage);
router.get("/courses", viewController.getCoursesPage); // A rota de cursos agora vive aqui!
router.get("/course/:id", viewController.getCourseDetailPage);
router.get("/register", viewController.getRegisterPage);
router.get("/logout", viewController.logout);

// Rotas que precisam de autenticação
router.get("/ongoingCourses", checkUserMiddleware, viewController.getOngoingCoursesPage);
router.get("/userScene", checkUserMiddleware, viewController.getUserScenePage);
router.get("/edit", checkUserMiddleware, viewController.getEditPage);
router.get("/beATeacher", checkUserMiddleware,viewController.getBeATeacherPage);
router.get("/teacherScene", checkUserMiddleware,viewController.getTeacherScenePage);
router.get("/createACourse", checkUserMiddleware,viewController.getCreateACoursePage);

export default router;