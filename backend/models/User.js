const mongoose = require('mongoose');

const WishlistItemSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  img: { type: String, required: true },
  video: { type: String, required: true }
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true, uppcase:true},
  password: { type: String, required: true }, 
  wishlist: [WishlistItemSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);