document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const typingIndicator = document.getElementById('typingIndicator');
    const themeToggle = document.getElementById('themeToggle');
    const suggestionButtons = document.querySelectorAll('.suggestion-btn');
    
    // Initialize theme
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    // Event Listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Auto-resize textarea
    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = `${Math.min(userInput.scrollHeight, 150)}px`;
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Suggestion buttons
    suggestionButtons.forEach(button => {
        button.addEventListener('click', () => {
            userInput.value = button.textContent;
            userInput.focus();
        });
    });

    // Functions
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessage(message, 'user');
        userInput.value = '';
        userInput.style.height = 'auto';
        sendButton.disabled = true;
        
        // Show typing indicator
        showTypingIndicator(true);
        
        try {
            // Send message to backend
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            
            // Add bot response to chat
            addMessage(data.response, 'bot');
            
        } catch (error) {
            console.error('Error:', error);
            addMessage("Ugh, something went wrong. Don't blame me, it's probably your connection.", 'bot');
        } finally {
            showTypingIndicator(false);
            sendButton.disabled = false;
        }
    }
    
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.textContent = sender === 'user' ? '👤' : '🤖';
        
        const content = document.createElement('div');
        content.className = 'content';
        
        const senderName = document.createElement('div');
        senderName.className = 'sender';
        senderName.textContent = sender === 'user' ? 'You' : 'DSA Instructor';
        
        const messageText = document.createElement('div');
        messageText.className = 'text';
        
        // Convert markdown code blocks to HTML
        const formattedText = formatMessage(text);
        messageText.innerHTML = formattedText;
        
        content.appendChild(senderName);
        content.appendChild(messageText);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    function formatMessage(text) {
        // Convert code blocks
        let formattedText = text.replace(/```(\w*)\n([\s\S]*?)\n```/g, 
            (match, lang, code) => {
                return `<pre><code class="language-${lang || 'text'}">${escapeHtml(code)}</code></pre>`;
            }
        );
        
        // Convert inline code
        formattedText = formattedText.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Convert newlines to <br>
        formattedText = formattedText.replace(/\n/g, '<br>');
        
        return formattedText;
    }
    
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    function showTypingIndicator(show) {
        if (show) {
            typingIndicator.classList.add('visible');
        } else {
            typingIndicator.classList.remove('visible');
        }
        scrollToBottom();
    }
    
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    }
    
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
    
    // Initialize
    scrollToBottom();
    userInput.focus();
});
