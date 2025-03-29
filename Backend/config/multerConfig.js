import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
const productUploadPath = path.join('utils/uploads/products');
const profileUploadPath = path.join('utils/uploads/profile_pictures');

[productUploadPath, profileUploadPath].forEach((dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const productStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("Saving file to:", productUploadPath); // Debugger
        cb(null, productUploadPath);
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        console.log("Generated filename:", filename); // Debugger
        cb(null, filename);
    }
});

const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("Saving file to:", profileUploadPath); // Debugger
        cb(null, profileUploadPath);
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        console.log("Generated filename:", filename); // Debugger
        cb(null, filename);
    }
});

// Single file upload with correct field name
export const uploadProductImage = multer({ storage: productStorage }).single("image");
export const uploadProfilePicture = multer({ storage: profileStorage }).single("image");
