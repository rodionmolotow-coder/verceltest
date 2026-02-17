import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 shadow-md text-sm sm:text-base leading-relaxed ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-none'
            : 'bg-gray-800 text-gray-100 rounded-bl-none border border-gray-700'
        }`}
      >
        <p className="whitespace-pre-wrap font-medium">{message.text}</p>
        <div
          className={`text-[10px] mt-2 opacity-70 ${
            isUser ? 'text-indigo-200' : 'text-gray-400'
          }`}
        >
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;