const cloudinary = require('../config/cloudinary').cloudinary;

/**
 * Upload file buffer to Cloudinary
 * @param {Buffer} fileBuffer - File buffer
 * @param {String} folder - Cloudinary folder path
 * @param {String} publicId - Custom public ID
 * @param {String} resourceType - 'image', 'raw', or 'auto'
 * @returns {Object} - { url, publicId, format }
 */
const uploadToCloudinary = (fileBuffer, folder, publicId, resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        public_id: publicId,
        resource_type: resourceType
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            bytes: result.bytes
          });
        }
      }
    );
    
    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete file from Cloudinary
 * @param {String} publicId - Cloudinary public ID
 * @param {String} resourceType - 'image' or 'raw'
 * @returns {Object} - Deletion result
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return {
      success: result.result === 'ok',
      message: result.result
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Extract public ID from Cloudinary URL
 * @param {String} url - Cloudinary URL
 * @returns {String} - Public ID
 */
const extractPublicId = (url) => {
  if (!url) return null;
  
  // Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/file.jpg
  const parts = url.split('/');
  const uploadIndex = parts.indexOf('upload');
  
  if (uploadIndex === -1) return null;
  
  // Get everything after version (v1234567890)
  const pathParts = parts.slice(uploadIndex + 2); // Skip 'upload' and version
  const publicIdWithExt = pathParts.join('/');
  
  // Remove file extension
  return publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
};

/**
 * Get file type from Cloudinary URL
 * @param {String} url - Cloudinary URL
 * @returns {String} - 'image' or 'raw'
 */
const getResourceType = (url) => {
  if (!url) return 'image';
  
  // Check if URL contains /image/ or /raw/
  if (url.includes('/image/')) return 'image';
  if (url.includes('/raw/')) return 'raw';
  
  // Default based on file extension
  const ext = url.split('.').pop().toLowerCase();
  return ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext) ? 'image' : 'raw';
};

/**
 * Generate optimized image URL
 * @param {String} publicId - Cloudinary public ID
 * @param {Object} options - { width, height, crop, quality }
 * @returns {String} - Optimized image URL
 */
const getOptimizedImageUrl = (publicId, options = {}) => {
  const {
    width = 500,
    height = 500,
    crop = 'fill',
    quality = 'auto',
    format = 'auto'
  } = options;
  
  return cloudinary.url(publicId, {
    transformation: [
      { width, height, crop, quality, fetch_format: format }
    ]
  });
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicId,
  getResourceType,
  getOptimizedImageUrl
};