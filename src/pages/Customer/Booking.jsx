import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const Booking = () => {
  const navigate = useNavigate();
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState('09:00');

  const customers = [
    { id: 101, name: 'Nguyễn Thùy Linh', phone: '0912345678' },
    { id: 102, name: 'Trần Minh Tâm', phone: '0988777666' },
  ];

  const staffList = [
    { id: 1, name: 'KTV Thảo', status: 'Trống' },
    { id: 2, name: 'KTV Linh', status: 'Đang bận' },
  ];

  const filteredCustomers = useMemo(() => {
    if (!searchTerm || selectedCustomer) return [];
    return customers.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm)
    );
  }, [searchTerm, selectedCustomer]);

  const handleConfirm = () => {
    alert("Đã đặt lịch thành công! Thông báo đã gửi tới Nhân viên và Chủ Spa.");
    navigate('/customer');
  };

  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <h2 style={{ color: '#a78bfa', textAlign: 'center' }}>Phiếu Đặt Lịch</h2>
      <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '20px', maxWidth: '500px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label style={labelS}>Khách hàng</label>
            <div style={{ display: 'flex', gap: '5px' }}>
              <button onClick={() => { setIsNewCustomer(false); setSelectedCustomer(null); setSearchTerm(''); }} style={!isNewCustomer ? btnOn : btnOff}>Cũ</button>
              <button onClick={() => setIsNewCustomer(true)} style={isNewCustomer ? btnOn : btnOff}>Mới</button>
            </div>
          </div>
          {isNewCustomer ? (
            <div style={{ display: 'grid', gap: '8px' }}>
              <input placeholder="Họ tên..." style={inputS} />
              <input placeholder="Số điện thoại..." style={inputS} />
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <input placeholder="🔍 Tìm tên hoặc SĐT..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={inputS} />
              {filteredCustomers.length > 0 && (
                <div style={dropS}>
                  {filteredCustomers.map(c => (
                    <div key={c.id} onClick={() => { setSelectedCustomer(c); setSearchTerm(c.name); }} style={dropItemS}>{c.name} - {c.phone}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
          <div><label style={labelS}>Ngày</label><input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} style={inputS} /></div>
          <div><label style={labelS}>Giờ</label><input type="time" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} style={inputS} /></div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelS}>Kỹ thuật viên</label>
          <select style={inputS}>
            {staffList.map(s => <option key={s.id}>{s.name} ({s.status})</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelS}>Dịch vụ / Liệu trình</label>
          <select style={inputS}>
            <option>Massage Body</option>
            <option>Trị mụn chuyên sâu (Buổi 3/10)</option>
            <option>Gội đầu dưỡng sinh</option>
          </select>
        </div>

        <button onClick={handleConfirm} style={{ width: '100%', padding: '15px', borderRadius: '12px', backgroundColor: '#a78bfa', border: 'none', color: 'white', fontWeight: 'bold' }}>XÁC NHẬN</button>
      </div>
    </div>
  );
};

const labelS = { fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' };
const inputS = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', boxSizing: 'border-box' };
const btnOn = { padding: '4px 10px', borderRadius: '6px', backgroundColor: '#a78bfa', color: 'white', border: 'none', fontSize: '11px' };
const btnOff = { padding: '4px 10px', borderRadius: '6px', backgroundColor: '#334155', color: '#94a3b8', border: 'none', fontSize: '11px' };
const dropS = { position: 'absolute', width: '100%', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', zIndex: 10 };
const dropItemS = { padding: '10px', cursor: 'pointer', borderBottom: '1px solid #334155' };

export default Booking;