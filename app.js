const express = require('express');
const cors = require('cors');
const logApiRoutes = require('./routes/logapiRoutes')
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.use(cors());

app.use(express.json());

//LogApi Events management
app.use('/api/logapi', logApiRoutes);

// Middleware error managment
app.use(errorMiddleware);

module.exports = app;