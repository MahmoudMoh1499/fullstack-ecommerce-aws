const { successResponse, errorResponse } = require('../../utils/response');
const authService = require('../../services/auth.service');
const { uploadToS3 } = require('../../config/aws');
const uuid = require('uuid');

module.exports.handler = async (event) => {
    try {
        // Parse multipart form data (you'll need a middleware for this)
        const { name, email, password } = JSON.parse(event.body);
        const profilePic = event.file; // Assuming middleware processed the upload

        if (!profilePic) {
            return errorResponse('Profile picture is required', 400);
        }

        // Generate unique filename
        const fileExtension = profilePic.originalname.split('.').pop();
        const fileName = `profile-pics/${uuid.v4()}.${fileExtension}`;

        // Upload to S3
        const profilePicUrl = await uploadToS3(
            process.env.PROFILE_PICS_BUCKET,
            fileName,
            profilePic.buffer,
            profilePic.mimetype
        );

        // Register user
        const userId = await authService.registerUser(
            name,
            email,
            password,
            profilePicUrl
        );

        return successResponse({
            message: 'Registration successful',
            userId,
            profilePicUrl
        });

    } catch (error) {
        console.error('Registration error:', error);
        return errorResponse(error.message, 400);
    }
};