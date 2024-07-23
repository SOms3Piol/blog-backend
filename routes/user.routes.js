import { Router } from "express";
import {
  loginUser,
  registerUser,
  verifyUser,
  resendEmail,
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/verify").post(verifyUser);
userRouter.route("/resend").get(resendEmail);

//secured routes

export default userRouter;
