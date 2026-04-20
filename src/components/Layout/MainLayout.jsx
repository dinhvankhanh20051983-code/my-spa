import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const MainLayout = ({ children }) => {
  const location = useLocation();

  // Danh sách menu điều hướng
  const menuItems = [
    { path: '/', label: 'Trang chủ', icon: '🏠' },
    { path: '/booking', label: 'Đặt lịch', icon: '📅' },
    { path: '/customer', label: 'Của tôi', icon: '👤' },
    { path: '/employee', label: 'Nhân viên', icon: '💼' },
    { path: '/owner', label: 'Quản lý', icon: '📊' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 1. Header (Thanh tiêu đề trên cùng) */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-purple-600">LOTUS SPA</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100">🔔</button>
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              👤
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Content (Nội dung thay đổi theo từng trang) */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-6 mb-20">
        {children}
      </main>

      {/* 3. Bottom Navigation (Thanh menu dưới cùng - App Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 z-20">
        <div className="max-w-7xl mx-auto flex justify-around items-center">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  isActive ? 'text-purple-600' : 'text-gray-500 hover:text-purple-400'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs font-medium mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

// ĐÂY LÀ DÒNG QUAN TRỌNG NHẤT ĐỂ SỬA LỖI CỦA BẠN
export default MainLayout;