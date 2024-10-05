const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const cors = require('cors');

// Initialize app and middlewares
const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

// MySQL connection configuration
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to MySQL database
db.connect((err) => {
    if (err) {
        console.log('Error connecting to MySQL:');
        return;
    }
    console.log('Connected to MySQL with thread ID:', db.threadId);

    // Start server after DB connection is successful
    app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`);

        // Default route
        app.get('/', (req, res) => {
            res.send('Server started successfully');
        });
    });
});

// Catch unhandled promise rejections or errors
process.on('unhandledRejection', (error) => {
    console.error('Unhandled rejection:', error.message);
});
