const { successResponse, errorResponse } = require('../../utils/response');
const { uploadToS3 } = require('../../config/aws');
const pool = require('../../config/database');
const uuid = require('uuid');

module.exports.handler = async (event) => {
    try {
        // For API Gateway/Lambda integration
        if (event.body && typeof event.body === 'string') {
            event.body = JSON.parse(event.body);
        }
        
        // For Express.js local testing
        const body = event.body || event;
        const file = event.file || (event.files && event.files.productImage);
        
        // console.log('Event body:', event.body);
        if (!file) {
            return errorResponse('Product image is required', 400);
        }

        // Extract product data from form fields
        const { name, description, price } = body;

        if (!name || !description || !price) {
            return errorResponse('Missing required product fields', 400);
        }

        // Generate unique filename
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `product-images/${uuid.v4()}.${fileExtension}`;

        // Upload to S3
        const imageUrl = await uploadToS3(
            process.env.PRODUCT_IMAGES_BUCKET,
            fileName,
            file.buffer,
            file.mimetype
        );
        // console.log('Image uploaded to S3:', imageUrl);
        // Save product to database
        const [result] = await pool.query(
            'INSERT INTO products (name, description, price, image_url) VALUES (?, ?, ?, ?)',
            [name, description, parseFloat(price), imageUrl]
        );

        // console.log('Product added to database:', result);
        

        return successResponse({
            message: 'Product added successfully',
            productId: result.insertId,
            imageUrl
        });

    } catch (error) {
        console.error('Add product error:', error);
        return errorResponse(error.message, 400);
    }
};