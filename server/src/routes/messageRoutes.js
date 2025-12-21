import express from 'express';
import multer from 'multer';
import path from 'path';
import { addMessage, getMessages } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';
import fs from 'fs';

const router = express.Router();

// Setup Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';
        // Ensure directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Images only!'));
        }
    },
});

router.use(protect);

router.post('/', upload.single('image'), addMessage);
router.get('/:customerId', getMessages);

export default router;
