const express = require('express')

const app = express()

const mysql = require('mysql2');

const dotenv = require('dotenv');

const cors = require('cors');


dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Question 1 goes here : Retrieve all patients
app.get('/patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query failed' });
    } else {
      res.json(results);
    }
  });
});

// Question 2 goes here: Retrieve all providers

app.get('/providers', (req, res) => {
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query failed' });
    } else {
      res.json(results);
    }
  });
});

// Question 3 goes here
// 3. Filter patients by first name
app.get('/patients/search', (req, res) => {
  const { first_name } = req.query;
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  db.query(query, [first_name], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query failed' });
    } else {
      res.json(results);
    }
  });
});


// Question 4 goes here

// 4. Retrieve all providers by specialty
app.get('/providers/search', (req, res) => {
  const { specialty } = req.query;
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
  db.query(query, [specialty], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query failed' });
    } else {
      res.json(results);
    }
  });
});


// Connect to the MySQL database
db.connect((err) => {
  if (err) {
    console.log('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL with thread ID:', db.threadId);
});

// Default route for testing
app.get('/', (req, res) => {
  res.send('Server started successfully');
});


// Route to render the EJS view for patient and provider data

app.set('view engine', 'ejs');

app.set('views', __dirname + '/views');

app.get('/data', (req, res) => {
  const patientQuery = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  const providerQuery = 'SELECT first_name, last_name, provider_specialty FROM providers';

  db.query(patientQuery, (err, patientResults) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve patients' });
    }
    db.query(providerQuery, (err, providerResults) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to retrieve providers' });
      }
      // Render the data.ejs template and pass the retrieved data
      res.render('data', { patients: patientResults, providers: providerResults });
    });
  });
});



// Set up the server to listen on the specified port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
