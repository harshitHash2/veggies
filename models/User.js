import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  fullName: { type: String },
  email: { type: String, unique: true, required: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['buyer','seller'], default: 'buyer' },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpire: { type: Date },
  resetOtp: { type: String },
  resetOtpExpire: { type: Date },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0,0] } // [lng, lat]
  },
  sellerItems: [{ 
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    price: { type: Number },
    inStock: { type: Boolean, default: true }
  }]
}, { timestamps: true });

UserSchema.index({ location: '2dsphere' });

export default mongoose.model('User', UserSchema);
