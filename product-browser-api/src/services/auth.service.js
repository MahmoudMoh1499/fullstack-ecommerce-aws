const pool = require('../config/database');
const jwt = require('../config/jwt');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

module.exports = {
    registerUser: async (name, email, password, profilePicUrl) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, profile_pic_url) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, profilePicUrl]
        );
        return result.insertId;
    },

    loginUser: async (email, password) => {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) throw new Error('User not found');

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Invalid credentials');

        const token = jwt.sign({ userId: user.id, email: user.email });
        return { token, profilePicUrl: user.profile_pic_url };
    },

    getUserById: async (userId) => {
        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
        return users[0];
    }
};