import 'dotenv/config';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/node-mongo-store';

async function run() {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  const products = [
    { name: 'Milk', description: 'Dairy milk' },
    { name: 'Bread', description: 'Bakery bread' },
    { name: 'Eggs', description: 'Dozen eggs' }
  ];
  await Product.insertMany(products);
  console.log('Seeded products');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
