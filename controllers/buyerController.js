import User from '../models/User.js';
import mongoose from 'mongoose';
import { success, error } from '../utils/response.js';

export const nearbyStores = async (req, res) => {
  try {
    const { productId } = req.params;
    const { latitude, longitude, radiusKm = 10 } = req.body; // using body as POST
    console.log(latitude, longitude, productId, req.body)
    const buyer = await User.findById(req.user.id);
    if (!buyer) return res.json(error('Buyer not found', -1));
    // if (!buyer.location || !Array.isArray(buyer.location.coordinates)) return res.json(error('Buyer location not set', -2));

    // const coords = buyer.location.coordinates; // [lng, lat]

    // Validate input
    // if (!latitude || !longitude) {
    //   return res.json(error("latitude and longitude are required", -1));
    // }

    // Convert to coordinates format [lng, lat]
    const coords = [parseFloat(longitude), parseFloat(latitude)];
    const maxDistance = parseFloat(radiusKm) * 1000;

    const sellers = await User.aggregate([
      { $geoNear: {
          near: { type: 'Point', coordinates: coords },
          distanceField: 'dist.calculated',
          spherical: true,
          maxDistance
      }},
      { $match: { role: 'seller', 'sellerItems.productId': { $exists: true } } },
      { $addFields: {
        items: {
          $filter: {
            input: '$sellerItems',
            as: 'it',
            cond: { $eq: ['$$it.productId', new mongoose.Types.ObjectId(productId)] }
          }
        }
      }},
      { $match: { 'items.0': { $exists: true } } },
      { $sort: { 'dist.calculated': 1 } },
      { $project: { fullName:1, email:1, location:1, items:1, 'dist.calculated':1 } }
    ]);
    const mapped = sellers.map(s => ({
    SellerId: s._id,
    SellerName: s.fullName,
    SellerLatitude: s.location.coordinates[1],
    SellerLongitude: s.location.coordinates[0],
    Price: s.items?.[0]?.price || 0,
    IsAvailable: s.items?.[0]?.inStock ? 1 : 0,
    UpdatedOn: s.items?.[0]?.updatedOn || null,
    DistanceKm: s.dist?.calculated || 0
}));
    return res.json(success('Nearby sellers fetched', mapped));
  } catch (err) {
    console.error(err);
    return res.json(error('Failed to fetch nearby sellers'));
  }
};
