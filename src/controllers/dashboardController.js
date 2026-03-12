const db = require('../config/database');
const logger = require('../config/logger');

exports.controller = {
    /**
     * Get dashboard statistics and counts
     * Returns various metrics for admin dashboard
     */
    getDashboard: async (req, res) => {
        try {
            // Execute all count queries in parallel
            const [
                usersResult,
                personsResult,
                transactionFunctionsResult,
                transactionsResult,
                investTransactionsResult,
                returnTransactionsResult,
                notificationsResult,
                feedbacksResult,
                defaultFunctionsResult,
                upcomingFunctionsResult,
                userDevicesResult
            ] = await Promise.all([
                // Total users
                db.query('SELECT COUNT(*) as count FROM users WHERE is_deleted = 0 OR is_deleted IS NULL'),
                
                // Total persons
                db.query('SELECT COUNT(*) as count FROM persons'),
                
                // Total transaction functions
                db.query('SELECT COUNT(*) as count FROM transaction_functions'),
                
                // Total transactions
                db.query('SELECT COUNT(*) as count FROM transactions WHERE is_deleted = 0 OR is_deleted IS NULL'),
                
                // Total invest transactions
                db.query(`SELECT COUNT(*) as count FROM transactions 
                         WHERE type = 'invest' AND (is_deleted = 0 OR is_deleted IS NULL)`),
                
                // Total return transactions
                db.query(`SELECT COUNT(*) as count FROM transactions 
                         WHERE type = 'return' AND (is_deleted = 0 OR is_deleted IS NULL)`),
                
                // Notification counts (total, read, unread)
                db.query(`SELECT 
                            COUNT(*) as total,
                            SUM(CASE WHEN is_read = 1 THEN 1 ELSE 0 END) as read_count,
                            SUM(CASE WHEN is_read = 0 THEN 1 ELSE 0 END) as unread_count
                         FROM notifications 
                         WHERE is_deleted = 0 OR is_deleted IS NULL`),
                
                // Total feedbacks
                db.query('SELECT COUNT(*) as count FROM feedbacks WHERE is_deleted = 0 OR is_deleted IS NULL'),
                
                // Total default functions
                db.query('SELECT COUNT(*) as count FROM default_functions'),
                
                // Total upcoming functions
                db.query('SELECT COUNT(*) as count FROM upcoming_functions'),
                
                // Total user devices
                db.query('SELECT COUNT(*) as count FROM user_devices WHERE is_deleted = 0 OR is_deleted IS NULL')
            ]);

            // Parse results - Simple format with title and count only
            const dashboard = [
                {
                    title: "Total Users",
                    count: usersResult[0][0]?.count || 0
                },
                {
                    title: "Total Persons",
                    count: personsResult[0][0]?.count || 0
                },
                {
                    title: "Total Transaction Functions",
                    count: transactionFunctionsResult[0][0]?.count || 0
                },
                {
                    title: "Total Transactions",
                    count: transactionsResult[0][0]?.count || 0
                },
                {
                    title: "Total Invest Transactions",
                    count: investTransactionsResult[0][0]?.count || 0
                },
                {
                    title: "Total Return Transactions",
                    count: returnTransactionsResult[0][0]?.count || 0
                },
                {
                    title: "Total Notifications",
                    count: notificationsResult[0][0]?.total || 0
                },
                {
                    title: "Read Notifications",
                    count: notificationsResult[0][0]?.read_count || 0
                },
                {
                    title: "Unread Notifications",
                    count: notificationsResult[0][0]?.unread_count || 0
                },
                {
                    title: "Total Feedbacks",
                    count: feedbacksResult[0][0]?.count || 0
                },
                {
                    title: "Total Default Functions",
                    count: defaultFunctionsResult[0][0]?.count || 0
                },
                {
                    title: "Total Upcoming Functions",
                    count: upcomingFunctionsResult[0][0]?.count || 0
                },
                {
                    title: "Total User Devices",
                    count: userDevicesResult[0][0]?.count || 0
                }
            ];

            logger.info('Dashboard statistics retrieved successfully');
            
            return res.status(200).json({
                responseType: "S",
                responseValue: dashboard
            });
        } catch (error) {
            logger.error('Error fetching dashboard statistics:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Get detailed dashboard with additional metrics
     */
    getDashboardDetailed: async (req, res) => {
        try {
            // Execute all queries in parallel
            const [
                usersResult,
                personsResult,
                transactionFunctionsResult,
                transactionsResult,
                investTransactionsResult,
                returnTransactionsResult,
                notificationsResult,
                feedbacksResult,
                defaultFunctionsResult,
                upcomingFunctionsResult,
                userDevicesResult,
                activeDevicesResult,
                recentUsersResult,
                recentTransactionsResult
            ] = await Promise.all([
                // Total users
                db.query('SELECT COUNT(*) as count FROM users WHERE is_deleted = 0 OR is_deleted IS NULL'),
                
                // Total persons
                db.query('SELECT COUNT(*) as count FROM persons'),
                
                // Total transaction functions
                db.query('SELECT COUNT(*) as count FROM transaction_functions'),
                
                // Total transactions
                db.query('SELECT COUNT(*) as count FROM transactions WHERE is_deleted = 0 OR is_deleted IS NULL'),
                
                // Total invest transactions (with amount)
                db.query(`SELECT COUNT(*) as count, SUM(amount) as total_amount 
                         FROM transactions 
                         WHERE type = 'invest' AND (is_deleted = 0 OR is_deleted IS NULL)`),
                
                // Total return transactions (with amount)
                db.query(`SELECT COUNT(*) as count, SUM(amount) as total_amount 
                         FROM transactions 
                         WHERE type = 'return' AND (is_deleted = 0 OR is_deleted IS NULL)`),
                
                // Notification counts (total, read, unread)
                db.query(`SELECT 
                            COUNT(*) as total,
                            SUM(CASE WHEN is_read = 1 THEN 1 ELSE 0 END) as read_count,
                            SUM(CASE WHEN is_read = 0 THEN 1 ELSE 0 END) as unread_count
                         FROM notifications 
                         WHERE is_deleted = 0 OR is_deleted IS NULL`),
                
                // Total feedbacks
                db.query('SELECT COUNT(*) as count FROM feedbacks WHERE is_deleted = 0 OR is_deleted IS NULL'),
                
                // Total default functions
                db.query('SELECT COUNT(*) as count FROM default_functions'),
                
                // Total upcoming functions
                db.query('SELECT COUNT(*) as count FROM upcoming_functions'),
                
                // Total user devices
                db.query('SELECT COUNT(*) as count FROM user_devices WHERE is_deleted = 0 OR is_deleted IS NULL'),
                
                // Active user devices (last 24 hours)
                db.query(`SELECT COUNT(*) as count FROM user_devices 
                         WHERE is_active = 1 AND last_used_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)`),
                
                // Recent users (last 7 days)
                db.query(`SELECT COUNT(*) as count FROM users 
                         WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`),
                
                // Recent transactions (last 7 days)
                db.query(`SELECT COUNT(*) as count, SUM(amount) as total_amount 
                         FROM transactions 
                         WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`)
            ]);

            // Parse results
            const dashboard = [
                {
                    title: "Total Users",
                    count: usersResult[0][0]?.count || 0,
                    recent_7days: recentUsersResult[0][0]?.count || 0
                },
                {
                    title: "Total Persons",
                    count: personsResult[0][0]?.count || 0
                },
                {
                    title: "Total Transaction Functions",
                    count: transactionFunctionsResult[0][0]?.count || 0
                },
                {
                    title: "Total Transactions",
                    count: transactionsResult[0][0]?.count || 0,
                    recent_7days: {
                        count: recentTransactionsResult[0][0]?.count || 0,
                        total_amount: recentTransactionsResult[0][0]?.total_amount || 0
                    }
                },
                {
                    title: "Total Invest Transactions",
                    count: investTransactionsResult[0][0]?.count || 0,
                    total_amount: investTransactionsResult[0][0]?.total_amount || 0
                },
                {
                    title: "Total Return Transactions",
                    count: returnTransactionsResult[0][0]?.count || 0,
                    total_amount: returnTransactionsResult[0][0]?.total_amount || 0
                },
                {
                    title: "Total Notifications",
                    count: notificationsResult[0][0]?.total || 0,
                    read: notificationsResult[0][0]?.read_count || 0,
                    unread: notificationsResult[0][0]?.unread_count || 0
                },
                {
                    title: "Total Feedbacks",
                    count: feedbacksResult[0][0]?.count || 0
                },
                {
                    title: "Total Default Functions",
                    count: defaultFunctionsResult[0][0]?.count || 0
                },
                {
                    title: "Total Upcoming Functions",
                    count: upcomingFunctionsResult[0][0]?.count || 0
                },
                {
                    title: "Total User Devices",
                    count: userDevicesResult[0][0]?.count || 0,
                    active_24h: activeDevicesResult[0][0]?.count || 0
                }
            ];

            logger.info('Detailed dashboard statistics retrieved successfully');
            
            return res.status(200).json({
                responseType: "S",
                responseValue: dashboard
            });
        } catch (error) {
            logger.error('Error fetching detailed dashboard statistics:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    }
};
