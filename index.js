require('dotenv').config();
const mongoose = require('mongoose');
const { time } = require('./functions');
const app = require('./app');

const PORT = process.env.PORT || 4000;

// Connect MongoDB
mongoose.connect(process.env.DB_URI)
  .then(() => {
    console.log('Connected to mongodb');
    // Start listening after server connect
    app.listen(PORT, () => {
      console.log(time() +`Listening at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Salir del proceso si no se puede conectar a la base de datos
  });