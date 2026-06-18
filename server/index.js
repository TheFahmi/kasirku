const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
// Set high limit because encrypted AppState can be large
app.use(express.json({ limit: '50mb' }));

const dbPath = path.resolve(__dirname, 'sync.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS store_data (store_id TEXT PRIMARY KEY, encrypted_blob TEXT, updated_at INTEGER)");
});

// API to push data to server
app.post('/api/sync', (req, res) => {
    const { storeId, blob } = req.body;
    if (!storeId || !blob) return res.status(400).json({ error: 'Missing data' });
    
    const stmt = db.prepare("INSERT OR REPLACE INTO store_data (store_id, encrypted_blob, updated_at) VALUES (?, ?, ?)");
    stmt.run(storeId, blob, Date.now(), function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: 'Data synced to cloud successfully' });
    });
    stmt.finalize();
});

// API to pull data from server
app.get('/api/sync/:storeId', (req, res) => {
    const storeId = req.params.storeId;
    db.get("SELECT encrypted_blob, updated_at FROM store_data WHERE store_id = ?", [storeId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'No data found for this store' });
        
        res.json({ success: true, blob: row.encrypted_blob, updatedAt: row.updated_at });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`[KasirKu E2EE Sync Server] Running on http://localhost:${PORT}`);
});
