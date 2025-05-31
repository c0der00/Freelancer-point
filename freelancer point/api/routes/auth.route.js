import express from "express";
import { register, login, logout, becomeDev } from "../controllers/auth.controller.js";
import { upload } from "../middleware/cloudinary.js";

const router = express.Router();

router.post("/register",
    upload.fields([
        {
            name:"img",
            maxCount:1
        }
    ]),    
    register
)
router.post("/login", login)
router.post("/logout", logout)
router.post("/become-dev",becomeDev)

export default router;