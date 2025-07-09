// server/controllers/testDriveController.js
import TestDrive from '../models/TestDrive.js';
import nodemailer from 'nodemailer';

export const submitTestDrive = async (req, res) => {
  try {
    const formData = req.body;
    console.log('🔥 Received test drive request:', formData);

    const testDrive = new TestDrive(formData);
    await testDrive.save();
    console.log('✅ Saved to MongoDB');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Shottenkirk Test Drive" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `New Test Drive Request: ${formData.vehicleModel}`,
      html: `
        <h2>New Test Drive Request</h2>
        <p><strong>Name:</strong> ${formData.fullName}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone}</p>
        <p><strong>Vehicle:</strong> ${formData.vehicleModel}</p>
        <p><strong>Preferred Date:</strong> ${formData.preferredDate}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('📧 Email sent');

    res.status(201).json({ message: 'Test drive submitted and email sent.' });
  } catch (err) {
    console.error('❌ Error in submitTestDrive:', err);
    res.status(500).json({ error: 'Failed to submit test drive or send email' });
  }
};
