import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';

const prisma = new PrismaClient();

export const addTransaction = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { amount, type, description, customerId } = req.body;

        // Verify customer belongs to user
        const customer = await prisma.customer.findFirst({
            where: {
                id: parseInt(customerId),
                userId: req.user.id,
            },
        });

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const transaction = await prisma.transaction.create({
            data: {
                amount: parseFloat(amount),
                type, // "CREDIT" or "DEBIT"
                description,
                customerId: parseInt(customerId),
            },
        });

        res.status(201).json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getTransactions = async (req, res) => {
    try {
        const { customerId } = req.params;

        // Verify customer belongs to user
        const customer = await prisma.customer.findFirst({
            where: {
                id: parseInt(customerId),
                userId: req.user.id,
            },
            include: {
                transactions: {
                    orderBy: { date: 'desc' },
                },
            },
        });

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.json(customer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const customerStats = await prisma.customer.findMany({
            where: { userId },
            include: {
                transactions: true
            }
        });

        let totalToCollect = 0; // You will get (Receivables)
        let totalToPay = 0; // You will give (Payables)

        customerStats.forEach(customer => {
            const customerBalance = customer.transactions.reduce((acc, txn) => {
                return txn.type === 'CREDIT' ? acc + txn.amount : acc - txn.amount;
            }, 0);

            // Balance Logic:
            // CREDIT (Got) - DEBIT (Gave)
            // Negative: Gave more -> You will get (Receivable)
            // Positive: Got more -> You will give (Advance/Payable)

            if (customerBalance < 0) {
                totalToCollect += Math.abs(customerBalance);
            } else {
                totalToPay += customerBalance;
            }
        });

        res.json({
            totalToCollect,
            totalToPay
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deleteTransaction = async (req, res) => {
    try {
        const { transactionId } = req.params;

        const transaction = await prisma.transaction.findUnique({
            where: { id: parseInt(transactionId) },
            include: { customer: true }
        });

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Check ownership
        if (transaction.customer.userId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        // Check if within 1 hour
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        if (transaction.date < oneHourAgo) {
            return res.status(400).json({ error: 'Cannot delete transaction older than 1 hour' });
        }

        await prisma.transaction.delete({
            where: { id: parseInt(transactionId) }
        });

        res.json({ message: 'Transaction deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateTransaction = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const { amount, type, description } = req.body;

        const transaction = await prisma.transaction.findUnique({
            where: { id: parseInt(transactionId) },
            include: { customer: true }
        });

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Check ownership
        if (transaction.customer.userId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        // Check if within 1 hour
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        if (transaction.date < oneHourAgo) {
            return res.status(400).json({ error: 'Cannot update transaction older than 1 hour' });
        }

        const updatedTransaction = await prisma.transaction.update({
            where: { id: parseInt(transactionId) },
            data: {
                amount: parseFloat(amount),
                type,
                description,
            }
        });

        res.json(updatedTransaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
