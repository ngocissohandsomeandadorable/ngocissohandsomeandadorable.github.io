const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use Gmail or another email service
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS   // Your email password (or app-specific password)
  }
});

// API endpoint to send quiz results
app.post('/send-results', (req, res) => {
  const { studentName, readingScore, answers, emailContent, essayContent } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Replace with the recipient's email
    subject: 'Vstep Quiz Results',
    text: `
      Student Name: ${studentName}
      Reading Score: ${readingScore}
      Answers: ${JSON.stringify(answers)}
      Email Content: ${emailContent}
      Essay Content: ${essayContent}
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Failed to send email' });
    } else {
      console.log('Email sent:', info.response);
      res.status(200).json({ status: 'success', message: 'Email sent successfully' });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});