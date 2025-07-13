// server/routes/agentMessageRoute.js

import express from 'express';
import OpenAI from 'openai';
import ConciergeSession from '../models/ConciergeSession.js';
import dotenv from 'dotenv';
import {
  getSession,
  getMissingDocs,
  generateCreditAppPDF,
  sendToFinance
} from '../utils/agentTools.js';

dotenv.config();

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/message', async (req, res) => {
  const { sessionId, question, context } = req.body;

  if (!sessionId || !question) {
    return res.status(400).json({ error: 'Missing sessionId or question' });
  }

  try {
    const session = await getSession(sessionId);
    const missing = getMissingDocs(session);

    const prompt = `
You are MeeRa, an intelligent, helpful AI Finance Concierge for a car dealership.
Your job is to help customers through their car buying process.
You have access to their current session including vehicle info and document upload status.
Return your reply in plain text and also suggest an action when applicable.

Session:
- Vehicle: ${JSON.stringify(session.vehicle)}
- Purchase Type: ${session.purchaseType}
- Missing Docs: ${missing.join(', ') || 'None'}

User said: "${question}"

Reply as MeeRa:`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8
    });

    const reply = completion.choices[0].message.content.trim();

    // Infer action based on keywords
    let action = null;
    let target = null;

    if (/pre[- ]?qual/i.test(question)) {
      action = 'show_prequal_form';
    } else if (/credit|finance|application/.test(question) && /start|fill|complete/.test(question)) {
      action = 'navigate';
      target = '/finance/application';
    } else if (/send.*finance/i.test(question) && missing.length === 0) {
      await sendToFinance(session);
      action = 'email_sent';
    }

    res.json({ reply, action, target });
  } catch (err) {
    console.error('AI agent error:', err);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

export default router;