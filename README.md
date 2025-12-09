# Moi Backend Node.js API

A Node.js/Express backend API for the Moi Credit/Debit management system.

## Prerequisites

- **Node.js** (v14 or higher recommended)
- **MySQL** (MariaDB 10.11+ or MySQL 8.0+)
- **npm** or **yarn**

## Installation

1. **Clone/Navigate to the project directory:**
   ```bash
   cd moi-beckend-nodejs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up the database:**
   - Create a MySQL database named `prasowla_moi_master`
   - Import the database backup:
     ```bash
     mysql -u root -p prasowla_moi_master < "db backup/prasowla_moi_master_28_11_2025.sql"
     ```
   - Run migrations (if any):
     ```bash
     mysql -u root -p prasowla_moi_master < migrations/add_firstname_secondname_city_to_credit_debit.sql
     ```

4. **Configure environment variables:**
   - Create a `.env` file in the root directory (or use the existing `env_copy.txt` as reference)
   - Update database credentials in `src/config/database.js` or use environment variables:
     ```env
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=prasowla_moi_master
     JWT_SECRET=mysonnameisrenzo
     API_SECRET_KEY=your_secure_api_key_here
     PORT=3000
     ```
   
   **Important:** Set a strong, random `API_SECRET_KEY` to protect your registration endpoint. This key must be included in the `X-API-Key` header for registration requests.

## Running the Project

### Development Mode (with auto-reload):

```bash
npx nodemon app.js
```

or

```bash
node app.js
```

The server will start on `http://localhost:3000`

### Production Mode:

```bash
node app.js
```

## API Endpoints

Base URL: `http://localhost:3000/apis`

### Main Endpoints:
- `/apis/user/*` - User management
- `/apis/moi-persons/*` - Person management
- `/apis/moi-credit-debit/*` - Credit/Debit transactions
- `/apis/moi-functions/*` - Function management
- `/apis/moi-default-functions/*` - Default functions
- `/apis/notifications/*` - Notifications
- `/apis/uploads/*` - File uploads

See `POSTMAN_API_DOCUMENTATION.md` for detailed API documentation.

### Security

**Registration Endpoint Protection:**
- The `/apis/user/create` endpoint requires an `X-API-Key` header with a valid API secret key
- Rate limiting: Maximum 5 registration attempts per IP address per 15 minutes
- Set `API_SECRET_KEY` in your `.env` file and include it in the `X-API-Key` header for registration requests

## Database Configuration

The database configuration is in `src/config/database.js`. Currently configured for:
- Host: `localhost`
- User: `root`
- Password: `` (empty)
- Database: `prasowla_moi_master`

**To use environment variables**, uncomment the lines in `database.js` and create a `.env` file.

## Scheduled Tasks

The application runs two scheduled tasks daily at 9:00 AM:
1. **Password Expiration Check** - Checks and notifies users about password expiration
2. **Function Reminder** - Sends reminders for upcoming functions (1 day before)

## Project Structure

```
moi-beckend-nodejs/
├── app.js                 # Main application entry point
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── models/           # Database models/queries
│   ├── routes/           # API routes
│   ├── middlewares/      # Custom middlewares (auth, etc.)
│   └── services/         # Background services
├── migrations/           # Database migration scripts
├── db backup/           # Database backup files
└── package.json         # Dependencies
```

## Troubleshooting

1. **Database Connection Error:**
   - Check MySQL is running: `mysql -u root -p`
   - Verify database exists: `SHOW DATABASES;`
   - Update credentials in `src/config/database.js`

2. **Port Already in Use:**
   - Change PORT in `.env` or `app.js`
   - Kill process using port 3000: `lsof -ti:3000 | xargs kill`

3. **Module Not Found:**
   - Run `npm install` again
   - Check `node_modules` folder exists

## Dependencies

Key dependencies:
- `express` - Web framework
- `mysql2` - MySQL database driver
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `moment` - Date manipulation
- `nodemailer` - Email sending
- `multer` - File uploads
- `firebase-admin` - Firebase integration

## License

ISC

## Author

gpdhanush
