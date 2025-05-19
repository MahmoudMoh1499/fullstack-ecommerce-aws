const pool = require('../config/database');

module.exports = {
    // Get or create cart for user
    getOrCreateCart: async (userId) => {
        const [carts] = await pool.query(
            'SELECT id FROM carts WHERE user_id = ?',
            [userId]
        );

        if (carts.length > 0) return carts[0].id;

        const [result] = await pool.query(
            'INSERT INTO carts (user_id) VALUES (?)',
            [userId]
        );
        return result.insertId;
    },

    // Add item to cart
    addToCart: async (userId, productId, quantity = 1) => {
        const cartId = await module.exports.getOrCreateCart(userId); // Changed this to module.exports

        await pool.query(`
            INSERT INTO cart_items (cart_id, product_id, quantity)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
        `, [cartId, productId, quantity]);

        return module.exports.getCartItems(userId); // Changed this to module.exports
    },

    // Remove item from cart
    removeFromCart: async (userId, productId) => {
        const [carts] = await pool.query(
            'SELECT id FROM carts WHERE user_id = ?',
            [userId]
        );
        if (carts.length === 0) return;

        await pool.query(
            'DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?',
            [carts[0].id, productId]
        );

        return module.exports.getCartItems(userId); // Changed this to module.exports
    },

    // Get cart contents with product details
    getCartItems: async (userId) => {
        const [carts] = await pool.query(
            'SELECT id FROM carts WHERE user_id = ?',
            [userId]
        );
        if (carts.length === 0) return [];

        const [items] = await pool.query(`
            SELECT 
                ci.product_id, 
                p.name, 
                p.price, 
                p.image_url,
                ci.quantity,
                (p.price * ci.quantity) AS subtotal
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.cart_id = ?
        `, [carts[0].id]);

        return items;
    },

    // Calculate cart total
    getCartTotal: async (userId) => {
        const items = await module.exports.getCartItems(userId); // Changed this to module.exports
        return items.reduce((total, item) => total + item.subtotal, 0);
    }
};