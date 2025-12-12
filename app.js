import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import accountRoutes from './routes/account.js';
import authRoutes from './routes/auth.js';
import buyerRoutes from './routes/buyer.js';
import sellerRoutes from './routes/seller.js';

import { success, error } from './utils/response.js';

const app = express();
app.use(bodyParser.json());

app.use('/api/Account', accountRoutes);
app.use('/api/Auth', authRoutes);
app.use('/api/Buyer', buyerRoutes);
app.use('/api/Seller', sellerRoutes);

app.get('/', (req, res) => res.json(success('API running', { now: new Date() })));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json(error('Internal Server Error', -1));
});

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/node-mongo-store';
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server started on ${port}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
