const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage configuration for different file types
const createStorage = (folder, allowedFormats) => {
    return new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: `lumos/${folder}`,
            allowed_formats: allowedFormats,
            resource_type: 'auto',
            transformation: folder === 'avatars' ? [{ width: 500, height: 500, crop: 'limit' }] : [],
        },
    });
};

// Document storage (PDFs, DOCs, images)
const documentStorage = createStorage('documents', ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']);

// Resume storage
const resumeStorage = createStorage('resumes', ['pdf', 'doc', 'docx']);

// Transcript storage
const transcriptStorage = createStorage('transcripts', ['pdf', 'jpg', 'jpeg', 'png']);

// Avatar/Profile image storage
const avatarStorage = createStorage('avatars', ['jpg', 'jpeg', 'png', 'webp']);

// File filter for validation
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/webp',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Allowed: PDF, DOC, DOCX, JPG, PNG, WEBP'), false);
    }
};

// Multer upload configurations
const uploadDocument = multer({
    storage: documentStorage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const uploadResume = multer({
    storage: resumeStorage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 },
});

const uploadTranscript = multer({
    storage: transcriptStorage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 },
});

const uploadAvatar = multer({
    storage: avatarStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed for avatars'), false);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for avatars
});

// Helper function to delete a file from Cloudinary
const deleteFile = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
        throw error;
    }
};

// Helper function to get public ID from Cloudinary URL
const getPublicIdFromUrl = (url) => {
    if (!url) return null;
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const folder = parts[parts.length - 2];
    const publicId = `${folder}/${filename.split('.')[0]}`;
    return publicId;
};

module.exports = {
    cloudinary,
    uploadDocument,
    uploadResume,
    uploadTranscript,
    uploadAvatar,
    deleteFile,
    getPublicIdFromUrl,
};

