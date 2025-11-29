const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const uploadDir = './uploads';
// const uploadDir = './../../public_html/gp/moi/uploads';

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        const userId = req.body.userId;
        if (!userId) {
            return cb(new Error('userId is required'), false);
        }

        const userDir = path.join(uploadDir, userId);

        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir);
        }

        cb(null, userDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `file-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }).single('file');


exports.controller = {
    saveFiles: async (req, res) => {
        try {
            upload(req, res, async (err) => {
                if (err) {
                    return res.status(400).json({ responseType: "F", responseValue: { message: err.message } });
                }

                if (!req.file) {
                    return res.status(400).json({ responseType: "F", responseValue: { message: 'No file uploaded!' } });
                }
                
                const userId = req.body.userId;
                const filePath = `${uploadDir}/${userId}/${req.file.filename}`;
                return res.status(200).json({ responseType: "S", responseValue: filePath });
            });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },

    deleteImage: async (req, res) => {
        try {
            const { userId, filename } = req.body;

            if (!userId || !filename) {
                return res.status(400).json({ 
                    responseType: "F", 
                    responseValue: { message: 'userId and filename are required!' } 
                });
            }

            const filePath = path.join(uploadDir, userId, filename);

            // Check if file exists
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: 'File not found!' } 
                });
            }

            // Delete the file
            fs.unlinkSync(filePath);

            return res.status(200).json({ 
                responseType: "S", 
                responseValue: { message: 'File deleted successfully!' } 
            });
        } catch (error) {
            return res.status(500).json({ 
                responseType: "F", 
                responseValue: { message: error.toString() } 
            });
        }
    }
};