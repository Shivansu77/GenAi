# 🚀 DSA Instructor - AI-Powered Learning Assistant

A modern, interactive web application that provides personalized DSA (Data Structures and Algorithms) tutoring using Google's Gemini AI. Built with React, Material-UI, and Express.js.

## ✨ Features

- 🤖 **AI-Powered Responses**: Get detailed explanations from Google's Gemini AI
- 💬 **Interactive Chat Interface**: Modern chat UI with real-time messaging
- 🌙 **Dark/Light Mode**: Toggle between themes for comfortable learning
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- ⚡ **Real-time Updates**: Smooth animations and instant feedback
- 🎯 **Sample Questions**: Quick-start with pre-built DSA questions
- 📝 **Code Examples**: Get well-commented code snippets for algorithms
- 🧹 **Chat Management**: Clear conversations and manage chat history

## 🛠️ Tech Stack

- **Frontend**: React 18, Material-UI, Framer Motion
- **Backend**: Express.js, Node.js
- **AI**: Google Gemini 2.0 Flash
- **Styling**: CSS3, Custom Theming

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd /Users/shivansubisht/Desktop/GenAi/Dsa
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Set up your API key**
   
   The API key is already configured in the code, but for production, you should:
   - Create a `.env` file in the root directory
   - Add your Gemini API key: `GEMINI_API_KEY=your_api_key_here`

### Running the Application

1. **Start the backend server** (in the root directory)
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5001`

2. **Start the React frontend** (in a new terminal, from the frontend directory)
   ```bash
   cd frontend
   npm start
   ```
   The frontend will start on `http://localhost:3000`

3. **Open your browser** and navigate to `http://localhost:3000`

## 🎯 How to Use

1. **Ask Questions**: Type your DSA-related questions in the input field
2. **Use Sample Questions**: Click on the sample question chips to get started quickly
3. **Get Detailed Responses**: The AI will provide step-by-step explanations with code examples
4. **Toggle Theme**: Use the theme toggle button in the header
5. **Clear Chat**: Use the clear button to start fresh conversations

## 📚 Sample Questions You Can Ask

- "Explain binary search algorithm"
- "What is the time complexity of quicksort?"
- "How does a hash table work?"
- "Explain dynamic programming with an example"
- "What's the difference between BFS and DFS?"
- "Show me how to implement a binary tree"
- "Explain the concept of Big O notation"

## 🏗️ Project Structure

```
Dsa/
├── frontend/                 # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── App.js           # Main React component
│   │   ├── index.js         # React entry point
│   │   └── index.css        # Global styles
│   └── package.json
├── server.js                # Express backend server
├── dsa.js                   # Original CLI version
├── package.json             # Backend dependencies
└── README.md               # This file
```

## 🔧 Available Scripts

### Backend (Root Directory)
- `npm run dev` - Start development server with nodemon
- `npm run server` - Start production server
- `npm start` - Run the original CLI version

### Frontend (frontend directory)
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 🎨 UI Features

- **Modern Design**: Clean, professional interface with Material-UI components
- **Smooth Animations**: Framer Motion animations for enhanced user experience
- **Responsive Layout**: Adapts to different screen sizes
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Loading States**: Visual feedback during AI processing
- **Error Handling**: User-friendly error messages

## 🔒 Security Notes

- The API key is currently hardcoded for development
- For production deployment, use environment variables
- Consider implementing rate limiting and user authentication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Server not starting**: Make sure port 5000 is available
2. **Frontend not connecting**: Ensure the backend is running on port 5001
3. **API errors**: Check your Gemini API key and internet connection
4. **Build errors**: Clear node_modules and reinstall dependencies

### Getting Help

If you encounter any issues:
1. Check the console for error messages
2. Ensure all dependencies are installed
3. Verify the API key is valid
4. Check network connectivity

---

**Happy Learning! 🎓**

*Built with ❤️ for the DSA community*
