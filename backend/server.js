const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');


dotenv.config();


const app = express();


app.use(cors()); 
app.use(express.json()); 


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.log('MongoDB Connection Error: ', err));


app.use('/api/auth', require('./routes/auth'));


app.use('/api/wishlist', require('./routes/wishlist'));

app.get('/', (req, res) => {
  res.send('VibePlay is running successfully!');
});


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});