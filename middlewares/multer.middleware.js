import multer from "multer";
import crypto from 'node:crypto'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!file) {
      cb(new Error('File not found'), null);
    } else {
      cb(null,"public/uploads");
    }
  },
  filename: function (req, file, cb) {
    if (!file) {
      cb(new Error('File not found'), null);
    } else {
      const uniqueSuffix = crypto.randomBytes(16).toString('hex');
      cb(null, file.originalname);
    }
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG files are allowed!'), false);
    }
  },
});

export const upload = multer({ storage: storage });
