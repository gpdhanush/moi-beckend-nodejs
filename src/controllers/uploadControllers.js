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
        const filePath = req.body.path; // path like 'profile', 'invitations', 'upcoming-functions', etc.

        if (!userId) {
            return cb(new Error('userId is required'), false);
        }

        if (!filePath) {
            return cb(new Error('path is required'), false);
        }

        const userDir = path.join(uploadDir, userId);
        const categoryDir = path.join(userDir, filePath);

        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }

        if (!fs.existsSync(categoryDir)) {
            fs.mkdirSync(categoryDir, { recursive: true });
        }

        cb(null, categoryDir);
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
                const filePath = req.body.path;
                const fullFilePath = `${uploadDir}/${userId}/${filePath}/${req.file.filename}`;
                return res.status(200).json({ responseType: "S", responseValue: fullFilePath });
            });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },

    deleteImage: async (req, res) => {
        try {
            const { userId, path: filePath, filename } = req.body;

            if (!userId || !filePath || !filename) {
                return res.status(400).json({ 
                    responseType: "F", 
                    responseValue: { message: 'userId, path, and filename are required!' } 
                });
            }

            const fullFilePath = path.join(uploadDir, userId, filePath, filename);

            // Check if file exists
            if (!fs.existsSync(fullFilePath)) {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: 'File not found!' } 
                });
            }

            // Delete the file
            fs.unlinkSync(fullFilePath);

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