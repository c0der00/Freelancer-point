import express from "express";
import { createJob, deleteJobById, getAllJob, getJobById, getJobs } from "../controllers/job.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post('/',verifyToken, createJob);
router.get('/a',verifyToken, getJobs);
router.get('/:id',verifyToken, getJobById);
router.delete("/:id",verifyToken,deleteJobById);
router.get("/",verifyToken,getAllJob)


export default router;