import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, ArrowLeft, Loader2, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Inbox = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [searchParams] = useSearchParams();
  const preSelectListing = searchParams.get('listing');
  const preSelectUser = searchParams.get('user');

  const { toast } = useToast();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=inbox');
      return;
    }

    fetchConversations();
  }, [navigate]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (activeChat) {
      fetchMessages(activeChat.listing._id, activeChat.otherUser._id);
      
      // REST Polling every 3 seconds
      interval = setInterval(() => {
        pollMessages(activeChat.listing._id, activeChat.otherUser._id);
      }, 3000);
    } else if (preSelectListing && preSelectUser && conversations.length > 0) {
      // Handle "Chat with Seller" deep link
      const existingChat = conversations.find(c => c.listing._id === preSelectListing && c.otherUser._id === preSelectUser);
      if (existingChat) {
        setActiveChat(existingChat);
      } else {
        // Create a temporary active chat object to start a new conversation
        // Real app would fetch the listing and user details here, we'll do a basic version
        setActiveChat({
          listing: { _id: preSelectListing, title: 'New Conversation' },
          otherUser: { _id: preSelectUser, name: 'Seller' }
        });
      }
    }

    return () => clearInterval(interval);
  }, [activeChat, preSelectListing, preSelectUser, conversations]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const { data } = await API.get('/messages/conversations');
      setConversations(data);
    } catch (error) {
      console.error('Failed to fetch conversations', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (listingId: string, otherUserId: string) => {
    setChatLoading(true);
    try {
      const { data } = await API.get(`/messages/${listingId}/${otherUserId}`);
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages', error);
    } finally {
      setChatLoading(false);
    }
  };

  const pollMessages = async (listingId: string, otherUserId: string) => {
    try {
      const { data } = await API.get(`/messages/${listingId}/${otherUserId}`);
      // Only update state if new messages arrived to prevent unnecessary re-renders
      if (data.length !== messages.length) {
        setMessages(data);
      }
    } catch (error) {
      console.error('Failed to poll messages', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const messageContent = newMessage;
    setNewMessage(''); // Optimistic clear

    try {
      const { data } = await API.post('/messages', {
        listingId: activeChat.listing._id,
        receiverId: activeChat.otherUser._id,
        content: messageContent
      });
      
      setMessages([...messages, data]);
      fetchConversations(); // Update left sidebar last message
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to send message' });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-[70vh]"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl h-[calc(100vh-80px)] flex">
      <div className="bg-white border border-border shadow-sm rounded-[32px] overflow-hidden flex w-full h-full">
        
        {/* Left Sidebar: Conversations List */}
        <div className={`w-full md:w-1/3 border-r border-border flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 border-b border-border bg-slate-50">
            <h1 className="text-2xl font-black">Messages</h1>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {conversations.length === 0 ? (
              <div className="text-center text-muted-foreground p-8">
                <MessageSquare className="mx-auto w-12 h-12 mb-4 opacity-20" />
                <p className="font-bold">No messages yet</p>
                <p className="text-sm">Start chatting with sellers to see them here.</p>
              </div>
            ) : (
              conversations.map((chat) => (
                <button
                  key={`${chat.listing._id}-${chat.otherUser._id}`}
                  onClick={() => setActiveChat(chat)}
                  className={`w-full text-left p-4 rounded-2xl transition-all ${activeChat?.otherUser._id === chat.otherUser._id ? 'bg-primary/10 border-primary/20' : 'hover:bg-slate-50 border-transparent'} border`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border border-border">
                      <AvatarFallback className="bg-primary/5 text-primary font-bold">
                        {chat.otherUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-sm truncate">{chat.otherUser.name}</h3>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {new Date(chat.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-semibold truncate mb-1">{chat.listing.title}</p>
                      <p className="text-sm text-foreground truncate">{chat.lastMessage}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Area: Active Chat Thread */}
        <div className={`flex-1 flex-col ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
          {!activeChat ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-slate-50/50">
              <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
              <h3 className="text-xl font-bold">Select a conversation</h3>
              <p>Choose a chat from the left to start messaging.</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border bg-white flex items-center gap-4">
                <button className="md:hidden p-2 rounded-full hover:bg-slate-100" onClick={() => setActiveChat(null)}>
                  <ArrowLeft size={20} />
                </button>
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarFallback className="bg-primary text-white font-bold">
                    {activeChat.otherUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold">{activeChat.otherUser.name}</h3>
                  <p className="text-xs text-muted-foreground font-semibold">{activeChat.listing.title}</p>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 flex flex-col gap-4">
                {chatLoading ? (
                  <div className="flex-1 flex justify-center items-center"><Loader2 className="animate-spin text-primary w-6 h-6" /></div>
                ) : messages.length === 0 ? (
                  <div className="flex-1 flex justify-center items-center text-muted-foreground font-bold">Say hello to {activeChat.otherUser.name}!</div>
                ) : (
                  messages.map((msg, idx) => {
                    const isMe = msg.sender._id === userInfo._id;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        key={msg._id || idx} 
                        className={`flex flex-col max-w-[75%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
                      >
                        <div className={`p-4 rounded-[24px] ${isMe ? 'bg-primary text-white rounded-br-sm' : 'bg-white border border-border rounded-bl-sm shadow-sm'}`}>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-1 px-1 font-semibold">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </motion.div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-border bg-white">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <Input 
                    placeholder="Type your message..." 
                    className="h-14 rounded-full bg-slate-100 border-transparent px-6 font-medium focus-visible:ring-primary"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button type="submit" disabled={!newMessage.trim()} className="h-14 w-14 rounded-full bg-primary shadow-lg shadow-primary/20 shrink-0 p-0">
                    <Send size={20} className="ml-1" />
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inbox;