import express from "express";
import {
  createMessage,
  getLastMessge,
  getMessages,
} from "../controllers/message.controller.js";
import { verifyToken } from "../middleware/jwt.js";
import { upload } from "../middleware/cloudinary.js";

const router = express.Router();

router.post("/",verifyToken, 
  upload.fields([
          {
              name:"file",
              maxCount:1
          }
      ]),createMessage);
router.get("/:id",verifyToken, getMessages);
router.get("/:conversationId/:friendId",verifyToken,getLastMessge)

export default router;