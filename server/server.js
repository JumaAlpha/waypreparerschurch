const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3000;
const purchaseRoutes = require('../routes/purchaseRoutes');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parses incoming form data

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir); // Create the "uploads" directory if it doesn't exist
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Rename the file to ensure uniqueness
    }
});
const upload = multer({ storage });

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Your MySQL password
    database: 'waychurch'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Routes

// Get all articles
app.get('/articles', (req, res) => {
    const query = 'SELECT * FROM articles';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
        } else {
            res.json(results);
        }
    });
});

// Get article preview (title, author, description)
app.get('/articles/preview/:id', (req, res) => {
    const articleId = req.params.id;
    const query = 'SELECT title, author, description FROM articles WHERE id = ?';

    db.query(query, [articleId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
        } else if (result.length === 0) {
            res.status(404).send('Article not found');
        } else {
            res.json(result[0]);
        }
    });
});

// Purchase an article
app.post('/articles/purchase', (req, res) => {
    const { articleId } = req.body;
    const query = 'UPDATE articles SET is_purchased = true WHERE id = ?';

    db.query(query, [articleId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
        } else if (result.affectedRows === 0) {
            res.status(404).send('Article not found');
        } else {
            res.status(200).send('Article purchased successfully');
        }
    });
});

// Serve article PDF for download
app.get('/articles/download/:id', (req, res) => {
    const articleId = req.params.id;
    const query = 'SELECT file_path FROM articles WHERE id = ?';

    db.query(query, [articleId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
        } else if (result.length === 0) {
            res.status(404).send('Article not found');
        } else {
            const filePath = result[0].file_path;
            const fullFilePath = path.resolve(filePath); // Resolve the full path to the file

            fs.access(fullFilePath, fs.constants.F_OK, (err) => {
                if (err) {
                    res.status(404).send('File not found');
                } else {
                    res.download(fullFilePath, (err) => {
                        if (err) {
                            console.error('Error downloading file:', err);
                            res.status(500).send('Server error');
                        }
                    });
                }
            });
        }
    });
});

// Create a new article
app.post('/articles', upload.single('file'), (req, res) => {
    const { title, author, price, description, is_free } = req.body;
    const filePath = req.file ? req.file.path : null;

    const query = `
    INSERT INTO articles (title, author, price, description, is_free, file_path) 
    VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [title, author, price, description, is_free === 'true', filePath], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
        } else {
            res.status(201).send('Article created successfully');
        }
    });
});

// Update an article
app.put('/articles/:id', upload.single('file'), (req, res) => {
    const articleId = req.params.id;
    const { title, author, price, description, is_free } = req.body;
    const filePath = req.file ? req.file.path : null;

    const query = `
        UPDATE articles 
        SET title = ?, author = ?, price = ?, description = ?, is_free = ?, file_path = COALESCE(?, file_path) 
        WHERE id = ?
    `;
    
    db.query(query, [title, author, price, description, is_free === 'true', filePath, articleId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
        } else if (result.affectedRows === 0) {
            res.status(404).send('Article not found');
        } else {
            res.status(200).send('Article updated successfully');
        }
    });
});

// Delete an article
app.delete('/articles/:id', (req, res) => {
    const articleId = req.params.id;
    const query = 'DELETE FROM articles WHERE id = ?';

    db.query(query, [articleId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
        } else if (result.affectedRows === 0) {
            res.status(404).send('Article not found');
        } else {
            res.status(200).send('Article deleted successfully');
        }
    });
});

// app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files
// app.use('/mpesa', purchaseRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
