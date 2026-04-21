import React, { useState } from 'react';

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

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChat) return;

    const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const chatKey = activeChat.phone;
    
    if (!messages[chatKey]) {
      messages[chatKey] = [];
    }

    setMessages(prev => ({
      ...prev,
      [chatKey]: [
        ...(prev[chatKey] || []),
        { sender: 'Bạn', time: now, text: messageInput }
      ]
    }));

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
                <div style={styles.msgLeft}>Chào Spa, tôi muốn hỏi về dịch vụ.</div>
                <div style={styles.msgRight}>Chào {activeChat.name}, Spa có thể giúp gì cho bạn?</div>
                {messages[activeChat.phone] && messages[activeChat.phone].map((msg, idx) => (
                  <div key={idx} style={msg.sender === 'Bạn' ? styles.msgRight : styles.msgLeft}>
                    {msg.text}
                  </div>
                ))}
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
