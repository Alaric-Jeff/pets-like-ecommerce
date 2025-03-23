import multer from 'multer'
import path from 'path'
import fs from 'fs'

const uploadDirs  = {
    products: '../utils/uploads/products',
    profilePictures: '../utils/uploads/profilePictures'
}
Object.values(uploadDirs).forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const folder = req.body.folder || 'products'; 
      const uploadPath = uploadDirs[folder] || uploadDirs.products;
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
  
  const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
  
    if (mimeType && extName) {
      return cb(null, true);
    } else {
      return cb(new Error('Only images (JPEG, JPG, PNG) are allowed'));
    }
  };
  

  const upload = multer({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 }, 
    fileFilter: fileFilter
  });
  
  export default upload;