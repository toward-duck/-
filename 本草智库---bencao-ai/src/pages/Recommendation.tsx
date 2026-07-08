
import React, { useState, useRef, useEffect } from 'react';
import { aiService } from '../services/ai';
import { ChatMessage, ChatSession } from '../types';
import { 
  LoaderIcon, 
  SendIcon, 
  MessageCircleIcon, 
  UserIcon, 
  PlusIcon, 
  TrashIcon, 
  HistoryIcon,
  MenuIcon,
  XIcon
} from '../components/ui/icons';
import Markdown from 'react-markdown';

const STORAGE_KEY = 'tcm_chat_sessions';

const Recommendation: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const aiModelName = import.meta.env.VITE_AI_MODEL || 'AI 助手';

  // Load sessions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSessions(parsed);
        if (parsed.length > 0) {
          setCurrentSessionId(parsed[0].id);
        }
      } catch (e) {
        console.error('Failed to parse chat sessions', e);
      }
    }
  }, []);

  // Save sessions to localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startNewChat = () => {
    const newId = Date.now().toString();
    const newSession: ChatSession = {
      id: newId,
      title: '新对话',
      messages: [
        {
          id: 'welcome-' + newId,
          role: 'model',
          text: '您好，我是您的智能中医助手。请告诉我您哪里不舒服，或者想咨询哪方面的养生建议？',
          timestamp: Date.now()
        }
      ],
      updatedAt: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newId);
    setIsSidebarOpen(false);
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    if (currentSessionId === id) {
      setCurrentSessionId(updated.length > 0 ? updated[0].id : null);
    }
    if (updated.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    let sessionId = currentSessionId;
    let updatedSessions = [...sessions];

    // Create session if none exists
    if (!sessionId) {
      sessionId = Date.now().toString();
      const newSession: ChatSession = {
        id: sessionId,
        title: input.slice(0, 20) + (input.length > 20 ? '...' : ''),
        messages: [],
        updatedAt: Date.now()
      };
      updatedSessions = [newSession, ...updatedSessions];
      setSessions(updatedSessions);
      setCurrentSessionId(sessionId);
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    // Update session with user message
    const sessionIndex = updatedSessions.findIndex(s => s.id === sessionId);
    const session = updatedSessions[sessionIndex];
    
    // Update title if it's the first user message
    if (session.messages.length <= 1) {
      session.title = input.slice(0, 20) + (input.length > 20 ? '...' : '');
    }

    session.messages = [...session.messages, userMsg];
    session.updatedAt = Date.now();
    setSessions([...updatedSessions]);
    
    setInput('');
    setIsLoading(true);

    try {
      const modelMsgId = (Date.now() + 1).toString();
      const modelMsg: ChatMessage = { id: modelMsgId, role: 'model', text: '', timestamp: Date.now() };
      
      session.messages = [...session.messages, modelMsg];
      setSessions([...updatedSessions]);

      const apiMessages = session.messages
        .filter(m => m.text !== '')
        .map(m => ({
          role: m.role === 'model' ? 'assistant' : 'user',
          content: m.text
        }));

      let fullText = '';
      const stream = aiService.sendMessageStream(apiMessages);
      
      for await (const chunk of stream) {
        fullText += chunk;
        session.messages = session.messages.map(msg => 
          msg.id === modelMsgId ? { ...msg, text: fullText } : msg
        );
        setSessions([...updatedSessions]);
      }

    } catch (error: any) {
      console.error(error);
      const errorText = error.message || '抱歉，系统暂时繁忙，请稍后再试。';
        
      session.messages = [...session.messages, {
        id: Date.now().toString(),
        role: 'model',
        text: errorText,
        isError: true,
        timestamp: Date.now()
      }];
      setSessions([...updatedSessions]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-white rounded-2xl shadow-lg border border-tcm-100 overflow-hidden relative">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="absolute inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        absolute lg:relative inset-y-0 left-0 w-64 bg-tcm-50 border-r border-tcm-100 z-30 transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 flex flex-col h-full">
          <button 
            onClick={startNewChat}
            className="flex items-center justify-center gap-2 w-full bg-tcm-700 hover:bg-tcm-800 text-white py-2.5 rounded-xl transition-colors shadow-sm mb-4"
          >
            <PlusIcon className="w-4 h-4" />
            <span>开启新对话</span>
          </button>

          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
            <div className="flex items-center gap-2 text-tcm-600 text-xs font-medium px-2 mb-2">
              <HistoryIcon className="w-3 h-3" />
              <span>历史记录</span>
            </div>
            
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-tcm-400 text-sm italic">
                暂无历史记录
              </div>
            ) : (
              sessions.map(s => (
                <div 
                  key={s.id}
                  onClick={() => {
                    setCurrentSessionId(s.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all
                    ${currentSessionId === s.id ? 'bg-tcm-200 text-tcm-900 shadow-sm' : 'hover:bg-tcm-100 text-tcm-700'}
                  `}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <MessageCircleIcon className={`w-4 h-4 flex-shrink-0 ${currentSessionId === s.id ? 'text-tcm-700' : 'text-tcm-400'}`} />
                    <span className="truncate text-sm font-medium">{s.title}</span>
                  </div>
                  <button 
                    onClick={(e) => deleteSession(e, s.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 hover:text-red-600 rounded-md transition-all"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="bg-tcm-800 p-4 flex items-center justify-between shadow-md z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-white p-1 hover:bg-white/10 rounded-md"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <div className="bg-white/10 p-2 rounded-full hidden sm:block">
              <MessageCircleIcon className="text-white w-5 h-5" />
            </div>
            <div>
               <h2 className="text-white font-medium truncate max-w-[200px] sm:max-w-none">
                 {currentSession?.title || '中医智能问诊'}
               </h2>
               <p className="text-tcm-300 text-xs">Powered by {aiModelName}</p>
            </div>
          </div>
          
          {currentSessionId && (
            <button 
              onClick={startNewChat}
              className="sm:hidden text-white p-2 hover:bg-white/10 rounded-full"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-paper">
          {!currentSessionId && sessions.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="bg-tcm-100 p-6 rounded-full mb-4">
                <MessageCircleIcon className="w-12 h-12 text-tcm-600" />
              </div>
              <h3 className="text-xl font-serif font-bold text-tcm-800 mb-2">开启您的中医健康咨询</h3>
              <p className="text-tcm-600 max-w-md">
                告诉我们您的症状或疑问，我们的智能助手将为您提供专业的中医养生建议。
              </p>
              <button 
                onClick={startNewChat}
                className="mt-6 bg-tcm-700 hover:bg-tcm-800 text-white px-8 py-3 rounded-xl transition-all shadow-md font-medium"
              >
                立即开始
              </button>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 sm:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 flex items-center justify-center ${
                    msg.role === 'user' ? 'bg-tcm-600' : 'bg-tcm-100 border border-tcm-200'
                  }`}>
                    {msg.role === 'user' ? (
                      <UserIcon className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <span className="text-tcm-800 font-serif font-bold text-sm sm:text-base">医</span>
                    )}
                  </div>
                  
                  <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-tcm-600 text-white rounded-tr-none' 
                      : 'bg-white border border-tcm-100 text-tcm-900 rounded-tl-none'
                  } ${msg.isError ? 'bg-red-50 text-red-600 border-red-200' : ''}`}>
                     {msg.role === 'model' ? (
                       <div className="prose prose-sm prose-emerald max-w-none">
                         <Markdown>{msg.text}</Markdown>
                         {msg.text === '' && <span className="animate-pulse">...</span>}
                       </div>
                     ) : (
                       <p className="whitespace-pre-wrap text-sm sm:text-base">{msg.text}</p>
                     )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="p-4 bg-white border-t border-tcm-100">
          <div className="relative flex items-end gap-2 max-w-4xl mx-auto">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="描述您的症状或疑问..."
              className="flex-1 bg-tcm-50 border border-tcm-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-tcm-500 outline-none resize-none min-h-[50px] max-h-[150px]"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-tcm-700 hover:bg-tcm-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors shadow-sm mb-0.5"
            >
              {isLoading ? <LoaderIcon className="animate-spin w-5 h-5" /> : <SendIcon className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">
            AI生成内容仅供参考，不可替代专业医疗诊断。
          </p>
        </div>
      </div>
    </div>
  );
};

export default Recommendation;
