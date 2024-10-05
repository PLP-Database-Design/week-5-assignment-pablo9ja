const express = require('express')

const app = express()

const mysql = require('mysql2');

const dotenv = require('dotenv');

const cors = require('cors');



dotenv.config();


const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


// Connect to the MySQL database
db.connect((err) => {
  if (err) return console.log('Error connecting to MySQL as id:');
      
  console.log('Connected to MySQL with thread ID:', db.threadId);
});
 
// Set up the server to listen on the specified port
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);

  // Default route for testing
  console.log('send a message to the browser');
  app.get('/', (req, res) => {
      res.send('Server started successfully');
  });
});

app.set('view engine', 'ejs');

app.set('views', __dirname + '/views');

app.get('/data', (req, res) => {
  // Define the SQL query to fetch data
  const sqlQuery = 'SELECT * FROM patients'; // Replace 'patients' with your table name
  
  // Execute the SQL query
  db.query(sqlQuery, (err, result) => {
    if (err) {
      return res.status(500).send('Error fetching data from database.');
    }

    // Render the data.ejs view and pass the result from the database
    res.render('data', {result: result });
  });
});
