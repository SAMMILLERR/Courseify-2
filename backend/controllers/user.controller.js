import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z, ZodError } from "zod";
import { Purchase } from "../models/purchase.model.js";

const signupSchema = z.object({
  firstName: z.string().min(1),
  lastName:  z.string().min(1),
  email:     z.string().email(),
  password:  z.string().min(6),
});
const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(6),
});

export const signup = async (req, res) => {
  let data;
  try {
    data = signupSchema.parse(req.body);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: err.errors });
    }
    return res.status(500).json({ error: "Validation error" });
  }

  try {
    if (await User.findOne({ email: data.email })) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const hashed = await bcrypt.hash(data.password, 12);
    const user = await User.create({ ...data, password: hashed });
   
    return res.status(201).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch {
    return res.status(500).json({ error: "Error in signup" });
  }
};

export const login = async (req, res) => {
  let credentials;
  try {
    credentials = loginSchema.parse(req.body);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: err.errors });
    }
    return res.status(500).json({ error: "Validation error" });
  }

  try {
    const user = await User.findOne({ email: credentials.email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      credentials.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_USER_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );
  const cookieOptions = {
  expires: new Date(Date.now() +  24 * 60 * 60 * 1000), // 7 days from now
  httpOnly: true, // Helps prevent XSS
  secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
  sameSite: "Strict" // Controls cross-site behavior
};

res.cookie("jwt", token, cookieOptions);


    return res.status(200).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch {
    return res.status(500).json({ error: "Error in login" });
  }
};

export const logout = async (req, res) => {
  try {
    // Access the cookies object (note the plural)
    if (!req.cookies?.jwt) {
      return res.status(401).json({ error: "Please log in first" });
    }

    // Clear the cookie named "jwt"
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/"
    });

    return res.status(200).json({ message: "You have logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ error: "Error during logout" });
  }
};


export const Purchases = async (req, res) => {
  const userId = req.userId;
  console.log(userId);

  try {
    const purchases = await Purchase.find({ userId }).populate('courseId');

    if (!purchases || purchases.length === 0) {
      return res.status(404).json({ message: "No purchases found for this user." });
    }

    res.status(200).json({ purchases });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve purchases." });
  }
};
