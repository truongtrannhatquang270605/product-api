const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const productRoutes = require('./routes/productRoutes');


const app = express();
app.use(express.json());

app.use(
    morgan(':method :url :status :response-time ms', {
        skip: (req) => req.url === '/health' || process.env.NODE_ENV === 'test',
    })
);

app.get('/health', (req, res) => {
    const ok = mongoose.connection.readyState === 1;
    res.status(ok ? 200 : 503).json({
        status: ok ? 'ok' : 'db not connected',
        version: 'v3'
    });
});

app.use('/api/products', productRoutes);

module.exports = app;