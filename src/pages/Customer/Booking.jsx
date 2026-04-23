import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import AppointmentConfirmationModal from '../../components/AppointmentConfirmationModal';

const Booking = ({ currentCustomer, onLogout }) => {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState(currentCustomer?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentCustomer?.phone || '');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState('10:00');
  const [staffName, setStaffName] = useState('KTV Thảo');
  const [serviceType, setServiceType] = useState('Massage Body');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(null);
  const [phoneError, setPhoneError] = useState('');

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


  const saveBookingToSupabase = async (bookingData) => {
    const { data, error } = await supabase.from('appointments').insert([bookingData]).select();
    if (error) {
      console.error('Supabase lưu lịch hẹn thất bại:', error);
      return { error };
    }
    console.log('Supabase lưu lịch hẹn thành công:', data);
    return { data: data?.[0] ?? null };
  };

  const createCustomerIfNotExists = async (customerData) => {
    // Kiểm tra customer đã tồn tại chưa
    const { data: existingCustomer, error: checkError } = await supabase
      .from('customers')
      .select('id')
      .eq('phone', customerData.phone)
      .maybeSingle();

    if (checkError) {
      console.error('Lỗi kiểm tra customer:', checkError);
      return { error: checkError };
    }

    if (existingCustomer) {
      console.log('Customer đã tồn tại:', existingCustomer);
      return { data: existingCustomer };
    }

    // Tạo customer mới
    const newCustomer = {
      name: customerData.name,
      phone: customerData.phone,
      points: 0,
      stocks: 0,
      shares: 0,
      history: [],
      my_packages: []
    };

    const { data, error } = await supabase.from('customers').insert([newCustomer]).select();
    if (error) {
      console.error('Lỗi tạo customer mới:', error);
      return { error };
    }
    console.log('Tạo customer mới thành công:', data);
    return { data: data?.[0] ?? null };
  };

  const handleConfirm = async () => {
    setPhoneError('');

    if (!customerName.trim() || !customerPhone.trim()) {
      return alert('Vui lòng nhập đầy đủ họ tên và số điện thoại.');
    }

    // Kiểm tra số điện thoại hợp lệ
    const phoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/;
    if (!phoneRegex.test(customerPhone.trim())) {
      setPhoneError('Số điện thoại không hợp lệ. Vui lòng nhập số Việt Nam (10-11 chữ số).');
      return;
    }

    if (customerPhone.length < 9 || customerPhone.length > 11) {
      setPhoneError('Số điện thoại phải có 9-11 chữ số.');
      return;
    }

    const newBooking = {
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      service: serviceType,
      ktv: staffName,
      date: bookingDate,
      time: bookingTime,
      price: 0,
      status: 'Chờ phục vụ',
      note: 'Đặt lịch từ khách hàng',
      is_reminded: false,
      is_approved: false,
      shared_update: false
    };

    setPendingBooking(newBooking);
    setShowConfirmation(true);
  };

  const handleConfirmationSubmit = async () => {
    if (!pendingBooking) return;

    const newBooking = {
      customer_name: pendingBooking.customer_name,
      customer_phone: pendingBooking.customer_phone,
      service: pendingBooking.service,
      ktv: pendingBooking.ktv,
      date: pendingBooking.date,
      time: pendingBooking.time,
      price: 0,
      status: 'Chờ phục vụ',
      note: 'Đặt lịch từ khách hàng',
      is_reminded: false,
      is_approved: false,
      shared_update: false
    };

    const localHistory = JSON.parse(localStorage.getItem('spa_customer_bookings') || '[]');
    localStorage.setItem('spa_customer_bookings', JSON.stringify([...localHistory, newBooking]));

    setIsSubmitting(true);
    try {
      // Tạo customer nếu chưa tồn tại
      const { error: customerError } = await createCustomerIfNotExists({
        name: pendingBooking.customer_name,
        phone: pendingBooking.customer_phone
      });
      if (customerError) {
        console.error('Lỗi tạo customer:', customerError);
        // Vẫn tiếp tục lưu booking nhưng cảnh báo
      }

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
      setShowConfirmation(false);
      setPendingBooking(null);
      navigate('/customer');
    }
  };

  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <AppointmentConfirmationModal
        appointment={pendingBooking}
        onConfirm={handleConfirmationSubmit}
        onCancel={() => {
          setShowConfirmation(false);
          setPendingBooking(null);
        }}
        isLoading={isSubmitting}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <button onClick={() => navigate('/customer')} style={btnBack}>← Quay lại</button>
        <button onClick={onLogout} style={btnLogout}>Đăng xuất</button>
      </div>

      <h2 style={{ color: '#a78bfa', textAlign: 'center', marginBottom: '10px' }}>Đặt lịch nhanh</h2>
      <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '24px' }}>Chọn dịch vụ, kỹ thuật viên và xác nhận. Hệ thống xử lý đồng bộ Supabase.</p>

      <div style={{ backgroundColor: '#1e293b', padding: '22px', borderRadius: '24px', maxWidth: '520px', margin: '0 auto', border: '1px solid #334155' }}>
        <div style={{ marginBottom: '15px' }}>
          <div style={{ marginBottom: '8px' }}>
            <label style={labelS}>Thông tin khách hàng</label>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>Chỉ bạn và spa biết thông tin này. Không hiển thị cho khách khác.</p>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Họ tên của bạn" style={inputS} />
            <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Số điện thoại" style={inputS} />
            {phoneError && <div style={{ color: '#f87171', fontSize: '13px' }}>{phoneError}</div>}
          </div>
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
          <p style={{ margin: '10px 0 0', color: '#fff', fontWeight: 700 }}>{customerName || 'Chưa chọn khách'}</p>
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
const btnConfirm = { width: '100%', padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: '#10b981', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' };

export default Booking;