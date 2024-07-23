import {
  createBlog,
  deleteBlog,
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

blogRouter.route("/edit").post(verifyJWT, createBlog);
blogRouter.route("/delete").delete(verifyJWT, deleteBlog);
blogRouter.route("/update").post(verifyJWT, updateBlog);
blogRouter.route("/like").post(verifyJWT, toggleLike);
blogRouter.route("/unlike").post(verifyJWT, untoggleLike);
blogRouter.route("/getlikes").get(verifyJWT, getLikes);
blogRouter.route("/upload").post(upload.single("file"), (req, res) => {
  res.send({
    message: " Image has been uploaded successfully",
    file: req.file.path,
  });
});

export default blogRouter;
