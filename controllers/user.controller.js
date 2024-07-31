import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utiles/ApiError.js";
import { ApiResponse } from "../utiles/ApiResponse.js";
import sendMail from "../utiles/sendMail.js";
import bcrypt from "bcryptjs";

const generateAccessToken = (email, _id = "") => {
  const token = jwt.sign(
    { id: _id, email: email },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "24h",
    },
  );
  return token;
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res
        .json(new ApiResponse(403, {}, "User already exists"));
    }
    const token = generateAccessToken(email);

    const user = new User({
      username: username,
      email: email,
      password: password,
      verificationToken: token,
    });

    const saved = await user.save();

    await sendMail(email, token, "verify");
    const data = { email: saved.email, token: saved.verificationToken };
    return res
      .json(new ApiResponse(200, data, "User registered successfully"));
  } catch (error) {
    console.error("Error in registerUser:");
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Something went wrong"));
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .json(new ApiResponse(401, {}, "User is not registered"));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .json(new ApiResponse(401, {}, "Invalid email or password"));
    }

    if (!user.isVerified) {
      const token = generateAccessToken(email);
      await sendMail(email, token, "verify");
      return res
        .json(
          new ApiResponse(
            401,
            { isVerified: user.isVerified },
            "Verification email sent",
          ),
        );
    }

    const token = generateAccessToken(email, user._id);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { username: user.username, token: token},
          "Login successful",
        ),
      );
  } catch (error) {
    console.error("Error in loginUser:", error);
    throw new ApiError(500, "Something went wrong");
  }
};

const verifyUser = async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(decoded)
    const user = await User.findOne(decoded?.email);
    console.log(user);
    if (user) {
      user.isVerified = true;
      user.verificationToken = undefined;
      const savedUser = await user.save();
      return res
        .status(201)
        .json(
          new ApiResponse(
            200,
            { email: savedUser.email, isVerified: savedUser.isVerified },
            "Verification is completed",
          ),
        );
    }
    return res.json(new ApiResponse(401, {}, "Invalid Token"));
  } catch (error) {
    return res.json(new ApiResponse(401, {}, "Invalid Token"));
  }
};

const resendEmail = async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return;
  }
  const user = await User.findOne({ email });
  if (!user) {
    return;
  }
  const token = generateAccessToken(email);
  user.verificationToken = token;
  await user.save();
  await sendMail(email, token, "verify");
  res.json({
    ok: true,
    message: "Email has been sent successfully",
  });
};

const unique = async (req, res) => {
  try {
    const { username } = req.query; // Assuming req.query is correct
    console.log(username);
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(201).json({ ok: true, message: "Username is unique" });
    }
    return res.json({ ok: false, message: "Username is already taken" });
  } catch (err) {
    return res.json(new ApiResponse(201, {}, "Something went wrong"));
  }
};

export { loginUser, registerUser, verifyUser, resendEmail, unique };
