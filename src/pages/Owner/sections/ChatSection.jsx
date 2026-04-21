import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export const ChatSection = ({
  chatType,
  setChatType,
  activeChat,
  setActiveChat,
  chatSearch,
  setChatSearch,
  filteredList,
  styles
}) => {
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState({});

  const loadChatMessages = async () => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      const grouped = data.reduce((acc, msg) => {
        const key = msg.target_phone || msg.chat_key || 'general';
        acc[key] = acc[key] || [];
        acc[key].push(msg);
        return acc;
      }, {});
      setMessages(grouped);
    }
  };

  useEffect(() => {
    loadChatMessages();
  }, []);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeChat) return;

    const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const chatKey = activeChat.phone;
    const newMessage = {
      chat_type: chatType,
      sender: 'Bạn',
      target_phone: activeChat.phone,
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
            placeholder="🔍 Tìm tên..."
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
                {messages[activeChat.phone] && messages[activeChat.phone].length > 0 ? (
                  messages[activeChat.phone].map((msg, idx) => {
                    const timeLabel = msg.created_at ? new Date(msg.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : msg.time || '';
                    return (
                      <div key={idx} style={msg.sender === 'Bạn' ? styles.msgRight : styles.msgLeft}>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                          <strong>{msg.sender}</strong> {timeLabel && `• ${timeLabel}`}
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
