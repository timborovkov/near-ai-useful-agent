'use client';

import { useEffect, useRef, useState } from 'react';

import ReactMarkdown from 'react-markdown';

import { useAgent } from '@/hooks/use-agent';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, isThinking } = useAgent();

  // Ref for the messages container
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-scroll whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onSendMessage = async () => {
    if (!input.trim() || isThinking) return;
    const message = input;
    setInput('');
    await sendMessage(message);
  };

  return (
    <div className='flex h-full w-full flex-grow flex-col items-center justify-center text-black dark:text-white'>
      <div className='flex h-[70vh] w-full max-w-2xl flex-col rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800'>
        {/* Chat Messages */}
        <div className='flex-grow space-y-3 overflow-y-auto p-2'>
          {messages.length === 0 ? (
            <p className='text-center text-gray-500'>
              Start chatting with AgentKit...
            </p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`rounded-2xl p-3 shadow ${
                  msg.sender === 'user'
                    ? 'self-end bg-[#0052FF] text-white'
                    : 'self-start bg-gray-100 dark:bg-gray-700'
                }`}
              >
                <ReactMarkdown
                  components={{
                    a: (props) => (
                      <a
                        {...props}
                        className='text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
                        target='_blank'
                        rel='noopener noreferrer'
                      />
                    ),
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
            ))
          )}

          {/* Thinking Indicator */}
          {isThinking && (
            <div className='mr-2 text-right italic text-gray-500'>
              🤖 Thinking...
            </div>
          )}

          {/* Invisible div to track the bottom */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Box */}
        <div className='mt-2 flex items-center space-x-2'>
          <input
            type='text'
            className='flex-grow rounded border p-2 dark:border-gray-600 dark:bg-gray-700'
            placeholder={'Type a message...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
            disabled={isThinking}
          />
          <button
            onClick={onSendMessage}
            className={`rounded-full px-6 py-2 font-semibold transition-all ${
              isThinking
                ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                : 'bg-[#0052FF] text-white shadow-md hover:bg-[#003ECF]'
            }`}
            disabled={isThinking}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
