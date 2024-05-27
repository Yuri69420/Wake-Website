const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const XLSX = require('xlsx');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config(); // To use environment variables

const app = express();
const PORT = 8080;
const db = new sqlite3.Database('registrations.db');

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse URL-encoded and JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route to handle form submission
app.post('/register', (req, res) => {
    const { name, email, phoneNumber, nationality } = req.body;

    // Add to Database
    db.run(`INSERT INTO registrations (name, email, phoneNumber, nationality) VALUES (?, ?, ?, ?)`, [name, email, phoneNumber, nationality], function(err) {
        if (err) {
            console.error('Error inserting into database:', err);
            return res.status(500).send('Error saving registration');
        }

        console.log('Successfully inserted into database');
    });

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

        // Log successful write
        console.log('Successfully wrote to Excel file');
    } catch (error) {
        console.error('Error writing to Excel file:', error);
        return res.status(500).send('Error saving registration');
    }

    // Send confirmation email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Registration Confirmation',
        text: `Hi ${name},\n\nThank you for registering for the event. We look forward to seeing you!\n\nBest regards,\nEvent Team`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Error sending confirmation email');
        }
        console.log('Email sent: ' + info.response);
        res.send('Registration successful and email sent!');
    });
});

// Default route to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
