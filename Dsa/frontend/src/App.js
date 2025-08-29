import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  ThemeProvider,
  createTheme,
  Avatar,
} from '@mui/material';
import {
  Send as SendIcon,
  Clear as ClearIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  SmartToy as BotIcon,
  MoreVert as MoreVertIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Create a WhatsApp-inspired theme
const createWhatsAppTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#8B5CF6', // Purple
    },
    secondary: {
      main: '#7C3AED', // Darker purple
    },
    background: {
      default: mode === 'dark' ? '#0B141A' : '#E5DDD5',
      paper: mode === 'dark' ? '#202C33' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#E9EDEF' : '#111B21',
      secondary: mode === 'dark' ? '#8696A0' : '#667781',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Helvetica Neue", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
        },
      },
    },
  },
});

const sampleQuestions = [
  "What is binary search?",
  "Explain quicksort",
  "How do hash tables work?",
  "What is dynamic programming?",
  "Explain Big O notation",
  "What is a linked list?",
];

// Typing indicator component
const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px' }}
  >
    <Avatar sx={{ bgcolor: '#8B5CF6', width: 32, height: 32 }}>
      <BotIcon fontSize="small" />
    </Avatar>
    <Box sx={{ 
      display: 'flex', 
      gap: 1, 
      bgcolor: 'background.paper', 
      px: 2, 
      py: 1, 
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'divider'
    }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: '#8B5CF6',
          }}
        />
      ))}
    </Box>
  </motion.div>
);

