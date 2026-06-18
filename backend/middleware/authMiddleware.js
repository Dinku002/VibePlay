const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      
      token = req.headers.authorization.split(' ')[1];

    
      req.user = await User.findById(token);

      return next(); 
    } catch (error) {
      return res.status(401).json({ message: 'User session invalid' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No user session found' });
  }
};

module.exports = { protect };