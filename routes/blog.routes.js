import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  updateBlog,
  singleBlog,
  userBlogs,
} from "../controllers/blog.controller.js";
import {
  toggleLike,
  untoggleLike,
  getLikes,
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

const blogRouter = Router();
//public routes
blogRouter.route("/getlikes/:id").get(getLikes);
blogRouter.route("/getallblogs").get(getAllBlogs);
blogRouter.route("/singleblog/:id").get(singleBlog);

// secured routes

blogRouter.route("/create").post(verifyJWT, upload.single("file"), createBlog);
blogRouter.route("/delete/:blogId").delete(verifyJWT, deleteBlog);
blogRouter
  .route("/update/:blogId")
  .post(verifyJWT, upload.single("file"), updateBlog);
blogRouter.route("/like/:id").post(verifyJWT, toggleLike);
blogRouter.route("/unlike/:id").post(verifyJWT, untoggleLike);
blogRouter.route('/userblogs').get(verifyJWT, userBlogs);

export default blogRouter;
