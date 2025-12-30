import User from '../models/User.js';
import { success, error } from '../utils/response.js';

export const updateItems = async (req, res) => {
  try {
    if (req.user.role !== 'seller') return res.json(error('Only sellers can update items', -1));
    const { products } = req.body;
    if (!Array.isArray(products)) return res.json(error('Items array required', -2));
    const user = await User.findById(req.user.id);
    if (!user) return res.json(error('User not found', -3));
    // user.sellerItems = products.map(i => ({ productId: i.productID, price: i.price, inStock: !!i.isAvailable }));
    if (!Array.isArray(user.sellerItems)) {
      user.sellerItems = [];
    }

    products.forEach(p => {
      const existingItem = user.sellerItems.find(
        si => si.productId.toString() === p.productID.toString()
      );

      if (existingItem) {
        // 🔁 Update existing item
        existingItem.price = p.price;
        existingItem.inStock = !!p.isAvailable;
      } else {
        // ➕ Add new item
        user.sellerItems.push({
          productId: p.productID,
          price: p.price,
          inStock: !!p.isAvailable
        });
      }
    });
    await user.save();
    return res.json(success('Items updated'));
  } catch (err) {
    console.error(err);
    return res.json(error('Update items failed'));
  }
};

export const getSellerItems = async (req, res) => {
  try {
    if (req.user.role !== 'seller')
      return res.json(error('Only sellers can access items', -1));

    const user = await User.findById(req.user.id)
      .select('sellerItems');
      

    if (!user)
      return res.json(error('User not found', -2));

    return res.json(success('Seller items fetched', user.sellerItems));
  } catch (err) {
    console.error(err);
    return res.json(error('Failed to fetch seller items'));
  }
};