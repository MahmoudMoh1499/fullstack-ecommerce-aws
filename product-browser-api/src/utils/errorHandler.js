module.exports = (handler) => {
    return async (event, context) => {
        try {
            return await handler(event, context);
        } catch (error) {
            console.error('Error:', error);
            return {
                statusCode: error.statusCode || 500,
                body: JSON.stringify({
                    error: error.message || 'Internal Server Error',
                }),
            };
        }
    };
};