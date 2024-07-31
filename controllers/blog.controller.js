import { Blog } from "../models/blog.model.js";
import { ApiResponse } from "../utiles/ApiResponse.js";
import fs from "fs";

const url = (path) => {
  const domain = process.env.DOMAIN;
  const imgPath = path.replace("public","");

  const imgUrl = domain + imgPath;
  return imgUrl;
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
   return res.json(new ApiResponse(500, "Something went Wrong"));
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    console.log(blogId)
    const path = await Blog.findById(blogId);
    fs.unlink(path.path, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        return res.status(500).json(new ApiResponse(500, "Error deleting file"));
      }
      console.log('File deleted successfully');
    });
    const deletedBlog = await Blog.findByIdAndDelete(blogId);
    res.status(200).json(new ApiResponse(200, "Blog deleted succesfully"));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, "Internal Error"));
  }
};

const updateBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { title, desc, blog } = req.body;

    // Find the blog post to be updated
    const data = await Blog.findById(blogId);

    // Check if a new image is uploaded
    if (req.file) {
      // Delete the previous image if it exists
      if (data.img ) {
        fs.unlink(blog.img, (err) => {
          if (err) {
            console.error('Error deleting previous image:', err);
          }
        });
      }

      // Update the image path with the new uploaded image
      const updatedData = {
        img: url(req.file.path),
        title: title,
        desc: desc,
        blog: blog,
        path: req.file.path
      };
      // Update the blog post
      const updated = await Blog.findByIdAndUpdate(blogId, updatedData, {
        new: true,
      });

      return res.status(200).json(
        new ApiResponse(200, { id: updated._id, message: 'Blog updated successfully' }, 'Updation successful')
      );
    } else {
      // Update the blog post without changing the image
      const updatedData = {
        title: title,
        desc: desc,
        blog: blog,
      };
      // Update the blog post
      const updated = await Blog.findByIdAndUpdate(blogId, updatedData, {
        new: true,
      });

      return res.status(200).json(
        new ApiResponse(200, { id: updated._id, message: 'Blog updated successfully' }, 'Updation successful')
      );
    }

  } catch (error) {
    return res.status(500).json(new ApiResponse(500, {}, 'Something went wrong'));
  }
};


const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({});
    if(!blogs){
      return res.json(new ApiResponse(400 , blogs , "Blos not found"))
    }
    return res.json(new ApiResponse(200, blogs, "Api successfully"));
  } catch (error) {}
};

const singleBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate({
      path:"userId",
      select:"username"
    });
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

const userBlogs = async (req, res) => {
  try {
    const {id} = req.user;
    const blogs = await Blog.find({userId: id});
    if(!blogs){
      return res.json(
        new ApiResponse(403 , {success: false} , "No blogs found for this users")
      )
    }

    return res.json(
      new ApiResponse(200 , blogs , "Blogs found Successfully!")
    )

  } catch (error) {
      return res.json( new ApiResponse(403 , {msg: error} , error ) )
  }
}

export { createBlog, deleteBlog, updateBlog, singleBlog, getAllBlogs , userBlogs };
