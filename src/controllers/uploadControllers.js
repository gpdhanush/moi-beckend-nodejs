const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const uploadDir = './gp.prasowlabs.in/apis/uploads';

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
                    // Handle multer errors with better messages
                    if (err instanceof multer.MulterError) {
                        if (err.code === 'LIMIT_FILE_SIZE') {
                            return res.status(400).json({ 
                                responseType: "F", 
                                responseValue: { message: 'File size too large! Maximum size is 5MB.' } 
                            });
                        }
                        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                            return res.status(400).json({ 
                                responseType: "F", 
                                responseValue: { message: 'Unexpected field. Please use field name "file" for the file upload.' } 
                            });
                        }
                    }
                    // Handle "Unexpected field" error
                    if (err.message && err.message.includes('Unexpected field')) {
                        return res.status(400).json({ 
                            responseType: "F", 
                            responseValue: { message: 'Unexpected field. Please use field name "file" for the file upload in form-data.' } 
                        });
                    }
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
                
                console.log('Upload Debug:', {
                    tempFilePath,
                    finalFilePath,
                    fileExists: fs.existsSync(tempFilePath),
                    userId,
                    filePath,
                    filename: req.file.filename
                });
                
                // Verify temp file exists before moving
                if (!fs.existsSync(tempFilePath)) {
                    console.error('Temp file not found:', tempFilePath);
                    return res.status(500).json({ 
                        responseType: "F", 
                        responseValue: { message: 'Temporary file not found after upload!' } 
                    });
                }

                try {
                    // Move the file
                    fs.renameSync(tempFilePath, finalFilePath);
                    
                    // Verify file was moved successfully
                    if (!fs.existsSync(finalFilePath)) {
                        console.error('File not found after move:', finalFilePath);
                        return res.status(500).json({ 
                            responseType: "F", 
                            responseValue: { message: 'File was not saved successfully!' } 
                        });
                    }

                    // Use forward slashes for the response path (URL-friendly)
                    const fullFilePath = `gp.prasowlabs.in/apis/uploads/${userId}/${filePath}/${req.file.filename}`;
                    console.log('File saved successfully:', fullFilePath);
                    return res.status(200).json({ responseType: "S", responseValue: fullFilePath });
                } catch (moveError) {
                    console.error('Error moving file:', moveError);
                    // If move fails, try to clean up temp file
                    try {
                        if (fs.existsSync(tempFilePath)) {
                            fs.unlinkSync(tempFilePath);
                        }
                    } catch (cleanupError) {
                        console.error('Error cleaning up temp file:', cleanupError);
                    }
                    
                    return res.status(500).json({ 
                        responseType: "F", 
                        responseValue: { message: `Failed to save file: ${moveError.message}` } 
                    });
                }
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