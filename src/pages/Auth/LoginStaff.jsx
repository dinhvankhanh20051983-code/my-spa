import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LoginStaff = () => {
  const [password, setPassword] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get('role');

  const handleLogin = (e) => {
    e.preventDefault();
    // Demo mật khẩu: Nhân viên là 1111, Chủ là 9999
    if ((role === 'employee' && password === '1111') || (role === 'owner' && password === '9999')) {
      navigate(role === 'employee' ? '/employee' : '/owner');
    } else {
      alert('Sai mật khẩu rồi bạn ơi!');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
      <form onSubmit={handleLogin} style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '24px', width: '300px', textAlign: 'center' }}>
        <h2 style={{ color: '#a78bfa' }}>{role === 'owner' ? 'Chủ Spa' : 'Nhân Viên'}</h2>
        <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>Vui lòng nhập mã PIN truy cập</p>
        
        <input 
          type="password" 
          placeholder="****" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '15px', borderRadius: '12px', border: 'none', backgroundColor: '#0f172a', color: 'white', textAlign: 'center', fontSize: '24px', letterSpacing: '10px', marginBottom: '20px' }}
        />
        
        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '15px' }}>Đăng nhập</button>
        <button type="button" onClick={() => navigate('/')} style={{ marginTop: '15px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>Quay lại</button>
      </form>
    </div>
  );
};

export default LoginStaff;