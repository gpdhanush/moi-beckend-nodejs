const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cron = require("node-cron");
const path = require("path");
require("dotenv").config();

const routes = require("./src/routes");
const healthRoutes = require("./src/routes/health");
const logger = require("./src/config/logger");
const {
  checkAndNotifyPasswordExpiration,
} = require("./src/services/passwordExpirationService");

const app = express();

/* =========================
   GLOBAL ERROR SAFETY
========================= */
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
});

/* =========================
   MIDDLEWARE
========================= */

// Secure headers
app.use(helmet());

// CORS (customizable via .env)
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : "*",
    credentials: true,
  }),
);

// Request logging
app.use(morgan("dev"));

// Body parsing
// Increase payload size for bulk endpoints (default is 100kb)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* =========================
   STATIC UPLOAD DIRECTORY
========================= */

const uploadPath = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(__dirname, "uploads");

app.use("/uploads", express.static(uploadPath));

/* =========================
   ROUTES
========================= */

// Health route (no auth)
app.use("/health", healthRoutes);

// API routes
app.use("/apis", routes);

/* =========================
   SERVER START
========================= */

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, "0.0.0.0", () => {
  logger.info(`Server running on port ${PORT}`);
});

/* =========================
   CRON JOB (Daily 9 AM IST)
========================= */

let isDailyCronRunning = false;

cron.schedule(
  "0 9 * * *",
  async () => {
    if (isDailyCronRunning) {
      logger.warn("Daily cron already running, skipping.");
      return;
    }

    isDailyCronRunning = true;

    try {
      logger.info("Running scheduled daily jobs...");
      await checkAndNotifyPasswordExpiration();
      // upcoming functions reminder removed
      logger.info("Daily cron jobs completed successfully.");
    } catch (err) {
      logger.error("Error in daily cron:", err);
    } finally {
      isDailyCronRunning = false;
    }
  },
  {
    timezone: "Asia/Kolkata",
  },
);

logger.info("Daily cron scheduled at 9:00 AM (Asia/Kolkata)");

/* =========================
   GLOBAL ERROR HANDLER
========================= */

// JSON parse error handler
app.use((err, req, res, next) => {
  // body-parser will set err.type === 'entity.too.large' when payload exceeds limit
  if (err.type === 'entity.too.large') {
    logger.warn('Payload too large:', {
      size: req.headers['content-length'],
      path: req.path,
      method: req.method,
    });
    return res.status(413).json({
      responseType: 'F',
      responseValue: { message: 'Request payload too large.' }
    });
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    logger.error('JSON Parse Error:', {
      message: err.message,
      body: err.body,
      path: req.path,
      method: req.method,
    });
    return res.status(400).json({
      responseType: 'F',
      responseValue: { message: `Invalid JSON: ${err.message}` }
    });
  }
  next(err);
});

// General error handler
app.use((err, req, res, next) => {
  logger.error("Unhandled error", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    query: req.query,
    body: req.body && Object.keys(req.body).length ? "[present]" : undefined,
  });

  res.status(500).json({
    // keep response structure consistent with other endpoints
    responseType: 'F',
    responseValue: { message: "Something went wrong!" }
  });
});

/* =========================
   GRACEFUL SHUTDOWN
========================= */

process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    logger.info("Server closed.");
    process.exit(0);
  });
});

module.exports = app;
