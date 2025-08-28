import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getMessages,uploadFile } from "../controllers/MessagesController.js";
import { Router } from "express";
import multer from "multer";

const messagesRoutes = Router();

// ✅ Fix: Use GET request with query params
messagesRoutes.post("/get-messages", verifyToken, getMessages);
const upload = multer({dest: "uploads/files"});

messagesRoutes.post(
    "/upload-file",
    verifyToken,
    upload.single("file"),
    uploadFile
)


export default messagesRoutes;
