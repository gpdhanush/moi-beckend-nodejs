const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * Logs Model
 * Reads and processes application logs
 */
const Model = {
    /**
     * Get all log files available
     * @returns {Promise<Array>} - List of log files
     */
    async getLogFiles() {
        try {
            const logsDir = path.join(process.cwd(), 'logs');
            if (!fs.existsSync(logsDir)) {
                return [];
            }
            
            const files = fs.readdirSync(logsDir);
            const logFiles = files.filter(f => f.endsWith('.log')).map(f => ({
                name: f,
                path: path.join(logsDir, f),
                size: fs.statSync(path.join(logsDir, f)).size
            }));
            
            return logFiles;
        } catch (error) {
            throw new Error(`Failed to get log files: ${error.message}`);
        }
    },

    /**
     * Read log file with pagination (tail of file)
     * @param {string} filename - Name of log file (e.g., 'combined.log')
     * @param {Object} options - Options {lines: 100, grep: ''}
     * @returns {Promise<Array>} - Array of log lines
     */
    async readLogFile(filename, options = {}) {
        try {
            const { lines = 100, grep = '' } = options;
            const logsDir = path.join(process.cwd(), 'logs');
            const filePath = path.join(logsDir, filename);
            
            // Security: prevent path traversal
            if (!filePath.startsWith(logsDir)) {
                throw new Error('Invalid file path');
            }
            
            if (!fs.existsSync(filePath)) {
                return { error: 'Log file not found', logs: [] };
            }
            
            const content = fs.readFileSync(filePath, 'utf-8');
            const fileLines = content.split('\n').filter(l => l.trim());
            
            // Get last N lines
            let selectedLines = fileLines.slice(-lines);
            
            // Apply grep filter if provided
            if (grep && grep.trim()) {
                selectedLines = selectedLines.filter(line => 
                    line.toLowerCase().includes(grep.toLowerCase())
                );
            }
            
            // Parse log lines to extract metadata
            const parsedLogs = selectedLines.map(line => {
                // Example format: "2025-02-22 10:30:45 [INFO] message metadata"
                const match = line.match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) \[(\w+)\] (.*)$/);
                if (match) {
                    return {
                        timestamp: match[1],
                        level: match[2],
                        message: match[3]
                    };
                }
                return {
                    timestamp: null,
                    level: 'UNKNOWN',
                    message: line
                };
            });
            
            return {
                file: filename,
                totalLines: fileLines.length,
                displayedLines: parsedLogs.length,
                logs: parsedLogs.reverse() // Most recent first
            };
        } catch (error) {
            throw new Error(`Failed to read log file: ${error.message}`);
        }
    },

    /**
     * Get log statistics
     * @returns {Promise<Object>} - Log statistics
     */
    async getLogStatistics() {
        try {
            const logFiles = await this.getLogFiles();
            const stats = {
                totalFiles: logFiles.length,
                files: [],
                totalSize: 0
            };
            
            for (const file of logFiles) {
                const content = fs.readFileSync(file.path, 'utf-8');
                const lines = content.split('\n').filter(l => l.trim()).length;
                
                // Count by level
                const errorCount = (content.match(/\[ERROR\]/g) || []).length;
                const warnCount = (content.match(/\[WARN\]/g) || []).length;
                const infoCount = (content.match(/\[INFO\]/g) || []).length;
                
                stats.files.push({
                    name: file.name,
                    size: file.size,
                    sizeInMB: (file.size / (1024 * 1024)).toFixed(2),
                    lines,
                    errorCount,
                    warnCount,
                    infoCount
                });
                
                stats.totalSize += file.size;
            }
            
            stats.totalSizeInMB = (stats.totalSize / (1024 * 1024)).toFixed(2);
            
            return stats;
        } catch (error) {
            throw new Error(`Failed to get log statistics: ${error.message}`);
        }
    },

    /**
     * Get recent errors from log files
     * @param {Object} options - Options {limit: 20, hours: 24}
     * @returns {Promise<Array>} - Array of recent errors
     */
    async getRecentErrors(options = {}) {
        try {
            const { limit = 20, hours = 24 } = options;
            const logsDir = path.join(process.cwd(), 'logs');
            
            if (!fs.existsSync(logsDir)) {
                return [];
            }
            
            const errorLogPath = path.join(logsDir, 'error.log');
            if (!fs.existsSync(errorLogPath)) {
                return [];
            }
            
            const content = fs.readFileSync(errorLogPath, 'utf-8');
            const allLines = content.split('\n').filter(l => l.trim());
            
            const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
            const recentLines = [];
            
            for (const line of allLines) {
                const match = line.match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/);
                if (match) {
                    const logTime = new Date(match[1]);
                    if (logTime >= cutoffTime) {
                        recentLines.push({
                            timestamp: match[1],
                            message: line.substring(match[0].length + 1)
                        });
                    }
                }
            }
            
            return recentLines.slice(-limit).reverse();
        } catch (error) {
            throw new Error(`Failed to get recent errors: ${error.message}`);
        }
    },

    /**
     * Clear logs (for admin)
     * @param {string} filename - Log file to clear
     * @returns {Promise<boolean>}
     */
    async clearLog(filename) {
        try {
            const logsDir = path.join(process.cwd(), 'logs');
            const filePath = path.join(logsDir, filename);
            
            // Security: prevent path traversal
            if (!filePath.startsWith(logsDir)) {
                throw new Error('Invalid file path');
            }
            
            if (fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, '');
                return true;
            }
            
            return false;
        } catch (error) {
            throw new Error(`Failed to clear log: ${error.message}`);
        }
    }
};

module.exports = Model;
