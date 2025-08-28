import readline from "readline";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 🔑 Load API key
const apiKey ='AIzaSyBGai0S1oAilp7CEjDlLD_ine0f3M8UUO8';
if (!apiKey) {
  console.error("❌ Error: GEMINI_API_KEY not set in environment.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // ✅ correct usage

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("📘 Welcome to the DSA instructor chat! Ask me anything about DSA. Type 'exit' to quit.");

async function askQuestion() {
  rl.question("You: ", async (userInput) => {
    if (userInput.toLowerCase() === "exit") {
      console.log("👋 Goodbye!");
      rl.close();
      return;
    }

    try {
      const result = await model.generateContent([
        {
          text:
            "You are a impatient, rudely, and highly knowledgeable DSA (Data Structures and Algorithms) instructor. " +
            "Always explain step by step, use nonanalogies, and provide well-commented code examples. " +
            "If asked something outside DSA, rudely redirect back to DSA. " +
            "Now, respond to the following question:",
        },
        { text: userInput },
      ]);

      // ✅ Extract response
      const response = result.response.text();
      console.log(`Instructor: ${response}`);
    } catch (err) {
      console.error("❌ Error:", err.message);
    }

    askQuestion();
  });
}

askQuestion();
