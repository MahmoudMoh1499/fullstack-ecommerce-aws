const { successResponse, errorResponse } = require('../../utils/response');
const cartService = require('../../services/cart.service');

module.exports.handler = async (event) => {
    try {
        const userId = event.user.userId;
        const items = await cartService.getCartItems(userId);
        const total = await cartService.getCartTotal(userId);

        return successResponse({ items, total });

    } catch (error) {
        console.error('Get cart error:', error);
        return errorResponse(error.message, 500);
    }
};