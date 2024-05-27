const nodemailer = require('nodemailer');
const sqlite3 = require('sqlite3').verbose();
const XLSX = require('xlsx');

const db = new sqlite3.Database('registrations.db');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  const { name, email, phoneNumber, nationality } = JSON.parse(event.body);

  db.run(`INSERT INTO registrations (name, email, phoneNumber, nationality) VALUES (?, ?, ?, ?)`, [name, email, phoneNumber, nationality], function(err) {
    if (err) {
      console.error('Error inserting into database:', err);
      return {
        statusCode: 500,
        body: 'Error saving registration'
      };
    }

    console.log('Successfully inserted into database');
  });

  const filePath = 'registrations.xlsx';
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
    return {
      statusCode: 500,
      body: 'Error saving registration'
    };
  }

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
      return {
        statusCode: 500,
        body: 'Error sending confirmation email'
      };
    }
    console.log('Email sent: ' + info.response);
  });

  return {
    statusCode: 200,
    body: 'Registration successful and email sent!'
  };
};
