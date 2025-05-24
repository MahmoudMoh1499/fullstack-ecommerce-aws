const { successResponse, errorResponse } = require('../../utils/response');
const pool = require('../../config/database');

module.exports.handler = async (event) => {
    try {        
        // Debug: Log raw incoming event
        console.log('Raw event:', event);

        // Optional: parse body in case of Lambda requests (not required here but keeps structure consistent)
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
