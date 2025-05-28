const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/search', (req, res) => {
    const { city } = req.body;
    if (!city) {
        return res.status(400).json({ error: 'City name is required' });
    }

    const query = 'INSERT INTO search_history (city) VALUES (?)';
    db.query(query, [city], (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Database Error');
        }
        res.send('Search saved');
    });
});

app.get('/history', (req, res) => {
    const query = 'SELECT * FROM search_history ORDER BY searched_at DESC LIMIT 10';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Database Error');
        }
        res.json(results);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
