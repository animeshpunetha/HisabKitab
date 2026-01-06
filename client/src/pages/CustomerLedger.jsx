import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useTransactionStore from '../store/transactionStore';
import useAuthStore from '../store/authStore';
import { Pencil, Trash2, X, Send, Image as ImageIcon, Paperclip, Copy } from 'lucide-react';
import { API_URL } from '../services/api';

const CustomerLedger = () => {
    const { customerId } = useParams();
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const fileInputRef = useRef(null);

    const customer = useTransactionStore((state) => state.customer);
    const transactions = useTransactionStore((state) => state.transactions);
    const messages = useTransactionStore((state) => state.messages);
    const fetchTransactions = useTransactionStore((state) => state.fetchTransactions);
    const fetchMessages = useTransactionStore((state) => state.fetchMessages);
    const addTransaction = useTransactionStore((state) => state.addTransaction);
    const updateTransaction = useTransactionStore((state) => state.updateTransaction);
    const deleteTransaction = useTransactionStore((state) => state.deleteTransaction);
    const addMessage = useTransactionStore((state) => state.addMessage);
    const loading = useTransactionStore((state) => state.loading);
    const user = useAuthStore((state) => state.user);

    const handleWhatsAppRemind = () => {
        if (!customer) return;
        const message = generateReminderMessage();
        const encodedMessage = encodeURIComponent(message);

        const cleanPhone = customer.phone.replace(/\D/g, '');
        const phoneNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    };

    const handleCopyMessage = async () => {
        if (!customer) return;
        const message = generateReminderMessage();
        try {
            await navigator.clipboard.writeText(message);
            alert('Reminder message copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const generateReminderMessage = () => {
        const absBalance = Math.abs(balance);
        const senderName = user?.name || 'Store Owner';
        return `Namaste ${customer.name},\nAapka ₹${absBalance} pending hai.\nKripya jaldi payment karein.`;
    };

    // Transaction Form State
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [isAddMode, setIsAddMode] = useState(false);
    const [transactionType, setTransactionType] = useState('CREDIT'); // CREDIT or DEBIT
    const [editingTransaction, setEditingTransaction] = useState(null);

    // Message Input State
    const [messageInput, setMessageInput] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (customerId) {
            fetchTransactions(customerId);
            fetchMessages(customerId);
        }
    }, [customerId, fetchTransactions, fetchMessages]);

    // Scroll to bottom on new items
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [transactions, messages]);

    // --- Message Handling ---
    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImageSelection = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim() && !selectedImage) return;

        try {
            const formData = new FormData();
            formData.append('customerId', customerId);
            if (messageInput.trim()) formData.append('content', messageInput);
            if (selectedImage) formData.append('image', selectedImage);

            await addMessage(formData);

            setMessageInput('');
            clearImageSelection();
        } catch (error) {
            alert('Failed to send message');
        }
    };

    // --- Transaction Handling ---
    const handleTransactionSubmit = async (e) => {
        e.preventDefault();
        try {
            const transactionData = {
                amount: parseFloat(amount),
                type: transactionType,
                description,
                customerId,
            };

            if (editingTransaction) {
                await updateTransaction(editingTransaction.id, transactionData);
            } else {
                await addTransaction(transactionData);
            }

            closeModal();
        } catch (error) {
            alert(error.message || 'Operation failed');
        }
    };

    const deleteHandler = async (transactionId) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await deleteTransaction(transactionId);
            } catch (error) {
                alert('Failed to delete transaction');
            }
        }
    };

    const openAddTransaction = (type) => {
        setTransactionType(type);
        setEditingTransaction(null);
        setAmount('');
        setDescription('');
        setIsAddMode(true);
    };

    const openEditTransaction = (txn) => {
        setEditingTransaction(txn);
        setTransactionType(txn.type);
        setAmount(txn.amount.toString());
        setDescription(txn.description || '');
        setIsAddMode(true);
    };

    const closeModal = () => {
        setIsAddMode(false);
        setEditingTransaction(null);
        setAmount('');
        setDescription('');
    };

    const isEditable = (dateStr) => {
        const txnDate = new Date(dateStr);
        const now = new Date();
        const diffInMs = now - txnDate;
        const oneHourInMs = 60 * 60 * 1000;
        return diffInMs < oneHourInMs;
    };

    // --- Timeline Construction ---
    const timelineItems = [
        ...transactions.map(t => ({ ...t, itemType: 'TRANSACTION', sortDate: new Date(t.date) })),
        ...messages.map(m => ({ ...m, itemType: 'MESSAGE', sortDate: new Date(m.createdAt) }))
    ].sort((a, b) => a.sortDate - b.sortDate);

    // Calculate balance
    const balance = transactions.reduce((acc, txn) => {
        return txn.type === 'CREDIT' ? acc + txn.amount : acc - txn.amount;
    }, 0);


    return (
        <div className="fixed inset-0 flex flex-col bg-gray-50 z-50">
            {/* Header fixed at top (relative in flex) */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm flex-none">
                <div className="mx-auto flex max-w-4xl items-center gap-4">
                    <button
                        onClick={() => navigate('/customers')}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                    >
                        &larr;
                    </button>
                    <div className="flex items-center gap-3 flex-1">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                            {customer?.name?.charAt(0) || 'C'}
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 leading-tight">{customer?.name || 'Loading...'}</h1>
                        </div>
                    </div>
                    {/* Actions */}
                    <div className="flex gap-2 items-center">
                        <button
                            onClick={handleCopyMessage}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full shadow-sm transition-colors"
                            title="Copy Reminder Message"
                        >
                            <Copy size={18} />
                        </button>
                        <button
                            onClick={handleWhatsAppRemind}
                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-sm transition-colors"
                            title="Send WhatsApp Reminder"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Fixed Balance Banner */}
            <div className="bg-white/90 backdrop-blur border-b border-gray-200 py-2 text-center shadow-sm z-10 flex-none">
                <p className={`text-sm font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Current Balance: ₹{Math.abs(balance)} {balance >= 0 ? '(Advance)' : '(Due)'}
                </p>
            </div>

            {/* Chat/Timeline Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50"
            >
                <div className="mx-auto max-w-4xl space-y-6 pb-4">
                    {loading && timelineItems.length === 0 && (
                        <div className="text-center py-8 text-gray-500">Loading history...</div>
                    )}

                    {timelineItems.map((item) => {
                        const isTransaction = item.itemType === 'TRANSACTION';

                        if (isTransaction) {
                            return (
                                <div key={`txn-${item.id}`} className="flex justify-center w-full px-4">
                                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between max-w-lg w-full transition-transform hover:scale-[1.01]">
                                        <div className="flex items-center gap-4">
                                            {/* Avatar Area */}
                                            {item.type === 'CREDIT' ? (
                                                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl">
                                                    ↓
                                                </div>
                                            ) : (
                                                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xl">
                                                    ↑
                                                </div>
                                            )}

                                            {/* Text Content */}
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 text-base">
                                                    {item.description || (item.type === 'CREDIT' ? 'Payment Received' : 'Credit Given')}
                                                </span>
                                                <span className="text-xs text-gray-500 font-medium">
                                                    {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(item.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Right Side: Amount & Actions */}
                                        <div className="flex items-center gap-4">
                                            <span className={`text-lg font-bold ${item.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                                                ₹{item.amount}
                                            </span>

                                            {isEditable(item.date) && (
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => openEditTransaction(item)}
                                                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteHandler(item.id)}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        } else {
                            // Message Bubble
                            const isOutgoing = item.direction === 'OUTGOING';
                            return (
                                <div key={`msg-${item.id}`} className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'} px-4`}>
                                    <div className={`relative max-w-[85%] sm:max-w-[70%] rounded-2xl px-5 py-3 shadow-sm ${isOutgoing
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                        }`}>
                                        {item.type === 'IMAGE' && item.mediaUrl && (
                                            <div className="mb-2 rounded-lg overflow-hidden max-w-xs">
                                                <img
                                                    src={`${API_URL}${item.mediaUrl}`}
                                                    alt="attachment"
                                                    className="w-full h-48 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                                                    onClick={() => window.open(`${API_URL}${item.mediaUrl}`, '_blank')}
                                                />
                                            </div>
                                        )}
                                        {item.content && <p className="text-sm sm:text-base whitespace-pre-wrap leading-relaxed">{item.content}</p>}
                                        <p className={`text-[10px] sm:text-xs mt-1 text-right font-medium ${isOutgoing ? 'text-blue-200' : 'text-gray-400'}`}>
                                            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            );
                        }
                    })}
                </div>
            </div>

            {/* Transaction Buttons (Fixed above input) */}
            <div className="grid grid-cols-2 gap-3 px-4 py-2 bg-white border-t border-gray-100 flex-none">
                <button
                    onClick={() => openAddTransaction('DEBIT')}
                    className="flex items-center justify-center gap-2 rounded-xl bg-red-50 py-3 text-sm font-bold text-red-600 border border-red-100 hover:bg-red-100 transition-colors shadow-sm"
                >
                    You Gave <span className="text-lg">−</span>
                </button>
                <button
                    onClick={() => openAddTransaction('CREDIT')}
                    className="flex items-center justify-center gap-2 rounded-xl bg-green-50 py-3 text-sm font-bold text-green-600 border border-green-100 hover:bg-green-100 transition-colors shadow-sm"
                >
                    You Got <span className="text-lg">+</span>
                </button>
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-3 flex-none">
                <div className="mx-auto max-w-4xl">
                    {imagePreview && (
                        <div className="mb-3 flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 w-fit shadow-sm">
                            <img src={imagePreview} alt="Preview" className="h-24 w-24 object-cover rounded-lg" />
                            <button onClick={clearImageSelection} className="text-gray-400 hover:text-red-500 transition-colors bg-white rounded-full p-1 shadow-sm hover:shadow-md">
                                <X size={18} />
                            </button>
                        </div>
                    )}
                    <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-3 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ImageIcon size={24} />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageSelect}
                            accept="image/*"
                            className="hidden"
                        />
                        <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all">
                            <textarea
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                placeholder="Type a message..."
                                className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 py-1 text-gray-800 placeholder-gray-400"
                                rows="1"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!messageInput.trim() && !selectedImage}
                            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>

            {/* Transaction Modal (Same as before) */}
            {isAddMode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="glass-card w-full max-w-md p-6 animate-slide-up bg-white">
                        <div className="mb-6 flex items-start justify-between">
                            <div className="text-center w-full">
                                <h2 className={`text-xl font-bold ${transactionType === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                                    {editingTransaction ? 'Edit Transaction' : (transactionType === 'CREDIT' ? 'Record Payment' : 'Give Credit')}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {editingTransaction ? 'Update details' : 'Enter transaction details'}
                                </p>
                            </div>
                            <button onClick={closeModal} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleTransactionSubmit} className="space-y-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-600">Amount</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-gray-400 pointer-events-none">₹</span>
                                    <input
                                        type="number"
                                        className="input-field !pl-6 text-xl font-bold"
                                        value={amount}
                                        min="0"
                                        onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0"
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-600">Description (Optional)</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="e.g. Milk, Cash, etc."
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`flex-1 rounded-xl py-3 font-bold text-white shadow-lg transition active:scale-95 disabled:opacity-70 ${transactionType === 'CREDIT' ? 'bg-green-500 shadow-green-500/30 hover:bg-green-600' : 'bg-red-500 shadow-red-500/30 hover:bg-red-600'}`}
                                >
                                    {editingTransaction ? 'Update' : 'Confirm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerLedger;
