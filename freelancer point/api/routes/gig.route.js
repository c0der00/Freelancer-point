import express from "express";
import {
  createGig,
  deleteGig,
  getGig,
  getGigs,
  myGigs
} from "../controllers/gig.controller.js";
import { verifyToken } from "../middleware/jwt.js";
import { upload } from "../middleware/cloudinary.js";

const router = express.Router();

router.post("/create",verifyToken, 
   upload.fields([
          {
              name:"cover",
              maxCount:1
          },
          {
            name:"images",
            maxCount:1
          }
      ]),
  createGig
);
// router.delete("/:id", verifyToken, deleteGig);
router.get("/single/:gigId",verifyToken, getGig);
router.get("/",verifyToken, getGigs);
router.get("/mygigs/:id",verifyToken,myGigs)
router.delete("/delete/:id",verifyToken,deleteGig)

export default router;