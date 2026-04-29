import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';

const normalizePhone = (phone) => {
  if (!phone) return '';
  const digits = phone.toString().replace(/\D/g, '');
  if (digits.startsWith('84')) return '0' + digits.slice(2);
  if (digits.startsWith('0')) return digits;
  return digits;
};

const isOwnerSenderValue = (sender) => {
  if (!sender) return false;
  const name = sender.toString().trim().toLowerCase();
  return ['bạn', 'chủ spa', 'spa', 'owner', 'admin', '0909123456'].includes(name) || normalizePhone(sender) === normalizePhone('0909123456');
};

const getCustomerKeyFromMessage = (msg, filteredList = []) => {
  if (!msg) return '';
  const sender = msg.sender?.toString().trim();
  const target = normalizePhone(msg.target_phone);
  const senderIsOwner = isOwnerSenderValue(sender);

  if (msg.chat_type === 'customer_owner' || msg.chat_type === 'customer') {
    if (senderIsOwner) {
      return target;
    }

    const fromCustomer = sender;
    const matchByName = filteredList.find(u => u.name?.toLowerCase().trim() === fromCustomer?.toLowerCase());
    return matchByName ? normalizePhone(matchByName.phone) : normalizePhone(sender);
  }

  if (senderIsOwner) {
    return target;
  }

  return normalizePhone(msg.target_phone) || normalizePhone(msg.sender);
};

export const ChatSection = ({
  chatType,
  setChatType,
  activeChat,
  setActiveChat,
  chatSearch,
  setChatSearch,
  filteredList = [],
  styles
}) => {
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState({});

  const activeKey = activeChat?.phone ? normalizePhone(activeChat.phone) : '';
  const fallbackKey = activeChat?.name?.toLowerCase() || '';
  const activeMessages = activeChat ? messages[activeKey] || messages[fallbackKey] || [] : [];

  const loadChatMessages = async () => {
    if (!filteredList || filteredList.length === 0) {
      console.log('Waiting for filteredList to load before chat grouping');
      return;
    }

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      const grouped = data.reduce((acc, msg) => {
        const key = getCustomerKeyFromMessage(msg, filteredList);
        if (!key) return acc;
        acc[key] = acc[key] || [];
        acc[key].push(msg);
        return acc;
      }, {});
      setMessages(grouped);
      console.log('📨 Loaded chat messages:', grouped);
    }
  };

  useEffect(() => {
    if (filteredList && filteredList.length > 0) {
      loadChatMessages();
    }
  }, [filteredList]);

  useEffect(() => {
    // Subscribe to realtime chat messages
    const chatSubscription = supabase
      .channel('chat_messages_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages' }, (payload) => {
        console.log('📨 New chat message received:', payload);
        
        if (payload.eventType === 'INSERT' && payload.new) {
          const newMsg = payload.new;
          const key = getCustomerKeyFromMessage(newMsg, filteredList);
          if (!key) {
            console.log('⚠️ Realtime chat message skipped because no conversation key could be determined', newMsg);
            return;
          }

          setMessages(prev => ({
            ...prev,
            [key]: [...(prev[key] || []), newMsg]
          }));
          
          console.log('✅ Chat message added to UI for conversation:', key);
        }
      })
      .subscribe((status) => {
        console.log('📡 Chat subscription status:', status);
      });

    return () => {
      chatSubscription.unsubscribe();
    };
  }, []);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeChat) return;

    const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const chatKey = normalizePhone(activeChat.phone);
    const newMessage = {
      chat_type: chatType,
      sender: 'Bạn',
      target_phone: normalizePhone(activeChat.phone),
      text: messageInput,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from('chat_messages').insert([newMessage]).select();
    if (!error && data && data.length > 0) {
      setMessages(prev => ({
        ...prev,
        [chatKey]: [...(prev[chatKey] || []), data[0]]
      }));
    } else {
      setMessages(prev => ({
        ...prev,
        [chatKey]: [...(prev[chatKey] || []), { ...newMessage, time: now }]
      }));
      if (error) console.error('Supabase insert chat failed:', error);
    }

    setMessageInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>💬 TIN NHẮN & GIAO TIẾP</h3>

      <div style={{ display: 'flex', marginBottom: '15px', backgroundColor: '#1e293b', borderRadius: '10px', overflow: 'hidden' }}>
        <button
          style={chatType === 'staff' ? { ...styles.chatTab, backgroundColor: '#10b981', color: 'white' } : { ...styles.chatTab }}
          onClick={() => { setChatType('staff'); setActiveChat(null); setMessageInput(''); }}
        >
          💡 Nội bộ
        </button>
        <button
          style={chatType === 'customer' ? { ...styles.chatTab, backgroundColor: '#10b981', color: 'white' } : { ...styles.chatTab }}
          onClick={() => { setChatType('customer'); setActiveChat(null); setMessageInput(''); }}
        >
          👤 Khách hàng
        </button>
      </div>

      <div style={styles.chatContainer}>
        {/* Sidebar danh sách */}
        <div style={styles.chatSidebar}>
          <input
            style={{ ...styles.input, padding: '8px', fontSize: '12px', marginBottom: '10px' }}
            placeholder="🔍 Tìm tên hoặc SĐT..."
            value={chatSearch}
            onChange={(e) => setChatSearch(e.target.value)}
          />
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filteredList.map(user => (
              <div
                key={user.phone}
                onClick={() => setActiveChat(user)}
                style={{
                  padding: '10px',
                  borderBottom: '1px solid #334155',
                  cursor: 'pointer',
                  backgroundColor: activeChat?.phone === user.phone ? '#334155' : 'transparent',
                  borderLeft: activeChat?.phone === user.phone ? '4px solid #10b981' : 'none'
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{user.name}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>📞 {user.phone}</div>
                <div style={{ fontSize: '11px', color: '#10b981' }}>● Online</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main chat */}
        <div style={styles.chatMain}>
          {activeChat ? (
            <>
              <div style={{ fontWeight: 'bold', paddingBottom: '10px', borderBottom: '1px solid #334155' }}>
                Chat với: {activeChat.name}
              </div>
              <div style={styles.chatHistory}>
                {activeMessages.length > 0 ? (
                  activeMessages.map((msg, idx) => {
                    const timeLabel = msg.created_at ? new Date(msg.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : msg.time || '';
                    const senderLabel = msg.sender === 'Bạn'
                      ? 'Bạn'
                      : msg.sender === activeChat.phone
                      ? activeChat.name
                      : msg.sender;
                    return (
                      <div key={idx} style={msg.sender === 'Bạn' ? styles.msgRight : styles.msgLeft}>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                          <strong>{senderLabel}</strong> {timeLabel && '• ' + timeLabel}
                        </div>
                        <div>{msg.text}</div>
                      </div>
                    );
                  })
                ) : (
                  <>
                    <div style={styles.msgLeft}>Chào Spa, tôi muốn hỏi về dịch vụ.</div>
                    <div style={styles.msgRight}>Chào {activeChat.name}, Spa có thể giúp gì cho bạn?</div>
                  </>
                )}
              </div>
              <div style={styles.chatInputArea}>
                <input 
                  style={{ ...styles.input, marginBottom: 0, flex: 1 }} 
                  placeholder="Nhập tin nhắn..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button style={styles.btnPrimary} onClick={handleSendMessage}>GỬI</button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#94a3b8' }}>
              Vui lòng chọn một người để bắt đầu trò chuyện
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
