const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const XLSX = require('xlsx');
const path = require('path');

const app = express();
const PORT = 8000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (your HTML, CSS, JS)
app.use(express.static('public'));

// Handle form submission
app.post('/register', (req, res) => {
    const { name, email, phoneNumber, nationality } = req.body;
    console.log("phone is " + phoneNumber);
    console.log("nat is "+nationality);

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
            worksheet = XLSX.utils.aoa_to_sheet([['Name', 'Phone Number', 'Nationality', 'Email']]);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
        }

        const newRow = [name, phoneNumber, nationality, email];
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
            console.error('Error sending email:', error);
            return res.status(500).send('Error sending confirmation email');
        }
        console.log('Email sent: ' + info.response);
        res.send('Registration successful and email sent!');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
