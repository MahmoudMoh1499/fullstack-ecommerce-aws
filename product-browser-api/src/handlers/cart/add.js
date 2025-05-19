const { successResponse, errorResponse } = require('../../utils/response');
const cartService = require('../../services/cart.service');

module.exports.handler = async (event) => {
    try {
        // Handle both raw Lambda events and Express-parsed requests
        const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        const { productId, quantity } = body;
        const userId = event.user?.userId || event.user?.user_id; // Handle different JWT formats

        if (!productId) {
            return errorResponse('Product ID is required', 400);
        }

        const cartItems = await cartService.addToCart(
            userId,
            productId,
            quantity || 1
        );

        return successResponse({ items: cartItems });

    } catch (error) {
        console.error('Add to cart error:', error);
        return errorResponse(error.message, 500);
    }
};