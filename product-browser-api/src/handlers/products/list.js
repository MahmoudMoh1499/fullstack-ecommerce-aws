const { successResponse, errorResponse } = require('../../utils/response');
const pool = require('../../config/database');

module.exports.handler = async (event) => {
    try {
        const [products] = await pool.query('SELECT * FROM products');

        return successResponse({
            products: products.map(product => ({
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                imageUrl: product.image_url
            }))
        });

    } catch (error) {
        console.error('List products error:', error);
        return errorResponse('Failed to fetch products', 500);
    }
};