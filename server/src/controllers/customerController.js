import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';

const prisma = new PrismaClient();

export const addCustomer = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, phone } = req.body;
        const userId = req.user.id;

        const customer = await prisma.customer.create({
            data: {
                name,
                phone,
                userId,
            },
        });

        res.status(201).json(customer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getCustomers = async (req, res) => {
    try {
        const userId = req.user.id;
        const customers = await prisma.customer.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                transactions: {
                    orderBy: { date: 'desc' },
                    take: 1, // Get latest transaction for checking balance if needed later
                },
            },
        });
        res.json(customers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
