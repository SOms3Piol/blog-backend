import { Blog } from "../models/blog.model.js";
import { ApiResponse } from "../utiles/ApiResponse.js";
import fs from "fs";

const url = (path) => {
  return path.replace("/public", "");
};

const createBlog = async (req, res) => {
  try {
    const { id } = req.user;
    const { title, desc, blog } = req.body;

    const newBlog = new Blog({
      userId: id,
      img: url(req.file.path),
      title: title,
      desc: desc,
      blog: blog,
      path: req.file.path,
    });
    const savedBlog = await newBlog.save();
    return res
      .status(201)
      .json(new ApiResponse(201, savedBlog, "Blog created succesfully"));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, "Something went Wrong"));
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.user;
    const { blogId } = req.params;
    const deletedBlog = await Blog.findOneAndDelete({
      userId: id,
      _id: blogId,
    });
    fs.unlink(deletedBlog.path);
    res.status(200).json(new ApiResponse(200, {}, "Blog deleted succesfully"));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, "Internal Error"));
  }
};

const updateBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { title, desc, blog } = req.body;
    const updated = await Blog.findOneAndUpdate(
      { _id: blogId },
      {
        img: url(req.file.path),
        title: title,
        desc: desc,
        blog: blog,
      },
      {
        returnOriginal: true,
      },
    );
    fs.unlink(updated.path);
    return res
      .status(200)
      .json(new ApiResponse(200, updated, "Updation successfully"));
  } catch (error) {}
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({});
    return res.json(new ApiResponse(200, blogs, "Api successfully"));
  } catch (error) {}
};

const singleBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findOne({ id });
    if (!blog) {
      return res.status(401).json(new ApiResponse(401, "Invalid Id of blog"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, blog, "Fetched successfully"));
  } catch (error) {
    return res.status(401).json(new ApiResponse(401, "Unsuccesfull"));
  }
};

export { createBlog, deleteBlog, updateBlog, singleBlog, getAllBlogs };
