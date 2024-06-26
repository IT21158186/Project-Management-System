import express from 'express';
import { CreateAccount, Login, getUserDetails, sendNewEmail, getAllUsers } from '../controllers/UserController.js';
import { LoginValidator } from '../middlewares/LoggedIn.js';

const userRouter = express.Router();

userRouter.get('/all', getAllUsers);
userRouter.get('/get-user',LoginValidator, getUserDetails);
userRouter.post('/login', Login);
userRouter.post('/create', CreateAccount);
userRouter.post('/send-email', sendNewEmail);

export default userRouter;