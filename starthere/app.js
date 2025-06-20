var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

let db;

(async () => {
  try {
    /* / Connect to MySQL without specifying a database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '', // Set your MySQL root password
      database: 'DogWalkService'
    });
    */

    // Create the database if it doesn't exist
    // await connection.query('CREATE DATABASE IF NOT EXISTS testdb');
    // await connection.end();

    // Now connect to the created database
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'DogWalkService'
    });

    /* / Create a table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        author VARCHAR(255)
      )
    `);
    */
    /* / Insert data if table is empty
    const [rows] = await db.execute('SELECT COUNT(*) AS count FROM books');
    if (rows[0].count === 0) {
      await db.execute(`
        INSERT INTO books (title, author) VALUES
        ('1984', 'George Orwell'),
        ('To Kill a Mockingbird', 'Harper Lee'),
        ('Brave New World', 'Aldous Huxley')
      `);
    }
      */
  } catch (err) {
    console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
  }
})();



app.get('/api/dogs', async (req, res) => {
  try {
    const [dogs] = await db.execute(`SELECT Dogs.name AS dog_name, Dogs.size, Users.username AS owner_username
                                    FROM Dogs
                                    JOIN Users ON Dogs.owner_id = Users.user_id;`);
    res.json(dogs);
  } catch (err) {
    res.status(500).json({ err: 'failed to fetch Dogs' });
  }
});

app.get('/api/walkrequests/open', async (req, res) => {
  try {
    const [walkrequests] = await db.execute(`SELECT r.request_id, d.name AS dog_name, r.requested_time, r.duration_minutes, r.location, u.username AS owner_username
                                    FROM WalkRequests AS r
                                    JOIN Dogs AS d ON r.dog_id = d.dog_id
                                    JOIN Users AS u ON d.owner_id = u.user_id
                                    WHERE r.status = 'open';`);
    res.json(walkrequests);
  } catch (err) {
    res.status(500).json({ err: 'failed to fetch walkrequests' });
  }
});

app.get('/api/walkers/summary', async (req, res) => {
  try {
    const [summary] = await db.execute(`SELECT u.username AS walker_username,
                                      (SELECT COUNT(*) FROM WalkRatings r WHERE r.walker_id = u.user_id) AS total_ratings,
                                      (SELECT AVG(rating) FROM WalkRatings r WHERE r.walker_id = u.user_id) AS average_rating,
                                      (SELECT COUNT(*) FROM WalkApplications AS wa
                                      JOIN WalkRequests AS wr ON wa.request_id = wr.request_id
                                      WHERE wa.walker_id = u.user_id AND wr.status = 'completed') AS completed_walks
                                      FROM Users AS u
                                      WHERE u.role = 'walker';`);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ err: 'failed to fetch summary' });
  }
});


app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
