import { Blog } from "../models/blog.model.js";
import { ApiResponse } from "../utiles/ApiResponse.js";

const createBlog = async (req, res) => {
  try {
    const { id } = req.user;
    const { title, blocks } = req.body;
    const blog = new Blog({
      userId: id,
      img: req.file.path,
      title: title,
      blocks: blocks,
    });
    const savedBlog = await blog.save();
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
    await Blog.findOneAndDelete({ userId: id });
    res.status(200).json(new ApiResponse(200, "Blog deleted succesfully"));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, "Internal Error"));
  }
};

const updateBlog = async (req, res) => {
  try {
    const { _id, img, title, blocks } = req.body;
    const updated = await Blog.findOneAndUpdate(
      { _id },
      {
        img: img,
        title: title,
        blocks: blocks,
      },
    );
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
    const { _id } = req.body;
    const blog = await Blog.findOne({ _id });
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

export { createBlog, deleteBlog, updateBlog };
