import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginCustomer = () => {
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (phone.length >= 10) {
      // Sau này sẽ gọi API gửi OTP ở đây
      navigate('/booking');
    } else {
      alert('Vui lòng nhập số điện thoại hợp lệ');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '350px', textAlign: 'center' }}>
        <h2 style={{ color: '#a78bfa', marginBottom: '10px' }}>Chào mừng bạn!</h2>
        <p style={{ color: '#94a3b8', marginBottom: '30px', fontSize: '14px' }}>Nhập số điện thoại để tiếp tục đặt lịch</p>
        
        <form onSubmit={handleLogin}>
          <input 
            type="tel" 
            placeholder="090x xxx xxx" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ width: '100%', padding: '18px', borderRadius: '15px', border: '1px solid #334155', backgroundColor: '#1e293b', color: 'white', fontSize: '18px', marginBottom: '20px', textAlign: 'center' }}
          />
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '18px', fontSize: '16px' }}>
            Tiếp tục
          </button>
        </form>
        
        <button onClick={() => navigate('/')} style={{ marginTop: '20px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
          Thay đổi vai trò
        </button>
      </div>
    </div>
  );
};

export default LoginCustomer;