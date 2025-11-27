const express = require('express');
const cors = require('cors');
const codeRoutes = require('./routes/codeRoutes');
const config = require('./config/config');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/code', codeRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Codvia Backend is running',
        timestamp: new Date().toISOString()
    });
});

// Supported languages endpoint
app.get('/api/languages', (req, res) => {
    const languageService = require('./services/languageService');
    res.json({
        success: true,
        languages: languageService.getSupportedLanguages()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal Server Error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

const PORT = config.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Codvia Backend Server running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    console.log(`💻 Execute code: POST http://localhost:${PORT}/api/code/execute`);
});

module.exports = app;
