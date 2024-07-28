import { Router } from "express";
import {
  loginUser,
  registerUser,
  verifyUser,
  resendEmail,
  unique,
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/verify").get(verifyUser);
userRouter.route("/resend").get(resendEmail);
userRouter.route("/unique-username").get(unique);

//secured routes

export default userRouter;
