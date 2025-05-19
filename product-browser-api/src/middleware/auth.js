const jwt = require('../config/jwt');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) throw new Error('Authentication required');

        const decoded = jwt.verify(token);
        req.user = decoded; // Attach user data to request
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};