import express from "express";
import {
  createSuperadmin,
  loginSuperadmin,
  getPendingRecruiters,
  approveRecruiter,
  deleteRecruiter,
  getPendingJobs,
  approveJob,
  deleteJob,
} from "../controllers/superadmin.controller.js";
import { singleUpload } from "../middlewares/mutler.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

// Public: create first superadmin (multipart optional)
router.post("/create", singleUpload, createSuperadmin);
router.post("/login", loginSuperadmin);

// Protected admin management
router.get(
  "/recruiters/pending",
  isAuthenticated,
  isAdmin,
  getPendingRecruiters
);
router.patch(
  "/recruiter/approve/:id",
  isAuthenticated,
  isAdmin,
  approveRecruiter
);
router.delete("/recruiter/:id", isAuthenticated, isAdmin, deleteRecruiter);

router.get("/jobs/pending", isAuthenticated, isAdmin, getPendingJobs);
router.patch("/job/approve/:id", isAuthenticated, isAdmin, approveJob);
router.delete("/job/:id", isAuthenticated, isAdmin, deleteJob);

export default router;
