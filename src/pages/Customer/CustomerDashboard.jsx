import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import ChatBox from '../../components/Chat/ChatBox';

const CustomerDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [referralName, setReferralName] = useState('');
  const [referralPhone, setReferralPhone] = useState('');
  const [selectedReward, setSelectedReward] = useState('');
  const [orderHistory, setOrderHistory] = useState([]);
  const [appSettings, setAppSettings] = useState(null);
  const [referralHistory, setReferralHistory] = useState([]);
  const [appointments, setAppointments] = useState(() => {
    const stored = localStorage.getItem('spa_customer_appointments');
    if (stored) {
      try {
        return JSON.parse(stored);
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

  const [customerInfo, setCustomerInfo] = useState(() => {
    const saved = localStorage.getItem('spa_customer_info');
    if (saved) return JSON.parse(saved);
    return {
      name: user?.name || 'Khách VIP',
      phone: user?.phone || '',
      referralCode: user?.referralCode || user?.phone || '',
      points: user?.points ?? 0,
      stocks: user?.stocks ?? 0,
      referralRewarded: user?.referralRewarded || false,
      myPackages: user?.myPackages || [],
      history: user?.history || []
    };
  });

  useEffect(() => {
    localStorage.setItem('spa_customer_info', JSON.stringify(customerInfo));
  }, [customerInfo]);

  useEffect(() => {
    if (!user?.phone) return;

    const fetchCustomerData = async () => {
      try {
        const [{ data: orders, error: ordersError }, { data: apps, error: appsError }, { data: settingsData, error: settingsError }, { data: referrals, error: referralsError }] = await Promise.all([
          supabase.from('online_orders').select('*').eq('customer_phone', user.phone).order('created_at', { ascending: false }),
          supabase.from('appointments').select('*').eq('customer_phone', user.phone).order('date', { ascending: false }),
          supabase.from('settings').select('*').maybeSingle(),
          supabase.from('customers').select('*').eq('referred_by', user.referralCode || user.phone).order('created_at', { ascending: false })
        ]);

        if (!ordersError && orders) {
          setOrderHistory(orders.map(order => ({
            ...order,
            itemName: order.item_name || order.itemName,
            totalPrice: order.total_price || order.totalPrice,
            customerName: order.customer_name || order.customerName,
            customerPhone: order.customer_phone || order.customerPhone
          })));
        }

        if (!appsError && apps) {
          setAppointments(apps.map(app => ({
            ...app,
            customerName: app.customer_name || app.customerName,
            customerPhone: app.customer_phone || app.customerPhone,
            isReminderSent: app.is_reminded || app.isReminderSent,
            isApproved: app.is_approved || app.isApproved,
            sharedUpdate: app.shared_update || app.sharedUpdate
          })));
        }

        if (!settingsError && settingsData) {
          setAppSettings(settingsData);
        }

        if (!referralsError && referrals) {
          setReferralHistory(referrals.map(ref => ({
            id: ref.id,
            name: ref.name,
            phone: ref.phone,
            status: ref.referral_rewarded || ref.referralRewarded ? 'Đã hoàn thành' : 'Đang chờ khách mua',
            reward: `+${settingsData?.referralPoints || 0} điểm + ${settingsData?.referralStocks || 0} CP`
          })));
        }
      } catch (error) {
        console.error('Không thể tải dữ liệu khách hàng từ Supabase:', error);
      }
    };

    fetchCustomerData();
  }, [user?.phone, user?.referralCode]);

  const computedRewardOptions = appSettings ? [
    { id: 'package', title: `Đổi ${appSettings.packageRedemptionThreshold || 500} điểm lấy gói ưu đãi`, subtitle: 'Sử dụng cho 1 liệu trình chăm sóc chuyên sâu', cost: appSettings.packageRedemptionThreshold || 500 },
    { id: 'product', title: `Đổi ${appSettings.productRedemptionThreshold || 300} điểm lấy sản phẩm mini`, subtitle: 'Nhận 1 sản phẩm chăm sóc da mini', cost: appSettings.productRedemptionThreshold || 300 }
  ] : [
    { id: 'package', title: 'Đổi 500 điểm lấy gói ưu đãi', subtitle: 'Sử dụng cho 1 liệu trình chăm sóc chuyên sâu', cost: 500 },
    { id: 'product', title: 'Đổi 300 điểm lấy sản phẩm mini', subtitle: 'Nhận 1 sản phẩm chăm sóc da mini', cost: 300 }
  ];

  const [myPackages] = useState([
    { id: 1, name: 'Trị mụn tầng sâu', used: 6, total: 10, status: 'Đang chạy' },
  ]);

  const [treatmentHistory] = useState([
    { id: 1, date: '2026-04-10', service: 'Trị mụn B1', staff: 'KTV Thảo', note: 'Da giảm sưng, cần bôi thuốc đều', before: '', after: '' },
    { id: 2, date: '2026-04-17', service: 'Trị mụn B2', staff: 'KTV Thảo', note: 'Nhân mụn khô, da tươi hơn', before: '', after: '' },
  ]);
  const [selectedTreatment, setSelectedTreatment] = useState(null);

  useEffect(() => {
    localStorage.setItem('spa_customer_appointments', JSON.stringify(appointments));
  }, [appointments]);

  const handleCancelApp = (id) => {
    if (window.confirm('Bạn muốn hủy lịch hẹn này?')) {
      setAppointments(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleConfirmAppointment = (id) => {
    setAppointments(prev => prev.map(a => {
      if (a.id !== id) return a;
      return { ...a, status: 'confirmed', isApproved: true };
    }));
    alert('Bạn đã xác nhận lịch hẹn. Chủ tiệm sẽ được thông báo.');
  };

  const parseDateTime = useCallback((date, time) => {
    const [day, month, year] = date.split('/').map(Number);
    const [hour, minute] = time.split(':').map(Number);
    return new Date(year, month - 1, day, hour, minute);
  }, []);

  const getMinutesUntil = useCallback((appointment) => {
    const appointmentTime = parseDateTime(appointment.date, appointment.time).getTime();
    return Math.round((appointmentTime - Date.now()) / 60000);
  }, [parseDateTime]);

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
  }, [getMinutesUntil]);

  const handleReferCustomer = () => {
    if (!referralName.trim() || !referralPhone.trim()) {
      return alert('Hãy nhập tên và số điện thoại khách được giới thiệu.');
    }

    setReferralHistory(prev => [
      { id: Date.now(), name: referralName, phone: referralPhone, reward: '300 điểm + 20 CP khi khách mua hàng', status: 'Đang chờ xác nhận' },
      ...prev,
    ]);

    setReferralName('');
    setReferralPhone('');
    alert('Giới thiệu thành công! Bạn sẽ nhận thưởng khi khách được giới thiệu mua liệu trình hoặc sản phẩm.');
  };

  const handleRedeem = () => {
    if (!selectedReward) {
      return alert('Vui lòng chọn phần thưởng để đổi.');
    }

    const reward = computedRewardOptions.find(option => option.id === selectedReward);
    if (!reward) {
      return alert('Đã có lỗi, hãy thử lại.');
    }

    if (customerInfo.points < reward.cost) {
      return alert('Bạn chưa đủ điểm để đổi phần quà này.');
    }

    setCustomerInfo(prev => ({ ...prev, points: prev.points - reward.cost }));
    alert(`Đổi ${reward.cost} điểm thành công! Bạn đã nhận: ${reward.title}.`);
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
          <h4 style={{ color: '#fff', marginBottom: '12px' }}>Lịch sử giới thiệu ({referralHistory.length})</h4>
          {referralHistory.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '13px' }}>Chưa có khách nào được giới thiệu</p>
          ) : (
            referralHistory.map(entry => (
              <div key={entry.id} style={{ backgroundColor: '#111827', padding: '12px 14px', borderRadius: '14px', border: '1px solid #334155', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{entry.name}</strong>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>{entry.phone}</div>
                  </div>
                  <span style={{ color: entry.status === 'Đã hoàn thành' ? '#a78bfa' : '#fbbf24', fontSize: '12px' }}>{entry.status}</span>
                </div>
                <div style={{ marginTop: '8px', color: '#94a3b8', fontSize: '12px' }}>{entry.reward}</div>
              </div>
            ))
          )}
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
          <h3 style={sectionTitle}>Lịch sử đơn hàng</h3>
          <span style={statusTag}>Đã mua</span>
        </div>
        {orderHistory.length === 0 ? (
          <p style={{ color: '#475569', fontSize: '13px' }}>Chưa có đơn hàng nào</p>
        ) : (
          orderHistory.map(order => (
            <div key={order.id} style={productRow}>
              <div>
                <strong>{order.itemName}</strong>
                <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                  {order.orderDate || order.order_date} • {order.status === 'confirmed' ? 'Đã xác nhận' : order.status === 'pending' ? 'Chờ xác nhận' : 'Đã hủy'}
                </div>
              </div>
              <div style={{ color: '#10b981' }}>{(order.totalPrice || 0).toLocaleString()}đ</div>
            </div>
          ))
        )}
      </div>

      <div style={sectionCard}>
        <div style={sectionHeader}>
          <h3 style={sectionTitle}>Nhật ký liệu trình</h3>
          <span style={statusTag}>Theo dõi tiến độ</span>
        </div>
        {treatmentHistory.map(item => (
          <div key={item.id} style={historyCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{item.service}</strong>
                <div style={{ color: '#94a3b8', fontSize: '12px' }}>{item.date}  {item.staff}</div>
              </div>
              <button
                onClick={() => setSelectedTreatment(item)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#10b981',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  padding: 0
                }}
              >
                Chi tiết
              </button>
            </div>
            <p style={{ margin: '10px 0 0', color: '#94a3b8', fontSize: '13px' }}>{item.note}</p>
          </div>
        ))}
        {selectedTreatment && (
          <div style={{ ...sectionCard, marginTop: '10px', borderColor: '#10b981' }}>
            <h4 style={{ color: '#10b981', marginBottom: '10px' }}>Chi tiết liệu trình</h4>
            <p><strong>Dịch vụ:</strong> {selectedTreatment.service}</p>
            <p><strong>Ngày:</strong> {selectedTreatment.date}</p>
            <p><strong>KTV:</strong> {selectedTreatment.staff}</p>
            <p><strong>Ghi chú:</strong> {selectedTreatment.note}</p>
            {selectedTreatment.before && <p><strong>Trước:</strong> {selectedTreatment.before}</p>}
            {selectedTreatment.after && <p><strong>Sau:</strong> {selectedTreatment.after}</p>}
          </div>
        )}
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
                  {app.status !== 'confirmed' && (
                    <button onClick={() => handleConfirmAppointment(app.id)} style={{ ...btnSmall, backgroundColor: '#10b981', border: 'none' }}>
                      ✅ Xác nhận
                    </button>
                  )}
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
          Sử dụng điểm để quy đổi sang quà tặng cao cấp. Chọn phần thưởng phù hợp với số điểm hiện có.
        </p>
        <div style={{ marginBottom: '16px', color: '#cbd5e1', fontSize: '14px' }}>
          Điểm hiện có: <strong>{customerInfo.points.toLocaleString()}</strong>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
          {computedRewardOptions.map(option => (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelectedReward(option.id)}
              style={{
                ...rewardCard,
                borderColor: selectedReward === option.id ? '#a78bfa' : '#334155',
                backgroundColor: selectedReward === option.id ? '#1f2937' : '#111827'
              }}
            >
              <div style={{ marginBottom: '8px', color: '#e2e8f0', fontWeight: '700' }}>{option.title}</div>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '10px' }}>{option.subtitle}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#a78bfa', fontWeight: '700' }}>{option.cost} điểm</span>
                {selectedReward === option.id && <span style={{ color: '#34d399', fontSize: '12px' }}>Đã chọn</span>}
              </div>
            </button>
          ))}
        </div>
        <button onClick={handleRedeem} style={btnPrimary}>Đổi điểm</button>
      </div>

      <div style={bottomMenu}>
        <button onClick={() => navigate('/customer/booking')} style={btnAction}> Đặt lịch online</button>
        <button onClick={() => navigate('/customer/store')} style={btnActionSecondary}> Mua liệu trình / sản phẩm</button>
      </div>

      {selectedTreatment && (
        <div style={treatmentModalOverlay} onClick={() => setSelectedTreatment(null)}>
          <div style={treatmentModalBox} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#10b981' }}>Chi tiết liệu trình</h3>
              <button
                onClick={() => setSelectedTreatment(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <div style={{ marginBottom: '12px', color: '#e2e8f0' }}>
              <p><strong>Dịch vụ:</strong> {selectedTreatment.service}</p>
              <p><strong>Ngày:</strong> {selectedTreatment.date}</p>
              <p><strong>KTV:</strong> {selectedTreatment.staff}</p>
              <p><strong>Ghi chú:</strong> {selectedTreatment.note}</p>
              {selectedTreatment.before && (
                <div style={{ marginTop: '16px' }}>
                  <p style={{ marginBottom: '8px' }}><strong>Ảnh trước</strong></p>
                  <img
                    src={selectedTreatment.before}
                    alt="Trước"
                    style={{ width: '100%', maxHeight: '280px', objectFit: 'cover', borderRadius: '16px', border: '1px solid #334155' }}
                  />
                </div>
              )}
              {selectedTreatment.after && (
                <div style={{ marginTop: '16px' }}>
                  <p style={{ marginBottom: '8px' }}><strong>Ảnh sau</strong></p>
                  <img
                    src={selectedTreatment.after}
                    alt="Sau"
                    style={{ width: '100%', maxHeight: '280px', objectFit: 'cover', borderRadius: '16px', border: '1px solid #334155' }}
                  />
                </div>
              )}
            </div>
            <button onClick={() => setSelectedTreatment(null)} style={{ ...btnPrimary, width: '100%' }}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const pageStyle = {
  padding: typeof window !== 'undefined' && window.innerWidth < 768 ? '14px' : '20px',
  color: 'white',
  backgroundColor: '#0f172a',
  minHeight: '100vh',
  paddingBottom: typeof window !== 'undefined' && window.innerWidth < 768 ? '140px' : '120px'
};

const headerSection = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: typeof window !== 'undefined' && window.innerWidth < 768 ? '12px' : '20px',
  marginBottom: typeof window !== 'undefined' && window.innerWidth < 768 ? '16px' : '20px',
  flexWrap: 'wrap'
};

const btnChatCircle = {
  width: '45px',
  height: '45px',
  borderRadius: '50%',
  border: 'none',
  backgroundColor: '#a78bfa',
  color: 'white',
  fontSize: '20px',
  cursor: 'pointer',
  boxShadow: '0 4px 10px rgba(167, 139, 250, 0.4)',
  flexShrink: 0,
  transition: 'all 0.2s ease'
};

const btnLogout = {
  padding: typeof window !== 'undefined' && window.innerWidth < 768 ? '10px 14px' : '12px 16px',
  borderRadius: '12px',
  border: '1px solid #ef4444',
  backgroundColor: '#ef4444',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? '12px' : '14px',
  transition: 'all 0.2s ease'
};

const assetGrid = {
  display: 'grid',
  gridTemplateColumns: typeof window !== 'undefined' && window.innerWidth < 768 ? '1fr' : '1fr 1fr',
  gap: typeof window !== 'undefined' && window.innerWidth < 768 ? '12px' : '15px',
  marginBottom: typeof window !== 'undefined' && window.innerWidth < 768 ? '16px' : '20px'
};

const assetCard = {
  padding: typeof window !== 'undefined' && window.innerWidth < 768 ? '16px' : '20px',
  borderRadius: '16px',
  backgroundColor: '#1e293b'
};

const assetLabel = {
  fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? '10px' : '11px',
  color: '#94a3b8',
  marginBottom: '8px',
  display: 'block',
  fontWeight: '600'
};

const assetValue = {
  fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? '24px' : '32px',
  fontWeight: 'bold',
  color: 'white'
};

const assetNote = {
  marginTop: '10px',
  fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? '12px' : '13px',
  color: '#94a3b8'
};

const sectionCard = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '16px',
  padding: typeof window !== 'undefined' && window.innerWidth < 768 ? '16px' : '20px',
  marginBottom: typeof window !== 'undefined' && window.innerWidth < 768 ? '16px' : '20px'
};

const sectionHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: typeof window !== 'undefined' && window.innerWidth < 768 ? '12px' : '15px',
  gap: '10px',
  flexWrap: 'wrap'
};

const sectionTitle = {
  color: '#10b981',
  margin: 0,
  fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? '16px' : '18px',
  fontWeight: 'bold'
};

const badge = {
  backgroundColor: '#0f172a',
  color: '#a78bfa',
  padding: '6px 10px',
  borderRadius: '999px',
  border: '1px solid rgba(167, 139, 250, 0.3)',
  fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? '11px' : '12px',
  whiteSpace: 'nowrap'
};

const badgeConfirmed = {
  backgroundColor: '#0f172a',
  color: '#34d399',
  padding: '6px 10px',
  borderRadius: '999px',
  border: '1px solid rgba(52, 211, 153, 0.3)',
  fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? '11px' : '12px',
  whiteSpace: 'nowrap'
};

const statusTag = {
  backgroundColor: '#0f172a',
  color: '#94a3b8',
  padding: '6px 10px',
  borderRadius: '999px',
  border: '1px solid #475569',
  fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? '11px' : '12px',
  whiteSpace: 'nowrap'
};

const grid2Input = {
  display: 'grid',
  gridTemplateColumns: typeof window !== 'undefined' && window.innerWidth < 768 ? '1fr' : '1fr 1fr',
  gap: typeof window !== 'undefined' && window.innerWidth < 768 ? '10px' : '12px',
  marginBottom: '15px'
};

const inputS = {
  width: '100%',
  padding: typeof window !== 'undefined' && window.innerWidth < 768 ? '12px' : '14px',
  borderRadius: '12px',
  border: '1px solid #334155',
  backgroundColor: '#0f172a',
  color: 'white',
  boxSizing: 'border-box',
  fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? '13px' : '14px'
};

const btnPrimary = {
  width: '100%',
  padding: typeof window !== 'undefined' && window.innerWidth < 768 ? '12px' : '14px',
  borderRadius: '12px',
  border: 'none',
  backgroundColor: '#a78bfa',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? '13px' : '14px',
  transition: 'all 0.2s ease'
};

const packageCard = {
  backgroundColor: '#111827',
  padding: typeof window !== 'undefined' && window.innerWidth < 768 ? '12px' : '15px',
  borderRadius: '14px',
  border: '1px solid #334155',
  marginBottom: typeof window !== 'undefined' && window.innerWidth < 768 ? '10px' : '12px'
};

const progressContainer = {
  height: '6px',
  backgroundColor: '#334155',
  borderRadius: '10px',
  overflow: 'hidden'
};

const progressFill = {
  height: '100%',
  backgroundColor: '#10b981',
  borderRadius: '10px'
};

const productRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: typeof window !== 'undefined' && window.innerWidth < 768 ? '11px 12px' : '12px 15px',
  borderRadius: '12px',
  backgroundColor: '#111827',
  marginBottom: typeof window !== 'undefined' && window.innerWidth < 768 ? '10px' : '12px',
  gap: '10px'
};

const historyCard = {
  backgroundColor: '#111827',
  padding: typeof window !== 'undefined' && window.innerWidth < 768 ? '12px' : '15px',
  borderRadius: '14px',
  border: '1px solid #334155',
  marginBottom: typeof window !== 'undefined' && window.innerWidth < 768 ? '10px' : '12px'
};

const rewardCard = {
  padding: typeof window !== 'undefined' && window.innerWidth < 768 ? '14px' : '18px',
  borderRadius: '14px',
  backgroundColor: '#111827',
  border: '1px solid #334155',
  textAlign: 'left',
  cursor: 'pointer',
  color: '#e2e8f0',
  transition: 'all 0.2s ease'
};

const appCard = {
  backgroundColor: '#111827',
  padding: typeof window !== 'undefined' && window.innerWidth < 768 ? '14px' : '18px',
  borderRadius: '14px',
  border: '1px solid #334155',
  marginBottom: typeof window !== 'undefined' && window.innerWidth < 768 ? '10px' : '12px'
};

const btnSmall = {
  padding: typeof window !== 'undefined' && window.innerWidth < 768 ? '8px 10px' : '10px 14px',
  borderRadius: '10px',
  border: '1px solid #10b981',
  backgroundColor: 'transparent',
  color: '#10b981',
  cursor: 'pointer',
  fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? '11px' : '12px',
  fontWeight: '600',
  transition: 'all 0.2s ease'
};

const btnSmallCancel = {
  padding: typeof window !== 'undefined' && window.innerWidth < 768 ? '8px 10px' : '10px 14px',
  borderRadius: '10px',
  border: '1px solid #ef4444',
  backgroundColor: 'transparent',
  color: '#ef4444',
  cursor: 'pointer',
  fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? '11px' : '12px',
  fontWeight: '600',
  transition: 'all 0.2s ease'
};

const btnAction = {
  flex: 1,
  padding: typeof window !== 'undefined' && window.innerWidth < 768 ? '12px' : '15px',
  borderRadius: '12px',
  border: 'none',
  backgroundColor: '#a78bfa',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? '13px' : '14px',
  transition: 'all 0.2s ease'
};

const btnActionSecondary = {
  flex: 1,
  padding: typeof window !== 'undefined' && window.innerWidth < 768 ? '12px' : '15px',
  borderRadius: '12px',
  border: '1px solid #334155',
  backgroundColor: '#0f172a',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? '13px' : '14px',
  transition: 'all 0.2s ease'
};

const bottomMenu = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  padding: typeof window !== 'undefined' && window.innerWidth < 768 ? '10px 12px' : '15px 20px',
  backgroundColor: '#0f172a',
  display: 'flex',
  gap: typeof window !== 'undefined' && window.innerWidth < 768 ? '10px' : '12px',
  borderTop: '1px solid #334155'
};

const treatmentModalOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.75)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  padding: typeof window !== 'undefined' && window.innerWidth < 768 ? '16px' : '20px'
};

const treatmentModalBox = {
  width: '100%',
  maxWidth: typeof window !== 'undefined' && window.innerWidth < 768 ? '100%' : '540px',
  backgroundColor: '#1e293b',
  borderRadius: '16px',
  border: '1px solid #10b981',
  padding: typeof window !== 'undefined' && window.innerWidth < 768 ? '20px' : '24px',
  boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
  color: '#e2e8f0',
  maxHeight: '90vh',
  overflowY: 'auto'
};

export default CustomerDashboard;
