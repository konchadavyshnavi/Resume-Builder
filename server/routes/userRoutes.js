import express from "express";
import { register, login ,getUserById,getUserResumes} from "../controllers/userControllers.js";
import  protect from "../middlewares/authMiddleware.js";
const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/data', protect, getUserById);
userRouter.get('/resumes', protect, getUserResumes);
export default userRouter;
