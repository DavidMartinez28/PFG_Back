const multer = require('multer');
const path = require('path');

const fs = require('fs');
const cloudinary = require('cloudinary').v2;

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop();
        const filename = file.originalname.replace(`.${ext}`, '');
        cb(null, `${filename}.${ext}`);
    },
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../documentos'));
    }
  });

const VALID_FILE_TYPES = ['application/pdf','image/png'];

const fileFilter = (req, file, cb) => {
  if (!VALID_FILE_TYPES.includes(file.mimetype)) {
    cb(new Error('Invalid file type'));
  } else {
    cb(null, true);
  }
}

const upload = multer({
    storage,
    fileFilter,
  });


  const uploadToCloudinary = async (req, res, next) => {
    if (req.file) {
      try{
      const filePath = req.file.path;
      const image = await cloudinary.uploader.upload(filePath);
  
      // Borramos el archivo local
      await fs.unlinkSync(filePath);
    
      // Añadimos la propiedad file_url a nuestro Request
      req.file_url = image.secure_url;
      return next();
      }catch(error){
        return next(error)
      }
    } else {
      return next();
    }
  };

module.exports = { upload, uploadToCloudinary};