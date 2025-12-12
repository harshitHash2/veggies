import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: String
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);
