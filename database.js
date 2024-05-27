const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('registrations.db');

db.serialize(() => {
    // Create table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phoneNumber TEXT NOT NULL,
        nationality TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

db.close();
console.log('Database and table created');
