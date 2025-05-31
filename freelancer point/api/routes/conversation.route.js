import express from "express";
import {
  createConversation,
  getConversations,
  getConversationsUser,
  getSingleConversation,
  updateConversation,
} from "../controllers/conversation.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.get("/:id",verifyToken, getConversationsUser);
router.post("/", verifyToken,createConversation);
router.get("/single/:id", verifyToken, getSingleConversation);
router.put("/:id", verifyToken, updateConversation);

export default router;