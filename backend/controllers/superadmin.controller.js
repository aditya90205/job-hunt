import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const createSuperadmin = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password } = req.body;
    if (!fullname || !email || !phoneNumber || !password) {
      return res
        .status(400)
        .json({ message: "Missing fields", success: false });
    }
    const existing = await User.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ message: "User already exists", success: false });

    // Allow the first superadmin without secret; otherwise require ADMIN_CREATION_SECRET
    const existingAdmin = await User.findOne({ role: "superadmin" });
    if (existingAdmin) {
      const { adminSecret } = req.body;
      if (
        !process.env.ADMIN_CREATION_SECRET ||
        adminSecret !== process.env.ADMIN_CREATION_SECRET
      ) {
        return res.status(403).json({
          message: "Not allowed to create superadmin.",
          success: false,
        });
      }
    }

    // optional file
    let cloudResponse = null;
    const file = req.file;
    if (file) {
      const fileUri = getDataUri(file);
      cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashed,
      role: "superadmin",
      isApprove: true,
      profile: { profilePhoto: cloudResponse ? cloudResponse.secure_url : "" },
    });
    return res
      .status(201)
      .json({ message: "Superadmin created", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const loginSuperadmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Missing fields", success: false });
    const user = await User.findOne({ email });
    if (!user || user.role !== "superadmin")
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    const respUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      profile: user.profile,
    };
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({ message: "Logged in", user: respUser, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// Recruiter management
export const getPendingRecruiters = async (req, res) => {
  try {
    const recruiters = await User.find({
      role: "recruiter",
      isApprove: false,
    }).sort({ createdAt: -1 });
    return res.status(200).json({ recruiters, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const approveRecruiter = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    user.isApprove = true;
    await user.save();
    return res
      .status(200)
      .json({ message: "Recruiter approved", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const deleteRecruiter = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    await user.remove();
    return res
      .status(200)
      .json({ message: "Recruiter deleted", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// Job management
export const getPendingJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isApprove: false })
      .populate("company created_by")
      .sort({ createdAt: -1 });
    return res.status(200).json({ jobs, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const approveJob = async (req, res) => {
  try {
    const id = req.params.id;
    const job = await Job.findById(id);
    if (!job)
      return res.status(404).json({ message: "Job not found", success: false });
    job.isApprove = true;
    job.status = "approved";
    await job.save();
    return res.status(200).json({ message: "Job approved", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const id = req.params.id;
    const job = await Job.findById(id);
    if (!job)
      return res.status(404).json({ message: "Job not found", success: false });
    await job.remove();
    return res.status(200).json({ message: "Job deleted", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
