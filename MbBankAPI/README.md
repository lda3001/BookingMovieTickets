# Node.js Backend with MySQL

This is a Node.js backend application with MySQL database integration.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file in the root directory with the following variables:
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database_name
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

- GET `/`: Welcome message
- GET `/api/items`: Get all items from database

## Database Setup

1. Make sure MySQL is installed and running on your system
2. Create a new database using the name specified in your .env file
3. The application will automatically connect to the database when started

## Development

- The server runs on port 3000 by default
- Uses nodemon for automatic server restart during development
- CORS is enabled for cross-origin requests
- Uses connection pooling for better database performance 