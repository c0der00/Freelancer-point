import express from "express";
import { countGigs, countJob, countUser, deleteGig, deleteUser, getFreelancerGigActivity, getGigs, getJobs, getUsers, getWeeklyActivity, updatePassword } from "../controllers/user.controller.js";
import { createContact, deleteContact, getContact } from "../controllers/contactUs.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.get("/",verifyToken, getUsers);
router.get("/usercount",verifyToken,countUser)
router.delete("/:id",verifyToken,deleteUser)
router.get("/gigscount",verifyToken,countGigs)
router.post("/update/:userId",verifyToken,updatePassword)

router.get("/fatchgigs",verifyToken,getGigs)
router.delete("/gig/:id",verifyToken,deleteGig);

router.get("/jodscount",verifyToken,countJob);
router.get("/jobs/getjob",verifyToken,getJobs)

router.post("/contact",verifyToken,createContact);
router.get("/contact",verifyToken,getContact);
router.delete("/contact/:id",verifyToken,deleteContact)

router.get("/activity",getWeeklyActivity)
router.get("/freelancer-activity",getFreelancerGigActivity)

export default router;