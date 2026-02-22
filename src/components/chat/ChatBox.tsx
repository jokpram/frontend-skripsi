import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import api from '../../services/api'; // Menggunakan instance axios yang ada
import { MessageCircle, X, Send, User } from 'lucide-react';
import type { RootState } from '../../store';

interface Conversation {
    otherId: number;
    otherRole: string;
    name: string;
    lastMessage: string;
    time: string;
    unread: number;
}

interface Message {
    id: number;
    sender_id: number;
    sender_role: string;
    receiver_id: number;
    receiver_role: string;
    content: string;
    is_read: boolean;
    created_at: string;
}

const CHAT_SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000';

const ChatBox = () => {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [isOpen, setIsOpen] = useState(false);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeChat, setActiveChat] = useState<{ id: number; role: string; name: string } | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMsg, setInputMsg] = useState('');
    const [, setSocket] = useState<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial load and socket connect
    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const newSocket = io(CHAT_SERVER_URL);

        newSocket.on('connect', () => {
            newSocket.emit('join_room', `${user.role}_${user.id}`);
        });

        newSocket.on('new_message', (msg: Message) => {
            // Jika chat ini sedang aktif
            if (activeChat &&
                ((msg.sender_id === activeChat.id && msg.sender_role === activeChat.role) ||
                    (msg.sender_id === user.id && msg.sender_role === user.role))) {
                setMessages(prev => [...prev, msg]);
            }
            fetchConversations(); // refresh list
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, user]);

    useEffect(() => {
        if (isOpen && isAuthenticated) {
            fetchConversations();
        }
    }, [isOpen, isAuthenticated]);

    useEffect(() => {
        if (activeChat) {
            fetchMessages(activeChat.id, activeChat.role);
        }
    }, [activeChat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const res = await api.get('/chat/conversations');
            setConversations(res.data);
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        }
    };

    const fetchMessages = async (id: number, role: string) => {
        try {
            const res = await api.get(`/chat/messages/${role}/${id}`);
            setMessages(res.data);
            fetchConversations(); // Update unread count
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMsg.trim() || !activeChat) return;

        try {
            await api.post('/chat/messages', {
                receiverId: activeChat.id,
                receiverRole: activeChat.role,
                content: inputMsg
            });
            setInputMsg('');
            // Optimistic update handled by socket
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    if (!isAuthenticated) return null;

    const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-4 shadow-xl transition-transform hover:scale-105 relative"
                >
                    <MessageCircle size={28} />
                    {totalUnread > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-bounce">
                            {totalUnread}
                        </span>
                    )}
                </button>
            )}

            {/* Chat Overlay */}
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col overflow-hidden border border-slate-200" style={{ height: '500px', maxHeight: '80vh' }}>
                    {/* Header */}
                    <div className="bg-emerald-600 p-4 text-white flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">{activeChat ? activeChat.name : 'Pesan'}</h3>
                            {activeChat && <p className="text-xs text-emerald-100 capitalize">{activeChat.role}</p>}
                        </div>
                        <div className="flex gap-2">
                            {activeChat && (
                                <button onClick={() => setActiveChat(null)} className="hover:bg-emerald-500 p-1 rounded transition-colors">
                                    <span className="text-sm font-bold">Kembali</span>
                                </button>
                            )}
                            <button onClick={() => setIsOpen(false)} className="hover:bg-emerald-500 p-1 rounded transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 bg-slate-50 overflow-hidden flex flex-col">
                        {!activeChat ? (
                            // Conversation List
                            <div className="flex-1 overflow-y-auto">
                                {conversations.length === 0 ? (
                                    <div className="p-8 text-center text-slate-400">
                                        <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                                        <p>Belum ada pesan.</p>
                                    </div>
                                ) : (
                                    conversations.map(conv => (
                                        <div
                                            key={`${conv.otherRole}_${conv.otherId}`}
                                            onClick={() => setActiveChat({ id: conv.otherId, role: conv.otherRole, name: conv.name })}
                                            className="p-4 border-b border-slate-100 hover:bg-slate-100 cursor-pointer flex justify-between items-center transition-colors"
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="bg-emerald-100 p-2 rounded-full text-emerald-600 flex-shrink-0">
                                                    <User size={20} />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <h4 className="font-bold text-sm text-slate-800 truncate">{conv.name} <span className="text-xs font-normal text-slate-400">({conv.otherRole})</span></h4>
                                                    <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
                                                </div>
                                            </div>
                                            {conv.unread > 0 && (
                                                <span className="bg-emerald-500 text-white text-xs font-bold rounded-full h-5 w-5 flex flex-shrink-0 items-center justify-center shadow-sm">
                                                    {conv.unread}
                                                </span>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        ) : (
                            // Messages View
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messages.map(msg => {
                                        const isMe = msg.sender_id === user!.id && msg.sender_role === user!.role;
                                        return (
                                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${isMe ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-bl-none'}`}>
                                                    <p className="text-sm">{msg.content}</p>
                                                    <span className={`text-[10px] block mt-1 ${isMe ? 'text-emerald-200' : 'text-slate-400'}`}>
                                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>
                                <form onSubmit={sendMessage} className="bg-white p-3 border-t border-slate-200 flex gap-2">
                                    <input
                                        type="text"
                                        value={inputMsg}
                                        onChange={(e) => setInputMsg(e.target.value)}
                                        placeholder="Ketik pesan..."
                                        className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!inputMsg.trim()}
                                        className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-full p-2 h-10 w-10 flex items-center justify-center transition-colors"
                                    >
                                        <Send size={16} />
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBox;
