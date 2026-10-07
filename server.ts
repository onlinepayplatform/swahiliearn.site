import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini if key exists
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Gemini client init warning:', err);
  }
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    name: 'SWAHILI EARN API',
    geminiConfigured: !!aiClient,
    timestamp: new Date().toISOString()
  });
});

// Conversational Chat Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { learnerName, learnerProfession, userMessage, history } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: 'userMessage is required' });
    }

    if (aiClient) {
      const prompt = `You are roleplaying as ${learnerName || 'a foreign visitor'}, a foreigner learning conversational Swahili in East Africa.
Profession: ${learnerProfession || 'Tourist'}.
You are conversing with a native Swahili speaker who is tutoring you.
Recent conversation history:
${Array.isArray(history) ? history.map((m: any) => `${m.sender}: ${m.text}`).join('\n') : ''}

Native Tutor said: "${userMessage}"

Respond naturally in 1 to 2 short sentences as the foreign learner. Speak in simple English mixed with beginner Swahili words (e.g. Hujambo, Habari, Asante sana). Be polite, cheerful, and curious.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt
      });

      const replyText = response.text ? response.text.trim() : '';
      return res.json({ text: replyText });
    }

    // Fallback response if no API key
    return res.json({
      text: `Asante sana rafiki yangu! Nimeelewa vizuri. Je, unaweza kunitajia neno jingine la Kiswahili?`
    });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ error: 'Failed to process chat response' });
  }
});

// Serve frontend build in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`SWAHILI EARN server running on http://localhost:${PORT}`);
});
