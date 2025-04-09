const multer = require('multer');
const path = require('path');
const File = require('../models/File');
const fs = require('fs').promises;

// הגדרת אחסון הקבצים
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// העלאת קובץ
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'לא נבחר קובץ' });
        }

        const file = new File({
            filename: req.file.originalname,
            path: req.file.path,
            uploadedBy: req.user._id,
            signaturePosition: req.body.signaturePosition ? JSON.parse(req.body.signaturePosition) : null
        });

        await file.save();

        res.status(201).json({
            message: 'הקובץ הועלה בהצלחה',
            file: {
                id: file._id,
                filename: file.filename,
                signaturePosition: file.signaturePosition
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'שגיאה בהעלאת הקובץ' });
    }
};

// קבלת כל הקבצים
const getFiles = async (req, res, next) => {
    try {
        // כאן תהיה הלוגיקה לשליפת הקבצים ממסד הנתונים
        res.json({
            success: true,
            data: []
        });
    } catch (error) {
        next(error);
    }
};

// קבלת קובץ ספציפי
const getFile = async (req, res) => {
    try {
        const file = await File.findOne({
            _id: req.params.id,
            uploadedBy: req.user._id
        });

        if (!file) {
            return res.status(404).json({ message: 'הקובץ לא נמצא' });
        }

        // בדיקה שהקובץ קיים פיזית
        try {
            await fs.access(file.path);
        } catch {
            return res.status(404).json({ message: 'הקובץ לא נמצא במערכת' });
        }

        res.json(file);
    } catch (error) {
        console.error('Get file error:', error);
        res.status(500).json({ message: 'שגיאה בטעינת הקובץ' });
    }
};

// מחיקת קובץ
const deleteFile = async (req, res, next) => {
    try {
        const fileId = req.params.id;
        // כאן תהיה הלוגיקה למחיקת הקובץ
        res.json({
            success: true,
            message: 'הקובץ נמחק בהצלחה'
        });
    } catch (error) {
        next(error);
    }
};

const getUserFiles = async (req, res) => {
    try {
        const files = await File.find({ uploadedBy: req.user._id })
            .sort({ createdAt: -1 })
            .select('filename signaturePosition status createdAt');

        res.json(files);
    } catch (error) {
        console.error('Get files error:', error);
        res.status(500).json({ message: 'שגיאה בטעינת הקבצים' });
    }
};

const downloadFile = async (req, res) => {
    try {
        const file = await File.findOne({
            _id: req.params.id,
            uploadedBy: req.user._id
        });

        if (!file) {
            return res.status(404).json({ message: 'הקובץ לא נמצא' });
        }

        res.download(file.path, file.filename);
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ message: 'שגיאה בהורדת הקובץ' });
    }
};

const updateSignaturePosition = async (req, res) => {
    try {
        const file = await File.findOne({
            _id: req.params.id,
            uploadedBy: req.user._id
        });

        if (!file) {
            return res.status(404).json({ message: 'הקובץ לא נמצא' });
        }

        file.signaturePosition = req.body.signaturePosition;
        await file.save();

        res.json({
            message: 'מיקום החתימה עודכן בהצלחה',
            file: {
                id: file._id,
                filename: file.filename,
                signaturePosition: file.signaturePosition
            }
        });
    } catch (error) {
        console.error('Update signature position error:', error);
        res.status(500).json({ message: 'שגיאה בעדכון מיקום החתימה' });
    }
};

module.exports = {
    upload,
    uploadFile,
    getFiles,
    getFile,
    deleteFile,
    getUserFiles,
    downloadFile,
    updateSignaturePosition
};
