import multer from 'multer';
import path from 'path';

const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join('utils/uploads/products')); 
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join('utils/uploads/profile_pictures'));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export const uploadProductImage = multer({ storage: productStorage });
export const uploadProfilePicture = multer({ storage: profileStorage });
