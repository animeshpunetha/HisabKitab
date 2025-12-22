import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false })); // Allow serving images
app.use(morgan('dev')); // Log requests

// Serve static uploads
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to HisabKitab API' });
});

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
