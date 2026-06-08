/**
 * Multer upload — medical report files (PDF + images).
 * Stored in server/uploads/reports/; served at /uploads/reports/<filename>
 */
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const ApiError = require('../utils/ApiError');

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads', 'reports');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '';
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 40);
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_MIME.has(file.mimetype)) return cb(null, true);
  cb(new ApiError(400, 'Only PDF and image files (JPEG, PNG, WebP) are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/** Single report file field name: `file` */
exports.uploadReport = upload.single('file');

/** Wrap multer errors into ApiError */
exports.handleUploadError = (err, _req, _res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') return next(new ApiError(400, 'File too large (max 5 MB)'));
    return next(new ApiError(400, err.message));
  }
  return next(err);
};
