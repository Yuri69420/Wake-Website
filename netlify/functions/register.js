const nodemailer = require('nodemailer');
const sqlite3 = require('sqlite3').verbose();
const XLSX = require('xlsx');

const db = new sqlite3.Database('registrations.db');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  const data = JSON.parse(event.body);
  const { name, email, phoneNumber, nationality } = data;

  // Send confirmation email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Registration Confirmation',
    text: `Hi ${name},\n\nThank you for registering for the event. We look forward to seeing you!\n\nBest regards,\nEvent Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: 'Registration successful and email sent!',
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: 'Error sending confirmation email',
    };
  }
};
