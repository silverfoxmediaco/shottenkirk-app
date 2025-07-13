// server/routes/conciergeAskRoute.js

import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const router = express.Router();

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  })
);

router.post('/ask', async (req, res) => {
  const { question, context } = req.body;

  try {
    // Generate response using OpenAI
    const prompt = `You are MeeRa, a helpful and professional AI finance concierge at a car dealership. Answer in a confident, friendly tone.\n\nContext: ${JSON.stringify(context)}\n\nCustomer: ${question}\n\nMeeRa:`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8
    });

    const reply = completion.data.choices[0].message.content.trim();
    console.log('MeeRa says:', reply);

    // Generate video stream using D-ID
    const didResponse = await axios.post(
      'https://api.d-id.com/talks',
      {
        script: {
          type: 'text',
          input: reply,
          provider: {
            type: 'microsoft',
            voice_id: 'en-US-JennyNeural' // Optional: change voice here
          }
        },
        source_url: process.env.DID_SOURCE_IMAGE_URL
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DID_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const stream_url = didResponse.data.stream_url;
    res.json({ stream_url });
  } catch (error) {
    console.error('MeeRa failed:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate video response' });
  }
});

export default router;
