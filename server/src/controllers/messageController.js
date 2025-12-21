import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export const addMessage = async (req, res) => {
    try {
        const { customerId, content, type, direction } = req.body;
        const file = req.file;

        // Verify customer belongs to user
        const customer = await prisma.customer.findFirst({
            where: {
                id: parseInt(customerId),
                userId: req.user.id,
            },
        });

        if (!customer) {
            // Clean up uploaded file if validation fails
            if (file) {
                fs.unlinkSync(file.path);
            }
            return res.status(404).json({ error: 'Customer not found' });
        }

        let mediaUrl = null;
        if (file) {
            mediaUrl = `/uploads/${file.filename}`;
        }

        const message = await prisma.message.create({
            data: {
                content,
                type: file ? 'IMAGE' : 'TEXT',
                mediaUrl,
                customerId: parseInt(customerId),
                direction: direction || 'OUTGOING',
            },
        });

        res.status(201).json(message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { customerId } = req.params;

        const customer = await prisma.customer.findFirst({
            where: {
                id: parseInt(customerId),
                userId: req.user.id,
            },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.json(customer.messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
