module.exports = {
    successResponse: (body, statusCode = 200) => {
        console.log('Success response:', body);
        return {
            statusCode,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(body),
        };
    },
    errorResponse: (message, statusCode = 500) => {
        
        return {
            statusCode,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: message }),
        };
    },
};