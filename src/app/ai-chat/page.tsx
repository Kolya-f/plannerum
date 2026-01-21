'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Download, Moon, Sun, Sparkles, Key, Zap } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '👋 Привіт! Я AI-помічник Plannerum. Тепер я працюю з реальним AI (Groq API)! Чим можу допомогти?',
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline' | 'demo'>('checking');
  const [apiKeyPreview, setApiKeyPreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Перевірка статусу API при завантаженні
  useEffect(() => {
    checkApiStatus();
  }, []);

  // Автоматична прокрутка до останнього повідомлення
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Автоматичне збільшення висоти textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const checkApiStatus = async () => {
    try {
      const response = await fetch('/api/chat/simple');
      const data = await response.json();
      
      if (data.has_api_key) {
        setApiStatus('online');
        setApiKeyPreview(data.key_preview);
      } else {
        setApiStatus('demo');
      }
    } catch (error) {
      setApiStatus('offline');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: data.message,
          role: 'assistant',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            content: `❌ Помилка: ${data.error}`,
            role: 'assistant',
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: '❌ Помилка підключення до сервера',
          role: 'assistant',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm('Ви впевнені, що хочете очистити весь чат?')) {
      setMessages([
        {
          id: '1',
          content: apiStatus === 'online' 
            ? '👋 Чат очищено! Я готовий допомогти з плануванням подій!'
            : '👋 Чат очищено! (Демо-режим)',
          role: 'assistant',
          timestamp: new Date(),
        },
      ]);
    }
  };

  const exportChat = () => {
    const chatText = messages
      .map((msg) => `${msg.role === 'user' ? '👤 Ви' : '🤖 AI'}: ${msg.content}`)
      .join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plannerum-chat-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const getApiStatusText = () => {
    switch (apiStatus) {
      case 'online': return '🟢 API активний';
      case 'offline': return '🔴 API недоступний';
      case 'demo': return '🟡 Демо-режим';
      default: return '⚪ Перевірка...';
    }
  };

  const getApiStatusColor = () => {
    switch (apiStatus) {
      case 'online': return 'text-green-600';
      case 'offline': return 'text-red-600';
      case 'demo': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <Bot className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Plannerum AI Помічник</h1>
                <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Ваш особистий AI-асистент для планування та продуктивності
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3 rounded-full ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} shadow-md transition-colors`}
              aria-label={isDarkMode ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">AI Модель</p>
                  <p className="font-semibold">Llama 3.1 8B</p>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Send className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Повідомлень</p>
                  <p className="font-semibold">{messages.length}</p>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Bot className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Статус</p>
                  <p className={`font-semibold ${getApiStatusColor()}`}>
                    {getApiStatusText()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Key className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">API Ключ</p>
                  <p className="font-semibold text-sm">
                    {apiKeyPreview || 'Не знайдено'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-1/4">
            <div className={`rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 shadow-lg sticky top-6`}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5" /> Налаштування
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Модель AI</label>
                  <select 
                    className={`w-full p-3 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    defaultValue="llama-3.1-8b-instant"
                  >
                    <option value="llama-3.1-8b-instant">Llama 3.1 8B (швидка)</option>
                    <option value="mixtral-8x7b-32768">Mixtral 8x7B (потужна)</option>
                    <option value="gemma2-9b-it">Gemma 2 9B</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Температура</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    defaultValue="0.7"
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>Точний</span>
                    <span>Креативний</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium mb-3">Дії</p>
                  <div className="space-y-2">
                    <button
                      onClick={clearChat}
                      className="flex items-center gap-2 w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Очистити чат
                    </button>
                    
                    <button
                      onClick={exportChat}
                      className="flex items-center gap-2 w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Експортувати чат
                    </button>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} mt-4`}>
                  <h3 className="font-medium mb-2">💡 Поради для Plannerum</h3>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>"Допоможи спланувати подію на 50 осіб"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>"Як організувати зустріч онлайн?"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>"Розкажи про можливості Plannerum"</span>
                    </li>
                  </ul>
                </div>

                {apiStatus === 'demo' && (
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200'} border mt-4`}>
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <Key className="h-4 w-4" /> Увага
                    </h3>
                    <p className="text-sm">
                      Демо-режим. Для реального AI додайте <code className="text-xs">GROQ_API_KEY</code> в <code className="text-xs">.env.local</code>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Chat Area */}
          <main className="lg:w-3/4">
            <div className={`rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl flex flex-col h-[600px]`}>
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === 'user' 
                          ? 'bg-blue-500' 
                          : 'bg-purple-500'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-white" />
                        )}
                      </div>
                      
                      <div className={`max-w-[80%] ${message.role === 'user' ? 'items-end' : ''}`}>
                        <div className={`p-4 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-bl-none`
                        }`}>
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        </div>
                        
                        <div className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} ${
                          message.role === 'user' ? 'text-right' : ''
                        }`}>
                          {message.timestamp.toLocaleTimeString('uk-UA', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="max-w-[80%]">
                        <div className={`p-4 rounded-2xl rounded-bl-none ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <div className="flex gap-2">
                            <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"></div>
                            <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <div className="flex-1 relative">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Напишіть ваше повідомлення... (Shift+Enter для нового рядка)"
                      className={`w-full p-4 pr-12 rounded-xl border resize-none min-h-[60px] max-h-[200px] focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300'
                      }`}
                      rows={1}
                    />
                    <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                      Enter ↵
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="self-end px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    <Send className="h-5 w-5" />
                    <span className="hidden sm:inline">Надіслати</span>
                  </button>
                </form>
                
                <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    Швидкі запити:
                  </span>
                  <button
                    type="button"
                    onClick={() => setInput("Допоможи спланувати подію на 50 осіб")}
                    className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Планування події
                  </button>
                  <button
                    type="button"
                    onClick={() => setInput("Як організувати зустріч у Plannerum?")}
                    className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Зустрічі
                  </button>
                  <button
                    type="button"
                    onClick={() => setInput("Розкажи про Plannerum")}
                    className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Про Plannerum
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Footer Note */}
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>
            {apiStatus === 'online' ? (
              <>🚀 <strong>Реальний AI</strong> активний! Питання про планування подій, зустрічей та продуктивність.</>
            ) : (
              <>💡 <strong>Демо-версія</strong>. Для роботи з реальним AI додайте API ключ у налаштуваннях.</>
            )}
          </p>
        </footer>
      </div>
    </div>
  );
}
