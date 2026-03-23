const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'MyDatabase'
});

db.connect((err) => {
    if (err) {
        console.error('Error:', err.message);
        return;
    }
    
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS articles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            titre VARCHAR(255) NOT NULL,
            contenu TEXT NOT NULL,
            auteur VARCHAR(255) NOT NULL,
            date DATETIME DEFAULT CURRENT_TIMESTAMP,
            categorie VARCHAR(100),
            tags VARCHAR(255)
        )
    `;
    db.query(createTableQuery);
});

app.post('/api/articles', (req, res) => {
    const { titre, contenu, auteur, date, categorie, tags } = req.body;
    
    if (!titre || !contenu || !auteur) {
        return res.status(400).json({ error: "Champs obligatoires manquants" });
    }

    const sql = "INSERT INTO articles (titre, contenu, auteur, date, categorie, tags) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [titre, contenu, auteur, date || new Date(), categorie, tags];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, message: "Article créé avec succès" });
    });
});

app.get('/api/articles', (req, res) => {
    const { categorie, auteur, date } = req.query;
    let sql = "SELECT * FROM articles WHERE 1=1";
    let params = [];

    if (categorie) { sql += " AND categorie = ?"; params.push(categorie); }
    if (auteur) { sql += " AND auteur = ?"; params.push(auteur); }
    if (date) { sql += " AND DATE(date) = ?"; params.push(date); }

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

app.get('/api/articles/search', (req, res) => {
    const term = req.query.query;
    if (!term) return res.status(400).json({ error: "Terme de recherche manquant" });

    const sql = "SELECT * FROM articles WHERE titre LIKE ? OR contenu LIKE ?";
    const val = `%${term}%`;

    db.query(sql, [val, val], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

app.get('/api/articles/:id', (req, res) => {
    const sql = "SELECT * FROM articles WHERE id = ?";
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: "Article non trouvé" });
        res.status(200).json(results[0]);
    });
});

app.put('/api/articles/:id', (req, res) => {
    const { titre, contenu, categorie, tags } = req.body;
    const sql = "UPDATE articles SET titre = ?, contenu = ?, categorie = ?, tags = ? WHERE id = ?";
    
    db.query(sql, [titre, contenu, categorie, tags, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Article non trouvé" });
        res.status(200).json({ message: "Article mis à jour avec succès" });
    });
});

app.delete('/api/articles/:id', (req, res) => {
    const sql = "DELETE FROM articles WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Article non trouvé" });
        res.status(200).json({ message: "Article supprimé avec succès" });
    });
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