function App() {
  const [mode, setMode] = useState('dark');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState(() => {
    try {
      const savedMessages = localStorage.getItem('elina-chat-history');
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        console.log('Loaded messages from localStorage:', parsed.length, 'messages');
        
        // Validate and convert messages
        const validMessages = parsed.filter(msg => 
          msg && 
          typeof msg === 'object' && 
          msg.type && 
          msg.content && 
          msg.timestamp &&
          (msg.type === 'user' || msg.type === 'ai')
        );
        
        if (validMessages.length > 0) {
          console.log('Valid messages found:', validMessages.length);
          return validMessages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
            id: msg.id || Date.now() + Math.random()
          }));
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      localStorage.removeItem('elina-chat-history');
    }
    console.log('No saved messages found, using default welcome message');
    return [{
      type: 'ai',
      content: "🚀 **Hi! I'm Elina, your DSA tutor!**\n\nI'm here to help you learn Data Structures & Algorithms quickly.\n\n**I remember our conversations!** I can recall your name, preferences, and previous questions.\n\n**Ask me about:**\n• Algorithms (sorting, searching, DP)\n• Data Structures (arrays, trees, graphs)\n• Time Complexity & Big O\n• Problem solving techniques\n\n**Try:** \"What is binary search?\" or \"My name is Rohit\" 💻",
      timestamp: new Date(),
      id: Date.now()
    }];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [streamingMessage, setStreamingMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const theme = createWhatsAppTheme(mode);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    try {
      // Only save if we have valid messages
      if (messages && messages.length > 0) {
        const messagesToSave = messages.map(msg => ({
          type: msg.type,
          content: msg.content,
          timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : new Date().toISOString(),
          id: msg.id || Date.now() + Math.random()
        }));
        localStorage.setItem('elina-chat-history', JSON.stringify(messagesToSave));
        console.log('Saved messages to localStorage:', messagesToSave.length, 'messages');
      }
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }, [messages]);

  // Simulate streaming response
  const simulateStreaming = (fullResponse) => {
    const words = fullResponse.split(' ');
    let currentIndex = 0;
    
    const streamInterval = setInterval(() => {
      if (currentIndex < words.length) {
        setStreamingMessage(words.slice(0, currentIndex + 1).join(' '));
        currentIndex++;
      } else {
        clearInterval(streamInterval);
        setStreamingMessage('');
        return true;
      }
    }, 50);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    const userMessage = { 
      type: 'user', 
      content: question, 
      timestamp: new Date(),
      id: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setError('');
    setStreamingMessage('');

    try {
      // Prepare conversation history (last 10 messages for context)
      const conversationHistory = messages.slice(-10).map(msg => ({
        type: msg.type,
        content: msg.content
      }));

      const response = await fetch('http://localhost:5001/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          question: question.trim(),
          conversationHistory: conversationHistory
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Simulate streaming
      simulateStreaming(data.response);
      
      // Wait for streaming to complete
      setTimeout(() => {
        const aiMessage = { 
          type: 'ai', 
          content: data.response, 
          timestamp: new Date(),
          id: Date.now() + 1
        };
        setMessages(prev => [...prev, aiMessage]);
        setLoading(false);
        setQuestion('');
        inputRef.current?.focus();
      }, data.response.split(' ').length * 50 + 500);

    } catch (err) {
      setError('Failed to get response from Elina. Please try again.');
      setLoading(false);
    }
  };

  const handleSampleQuestion = (sampleQ) => {
    setQuestion(sampleQ);
    inputRef.current?.focus();
  };

  const clearChat = () => {
    const welcomeMessage = {
      type: 'ai',
      content: "🚀 **Hi! I'm Elina, your DSA tutor!**\n\nI'm here to help you learn Data Structures & Algorithms quickly.\n\n**I remember our conversations!** I can recall your name, preferences, and previous questions.\n\n**Ask me about:**\n• Algorithms (sorting, searching, DP)\n• Data Structures (arrays, trees, graphs)\n• Time Complexity & Big O\n• Problem solving techniques\n\n**Try:** \"What is binary search?\" or \"My name is Rohit\" 💻",
      timestamp: new Date(),
      id: Date.now()
    };
    setMessages([welcomeMessage]);
    try {
      const messageToSave = {
        ...welcomeMessage,
        timestamp: welcomeMessage.timestamp.toISOString()
      };
      localStorage.setItem('elina-chat-history', JSON.stringify([messageToSave]));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
    setError('');
    setStreamingMessage('');
  };

  const toggleMode = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };

  const formatMessage = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  };

  // Debug function to test localStorage
  const debugLocalStorage = () => {
    console.log('=== localStorage Debug ===');
    const saved = localStorage.getItem('elina-chat-history');
    console.log('Raw localStorage data:', saved);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log('Parsed data:', parsed);
        console.log('Number of messages:', parsed.length);
      } catch (e) {
        console.error('Error parsing localStorage:', e);
      }
    } else {
      console.log('No data in localStorage');
    }
    console.log('Current messages state:', messages);
    console.log('=== End Debug ===');
  };

  // Test function to add a sample message
  const addTestMessage = () => {
    const testMessage = {
      type: 'user',
      content: 'Test message for chat history',
      timestamp: new Date(),
      id: Date.now()
    };
    const testResponse = {
      type: 'ai',
      content: 'This is a test response to verify chat history persistence.',
      timestamp: new Date(),
      id: Date.now() + 1
    };
    setMessages(prev => [...prev, testMessage, testResponse]);
  };

  // Function to clear localStorage manually
  const clearLocalStorage = () => {
    localStorage.removeItem('elina-chat-history');
    console.log('localStorage cleared manually');
    window.location.reload();
  };

  // Function to simulate a full conversation
  const simulateConversation = async () => {
    const userMsg = {
      type: 'user',
      content: 'height of binary tree in java',
      timestamp: new Date(),
      id: Date.now()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    
    try {
      // Prepare conversation history
      const conversationHistory = messages.slice(-10).map(msg => ({
        type: msg.type,
        content: msg.content
      }));

      const response = await fetch('http://localhost:5001/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: 'height of binary tree in java',
          conversationHistory: conversationHistory
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const aiMsg = {
          type: 'ai',
          content: data.response,
          timestamp: new Date(),
          id: Date.now() + 1
        };
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (error) {
      console.error('Error in simulation:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to test memory feature
  const testMemory = async () => {
    // First message: Tell Elina your name
    const nameMsg = {
      type: 'user',
      content: 'My name is Rohit',
      timestamp: new Date(),
      id: Date.now()
    };
    
    setMessages(prev => [...prev, nameMsg]);
    setLoading(true);
    
    try {
      const response1 = await fetch('http://localhost:5001/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: 'My name is Rohit',
          conversationHistory: messages.slice(-10).map(msg => ({
            type: msg.type,
            content: msg.content
          }))
        }),
      });
      
      if (response1.ok) {
        const data1 = await response1.json();
        const aiMsg1 = {
          type: 'ai',
          content: data1.response,
          timestamp: new Date(),
          id: Date.now() + 1
        };
        setMessages(prev => [...prev, aiMsg1]);
        
        // Wait a bit, then ask about the name
        setTimeout(async () => {
          const askNameMsg = {
            type: 'user',
            content: 'What is my name?',
            timestamp: new Date(),
            id: Date.now() + 2
          };
          
          setMessages(prev => [...prev, askNameMsg]);
          
          const response2 = await fetch('http://localhost:5001/api/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              question: 'What is my name?',
              conversationHistory: [...messages, aiMsg1, askNameMsg].slice(-10).map(msg => ({
                type: msg.type,
                content: msg.content
              }))
            }),
          });
          
          if (response2.ok) {
            const data2 = await response2.json();
            const aiMsg2 = {
              type: 'ai',
              content: data2.response,
              timestamp: new Date(),
              id: Date.now() + 3
            };
            setMessages(prev => [...prev, aiMsg2]);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error in memory test:', error);
    } finally {
      setLoading(false);
    }
  };

  // Call debug function on component mount
  useEffect(() => {
    debugLocalStorage();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ height: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Toolbar sx={{ minHeight: '64px' }}>
            <Avatar sx={{ bgcolor: '#8B5CF6', width: 40, height: 40, mr: 2 }}>
              <BotIcon />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Elina
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                DSA Instructor • Online
              </Typography>
            </Box>
            <IconButton color="inherit" onClick={toggleMode} sx={{ color: 'text.primary', mr: 1 }}>
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <IconButton color="inherit" onClick={debugLocalStorage} sx={{ color: 'text.primary', mr: 1 }}>
              <Typography variant="caption">Debug</Typography>
            </IconButton>
            <IconButton color="inherit" onClick={addTestMessage} sx={{ color: 'text.primary', mr: 1 }}>
              <Typography variant="caption">Test</Typography>
            </IconButton>
            <IconButton color="inherit" onClick={clearLocalStorage} sx={{ color: 'text.primary', mr: 1 }}>
              <Typography variant="caption">Clear</Typography>
            </IconButton>
            <IconButton color="inherit" onClick={simulateConversation} sx={{ color: 'text.primary', mr: 1 }}>
              <Typography variant="caption">Simulate</Typography>
            </IconButton>
            <IconButton color="inherit" onClick={testMemory} sx={{ color: 'text.primary', mr: 1 }}>
              <Typography variant="caption">Memory</Typography>
            </IconButton>
            <IconButton color="inherit" sx={{ color: 'text.primary' }}>
              <MoreVertIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Chat Area */}
        <Box sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Sample Questions */}
          {messages.length <= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box sx={{ p: 2, pb: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, textAlign: 'center' }}>
                  💡 Quick questions to get started:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                  {sampleQuestions.map((sampleQ, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Chip
                        label={sampleQ}
                        onClick={() => handleSampleQuestion(sampleQ)}
                        variant="outlined"
                        size="small"
                        sx={{ 
                          cursor: 'pointer', 
                          bgcolor: 'background.paper',
                          borderColor: '#8B5CF6',
                          color: '#8B5CF6',
                          '&:hover': { 
                            bgcolor: '#8B5CF6', 
                            color: 'white',
                          },
                          transition: 'all 0.2s ease'
                        }}
                      />
                    </motion.div>
                  ))}
                </Box>
              </Box>
            </motion.div>
          )}

          {/* Messages */}
          <Box sx={{ 
            flexGrow: 1, 
            overflow: 'auto', 
            p: 1,
            backgroundImage: mode === 'dark' 
              ? 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
              : 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}>
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                    mb: 1
                  }}>
                    <Box sx={{ 
                      maxWidth: '70%',
                      bgcolor: message.type === 'user' ? '#8B5CF6' : 'background.paper',
                      color: message.type === 'user' ? 'white' : 'text.primary',
                      borderRadius: 2,
                      px: 2,
                      py: 1.5,
                      position: 'relative',
                      border: message.type === 'ai' ? '1px solid' : 'none',
                      borderColor: 'divider',
                      boxShadow: message.type === 'ai' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    }}>
                      <Typography 
                        variant="body2" 
                        component="div"
                        dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                        sx={{ 
                          whiteSpace: 'pre-wrap', 
                          fontFamily: 'inherit',
                          lineHeight: 1.4,
                          '& code': {
                            bgcolor: message.type === 'user' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontFamily: 'monospace',
                            fontSize: '0.85em'
                          },
                          '& strong': {
                            fontWeight: 600
                          }
                        }}
                      />
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: message.type === 'user' ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                          fontSize: '0.7rem',
                          display: 'block',
                          mt: 0.5,
                          textAlign: 'right'
                        }}
                      >
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && <TypingIndicator />}

            {streamingMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
                  <Box sx={{ 
                    maxWidth: '70%',
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    borderRadius: 2,
                    px: 2,
                    py: 1.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}>
                    <Typography 
                      variant="body2" 
                      component="div"
                      dangerouslySetInnerHTML={{ __html: formatMessage(streamingMessage) }}
                      sx={{ 
                        whiteSpace: 'pre-wrap', 
                        fontFamily: 'inherit',
                        lineHeight: 1.4,
                        '& code': {
                          bgcolor: 'rgba(0,0,0,0.1)',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontFamily: 'monospace',
                          fontSize: '0.85em'
                        },
                        '& strong': {
                          fontWeight: 600
                        }
                      }}
                    />
                  </Box>
                </Box>
              </motion.div>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 1, mx: 1 }}>
                {error}
              </Alert>
            )}

            <div ref={messagesEndRef} />
          </Box>
        </Box>

        {/* Input Area */}
        <Box sx={{ 
          p: 2, 
          bgcolor: 'background.paper', 
          borderTop: '1px solid', 
          borderColor: 'divider' 
        }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
            <IconButton 
              size="small" 
              sx={{ 
                color: 'text.secondary',
                bgcolor: 'background.default',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <EmojiIcon />
            </IconButton>
            <IconButton 
              size="small" 
              sx={{ 
                color: 'text.secondary',
                bgcolor: 'background.default',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <AttachFileIcon />
            </IconButton>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={loading}
              inputRef={inputRef}
              multiline
              maxRows={4}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  bgcolor: 'background.default',
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8B5CF6',
                  },
                }
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={!question.trim() || loading}
              sx={{ 
                minWidth: '48px',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                bgcolor: '#8B5CF6',
                '&:hover': {
                  bgcolor: '#7C3AED',
                },
                '&:disabled': {
                  bgcolor: 'action.disabledBackground',
                }
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            </Button>
            {messages.length > 1 && (
              <IconButton
                onClick={clearChat}
                sx={{ 
                  color: 'text.secondary',
                  bgcolor: 'background.default',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <ClearIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
