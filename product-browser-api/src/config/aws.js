const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

// Configure AWS credentials
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

module.exports = {
    s3,

    // Upload file to S3
    uploadToS3: async (bucket, key, buffer, mimetype) => {
        const params = {
            Bucket: bucket,
            Key: key,
            Body: buffer,
            ContentType: mimetype,
            // ACL: 'public-read' // Change to 'private' if you want restricted access
        };

        try {
            const data = await s3.upload(params).promise();
            return data.Location;
        } catch (error) {
            console.error('S3 Upload Error:', error);
            throw error;
        }
    },

    // Generate pre-signed URL for private objects
    getSignedUrl: async (bucket, key, expires = 3600) => {
        const params = {
            Bucket: bucket,
            Key: key,
            Expires: expires
        };
        return s3.getSignedUrl('getObject', params);
    },

    // Delete object from S3
    deleteFromS3: async (bucket, key) => {
        const params = {
            Bucket: bucket,
            Key: key
        };
        await s3.deleteObject(params).promise();
    }
};