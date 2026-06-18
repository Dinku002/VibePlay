const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');


router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving wishlist', error: error.message });
  }
});


router.post('/toggle', protect, async (req, res) => {
  try {
    const { id, title, img, video } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

  
    const isSaved = user.wishlist.find(item => item.id === id);

    if (isSaved) {
  
      user.wishlist = user.wishlist.filter(item => item.id !== id);
      await user.save();
      return res.json({ message: 'Removed from wishlist', wishlist: user.wishlist });
    } else {
      user.wishlist.push({ id, title, img, video });
      await user.save();
      return res.json({ message: 'Added to wishlist', wishlist: user.wishlist });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating wishlist', error: error.message });
  }
});

module.exports = router;