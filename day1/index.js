import { GoogleGenerativeAI } from "@google/generative-ai";
import readlineSync from "readline-sync";

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI('AIzaSyBGai0S1oAilp7CEjDlLD_ine0f3M8UUO8');

const chatHistory = [];

async function Chatting(userInput) {
  try {
    // Format the chat history for the API
    const chat = chatHistory.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));
    
    // Add the user's new message
    chat.push({
      role: 'user',
      parts: [{ text: userInput }]
    });
    
    // Get the model and start a chat session
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const chatSession = model.startChat({
      history: chat.slice(0, -1), // All messages except the last one
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });
    
    // Send the message and get the response
    const result = await chatSession.sendMessage(userInput);
    const response = await result.response;
    const text = response.text();
    
    // Update chat history
    chatHistory.push(
      { role: 'user', text: userInput },
      { role: 'model', text: text }
    );
    
    console.log('\nAssistant:', text);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function main() {
  while (true) {
    const userInput = readlineSync.question('\nYou: ');
    if (userInput.toLowerCase() === 'exit') break;
    await Chatting(userInput);
  }
  console.log('Goodbye!');
}

// Start the chat
console.log('Chat with Gemini (type "exit" to quit)');
main();