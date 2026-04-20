import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBox from '../../components/Chat/ChatBox';

const CustomerDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [referralName, setReferralName] = useState('');
  const [referralPhone, setReferralPhone] = useState('');
  const [selectedReward, setSelectedReward] = useState('');

  const [customerInfo, setCustomerInfo] = useState({
    name: 'Nguyễn Linh',
    phone: '0905123456',
    referralCode: 'NL0905123456',
    points: 1500,
    stocks: 2000,
  });

  const [myPackages] = useState([
    { id: 1, name: 'Trị mụn tầng sâu', used: 6, total: 10, status: 'Đang chạy' },
  ]);

  const [purchasedProducts] = useState([
    { id: 1, name: 'Serum Vitamin C', qty: 2, price: 250000 },
    { id: 2, name: 'Gel rửa mặt dịu nhẹ', qty: 1, price: 180000 },
  ]);

  const [treatmentHistory] = useState([
    { id: 1, date: '2026-04-10', service: 'Trị mụn B1', staff: 'KTV Thảo', note: 'Da giảm sưng, cần bôi thuốc đều', before: '', after: '' },
    { id: 2, date: '2026-04-17', service: 'Trị mụn B2', staff: 'KTV Thảo', note: 'Nhân mụn khô, da tươi hơn', before: '', after: '' },
  ]);

  const [appointments, setAppointments] = useState(() => {
    const storedAppointments = localStorage.getItem('spa_customer_appointments');
    if (storedAppointments) {
      try {
        return JSON.parse(storedAppointments);
      } catch {
        return [
          { id: 101, service: 'Trị mụn tầng sâu', date: '2024-03-25', time: '14:00', status: 'pending', isReminderSent: false },
          { id: 102, service: 'Massage Body', date: '2024-03-28', time: '09:00', status: 'confirmed', isReminderSent: true },
        ];
      }
    }
    return [
      { id: 101, service: 'Trị mụn tầng sâu', date: '21/04/2026', time: '14:00', status: 'pending', isReminderSent: false },
      { id: 102, service: 'Massage Body', date: '22/04/2026', time: '09:00', status: 'confirmed', isReminderSent: false },
    ];
  });

  const [referralHistory, setReferralHistory] = useState([
    { id: 1, name: 'Nguyễn Thanh', phone: '0911222334', reward: '300 điểm + 20 CP', status: 'Đã hoàn thành' },
  ]);

  useEffect(() => {
    localStorage.setItem('spa_customer_appointments', JSON.stringify(appointments));
  }, [appointments]);

  const handleCancelApp = (id) => {
    if (window.confirm('Bạn muốn hủy lịch hẹn này?')) {
      setAppointments(prev => prev.filter(a => a.id !== id));
    }
  };

  const parseDateTime = (date, time) => {
    const [day, month, year] = date.split('/').map(Number);
    const [hour, minute] = time.split(':').map(Number);
    return new Date(year, month - 1, day, hour, minute);
  };

  const getMinutesUntil = (appointment) => {
    const appointmentTime = parseDateTime(appointment.date, appointment.time).getTime();
    return Math.round((appointmentTime - Date.now()) / 60000);
  };

  const handleSendReminder = (id) => {
    setAppointments(prev => prev.map(a => {
      if (a.id !== id) return a;
      const minutes = getMinutesUntil(a);
      const willRemindNow = minutes <= 60;
      if (willRemindNow) {
        alert('Lịch hẹn còn dưới 1 giờ, nhắc bạn ngay.');
      } else {
        alert('Nhắc lịch đã được bật. App sẽ nhắc bạn trước 1 giờ.');
      }
      return { ...a, isReminderSent: true, reminderMode: willRemindNow ? 'immediate' : 'scheduled' };
    }));
  };

  useEffect(() => {
    setAppointments(prev => prev.map(a => {
      if (!a.isReminderSent && a.status !== 'completed' && getMinutesUntil(a) <= 60) {
        return { ...a, isReminderSent: true, reminderMode: 'immediate' };
      }
      return a;
    }));
  }, []);

  const handleReferCustomer = () => {
    if (!referralName.trim() || !referralPhone.trim()) {
      return alert('Hãy nhập tên và số điện thoại khách được giới thiệu.');
    }

    setReferralHistory(prev => [
      { id: Date.now(), name: referralName, phone: referralPhone, reward: '300 điểm + 20 CP', status: 'Đang chờ xác nhận' },
      ...prev,
    ]);

    setCustomerInfo(prev => ({
      ...prev,
      points: prev.points + 300,
      stocks: prev.stocks + 20,
    }));

    setReferralName('');
    setReferralPhone('');
    alert('Giới thiệu thành công! Bạn nhận ngay 300 điểm và 20 cổ phần.');
  };

  const handleRedeem = () => {
    if (!selectedReward) {
      return alert('Chọn gói hoặc sản phẩm để đổi điểm.');
    }

    const cost = selectedReward === 'package' ? 500 : 300;
    if (customerInfo.points < cost) {
      return alert('Bạn không đủ điểm để đổi.');
    }

    setCustomerInfo(prev => ({ ...prev, points: prev.points - cost }));
    alert(`Bạn đã đổi ${cost} điểm thành công!`);
  };

  return (
    <div style={pageStyle}>
      <div style={headerSection}>
        <div>
          <h2 style={{ margin: 0, color: '#fff' }}>Xin chào, {customerInfo.name}!</h2>
          <p style={{ margin: '6px 0 0', color: '#94a3b8' }}>
            Mã giới thiệu: <strong>{customerInfo.referralCode}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={() => setIsChatOpen(!isChatOpen)} style={btnChatCircle}>
            {isChatOpen ? '' : ''}
          </button>
          <button onClick={onLogout} style={btnLogout}>Đăng xuất</button>
        </div>
      </div>

      {isChatOpen && (
        <div style={{ marginBottom: '20px' }}>
          <ChatBox senderRole="Khách hàng" receiverRole="Chủ Spa" receiverName="Chủ Spa" />
        </div>
      )}

      <div style={assetGrid}>
        <div style={{ ...assetCard, border: '1px solid #fbbf2444' }}>
          <small style={assetLabel}>Điểm hiện có</small>
          <div style={assetValue}>{customerInfo.points.toLocaleString()}</div>
          <p style={assetNote}>Điểm dùng để đổi liệu trình và sản phẩm.</p>
        </div>
        <div style={{ ...assetCard, border: '1px solid #a78bfa44' }}>
          <small style={assetLabel}>Cổ phần sở hữu</small>
          <div style={assetValue}>{customerInfo.stocks.toLocaleString()}</div>
          <p style={assetNote}>Cổ phần được tích luỹ theo tỷ lệ chủ tiệm.</p>
        </div>
      </div>

      <div style={sectionCard}>
        <div style={sectionHeader}>
          <h3 style={sectionTitle}>Giới thiệu khách mới</h3>
          <span style={badge}>+300 điểm +20 CP</span>
        </div>
        <p style={{ color: '#94a3b8', marginBottom: '15px' }}>
          Giới thiệu khách mới để nhận thưởng điểm và cổ phần. Chủ tiệm sẽ xác nhận sau khi khách hoàn tất booking.
        </p>
        <div style={grid2Input}>
          <input value={referralName} onChange={e => setReferralName(e.target.value)} placeholder="Họ tên khách mới" style={inputS} />
          <input value={referralPhone} onChange={e => setReferralPhone(e.target.value)} placeholder="Số điện thoại" style={inputS} />
        </div>
        <button onClick={handleReferCustomer} style={btnPrimary}>Gửi giới thiệu</button>

        <div style={{ marginTop: '20px' }}>
          <h4 style={{ color: '#fff', marginBottom: '12px' }}>Lịch sử giới thiệu</h4>
          {referralHistory.map(entry => (
            <div key={entry.id} style={{ backgroundColor: '#111827', padding: '12px 14px', borderRadius: '14px', border: '1px solid #334155', marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{entry.name}</strong>
                  <div style={{ color: '#94a3b8', fontSize: '12px' }}>{entry.phone}</div>
                </div>
                <span style={{ color: '#a78bfa', fontSize: '12px' }}>{entry.status}</span>
              </div>
              <div style={{ marginTop: '8px', color: '#94a3b8', fontSize: '12px' }}>{entry.reward}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={sectionCard}>
        <div style={sectionHeader}>
          <h3 style={sectionTitle}>Liệu trình đã mua</h3>
          <span style={statusTag}>Còn buổi</span>
        </div>
        {myPackages.map(pkg => (
          <div key={pkg.id} style={packageCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div>
                <strong>{pkg.name}</strong>
                <div style={{ color: '#94a3b8', fontSize: '12px' }}>{pkg.status}</div>
              </div>
              <div style={{ color: '#10b981', fontWeight: 'bold' }}>{pkg.total - pkg.used} buổi</div>
            </div>
            <div style={progressContainer}><div style={{ ...progressFill, width: `${(pkg.used / pkg.total) * 100}%` }}></div></div>
          </div>
        ))}
      </div>

      <div style={sectionCard}>
        <div style={sectionHeader}>
          <h3 style={sectionTitle}>Sản phẩm đã mua</h3>
          <span style={statusTag}>Đã sở hữu</span>
        </div>
        {purchasedProducts.map(prod => (
          <div key={prod.id} style={productRow}>
            <div>
              <strong>{prod.name}</strong>
              <div style={{ color: '#94a3b8', fontSize: '12px' }}>Số lượng: {prod.qty}</div>
            </div>
            <div style={{ color: '#10b981' }}>{prod.price.toLocaleString()}đ</div>
          </div>
        ))}
      </div>

      <div style={sectionCard}>
        <div style={sectionHeader}>
          <h3 style={sectionTitle}>Nhật ký liệu trình</h3>
          <span style={statusTag}>Theo dõi tiến độ</span>
        </div>
        {treatmentHistory.map(item => (
          <div key={item.id} style={historyCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong>{item.service}</strong>
                <div style={{ color: '#94a3b8', fontSize: '12px' }}>{item.date}  {item.staff}</div>
              </div>
              <span style={{ color: '#10b981' }}>Chi tiết</span>
            </div>
            <p style={{ margin: '10px 0 0', color: '#94a3b8', fontSize: '13px' }}>{item.note}</p>
          </div>
        ))}
      </div>

      <div style={sectionCard}>
        <div style={sectionHeader}>
          <h3 style={sectionTitle}>Lịch hẹn của tôi</h3>
          <span style={badgeConfirmed}>Xác nhận & Nhắc lịch</span>
        </div>
        {appointments.length === 0 ? (
          <p style={{ color: '#475569', fontSize: '13px' }}>Chưa có lịch hẹn nào</p>
        ) : (
          appointments.map(app => (
            <div key={app.id} style={appCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{app.service}</div>
                  <div style={{ color: '#94a3b8', fontSize: '12px' }}> {app.date} |  {app.time}</div>
                  <div style={{ marginTop: '6px', fontSize: '12px', color: app.status === 'confirmed' ? '#34d399' : '#fbbf24' }}>
                    {app.status === 'confirmed' ? 'Đã xác nhận bởi chủ tiệm' : 'Đang chờ xác nhận'}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button onClick={() => handleCancelApp(app.id)} style={btnSmallCancel}>Hủy</button>
                  <button onClick={() => handleSendReminder(app.id)} style={btnSmall}>{app.isReminderSent ? 'Đã nhắc' : getMinutesUntil(app) <= 60 ? 'Nhắc ngay' : 'Nhắc lịch'}</button>
                </div>
              </div>
              <div style={{ marginTop: '12px', color: '#94a3b8', fontSize: '12px' }}>
                {app.isReminderSent
                  ? getMinutesUntil(app) <= 60
                    ? 'Lịch hẹn còn dưới 1 giờ, đã nhắc bạn ngay.'
                    : 'Nhắc lịch đã bật. App sẽ nhắc bạn trước 1 giờ.'
                  : getMinutesUntil(app) <= 60
                    ? 'Còn dưới 1 giờ. Nhấn nhắc ngay để xác nhận.'
                    : 'Sẽ nhắc bạn 1 giờ trước khi lịch hẹn.'}
              </div>
            </div>
          ))
        )}
      </div>

      <div style={sectionCard}>
        <div style={sectionHeader}>
          <h3 style={sectionTitle}>Đổi điểm & săn ưu đãi</h3>
        </div>
        <p style={{ color: '#94a3b8', marginBottom: '12px' }}>
          Sử dụng điểm để đổi gói liệu trình hoặc sản phẩm. Cổ phần sẽ được phân phối theo tỷ lệ chủ tiệm.
        </p>
        <div style={grid2Input}>
          <select value={selectedReward} onChange={e => setSelectedReward(e.target.value)} style={inputS}>
            <option value="">Chọn gói / sản phẩm</option>
            <option value="package">Đổi 500 điểm lấy gói ưu đãi</option>
            <option value="product">Đổi 300 điểm lấy sản phẩm mini</option>
          </select>
          <button onClick={handleRedeem} style={btnPrimary}>Đổi điểm</button>
        </div>
      </div>

      <div style={bottomMenu}>
        <button onClick={() => navigate('/customer/booking')} style={btnAction}> Đặt lịch online</button>
        <button onClick={() => navigate('/customer/store')} style={btnActionSecondary}> Mua liệu trình / sản phẩm</button>
      </div>
    </div>
  );
};

const pageStyle = { padding: '20px', color: 'white', backgroundColor: '#0f172a', minHeight: '100vh', paddingBottom: '120px' };
const headerSection = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', marginBottom: '20px' };
const btnChatCircle = { width: '45px', height: '45px', borderRadius: '50%', border: 'none', backgroundColor: '#a78bfa', color: 'white', fontSize: '20px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(167, 139, 250, 0.4)' };
const btnLogout = { padding: '12px 16px', borderRadius: '14px', border: '1px solid #ef4444', backgroundColor: '#ef4444', color: 'white', fontWeight: 'bold', cursor: 'pointer' };
const assetGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' };
const assetCard = { padding: '20px', borderRadius: '20px', backgroundColor: '#1e293b' };
const assetLabel = { fontSize: '11px', color: '#94a3b8', marginBottom: '8px', display: 'block' };
const assetValue = { fontSize: '32px', fontWeight: 'bold', color: 'white' };
const assetNote = { marginTop: '10px', fontSize: '13px', color: '#94a3b8' };
const sectionCard = { backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '20px', padding: '20px', marginBottom: '20px' };
const sectionHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', gap: '15px' };
const sectionTitle = { color: '#10b981', margin: 0, fontSize: '18px' };
const badge = { backgroundColor: '#0f172a', color: '#a78bfa', padding: '6px 12px', borderRadius: '999px', border: '1px solid #a78bfa44', fontSize: '12px' };
const badgeConfirmed = { backgroundColor: '#0f172a', color: '#34d399', padding: '6px 12px', borderRadius: '999px', border: '1px solid #34d39944', fontSize: '12px' };
const statusTag = { backgroundColor: '#0f172a', color: '#94a3b8', padding: '6px 12px', borderRadius: '999px', border: '1px solid #475569', fontSize: '12px' };
const grid2Input = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' };
const inputS = { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', boxSizing: 'border-box' };
const btnPrimary = { width: '100%', padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: '#a78bfa', color: 'white', fontWeight: 'bold', cursor: 'pointer' };
const packageCard = { backgroundColor: '#111827', padding: '15px', borderRadius: '15px', border: '1px solid #334155', marginBottom: '12px' };
const progressContainer = { height: '6px', backgroundColor: '#334155', borderRadius: '10px', overflow: 'hidden' };
const progressFill = { height: '100%', backgroundColor: '#10b981', borderRadius: '10px' };
const productRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', borderRadius: '12px', backgroundColor: '#111827' };
const historyCard = { backgroundColor: '#111827', padding: '15px', borderRadius: '15px', border: '1px solid #334155' };
const appCard = { backgroundColor: '#111827', padding: '18px', borderRadius: '18px', border: '1px solid #334155', marginBottom: '12px' };
const btnSmall = { padding: '10px 14px', borderRadius: '10px', border: '1px solid #10b981', backgroundColor: 'transparent', color: '#10b981', cursor: 'pointer', fontSize: '12px' };
const btnSmallCancel = { padding: '10px 14px', borderRadius: '10px', border: '1px solid #ef4444', backgroundColor: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '12px' };
const btnAction = { flex: 1, padding: '15px', borderRadius: '12px', border: 'none', backgroundColor: '#a78bfa', color: 'white', fontWeight: 'bold', cursor: 'pointer' };
const btnActionSecondary = { flex: 1, padding: '15px', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', fontWeight: 'bold', cursor: 'pointer' };
const bottomMenu = { position: 'fixed', bottom: 0, left: 0, right: 0, padding: '15px 20px', backgroundColor: '#0f172a', display: 'flex', gap: '12px', borderTop: '1px solid #334155' };

export default CustomerDashboard;
