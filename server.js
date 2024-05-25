const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const XLSX = require('xlsx');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (your HTML, CSS, JS)
app.use(express.static('public'));

// Handle form submission
app.post('/register', (req, res) => {
    const { name, email } = req.body;

    // Append to Excel file
    const filePath = './registrations.xlsx';
    let workbook;
    let worksheet;
    if (fs.existsSync(filePath)) {
        workbook = XLSX.readFile(filePath);
        worksheet = workbook.Sheets[workbook.SheetNames[0]];
    } else {
        workbook = XLSX.utils.book_new();
        worksheet = XLSX.utils.json_to_sheet([]);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
    }
    const newRow = { Name: name, Email: email };
    const worksheetData = XLSX.utils.sheet_to_json(worksheet);
    worksheetData.push(newRow);
    const newWorksheet = XLSX.utils.json_to_sheet(worksheetData);
    workbook.Sheets[workbook.SheetNames[0]] = newWorksheet;
    XLSX.writeFile(workbook, filePath);

    // Send confirmation email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password'
        }
    });

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Registration Confirmation',
        text: `Hi ${name},\n\nThank you for registering for the event. We look forward to seeing you!\n\nBest regards,\nEvent Team`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
        res.send('Registration successful and email sent!');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
