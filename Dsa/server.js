import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// 🔑 Load API key
const apiKey = 'AIzaSyBGai0S1oAilp7CEjDlLD_ine0f3M8UUO8';
if (!apiKey) {
  console.error("❌ Error: GEMINI_API_KEY not set in environment.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'DSA Instructor API is running!' });
});

app.post('/api/ask', async (req, res) => {
  try {
    const { question, conversationHistory = [] } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Check if it's a non-DSA question
    const nonDsaKeywords = ['ronaldo', 'football', 'soccer', 'sport', 'movie', 'music', 'food', 'weather', 'politics'];
    const questionLower = question.toLowerCase();
    
    if (nonDsaKeywords.some(keyword => questionLower.includes(keyword))) {
      return res.json({ 
        response: "🤖 **This is a DSA instructor, not a general chatbot!**\n\n" +
                  "I teach **Data Structures & Algorithms** only.\n\n" +
                  "**Ask me about:**\n" +
                  "• Binary search, quicksort, hash tables\n" +
                  "• Arrays, linked lists, trees, graphs\n" +
                  "• Big O notation, dynamic programming\n\n" +
                  "**Try:** \"What is binary search?\" or \"Explain quicksort\" 🚀"
      });
    }

    // Build conversation context
    let conversationContext = "";
    if (conversationHistory.length > 0) {
      conversationContext = "\n\n**Previous Conversation Context:**\n";
      conversationHistory.forEach((msg, index) => {
        if (index < 10) { // Limit to last 10 messages for context
          conversationContext += `${msg.type === 'user' ? 'User' : 'Elina'}: ${msg.content}\n`;
        }
      });
    }

    const result = await model.generateContent([
      {
        text:
          "You are Elina, a friendly and knowledgeable DSA instructor. You have memory of previous conversations and can remember personal details shared by the user (like their name, preferences, etc.). " +
          "Keep responses concise (2-4 paragraphs max) and focus on the key concept. " +
          "Provide one clear code example in the language requested by the user, and mention time complexity briefly. " +
          "If the user asks for Java code, provide Java code. If they ask for Python, provide Python code. " +
          "If they ask for a recursive solution, provide the recursive version. If they ask for iterative, provide iterative. " +
          "Use bullet points and bold text for emphasis. Be friendly and remember personal context from previous messages. " +
          "If the user asks about their name or personal information they've shared before, refer to that information naturally." +
          conversationContext +
          "\n\nNow, respond to the following question:",
      },
      { text: question },
    ]);

    const response = result.response.text();
    res.json({ response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
