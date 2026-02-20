const cloudinary = require('../config/cloudinary');

// Upload image to Cloudinary
const uploadImage = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.path, {
            resource_type: 'image',
            // upload_preset: 'course_uploads', // Use upload preset
        });

        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error) {
        console.error('Cloudinary Image Upload Error:', error);
        throw new Error('Error uploading image: ' + (error.error?.message || error.message));
    }
};

// Upload video to Cloudinary
const uploadVideo = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(
            file.path,
            {
                resource_type: 'video',
                chunk_size: 60000000, // 60MB chunks
                // upload_preset: 'course_uploads', // Use upload preset
            }
        );

        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error) {
        console.error('Cloudinary Video Upload Error:', error);
        throw new Error('Error uploading video: ' + (error.error?.message || error.message));
    }
};

// Delete file from Cloudinary
const deleteFile = async (publicId, resourceType = 'image') => {
    try {
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (error) {
        throw new Error('Error deleting file: ' + error.message);
    }
};

module.exports = {
    uploadImage,
    uploadVideo,
    deleteFile,
};
