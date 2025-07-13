// server/utils/agentTools.js

import ConciergeSession from '../models/ConciergeSession.js';
import { sendCompletionEmail } from './sendEmail.js';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

export async function getSession(sessionId) {
  const session = await ConciergeSession.findOne({ sessionId });
  if (!session) throw new Error('Session not found');
  return session;
}

export function getMissingDocs(session) {
  const uploaded = session.uploadedDocs || {};
  return Object.entries(uploaded)
    .filter(([_, val]) => !val)
    .map(([key]) => key);
}

export async function generateCreditAppPDF(session) {
  const pdfPath = path.join('uploads', `creditapp-${session.sessionId}.pdf`);
  const doc = new PDFDocument();
  const stream = fs.createWriteStream(pdfPath);
  doc.pipe(stream);

  doc.fontSize(18).text('Credit Application', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`Session ID: ${session.sessionId}`);
  doc.text(`Vehicle: ${session.vehicle?.year} ${session.vehicle?.make} ${session.vehicle?.model}`);
  doc.text(`Purchase Type: ${session.purchaseType}`);
  doc.moveDown();

  doc.text('Uploaded Documents:');
  Object.entries(session.uploadedDocs || {}).forEach(([key, val]) => {
    doc.text(`- ${key}: ${val ? '✓ Uploaded' : '❌ Missing'}`);
  });

  doc.end();

  await new Promise((resolve) => stream.on('finish', resolve));
  return pdfPath;
}

export async function sendToFinance(session) {
  const pdfPath = await generateCreditAppPDF(session);
  await sendCompletionEmail(session, pdfPath);
}
