import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const Booking = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState('10:00');
  const [staffName, setStaffName] = useState('KTV Thảo');
  const [serviceType, setServiceType] = useState('Massage Body');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const customers = [
    { id: 101, name: 'Nguyễn Thùy Linh', phone: '0912345678' },
    { id: 102, name: 'Trần Minh Tâm', phone: '0988777666' },
  ];

  const staffList = [
    { id: 1, name: 'KTV Thảo', status: 'Trống' },
    { id: 2, name: 'KTV Linh', status: 'Đang bận' },
  ];

  const services = [
    'Massage Body',
    'Trị mụn chuyên sâu (Buổi 3/10)',
    'Gội đầu dưỡng sinh',
    'Chăm sóc da mặt VIP'
  ];

  const filteredCustomers = useMemo(() => {
    if (!searchTerm || isNewCustomer) return [];
    return customers.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm)
    );
  }, [searchTerm, isNewCustomer]);

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCustomerName(customer.name);
    setCustomerPhone(customer.phone);
    setSearchTerm(customer.name);
  };

  const saveBookingToSupabase = async (bookingData) => {
    const { data, error } = await supabase.from('appointments').insert([bookingData]);
    if (error) {
      console.error('Supabase lưu lịch hẹn thất bại:', error);
      return { error };
    }
    console.log('Supabase lưu lịch hẹn thành công:', data);
    return { data };
  };

  const handleConfirm = async () => {
    const customer = {
      name: customerName.trim() || searchTerm.trim(),
      phone: customerPhone.trim()
    };

    if (!customer.name || !customer.phone) {
      return alert('Vui lòng nhập đầy đủ họ tên và số điện thoại.');
    }

    if (customer.phone.length < 9) {
      return alert('Số điện thoại phải có ít nhất 9 chữ số.');
    }

    const newBooking = {
      customer_name: customer.name,
      customer_phone: customer.phone,
      service: serviceType,
      staff: staffName,
      date: bookingDate,
      time: bookingTime,
      status: 'pending',
      note: 'Đặt lịch từ khách hàng',
      created_at: new Date().toISOString()
    };

    const localHistory = JSON.parse(localStorage.getItem('spa_customer_bookings') || '[]');
    localStorage.setItem('spa_customer_bookings', JSON.stringify([...localHistory, newBooking]));

    setIsSubmitting(true);
    try {
      const { error } = await saveBookingToSupabase(newBooking);
      if (error) {
        alert('Lịch hẹn đã được lưu cục bộ. Supabase chưa lưu được. Vui lòng kiểm tra cấu hình.');
      } else {
        alert('Đã đặt lịch thành công và đồng bộ dữ liệu lên Supabase.');
      }
    } catch (err) {
      console.error(err);
      alert('Có lỗi khi lưu lịch. Kiểm tra lại kết nối Supabase.');
    } finally {
      setIsSubmitting(false);
      navigate('/customer');
    }
  };

  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <button onClick={() => navigate('/customer')} style={btnBack}>← Quay lại</button>
        <button onClick={onLogout} style={btnLogout}>Đăng xuất</button>
      </div>

      <h2 style={{ color: '#a78bfa', textAlign: 'center', marginBottom: '10px' }}>Đặt lịch nhanh</h2>
      <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '24px' }}>Chọn dịch vụ, kỹ thuật viên và xác nhận. Hệ thống xử lý đồng bộ Supabase.</p>

      <div style={{ backgroundColor: '#1e293b', padding: '22px', borderRadius: '24px', maxWidth: '520px', margin: '0 auto', border: '1px solid #334155' }}>
        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label style={labelS}>Khách hàng</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { setIsNewCustomer(false); setSelectedCustomer(null); setSearchTerm(''); setCustomerName(''); setCustomerPhone(''); }} style={!isNewCustomer ? btnOptionActive : btnOption}>Khách cũ</button>
              <button onClick={() => { setIsNewCustomer(true); setSelectedCustomer(null); setSearchTerm(''); setCustomerName(''); setCustomerPhone(''); }} style={isNewCustomer ? btnOptionActive : btnOption}>Khách mới</button>
            </div>
          </div>

          {isNewCustomer ? (
            <div style={{ display: 'grid', gap: '12px' }}>
              <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Họ tên khách" style={inputS} />
              <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Số điện thoại" style={inputS} />
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <input value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setSelectedCustomer(null); }} placeholder="🔍 Tìm tên hoặc SĐT" style={inputS} />
              {filteredCustomers.length > 0 && (
                <div style={dropS}>
                  {filteredCustomers.map(c => (
                    <div key={c.id} onClick={() => handleSelectCustomer(c)} style={dropItemS}>{c.name} • {c.phone}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
          <div>
            <label style={labelS}>Ngày</label>
            <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} style={inputS} />
          </div>
          <div>
            <label style={labelS}>Giờ</label>
            <input type="time" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} style={inputS} />
          </div>
        </div>

        <label style={labelS}>KTV</label>
        <select value={staffName} onChange={(e) => setStaffName(e.target.value)} style={inputS}>
          {staffList.map(s => <option key={s.id} value={s.name}>{s.name} ({s.status})</option>)}
        </select>

        <label style={{ ...labelS, marginTop: '18px' }}>Dịch vụ</label>
        <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} style={{ ...inputS, marginBottom: '20px' }}>
          {services.map(item => <option key={item} value={item}>{item}</option>)}
        </select>

        <div style={{ backgroundColor: '#111827', borderRadius: '18px', padding: '18px', marginBottom: '20px' }}>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>Tóm tắt đơn hàng</p>
          <p style={{ margin: '10px 0 0', color: '#fff', fontWeight: 700 }}>{customerName || searchTerm || 'Chưa chọn khách'}</p>
          <p style={{ margin: '6px 0 0', color: '#94a3b8' }}>{customerPhone || 'Chưa có số điện thoại'}</p>
          <p style={{ margin: '10px 0 0', color: '#94a3b8' }}>{serviceType} • {staffName}</p>
          <p style={{ margin: '4px 0 0', color: '#94a3b8' }}>{bookingDate} • {bookingTime}</p>
        </div>

        <button onClick={handleConfirm} disabled={isSubmitting} style={btnConfirm}>
          {isSubmitting ? 'Đang lưu...' : 'XÁC NHẬN ĐẶT LỊCH'}
        </button>
      </div>
    </div>
  );
};

const labelS = { fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '8px' };
const inputS = { width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', boxSizing: 'border-box', outline: 'none' };
const btnBack = { padding: '12px 16px', borderRadius: '14px', border: '1px solid #334155', backgroundColor: '#111827', color: 'white', cursor: 'pointer' };
const btnLogout = { padding: '12px 16px', borderRadius: '14px', border: '1px solid #ef4444', backgroundColor: '#ef4444', color: 'white', cursor: 'pointer' };
const btnOption = { flex: 1, padding: '12px', borderRadius: '14px', backgroundColor: '#111827', border: '1px solid #334155', color: '#94a3b8', cursor: 'pointer' };
const btnOptionActive = { flex: 1, padding: '12px', borderRadius: '14px', backgroundColor: '#a78bfa', border: '1px solid #a78bfa', color: 'white', cursor: 'pointer' };
const btnConfirm = { width: '100%', padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: '#10b981', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' };
const dropS = { position: 'absolute', width: '100%', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', zIndex: 10, maxHeight: '220px', overflowY: 'auto' };
const dropItemS = { padding: '12px 14px', cursor: 'pointer', borderBottom: '1px solid #334155', color: 'white' };

export default Booking;