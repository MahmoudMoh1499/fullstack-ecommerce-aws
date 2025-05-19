module.exports = (handler) => {
    return async (event, context) => {
        try {
            // Convert Lambda event to Express-like request
            const req = {
                body: event.body ? JSON.parse(event.body) : {},
                query: event.queryStringParameters || {},
                params: event.pathParameters || {},
                method: event.httpMethod,
                headers: event.headers,
                file: event.file // For file uploads
            };

            // Mock response object
            const res = {
                status: (code) => ({
                    json: (data) => ({
                        statusCode: code,
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    })
                })
            };

            // Execute the handler
            return await handler(req, res);

        } catch (error) {
            console.error('Handler error:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Internal Server Error' })
            };
        }
    };
};