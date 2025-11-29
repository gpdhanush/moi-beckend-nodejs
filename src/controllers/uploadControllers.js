const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const uploadDir = './uploads';
// const uploadDir = './../../public_html/gp/moi/uploads';

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Temporary directory for initial upload
const tempDir = path.join(uploadDir, 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Save to temp directory first, then move after validation
        cb(null, tempDir);
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

                if (!userId) {
                    // Clean up temp file if validation fails
                    if (req.file && req.file.path) {
                        try {
                            fs.unlinkSync(req.file.path);
                        } catch (cleanupError) {
                            // Ignore cleanup errors
                        }
                    }
                    return res.status(400).json({ responseType: "F", responseValue: { message: 'userId is required!' } });
                }

                if (!filePath) {
                    // Clean up temp file if validation fails
                    if (req.file && req.file.path) {
                        try {
                            fs.unlinkSync(req.file.path);
                        } catch (cleanupError) {
                            // Ignore cleanup errors
                        }
                    }
                    return res.status(400).json({ responseType: "F", responseValue: { message: 'path is required!' } });
                }

                // Create the final destination directory
                const userDir = path.join(uploadDir, userId);
                const categoryDir = path.join(userDir, filePath);

                if (!fs.existsSync(userDir)) {
                    fs.mkdirSync(userDir, { recursive: true });
                }

                if (!fs.existsSync(categoryDir)) {
                    fs.mkdirSync(categoryDir, { recursive: true });
                }

                // Move file from temp to final location
                const tempFilePath = req.file.path;
                const finalFilePath = path.join(categoryDir, req.file.filename);
                
                fs.renameSync(tempFilePath, finalFilePath);

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