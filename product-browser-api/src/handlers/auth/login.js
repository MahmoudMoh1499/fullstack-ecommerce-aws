const { successResponse, errorResponse } = require('../../utils/response');
const pool = require('../../config/database');
const jwt = require('../../config/jwt');
const bcrypt = require('bcryptjs');

module.exports.handler = async (event) => {
    try {
        // Debug: Log raw incoming event
        console.log('Raw event:', event);

        // Handle both Lambda and Express.js formats
        let body;
        if (typeof event.body === 'string') {
            try {
                body = JSON.parse(event.body);
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                return errorResponse('Invalid JSON format', 400);
            }
        } else {
            body = event.body || event;
        }

        const { email, password } = body;

        if (!email || !password) {
            return errorResponse('Email and password are required', 400);
        }

        // Rest of your login logic...
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return errorResponse('Invalid credentials', 401);

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return errorResponse('Invalid credentials', 401);

        const token = jwt.sign({
            userId: user.id,
            email: user.email,
            isAdmin: user.is_admin
        });

        return successResponse({
            token,
            profilePicUrl: user.profile_pic_url,
            name: user.name
        });

    } catch (error) {
        console.error('Login error:', error);
        return errorResponse(error.message, 500);
    }
};