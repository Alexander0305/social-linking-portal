
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip, Image, Smile } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface Message {
  id: string;
  content: string;
  sender: 'me' | 'other';
  timestamp: string;
}

interface ChatContactProps {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isOnline: boolean;
  isActive: boolean;
  onClick: () => void;
}

const ChatContact: React.FC<ChatContactProps> = ({ 
  name, avatar, lastMessage, timestamp, unread, isOnline, isActive, onClick 
}) => {
  return (
    <div 
      className={`flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-muted transition-colors
        ${isActive ? 'bg-muted' : ''}`}
      onClick={onClick}
    >
      <div className="relative">
        <Avatar>
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-1 ring-white"></span>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-sm truncate">{name}</h3>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{timestamp}</span>
        </div>
        <p className="text-xs text-muted-foreground truncate">{lastMessage}</p>
      </div>
      {unread > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
          {unread}
        </span>
      )}
    </div>
  );
};

const ChatInterface = () => {
  const [contacts, setContacts] = useState([
    { id: '1', name: 'John Doe', avatar: '', lastMessage: 'Hey, how are you?', timestamp: '10:30 AM', unread: 2, isOnline: true },
    { id: '2', name: 'Jane Smith', avatar: '', lastMessage: 'Let\'s meet tomorrow', timestamp: 'Yesterday', unread: 0, isOnline: true },
    { id: '3', name: 'Mike Johnson', avatar: '', lastMessage: 'Thanks for your help!', timestamp: 'Yesterday', unread: 0, isOnline: false },
    { id: '4', name: 'Sarah Williams', avatar: '', lastMessage: 'Can you send me the files?', timestamp: '2 days ago', unread: 0, isOnline: false },
  ]);
  
  const [activeContact, setActiveContact] = useState('1');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', content: 'Hey there!', sender: 'other', timestamp: '10:30 AM' },
    { id: '2', content: 'Hi! How are you?', sender: 'me', timestamp: '10:31 AM' },
    { id: '3', content: 'I\'m good, thanks! How about you?', sender: 'other', timestamp: '10:32 AM' },
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages([...messages, newMsg]);
      setNewMessage('');
      
      // Update the last message in contacts
      setContacts(contacts.map(contact => 
        contact.id === activeContact 
          ? { ...contact, lastMessage: newMessage, timestamp: 'Just now', unread: 0 }
          : contact
      ));
    }
  };

  const handleContactClick = (contactId: string) => {
    setActiveContact(contactId);
    // Mark as read
    setContacts(contacts.map(contact => 
      contact.id === contactId 
        ? { ...contact, unread: 0 }
        : contact
    ));
  };

  const activeContactData = contacts.find(c => c.id === activeContact);

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)]">
      {/* Contacts List */}
      <div className="w-80 border-r overflow-y-auto h-full">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Messages</h2>
        </div>
        <div className="py-2">
          {contacts.map(contact => (
            <ChatContact 
              key={contact.id}
              {...contact}
              isActive={activeContact === contact.id}
              onClick={() => handleContactClick(contact.id)}
            />
          ))}
        </div>
      </div>
      
      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        {activeContactData && (
          <div className="p-4 border-b flex items-center gap-3">
            <Avatar>
              <AvatarImage src={activeContactData.avatar} alt={activeContactData.name} />
              <AvatarFallback>{activeContactData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{activeContactData.name}</h3>
              <p className="text-xs text-muted-foreground">
                {activeContactData.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        )}
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.sender === 'me' 
                    ? 'bg-primary text-primary-foreground rounded-tr-none' 
                    : 'bg-muted rounded-tl-none'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <span className="text-xs mt-1 opacity-70 block text-right">{message.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Message Input */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Image className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Smile className="h-5 w-5" />
            </Button>
            <Input 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
