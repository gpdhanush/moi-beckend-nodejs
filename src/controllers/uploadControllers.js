const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const logger = require("../config/logger");

// Support both environments: local ('./uploads') and production ('./../gp.prasowlabs.in/uploads')
const uploadDir = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.resolve("./../gp.prasowlabs.in/uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Temporary directory for initial upload
const tempDir = path.join(uploadDir, "temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save to temp directory first, then move after validation
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `file-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("file");

exports.controller = {
  saveFiles: async (req, res) => {
    try {
      upload(req, res, async (err) => {
        if (err) {
          // Handle multer errors with better messages
          if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
              return res.status(400).json({
                responseType: "F",
                responseValue: {
                  message: "கோப்பு அளவு மிகப் பெரியது! அதிகபட்ச அளவு 5MB.",
                },
              });
            }
            if (err.code === "LIMIT_UNEXPECTED_FILE") {
              return res.status(400).json({
                responseType: "F",
                responseValue: {
                  message:
                    'எதிர்பாராத புலம். கோப்பு பதிவேற்றத்திற்கு "file" என்ற புலப் பெயரைப் பயன்படுத்தவும்.',
                },
              });
            }
          }
          // Handle "Unexpected field" error
          if (err.message && err.message.includes("Unexpected field")) {
            return res.status(400).json({
              responseType: "F",
              responseValue: {
                message:
                  'எதிர்பாராத புலம். form-data இல் கோப்பு பதிவேற்றத்திற்கு "file" என்ற புலப் பெயரைப் பயன்படுத்தவும்.',
              },
            });
          }
          return res
            .status(400)
            .json({
              responseType: "F",
              responseValue: { message: err.message },
            });
        }

        if (!req.file) {
          return res
            .status(400)
            .json({
              responseType: "F",
              responseValue: { message: "கோப்பு பதிவேற்றப்படவில்லை!" },
            });
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
          return res
            .status(400)
            .json({
              responseType: "F",
              responseValue: { message: "பயனர் ஐடி தேவையானது!" },
            });
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
          return res
            .status(400)
            .json({
              responseType: "F",
              responseValue: { message: "பாதை தேவையானது!" },
            });
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

        logger.info("Upload Debug:", {
          tempFilePath,
          finalFilePath,
          fileExists: fs.existsSync(tempFilePath),
          userId,
          filePath,
          filename: req.file.filename,
        });

        // Verify temp file exists before moving
        if (!fs.existsSync(tempFilePath)) {
          logger.error("Temp file not found:", tempFilePath);
          return res.status(500).json({
            responseType: "F",
            responseValue: { message: "விவரங்கள் எதுவும் கிடைக்கவில்லை." },
          });
        }

        try {
          // Move the file
          fs.renameSync(tempFilePath, finalFilePath);

          // Verify file was moved successfully
          if (!fs.existsSync(finalFilePath)) {
            logger.error("File not found after move:", finalFilePath);
            return res.status(500).json({
              responseType: "F",
              responseValue: {
                message: "கோப்பு வெற்றிகரமாக சேமிக்கப்படவில்லை!",
              },
            });
          }

          // Use forward slashes for the response path (URL-friendly)
          const fullFilePath = `uploads/${userId}/${filePath}/${req.file.filename}`;
          logger.info("File saved successfully:", fullFilePath);
          return res
            .status(200)
            .json({ responseType: "S", responseValue: fullFilePath });
        } catch (moveError) {
          logger.error("Error moving file:", moveError);
          // If move fails, try to clean up temp file
          try {
            if (fs.existsSync(tempFilePath)) {
              fs.unlinkSync(tempFilePath);
            }
          } catch (cleanupError) {
            logger.error("Error cleaning up temp file:", cleanupError);
          }

          return res.status(500).json({
            responseType: "F",
            responseValue: {
              message: `கோப்பை சேமிக்க முடியவில்லை: ${moveError.message}`,
            },
          });
        }
      });
    } catch (error) {
      return res
        .status(500)
        .json({
          responseType: "F",
          responseValue: { message: error.toString() },
        });
    }
  },

  deleteImage: async (req, res) => {
    try {
      const { userId, path: filePath, filename } = req.body;

      if (!userId || !filePath || !filename) {
        return res.status(400).json({
          responseType: "F",
          responseValue: {
            message: "பயனர் ஐடி, பாதை மற்றும் கோப்பு பெயர் தேவையானவை!",
          },
        });
      }

      const fullFilePath = path.join(uploadDir, userId, filePath, filename);

      // Check if file exists
      if (!fs.existsSync(fullFilePath)) {
        return res.status(404).json({
          responseType: "F",
          responseValue: { message: "No details found." },
        });
      }

      // Delete the file
      fs.unlinkSync(fullFilePath);

      return res.status(200).json({
        responseType: "S",
        responseValue: { message: "கோப்பு வெற்றிகரமாக நீக்கப்பட்டது!" },
      });
    } catch (error) {
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() },
      });
    }
  },

  getFile: async (req, res) => {
    try {
      const { userId, path: filePath, filename } = req.query;

      if (!userId || !filePath || !filename) {
        return res.status(400).json({
          responseType: "F",
          responseValue: {
            message: "பயனர் ஐடி, பாதை மற்றும் கோப்பு பெயர் தேவையானவை!",
          },
        });
      }

      const fullFilePath = path.join(uploadDir, userId, filePath, filename);

      // Prevent directory traversal attacks
      if (!fullFilePath.startsWith(uploadDir)) {
        return res.status(403).json({
          responseType: "F",
          responseValue: { message: "Invalid file path." },
        });
      }

      // Check if file exists
      if (!fs.existsSync(fullFilePath)) {
        return res.status(404).json({
          responseType: "F",
          responseValue: { message: "فائل نہیں ملی." },
        });
      }

      // Get file stats for content length
      const stats = fs.statSync(fullFilePath);

      // Send file with appropriate headers
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader("Content-Length", stats.size);
      res.setHeader("Cache-Control", "public, max-age=3600");

      const fileStream = fs.createReadStream(fullFilePath);
      fileStream.pipe(res);

      fileStream.on("error", (err) => {
        logger.error("Error streaming file:", err);
        if (!res.headersSent) {
          res.status(500).json({
            responseType: "F",
            responseValue: { message: "கோப்பு வழங்க முடியவில்லை!" },
          });
        }
      });
    } catch (error) {
      logger.error("Error retrieving file:", error);
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() },
      });
    }
  },
};
