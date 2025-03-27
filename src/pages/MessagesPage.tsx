
import React from 'react';
import ChatInterface from '@/components/messaging/ChatInterface';

const MessagesPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      <ChatInterface />
    </div>
  );
};

export default MessagesPage;
