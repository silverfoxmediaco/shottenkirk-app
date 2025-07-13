// server/utils/sendEmail.js

import nodemailer from 'nodemailer';

export const sendCompletionEmail = async (session) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Finance Concierge" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: `🚗 Concierge Session Completed: ${session.sessionId}`,
    html: `
      <h2>New Concierge Session Completed</h2>
      <p><strong>Session ID:</strong> ${session.sessionId}</p>
      <p><strong>Purchase Type:</strong> ${session.purchaseType}</p>
      <p><strong>Vehicle:</strong> ${session.vehicle.year} ${session.vehicle.make} ${session.vehicle.model} - $${session.vehicle.price}</p>
      <p>All required documents have been uploaded.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};
