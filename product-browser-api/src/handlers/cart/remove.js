const { successResponse, errorResponse } = require('../../utils/response');
const cartService = require('../../services/cart.service');

module.exports.handler = async (event) => {
    try {
        // Handle both raw Lambda events and Express-parsed requests
        const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        const { productId } = body;
        const userId = event.user?.userId || event.user?.user_id;
        
        if (!productId) {
            return errorResponse('Product ID is required', 400);
        }

        const cartItems = await cartService.removeFromCart(userId, productId);
        return successResponse({ items: cartItems });

    } catch (error) {
        console.error('Remove from cart error:', error);
        return errorResponse(error.message, 500);
    }
};