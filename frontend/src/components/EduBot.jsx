import { useState, useEffect, useRef } from 'react';

function EduBot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      fetchSession();
    }
  }, [isOpen]);

  const fetchSession = async () => {
    setSessionLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/chat/session', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const session = await response.json();
        if (session && session.messages) {
          setMessages(session.messages);
        }
      }
    } catch (err) {
      console.error('Failed to fetch chat session:', err);
    } finally {
      setSessionLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Add user message immediately
    setMessages(prev => [...prev, { 
      id: Date.now(), 
      role: 'user', 
      content: userMessage,
      created_at: new Date().toISOString()
    }]);
    
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message: userMessage })
      });

      if (response.ok) {
        const botMessage = await response.json();
        setMessages(prev => [...prev, botMessage]);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now(),
          role: 'assistant',
          content: "Sorry, I couldn't process your request. Please try again! 🔄",
          created_at: new Date().toISOString()
        }]);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content: "Connection error. Please check your internet and try again! 🔄",
        created_at: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    try {
      await fetch('http://localhost:8000/api/chat/clear', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMessages([]);
    } catch (err) {
      console.error('Failed to clear chat:', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 w-96 h-[500px] bg-white rounded-t-2xl shadow-2xl border border-gray-200 flex flex-col z-50 mr-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-t-2xl flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h3 className="font-bold">EduBot</h3>
            <p className="text-xs text-white/80">Your EduPilot Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Clear chat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {sessionLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎓</span>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Welcome to EduBot!</h4>
            <p className="text-sm text-gray-600 mb-4">
              I'm here to help you navigate EduPilot. Ask me anything about the platform!
            </p>
            <div className="space-y-2">
              <button
                onClick={() => setInputValue("How do I add a new course?")}
                className="w-full text-left text-sm bg-white p-3 rounded-lg border border-gray-200 hover:border-cyan-300 transition-colors"
              >
                💡 How do I add a new course?
              </button>
              <button
                onClick={() => setInputValue("How can I generate my CV?")}
                className="w-full text-left text-sm bg-white p-3 rounded-lg border border-gray-200 hover:border-cyan-300 transition-colors"
              >
                💡 How can I generate my CV?
              </button>
              <button
                onClick={() => setInputValue("What features does EduPilot have?")}
                className="w-full text-left text-sm bg-white p-3 rounded-lg border border-gray-200 hover:border-cyan-300 transition-colors"
              >
                💡 What features does EduPilot have?
              </button>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-br-md'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-md p-3 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm text-gray-500">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about EduPilot..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !inputValue.trim()}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-2 rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          Chat history saved for 7 days
        </p>
      </div>
    </div>
  );
}

export default EduBot;
