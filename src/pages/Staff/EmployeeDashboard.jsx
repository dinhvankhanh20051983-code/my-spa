import React, { useEffect, useMemo, useState } from 'react';
import ChatBox from '../../components/Chat/ChatBox';

const EmployeeDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(1);
  const [appointments, setAppointments] = useState(() => {
    const storedAppointments = localStorage.getItem('spa_staff_appointments');
    if (storedAppointments) {
      try {
        return JSON.parse(storedAppointments);
      } catch {
        // ignore invalid data
      }
    }
    return [
      {
        id: 1,
        customer: 'Chị Lan Anh',
        time: '14:00',
        date: '21/04/2026',
        service: 'Trị mụn tầng sâu',
        status: 'scheduled',
        servicePrice: 1200000,
        commissionRate: 0.18,
        beforePhoto: null,
        afterPhoto: null,
        notes: 'Khách cần giảm viêm, tránh sờ tay, và bôi kem sau trị liệu.',
        treatmentLog: [],
        referralType: 'Dịch vụ',
        isReminderSent: false,
        isApproved: true,
        sharedUpdate: false
      },
      {
        id: 2,
        customer: 'Anh Minh',
        time: '16:00',
        date: '21/04/2026',
        service: 'Massage Body',
        status: 'scheduled',
        servicePrice: 900000,
        commissionRate: 0.15,
        beforePhoto: null,
        afterPhoto: null,
        notes: 'Khách muốn thư giãn và giảm đau mỏi sau ngày dài.',
        treatmentLog: [],
        referralType: 'Sản phẩm',
        isReminderSent: false,
        isApproved: true,
        sharedUpdate: false
      }
    ];
  });

  const [referralBonus] = useState(250000);
  const [sharesOwned] = useState(5200);
  const baseSalary = 4500000;

  const selectedAppointment = appointments.find(a => a.id === selectedAppointmentId) || appointments[0];

  const newAppointmentsCount = useMemo(
    () => appointments.filter(a => a.status === 'scheduled').length,
    [appointments]
  );

  const completedCommission = useMemo(
    () => appointments.reduce((sum, a) => a.status === 'completed' ? sum + Math.round(a.servicePrice * a.commissionRate) : sum, 0),
    [appointments]
  );

  const monthlySalary = useMemo(
    () => baseSalary + completedCommission + referralBonus,
    [baseSalary, completedCommission, referralBonus]
  );

  const handleStartAppointment = (id) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'in_progress' } : a));
    setSelectedAppointmentId(id);
  };

  const handleCaptureBefore = (id) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, beforePhoto: 'Đã lưu ảnh trước liệu trình' } : a));
    setSelectedAppointmentId(id);
  };

  const handleUploadPhoto = (id, photoType, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, [`${photoType}Photo`]: reader.result } : a));
    };
    reader.readAsDataURL(file);
  };

  const handleCompleteTreatment = (id) => {
    setAppointments(prev => prev.map(a => a.id === id ? {
      ...a,
      status: 'completed',
      afterPhoto: a.afterPhoto || 'Đã lưu ảnh sau liệu trình',
      treatmentLog: [...a.treatmentLog, { time: new Date().toLocaleString('vi-VN'), note: 'Hoàn thành liệu trình, hướng dẫn chăm sóc sau.' }]
    } : a));
    setSelectedAppointmentId(id);
  };

  useEffect(() => {
    localStorage.setItem('spa_staff_appointments', JSON.stringify(appointments));
  }, [appointments]);

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
        alert('Lịch hẹn của khách còn dưới 1 giờ, đã gợi ý nhắc ngay.');
      } else {
        alert('Đã bật nhắc lịch. Nhắc trước 1 giờ.');
      }
      return { ...a, isReminderSent: true, reminderMode: willRemindNow ? 'immediate' : 'scheduled' };
    }));
  };

  useEffect(() => {
    setAppointments(prev => prev.map(a => {
      if (!a.isReminderSent && a.status === 'scheduled' && getMinutesUntil(a) <= 60) {
        return { ...a, isReminderSent: true, reminderMode: 'immediate' };
      }
      return a;
    }));
  }, []);

  const statusBadge = (status) => ({
    scheduled: { backgroundColor: '#334155', color: '#facc15', borderColor: '#facc15' },
    in_progress: { backgroundColor: '#78350f', color: '#fde68a', borderColor: '#fde68a' },
    completed: { backgroundColor: '#163a0f', color: '#86efac', borderColor: '#86efac' }
  }[status] || { backgroundColor: '#334155', color: '#94a3b8', borderColor: '#64748b' });

  const renderNotificationBar = () => (
    <div style={notificationBar}>
      <div>
        <strong>{newAppointmentsCount}</strong> lịch hẹn mới đang chờ xử lý.
      </div>
      <div style={{ color: '#a78bfa' }}>Cập nhật nhanh khi có khách mới.</div>
    </div>
  );

  const renderScheduleTab = () => (
    <div style={{ display: 'grid', gap: '18px' }}>
      {renderNotificationBar()}
      <div style={gridSchedule} className="responsive-grid-2">
        <div style={scheduleColumn}>
          {appointments.map(app => (
            <div key={app.id} style={{ ...cardItem, borderLeft: app.status === 'completed' ? '4px solid #22c55e' : app.status === 'in_progress' ? '4px solid #f97316' : '4px solid #3b82f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <strong style={{ fontSize: '16px' }}>{app.customer}</strong>
                  <p style={{ margin: '6px 0 0', color: '#94a3b8' }}>{app.date}  {app.time}</p>
                  <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#e2e8f0' }}>{app.service}</p>
                </div>
                <span style={{ ...statusBadge(app.status), padding: '6px 10px', borderRadius: '999px', border: '1px solid', fontSize: '12px' }}>
                  {app.status === 'scheduled' ? 'Đang chờ' : app.status === 'in_progress' ? 'Đang làm' : 'Hoàn thành'}
                </span>
              </div>
              <div style={{ marginTop: '14px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {app.status === 'scheduled' && <button onClick={() => handleStartAppointment(app.id)} style={btnPrimary}>Bắt đầu</button>}
                {app.status === 'scheduled' && <button onClick={() => handleSendReminder(app.id)} style={btnSecondary}>{app.isReminderSent ? 'Đã nhắc' : getMinutesUntil(app) <= 60 ? 'Nhắc ngay' : 'Nhắc lịch'}</button>}
                {app.status === 'in_progress' && (
                  <label style={{ ...btnSecondary, position: 'relative', overflow: 'hidden' }}>
                    {app.beforePhoto ? 'Ảnh trước đã chọn' : 'Tải ảnh trước'}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                      onChange={(e) => handleUploadPhoto(app.id, 'before', e.target.files?.[0])}
                    />
                  </label>
                )}
                {app.status === 'in_progress' && <button onClick={() => handleCompleteTreatment(app.id)} style={btnPrimary}>Hoàn thành</button>}
                {app.status === 'completed' && (
                  <>
                    <label style={{ ...btnSecondary, position: 'relative', overflow: 'hidden' }}>
                      {app.afterPhoto ? 'Ảnh sau đã chọn' : 'Tải ảnh sau'}
                      <input
                        type="file"
                        accept="image/*"
                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                        onChange={(e) => handleUploadPhoto(app.id, 'after', e.target.files?.[0])}
                      />
                    </label>
                    <span style={{ color: '#a78bfa', fontSize: '13px', alignSelf: 'center' }}>Hoa hồng: {(app.servicePrice * app.commissionRate).toLocaleString()}đ</span>
                  </>
                )}
              </div>
              {app.status === 'scheduled' && (
                <div style={{ color: '#94a3b8', fontSize: '12px', width: '100%' }}>
                  {app.isReminderSent
                    ? getMinutesUntil(app) <= 60
                      ? 'Lịch hẹn còn dưới 1 giờ, đã bật nhắc ngay.'
                      : 'Nhắc lịch đã bật. Sẽ nhắc trước 1 giờ.'
                    : getMinutesUntil(app) <= 60
                      ? 'Còn dưới 1 giờ. Nhấn nhắc ngay để xác nhận.'
                      : 'Nhắc lịch trước 1 giờ để bạn không quên.'}
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={detailCard}>
          <h3 style={{ color: '#10b981', marginBottom: '12px' }}>Chi tiết lịch hẹn</h3>
          {selectedAppointment ? (
            <>
              <div style={detailRow}><span>Khách hàng</span><strong>{selectedAppointment.customer}</strong></div>
              <div style={detailRow}><span>Dịch vụ</span><strong>{selectedAppointment.service}</strong></div>
              <div style={detailRow}><span>Thời gian</span><strong>{selectedAppointment.date}, {selectedAppointment.time}</strong></div>
              <div style={detailRow}><span>Trạng thái</span><strong>{selectedAppointment.status === 'scheduled' ? 'Chờ làm' : selectedAppointment.status === 'in_progress' ? 'Đang làm' : 'Hoàn thành'}</strong></div>
              <div style={detailRow}><span>Giá trị dịch vụ</span><strong>{selectedAppointment.servicePrice.toLocaleString()}đ</strong></div>
              <div style={detailRow}><span>Hoa hồng</span><strong>{Math.round(selectedAppointment.commissionRate * 100)}%</strong></div>
              <div style={{ marginTop: '12px', color: '#94a3b8', fontSize: '13px' }}>Ghi chú chuyên viên: {selectedAppointment.notes}</div>
              <div style={{ marginTop: '18px' }}>
                <h4 style={{ margin: '0 0 10px', color: '#fff' }}>Nhật ký liệu trình</h4>
                {selectedAppointment.treatmentLog.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: '13px' }}>Chưa có ghi chú hoàn thành.</p>
                ) : selectedAppointment.treatmentLog.map((log, index) => (
                  <div key={index} style={logItem}><strong>{log.time}</strong><p style={{ margin: '6px 0 0', color: '#94a3b8' }}>{log.note}</p></div>
                ))}
              </div>
              <div style={{ marginTop: '18px', display: 'grid', gap: '10px' }}>
                <div style={photoTag}>
                  <div style={{ fontWeight: '600', marginBottom: '8px' }}>Ảnh trước</div>
                  {selectedAppointment.beforePhoto ? (
                    selectedAppointment.beforePhoto.startsWith('data:image') ? (
                      <img src={selectedAppointment.beforePhoto} alt="Trước" style={{ width: '100%', borderRadius: '12px', maxHeight: '200px', objectFit: 'cover' }} />
                    ) : (
                      <span>{selectedAppointment.beforePhoto}</span>
                    )
                  ) : 'Chưa có'}
                </div>
                <div style={photoTag}>
                  <div style={{ fontWeight: '600', marginBottom: '8px' }}>Ảnh sau</div>
                  {selectedAppointment.afterPhoto ? (
                    selectedAppointment.afterPhoto.startsWith('data:image') ? (
                      <img src={selectedAppointment.afterPhoto} alt="Sau" style={{ width: '100%', borderRadius: '12px', maxHeight: '200px', objectFit: 'cover' }} />
                    ) : (
                      <span>{selectedAppointment.afterPhoto}</span>
                    )
                  ) : 'Chưa có'}
                </div>
              </div>
            </>
          ) : <p style={{ color: '#94a3b8' }}>Chọn lịch hẹn để xem chi tiết.</p>}
        </div>
      </div>
    </div>
  );

  const renderSalaryTab = () => (
    <div style={{ display: 'grid', gap: '18px' }}>
      <div style={salaryPanel}>
        <h3 style={{ margin: 0, color: '#10b981' }}>Lương cập nhật tháng này</h3>
        <p style={{ margin: '8px 0 0', color: '#94a3b8' }}>Lương cứng + % trị liệu + % tư vấn / sản phẩm.</p>
        <div style={bigValue}>{monthlySalary.toLocaleString()}đ</div>
      </div>
      <div style={salaryPanel}>
        <div style={salaryRow}><span>Lương cứng</span><strong>{baseSalary.toLocaleString()}đ</strong></div>
        <div style={salaryRow}><span>Hoa hồng trị liệu</span><strong>{completedCommission.toLocaleString()}đ</strong></div>
        <div style={salaryRow}><span>Thưởng giới thiệu</span><strong>{referralBonus.toLocaleString()}đ</strong></div>
        <hr style={{ border: '0.5px solid #334155', margin: '16px 0' }} />
        <div style={{ ...salaryRow, fontWeight: 'bold', color: '#10b981', fontSize: '16px' }}><span>Tổng thu nhập</span><strong>{monthlySalary.toLocaleString()}đ</strong></div>
      </div>
      <div style={salaryPanel}>
        <h4 style={{ marginBottom: '12px', color: '#fff' }}>Luồng lương chuyên nghiệp</h4>
        <p style={{ color: '#94a3b8', fontSize: '13px' }}>Khi bạn hoàn thành liệu trình, hệ thống tự động cộng hoa hồng theo % trị liệu. Nếu giới thiệu khách mua thêm dịch vụ hoặc sản phẩm, thêm % tư vấn và % sản phẩm.</p>
      </div>
    </div>
  );

  const renderChatTab = () => (
    <div style={{ display: 'grid', gap: '18px' }}>
      <div style={infoCard}>
        <h3 style={{ margin: 0, color: '#10b981' }}>Chat với Chủ Spa</h3>
        <p style={{ margin: '8px 0 0', color: '#94a3b8' }}>Kết nối nhanh để báo cáo lịch, khách mới và hỗ trợ thực hiện.</p>
      </div>
      <div style={{ minHeight: '520px', borderRadius: '20px', overflow: 'hidden' }}>
        <ChatBox receiverName="Chủ Spa" />
      </div>
    </div>
  );

  return (
    <div style={container} className="responsive-employee-dashboard">
      <div style={topBar}>
        <div>
          <h2 style={{ margin: 0, color: '#10b981' }}>Xin chào, {user?.name || 'Nhân viên'}</h2>
          <div style={{ marginTop: '8px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <span style={pill}>Cổ phần: {sharesOwned.toLocaleString()} CP</span>
            <span style={pill}>Lịch hẹn mới: {newAppointmentsCount}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={onLogout} style={btnLogout}>Đăng xuất</button>
          <button onClick={() => setActiveTab('chat')} style={btnChatTop}> Chat</button>
        </div>
      </div>

      <div style={headerCard}>
        <div>
          <small style={{ color: '#94a3b8' }}>Lương tháng</small>
          <div style={headerValue}>{monthlySalary.toLocaleString()}đ</div>
          <div style={{ color: '#94a3b8', fontSize: '13px' }}>Cập nhật theo hoàn thành liệu trình và referral.</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={smallCard}>Lương cứng: {baseSalary.toLocaleString()}đ</span>
          <span style={smallCard}>Hoa hồng: {completedCommission.toLocaleString()}đ</span>
          <span style={smallCard}>Thưởng tư vấn: {referralBonus.toLocaleString()}đ</span>
        </div>
      </div>

      <div style={tabContainer}>
        <button onClick={() => setActiveTab('schedule')} style={activeTab === 'schedule' ? tabActive : tabInactive}>Lịch Hẹn</button>
        <button onClick={() => setActiveTab('salary')} style={activeTab === 'salary' ? tabActive : tabInactive}>Lương</button>
        <button onClick={() => setActiveTab('chat')} style={activeTab === 'chat' ? tabActive : tabInactive}>Chat</button>
      </div>

      <div style={contentArea}>
        {activeTab === 'schedule' && renderScheduleTab()}
        {activeTab === 'salary' && renderSalaryTab()}
        {activeTab === 'chat' && renderChatTab()}
      </div>
    </div>
  );
};

const container = { minHeight: '100vh', padding: '24px', backgroundColor: '#0b1120', color: 'white' };
const topBar = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', marginBottom: '22px' };
const headerCard = { display: 'flex', justifyContent: 'space-between', gap: '18px', padding: '22px', borderRadius: '22px', backgroundColor: '#111827', border: '1px solid #334155', marginBottom: '20px' };
const headerValue = { fontSize: '32px', fontWeight: 'bold', color: '#10b981', marginTop: '8px' };
const smallCard = { padding: '10px 14px', borderRadius: '14px', backgroundColor: '#161f33', border: '1px solid #334155', fontSize: '13px' };
const pill = { padding: '8px 12px', borderRadius: '999px', backgroundColor: '#111827', border: '1px solid #334155', color: '#94a3b8', fontSize: '13px' };
const btnLogout = { padding: '12px 18px', borderRadius: '14px', border: '1px solid #ef4444', backgroundColor: '#ef4444', color: 'white', fontWeight: 'bold', cursor: 'pointer' };
const btnChatTop = { padding: '12px 16px', borderRadius: '14px', border: 'none', backgroundColor: '#334155', color: 'white', cursor: 'pointer' };
const tabContainer = { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px', marginBottom: '20px' };
const tabInactive = { padding: '14px', backgroundColor: '#111827', border: '1px solid #334155', color: '#94a3b8', borderRadius: '14px', cursor: 'pointer', fontWeight: '600' };
const tabActive = { ...tabInactive, backgroundColor: '#10b981', color: 'white' };
const contentArea = { display: 'flex', flexDirection: 'column', gap: '18px' };
const notificationBar = { padding: '16px 20px', borderRadius: '18px', backgroundColor: '#111827', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', color: 'white' };
const gridSchedule = { display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '18px' };
const scheduleColumn = { display: 'flex', flexDirection: 'column', gap: '14px' };
const detailCard = { backgroundColor: '#111827', border: '1px solid #334155', borderRadius: '18px', padding: '20px' };
const detailRow = { display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#cbd5e1' };
const btnPrimary = { padding: '10px 14px', borderRadius: '12px', border: 'none', backgroundColor: '#10b981', color: 'white', cursor: 'pointer', fontWeight: 'bold' };
const btnSecondary = { padding: '10px 14px', borderRadius: '12px', border: '1px solid #10b981', backgroundColor: 'transparent', color: '#10b981', cursor: 'pointer' };
const logItem = { borderTop: '1px solid #334155', paddingTop: '12px', marginTop: '12px' };
const cardItem = { backgroundColor: '#111827', border: '1px solid #334155', borderRadius: '18px', padding: '18px', color: '#e2e8f0' };
const salaryPanel = { backgroundColor: '#111827', border: '1px solid #334155', borderRadius: '18px', padding: '22px' };
const bigValue = { marginTop: '18px', fontSize: '32px', fontWeight: 'bold', color: '#10b981' };
const infoCard = { backgroundColor: '#111827', border: '1px solid #334155', borderRadius: '18px', padding: '22px' };
const photoTag = { padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '14px', color: '#94a3b8' };
const salaryRow = { display: 'flex', justifyContent: 'space-between', margin: '8px 0', fontSize: '14px' };

export default EmployeeDashboard;
