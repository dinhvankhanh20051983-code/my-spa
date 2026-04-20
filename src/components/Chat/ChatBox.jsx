import React, { useState } from 'react';

const ChatBox = ({ receiverName }) => {
  const [messages, setMessages] = useState([{ id: 1, text: "Chào bạn!", sender: 'other' }]);
  const [input, setInput] = useState('');

  const send = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, sender: 'me' }]);
    setInput('');
  };

  return (
    <div style={chatBoxContainer}>
      <div style={chatHeader}>Đang chat với: {receiverName || "Khách hàng"}</div>
      <div style={msgList}>
        {messages.map(m => (
          <div key={m.id} style={{ textAlign: m.sender === 'me' ? 'right' : 'left', margin: '10px 0' }}>
            <span style={{ 
              padding: '8px 12px', 
              borderRadius: '10px', 
              display: 'inline-block',
              backgroundColor: m.sender === 'me' ? '#10b981' : '#334155' 
            }}>
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={send} style={inputGroup}>
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          style={inputField} 
          placeholder="Nhập tin nhắn..."
        />
        <button type="submit" style={btnSend}>Gửi</button>
      </form>
    </div>
  );
};

// Styles nội bộ cho ChatBox
const chatBoxContainer = { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#1e293b', borderRadius: '15px', color: 'white' };
const chatHeader = { padding: '15px', borderBottom: '1px solid #334155', fontWeight: 'bold' };
const msgList = { flex: 1, padding: '15px', overflowY: 'auto' };
const inputGroup = { padding: '15px', display: 'flex', gap: '10px', borderTop: '1px solid #334155' };
const inputField = { flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: 'white' };
const btnSend = { padding: '10px 20px', backgroundColor: '#10b981', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' };

export default ChatBox;