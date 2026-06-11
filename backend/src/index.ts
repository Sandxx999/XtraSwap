import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import listingRoutes from './routes/listingRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error: any) {
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
});

app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'XtraSwap API is running' });
});

app.get('/', (req, res) => {
  res.send('XtraSwap API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
