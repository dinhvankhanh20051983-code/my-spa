import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginByPhone = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#a78bfa', fontSize: '36px', fontWeight: 'bold', margin: '0' }}>LOTUS SPA</h1>
        <p style={{ color: '#94a3b8' }}>Trải nghiệm dịch vụ đẳng cấp</p>
      </div>
      
      <div style={{ width: '100%', maxWidth: '350px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Điều hướng Khách hàng sang trang nhập SĐT */}
        <button onClick={() => navigate('/login-customer')} className="card-item" style={roleBtnStyle('#a78bfa')}>
          <span style={iconCircle}>👤</span>
          <div>
            <div style={{ fontWeight: 'bold' }}>Khách hàng</div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>Đặt lịch & Nhận ưu đãi</div>
          </div>
        </button>
        
        {/* Điều hướng Nhân viên/Chủ sang trang nhập mã PIN */}
        <button onClick={() => navigate('/login-staff?role=employee')} className="card-item" style={roleBtnStyle('#10b981')}>
          <span style={iconCircle}>💼</span>
          <div>
            <div style={{ fontWeight: 'bold' }}>Nhân viên</div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>Quản lý lịch làm việc</div>
          </div>
        </button>

        <button onClick={() => navigate('/login-staff?role=owner')} className="card-item" style={roleBtnStyle('#f472b6')}>
          <span style={iconCircle}>👑</span>
          <div>
            <div style={{ fontWeight: 'bold' }}>Chủ Spa</div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>Quản trị hệ thống</div>
          </div>
        </button>
      </div>
    </div>
  );
};

const roleBtnStyle = (color) => ({
  display: 'flex', alignItems: 'center', gap: '15px', padding: '20px',
  backgroundColor: '#1e293b', border: `1px solid ${color}33`,
  borderRadius: '20px', color: 'white', cursor: 'pointer', fontSize: '16px'
});

const iconCircle = {
  width: '45px', height: '45px', backgroundColor: '#0f172a',
  borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
};

export default LoginByPhone;