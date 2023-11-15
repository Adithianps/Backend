const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const port = 3000;

// Set up Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.static('public')); // Assuming your frontend files are in a 'public' folder

app.post('/submitOrder', upload.single('document'), (req, res) => {
  // Handle form submission here
  const formData = req.body;

  // Access file buffer from multer
  const documentBuffer = req.file.buffer;

  // Implement logic to send email using nodemailer
  sendEmail(formData, documentBuffer);

  res.json({ message: 'Order submitted successfully!' });
});

// Function to send email using nodemailer
function sendEmail(formData, documentBuffer) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'printtestbot10@gmail.com',
      pass: '9656466510',
    },
  });

  const mailOptions = {
    from: 'printtestbot10@gmail.com',
    to: 'adisakthi10@gmail.com',
    subject: 'New Print Order',
    html: `
      <p><strong>User Details:</strong></p>
      <p><strong>Name:</strong> ${formData.userName}</p>
      <p><strong>Class Division:</strong> ${formData.classDivision}</p>
      
      <p><strong>Order Details:</strong></p>
      <p><strong>Copies:</strong> ${formData.copies}</p>
      <p><strong>Delivery Date:</strong> ${formData.deliveryDate}</p>
      <p><strong>Additional Requests:</strong> ${formData.additionalRequests}</p>
    `,
    attachments: [
      {
        filename: 'document.pdf', // You can customize the filename
        content: documentBuffer,
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
