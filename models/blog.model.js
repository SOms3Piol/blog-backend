import mongoose, { Schema, Types } from "mongoose";

const blogSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  desc: {
    type: String,
    required: true,
  },
  blog: {
    type: String,
    required: true,
    trim: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  path: {
    type: String,
  },
});

const Blog = mongoose.model("Blog", blogSchema);
export { Blog };
