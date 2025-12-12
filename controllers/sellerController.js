import User from '../models/User.js';
import { success, error } from '../utils/response.js';

export const updateItems = async (req, res) => {
  try {
    if (req.user.role !== 'seller') return res.json(error('Only sellers can update items', -1));
    const { products } = req.body;
    if (!Array.isArray(products)) return res.json(error('Items array required', -2));
    const user = await User.findById(req.user.id);
    if (!user) return res.json(error('User not found', -3));
    user.sellerItems = products.map(i => ({ productId: i.productID, price: i.price, inStock: !!i.isAvailable }));
    await user.save();
    return res.json(success('Items updated'));
  } catch (err) {
    console.error(err);
    return res.json(error('Update items failed'));
  }
};
