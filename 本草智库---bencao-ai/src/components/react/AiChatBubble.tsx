// src/components/react/AiChatBubble.tsx
import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Bot } from 'lucide-react';

// 定义接收自 Vue 的属性类型
export interface AiChatBubbleProps {
  content: string;
  isTyping?: boolean;
}

export const AiChatBubble: React.FC<AiChatBubbleProps> = ({ content, isTyping }) => {
  return (
    // 使用 framer-motion 实现平滑的入场和内容更新动画
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex gap-4 p-5 bg-emerald-50 rounded-2xl shadow-sm border border-emerald-100/60"
    >
      <div className="flex-shrink-0 w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-inner">
        <Bot size={26} />
      </div>
      
      <div className="prose prose-emerald max-w-none text-gray-700 w-full pt-1">
        {isTyping && content === '' ? (
          <div className="flex items-center gap-1 h-full">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        ) : (
          <ReactMarkdown>{content}</ReactMarkdown>
        )}
      </div>
    </motion.div>
  );
};