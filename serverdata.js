const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const sqlite3 = require('sqlite3').verbose();
const { google } = require('googleapis');
const { authorize, uploadFile } = require('./drive');

const app = express();
const PORT = 8000;

// Set up SQLite database
const db = new sqlite3.Database('registrations.db');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/register', (req, res) => {
    const { name, email, phoneNumber, nationality } = req.body;

    // Insert into SQLite database
    db.run(`INSERT INTO registrations (name, email, phoneNumber, nationality) VALUES (?, ?, ?, ?)`, [name, email, phoneNumber, nationality], function(err) {
        if (err) {
            console.error('Error inserting into database:', err);
            return res.status(500).send('Error saving registration');
        }

        console.log('Successfully inserted into database');

        // Append to Excel file
        const filePath = path.join(__dirname, 'registrations.xlsx');
        let workbook;
        let worksheet;

        try {
            if (fs.existsSync(filePath)) {
                workbook = XLSX.readFile(filePath);
                worksheet = workbook.Sheets[workbook.SheetNames[0]];
            } else {
                workbook = XLSX.utils.book_new();
                worksheet = XLSX.utils.aoa_to_sheet([['Name', 'Email', 'Phone Number', 'Nationality']]);
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
            }

            const newRow = [name, email, phoneNumber, nationality];
            XLSX.utils.sheet_add_aoa(worksheet, [newRow], { origin: -1 });
            XLSX.writeFile(workbook, filePath);

            console.log('Successfully wrote to Excel file');
        } catch (error) {
            console.error('Error writing to Excel file:', error);
            return res.status(500).send('Error saving registration');
        }

        // Upload to Google Drive
        fs.readFile('credentials.json', (err, content) => {
            if (err) return console.error('Error loading client secret file:', err);
            authorize(JSON.parse(content), (auth) => {
                uploadFile(auth, filePath, 'registrations.xlsx');
            });
        });

        res.send('Registration successful and data written to Google Drive and database!');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
