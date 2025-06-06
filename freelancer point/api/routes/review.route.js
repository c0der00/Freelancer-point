import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import {
  createReview,
  getReviews,
  deleteReview,
} from "../controllers/review.controller.js";

const router = express.Router();

router.post("/creategig",verifyToken, createReview )
router.get("/:gigId",verifyToken, getReviews )
router.delete("/:id",verifyToken, deleteReview)

export default router;