import { GoogleGenerativeAI } from "@google/generative-ai";
import readlineSync from "readline-sync";

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI('AIzaSyBGai0S1oAilp7CEjDlLD_ine0f3M8UUO8');

async function main() {
  // Get the model and start a chat session
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const chat = model.startChat({
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });

  console.log('Chat with Gemini (type "exit" to quit)');
  
  while (true) {
    const userInput = readlineSync.question('\nYou: ');
    if (userInput.toLowerCase() === 'exit') break;
    
    try {
      const result = await chat.sendMessage(userInput);
      const response = await result.response;
      const text = response.text();
      console.log('\nAssistant:', text);
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
  
  console.log('Goodbye!');
}

// Start the chat
main();