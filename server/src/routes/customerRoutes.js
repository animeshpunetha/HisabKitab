import express from 'express';
import { body } from 'express-validator';
import { addCustomer, getCustomers } from '../controllers/customerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const customerValidation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
];

router.use(protect); // Apply auth middleware to all routes

router.post('/', customerValidation, addCustomer);
router.get('/', getCustomers);

export default router;
