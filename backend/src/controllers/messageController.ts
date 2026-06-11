import { Request, Response } from 'express';
import Message from '../models/Message.js';
import User from '../models/User.js';

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req: any, res: Response) => {
  try {
    const { receiverId, listingId, content } = req.body;
    const senderId = req.user._id;

    if (!receiverId || !listingId || !content) {
      res.status(400).json({ message: 'Please provide receiverId, listingId, and content' });
      return;
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      listing: listingId,
      content,
    });

    // Populate sender info for the real-time response
    const populatedMessage = await Message.findById(message._id).populate('sender', 'name avatar');
    
    res.status(201).json(populatedMessage);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get messages for a conversation (listing + two users)
// @route   GET /api/messages/:listingId/:otherUserId
// @access  Private
const getMessages = async (req: any, res: Response) => {
  try {
    const { listingId, otherUserId } = req.params;
    const currentUserId = req.user._id;

    const messages = await Message.find({
      listing: listingId,
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ],
    })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 }); // Oldest first for chat UI

    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all conversations for the logged-in user
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = async (req: any, res: Response) => {
  try {
    const currentUserId = req.user._id;

    // Find all unique listings the user has chatted about
    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
      .populate('listing', 'title images')
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .sort({ createdAt: -1 });

    // Deduplicate to get the latest message per conversation
    const conversationsMap = new Map();
    
    messages.forEach((msg: any) => {
      // The "other" user in the conversation
      const otherUserId = msg.sender._id.toString() === currentUserId.toString() 
        ? msg.receiver._id.toString() 
        : msg.sender._id.toString();
        
      const key = `${msg.listing._id}-${otherUserId}`;
      
      if (!conversationsMap.has(key)) {
        conversationsMap.set(key, {
          listing: msg.listing,
          otherUser: msg.sender._id.toString() === currentUserId.toString() ? msg.receiver : msg.sender,
          lastMessage: msg.content,
          updatedAt: msg.createdAt,
          unread: msg.receiver._id.toString() === currentUserId.toString() && !msg.read
        });
      }
    });

    const conversations = Array.from(conversationsMap.values());
    res.json(conversations);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export { sendMessage, getMessages, getConversations };