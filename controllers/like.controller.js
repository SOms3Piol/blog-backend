import { Blog } from "../models/blog.model.js";
import { ApiError } from "../utiles/ApiError.js";
import { ApiResponse } from "../utiles/ApiResponse.js";

const toggleLike = async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    return res.json(new ApiResponse(200, updatedBlog, "liked successfully"));
  } catch (error) {
    return res.json(new ApiResponse(401, "Something went wrong"));
  }
};

const untoggleLike = async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { likes: -1 },
      },
      { new: true }, //to return the new document
    );
    return res.json(new ApiResponse(200, updatedBlog, "Unliked Successfully"));
  } catch (error) {
    return res.json(new ApiResponse(403, "Something went wrong"));
  }
};

const getLikes = async (req, res) => {
  try {
    const { id } = req.params;
    const likes = await Blog.findOne(id).select("likes");
    return res.status(200).json(new ApiResponse(200, likes, "Success"));
  } catch (error) {
    return res.status(402).json(new ApiResponse(403, "Something went wrong"));
  }
};

export { toggleLike, untoggleLike, getLikes };
