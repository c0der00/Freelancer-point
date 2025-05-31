import express from "express";
import { acceptBid, createBid, getBidsByFreelancer, getBidsByJob, rejectBid } from "../controllers/bid.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post('/:jobId', verifyToken, createBid);

router.get('/:jobId', verifyToken, getBidsByJob);

router.get('/user/:freelancerId',verifyToken,getBidsByFreelancer)

router.put('/accept/:bidId',verifyToken, acceptBid);
router.put('/reject/:bidId',verifyToken, rejectBid);

export default router;