import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import OwnerDashboard from './pages/Owner/OwnerDashboard';
import CustomerDashboard from './pages/Customer/CustomerDashboard';
import EmployeeDashboard from './pages/Staff/EmployeeDashboard';
import Booking from './pages/Customer/Booking';
import Store from './pages/Customer/Store';

// --- 1. DANH SÁCH TÀI KHOẢN (Chỉ cần lưu SĐT và Tên) ---
const SYSTEM_USERS = {
  owners: [
    { phone: "0909123456", name: "Chủ Spa Admin" } // Pass mặc định: 23456
  ],
  staffs: [
    { phone: "0905111222", name: "KTV Thảo", id: 201 }, // Pass mặc định: 11222
    { phone: "0905333444", name: "KTV Lan", id: 202 }   // Pass mặc định: 33444
  ],
  customers: [
    { phone: "0905666777", name: "Nguyễn Anh Thư", id: 301 } // Pass mặc định: 66777
  ]
};

// --- 2. MÀN HÌNH ĐĂNG NHẬP THÔNG MINH ---
const LoginScreen = ({ onLogin }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Logic Bảo mật: Lấy 5 số cuối của số điện thoại vừa nhập
    const lastFiveDigits = phone.slice(-5);

    // Kiểm tra tính hợp lệ của mật khẩu (Phải khớp với 5 số cuối SĐT)
    if (password !== lastFiveDigits) {
      setError('Mật khẩu phải là 5 số cuối của số điện thoại!');
      return;
    }

    // Sau khi khớp Pass, bắt đầu tìm kiếm Vai trò trong Database
    let foundUser = null;
    let role = '';

    // Tìm trong nhóm Owner
    foundUser = SYSTEM_USERS.owners.find(u => u.phone === phone);
    if (foundUser) role = 'owner';

    // Nếu không thấy, tìm trong nhóm Nhân viên
    if (!foundUser) {
      foundUser = SYSTEM_USERS.staffs.find(u => u.phone === phone);
      if (foundUser) role = 'staff';
    }

    // Nếu vẫn không thấy, tìm trong nhóm Khách hàng
    if (!foundUser) {
      foundUser = SYSTEM_USERS.customers.find(u => u.phone === phone);
      if (foundUser) role = 'customer';
    }

    if (foundUser) {
      onLogin(role, foundUser);
    } else {
      setError('Số điện thoại này không tồn tại trên hệ thống!');
    }
  };

  return (
    <div style={loginContainer}>
      <form style={loginForm} onSubmit={handleLoginSubmit}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#10b981', margin: '0' }}>SPA SYSTEM</h2>
          <p style={{ color: '#94a3b8', fontSize: '12px' }}>Đăng nhập bằng SĐT & 5 số cuối</p>
        </div>

        <div style={inputGroup}>
          <label style={labelStyle}>SỐ ĐIỆN THOẠI</label>
          <input 
            type="tel" 
            placeholder="Nhập số điện thoại đăng ký..." 
            style={inputStyle}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required 
          />
        </div>

        <div style={inputGroup}>
          <label style={labelStyle}>MẬT KHẨU (5 SỐ CUỐI SĐT)</label>
          <input 
            type="password" 
            placeholder="*****" 
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>

        {error && <div style={errorBox}>{error}</div>}

        <button type="submit" style={btnSubmit}>XÁC THỰC VÀ ĐĂNG NHẬP</button>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#475569' }}>
          Ghi chú: Mật khẩu mặc định là 5 chữ số cuối của số điện thoại bạn đang dùng.
        </div>
      </form>
    </div>
  );
};

// --- 5. COMPONENT CHÍNH (APP ENTRY) ---
export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (role, userData) => {
    setUser({ role, ...userData });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) return <LoginScreen onLogin={handleLogin} />;

  const defaultPath = user.role === 'customer' ? '/customer' : user.role === 'staff' ? '/employee' : '/owner';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a' }}>
      {user.role === 'owner' && (
        <button onClick={handleLogout} style={btnFloatExit}>🔒 ĐĂNG XUẤT AN TOÀN</button>
      )}
      <Routes>
        <Route path="/" element={<Navigate to={defaultPath} replace />} />
        <Route path="/customer" element={user.role === 'customer' ? <CustomerDashboard onLogout={handleLogout} /> : <Navigate to={defaultPath} replace />} />
        <Route path="/customer/booking" element={user.role === 'customer' ? <Booking /> : <Navigate to={defaultPath} replace />} />
        <Route path="/customer/store" element={user.role === 'customer' ? <Store /> : <Navigate to={defaultPath} replace />} />
        <Route path="/employee" element={user.role === 'staff' ? <EmployeeDashboard user={user} onLogout={handleLogout} /> : <Navigate to={defaultPath} replace />} />
        <Route path="/owner" element={user.role === 'owner' ? <OwnerDashboard /> : <Navigate to={defaultPath} replace />} />
        <Route path="*" element={<Navigate to={defaultPath} replace />} />
      </Routes>
    </div>
  );
}

// --- HỆ THỐNG CSS (STYLING) ---
const loginContainer = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', fontFamily: 'sans-serif', padding: '20px' };
const loginForm = { backgroundColor: '#1e293b', padding: '40px', borderRadius: '25px', width: '100%', maxWidth: '360px', border: '1px solid #334155', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' };
const inputGroup = { marginBottom: '20px' };
const labelStyle = { color: '#10b981', fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '8px' };
const inputStyle = { width: '100%', padding: '15px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: 'white', boxSizing: 'border-box', outline: 'none', fontSize: '16px' };
const btnSubmit = { width: '100%', padding: '16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' };
const errorBox = { color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px', textAlign: 'center' };

const simpleLayout = { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', color: 'white' };
const cardFull = { backgroundColor: '#1e293b', padding: '40px', borderRadius: '30px', textAlign: 'center', width: '380px', border: '1px solid #334155' };
const subText = { color: '#94a3b8', fontSize: '14px', marginBottom: '30px' };
const menuGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' };
const menuItem = { backgroundColor: '#0f172a', padding: '15px', borderRadius: '12px', fontSize: '12px', textAlign: 'center', border: '1px solid #334155' };
const btnExit = { width: '100%', padding: '12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' };

const btnFloatExit = {
  position: 'fixed', bottom: '20px', left: '20px', zIndex: 10000,
  padding: '10px 15px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold'
};