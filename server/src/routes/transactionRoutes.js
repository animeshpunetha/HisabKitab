import express from 'express';
import { body } from 'express-validator';
import { addTransaction, getTransactions, getDashboardStats, deleteTransaction, updateTransaction } from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const transactionValidation = [
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('type').isIn(['CREDIT', 'DEBIT']).withMessage('Type must be CREDIT or DEBIT'),
    body('customerId').notEmpty().withMessage('Customer ID is required'),
];

router.use(protect);

router.post('/', transactionValidation, addTransaction);
router.delete('/:transactionId', deleteTransaction);
router.put('/:transactionId', transactionValidation, updateTransaction);
router.get('/stats', getDashboardStats);
router.get('/:customerId', getTransactions);

export default router;
