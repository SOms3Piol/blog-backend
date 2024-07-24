import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  updateBlog,
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

blogRouter.route("/create").post(verifyJWT , upload.single('file'), createBlog);
blogRouter.route("/delete").delete(verifyJWT, deleteBlog);
blogRouter.route("/update").post(verifyJWT , upload.single('file') , updateBlog);
blogRouter.route("/like").post(verifyJWT, toggleLike);
blogRouter.route("/unlike").post(verifyJWT, untoggleLike);
blogRouter.route("/getlikes").get(getLikes);
blogRouter.route('/getallblogs').get(getAllBlogs);


export default blogRouter;
