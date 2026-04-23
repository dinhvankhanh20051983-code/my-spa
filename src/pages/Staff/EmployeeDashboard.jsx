import React, { useEffect, useMemo, useState } from 'react';
import ChatBox from '../../components/Chat/ChatBox';
import { useEmployeeDashboard } from './useEmployeeDashboard';

/**
 * EmployeeDashboard Component
 * Professional employee management interface with Supabase integration
 * - Real-time appointment management with database sync
 * - Professional treatment logging with customer history
 * - Advanced salary tracking with commission calculations
 * - Direct communication with owner via persistent chat
 */
const EmployeeDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [isTablet, setIsTablet] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);
  const [showTreatmentHistory, setShowTreatmentHistory] = useState(null);
  const [showPhotoCapture, setShowPhotoCapture] = useState(null);
  const [treatmentNotes, setTreatmentNotes] = useState('');
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [editingTreatment, setEditingTreatment] = useState(null);
  const [editNote, setEditNote] = useState('');

  // Use Supabase hook for data management
  const {
    appointments,
    treatmentLogs,
    staffTreatmentLogs,
    staffData,
    chatMessages,
    isLoading,
    error,
    salaryData,
    updateAppointmentStatus,
    addTreatmentLog,
    updateTreatmentLog,
    sendChatMessage,
    refreshData
  } = useEmployeeDashboard(user);

  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate dashboard stats
  const dashboardStats = useMemo(() => {
    if (!appointments.length || !salaryData) return {
      newAppointmentsCount: 0,
      completedCommission: 0,
      referralBonus: 0,
      monthlySalary: 0
    };

    const newAppointments = appointments.filter(a => a.status === 'Chờ phục vụ');
    const completedAppointments = appointments.filter(a => a.status === 'Hoàn thành');

    return {
      newAppointmentsCount: newAppointments.length,
      completedCommission: salaryData.totalCommission,
      referralBonus: salaryData.referralBonus,
      monthlySalary: salaryData.totalSalary
    };
  }, [appointments, salaryData]);

  const { newAppointmentsCount, completedCommission, referralBonus, monthlySalary } = dashboardStats;

  // Calculate shares owned
  const sharesOwned = useMemo(() => {
    return staffData?.stocks || 0;
  }, [staffData]);

  // Helper functions
  const handleStartAppointment = async (id) => {
    try {
      await updateAppointmentStatus(id, 'Đang thực hiện');
      setSelectedAppointmentId(id);
    } catch (error) {
      alert('Không thể cập nhật trạng thái lịch hẹn: ' + error.message);
    }
  };

  const handleCompleteAppointment = async (id) => {
    try {
      await updateAppointmentStatus(id, 'Hoàn thành');
      setSelectedAppointmentId(null);
    } catch (error) {
      alert('Không thể hoàn thành lịch hẹn: ' + error.message);
    }
  };

  const handleSendReminder = async (id) => {
    // For now, just mark as reminded locally
    // In future, could integrate with SMS/email service
    alert('Tính năng nhắc nhở sẽ được tích hợp với dịch vụ SMS/Email');
  };

  // Photo capture functions (keeping local for now, could be enhanced with Supabase storage)
  const handleCapturePhoto = async (appointmentId, photoType) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      // Create canvas for capturing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Wait for video to load
      await new Promise(resolve => {
        video.onloadedmetadata = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0);
          resolve();
        };
      });

      const photoData = canvas.toDataURL('image/jpeg', 0.8);

      // Stop camera
      stream.getTracks().forEach(track => track.stop());

      // For now, store locally. In future, upload to Supabase storage
      alert(`Ảnh ${photoType === 'beforePhoto' ? 'trước' : 'sau'} đã được chụp! (Tính năng lưu trữ đám mây sẽ được thêm sau)`);
    } catch (error) {
      console.error('Error capturing photo:', error);
      alert('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.');
    }
  };

  // Treatment logging functions
  const handleAddTreatmentLog = async (appointmentId) => {
    if (!treatmentNotes.trim()) {
      alert('Vui lòng nhập ghi chú liệu trình');
      return;
    }

    const appointment = appointments.find(a => a.id === appointmentId);
    if (!appointment) return;

    try {
      await addTreatmentLog(appointment.customer_id || 1, { // Need to get customer_id properly
        service: appointment.service,
        note: treatmentNotes,
        images: {},
        skinCondition: '',
        productsUsed: '',
        nextStep: '',
        sessionProgress: ''
      });

      setTreatmentNotes('');
      alert('Ghi chú liệu trình đã được lưu thành công!');
    } catch (error) {
      alert('Không thể lưu ghi chú liệu trình: ' + error.message);
    }
  };

  const handleViewTreatmentHistory = (appointment) => {
    // Find treatment logs for this customer
    const customerLogs = treatmentLogs.filter(log =>
      log.customer_id === appointment.customer_id // Need proper customer_id mapping
    );
    setShowTreatmentHistory({ appointment, logs: customerLogs });
  };

  const handleSelectTreatment = (appointment) => {
    setSelectedTreatment(appointment);
    handleViewTreatmentHistory(appointment);
  };

  // Render functions
  const renderScheduleTab = () => {
    if (isLoading) {
      return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div>Đang tải dữ liệu...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ textAlign: 'center', padding: '40px', color: '#C97070' }}>
          <div>Lỗi tải dữ liệu: {error}</div>
          <button onClick={refreshData} style={btnPrimary}>Thử lại</button>
        </div>
      );
    }

    const scheduledAppointments = appointments.filter(a => a.status === 'Chờ phục vụ');
    const inProgressAppointments = appointments.filter(a => a.status === 'Đang thực hiện');

    return (
      <div style={gridScheduleStyle}>
        <div style={scheduleColumn}>
          <h3 style={{ margin: '0 0 16px 0', color: '#9CAF88', fontSize: isMobile ? '16px' : '18px' }}>
            Lịch Hẹn Sắp Tới ({scheduledAppointments.length})
          </h3>
          {scheduledAppointments.map(appointment => (
            <div key={appointment.id} style={cardItem}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#3D3D3D', fontSize: isMobile ? '14px' : '16px' }}>
                    {appointment.customer_name}
                  </div>
                  <div style={{ color: '#6B7280', fontSize: isMobile ? '12px' : '13px' }}>{appointment.service}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', color: '#9CAF88', fontSize: isMobile ? '14px' : '16px' }}>
                    {appointment.time}
                  </div>
                  <div style={{ color: '#6B7280', fontSize: isMobile ? '12px' : '13px' }}>
                    {new Date(appointment.date).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span style={pill}>💰 {appointment.price?.toLocaleString()}đ</span>
                <span style={pill}>📈 {salaryData?.serviceCommissionRate || 0}%</span>
                {appointment.is_reminded && <span style={pill}>✅ Đã nhắc</span>}
              </div>

              <div style={{ color: '#6B7280', fontSize: isMobile ? '12px' : '13px', marginBottom: '12px', lineHeight: '1.4' }}>
                {appointment.note}
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={() => handleStartAppointment(appointment.id)} style={btnPrimary}>
                  Bắt Đầu Liệu Trình
                </button>
                {!appointment.is_reminded && (
                  <button onClick={() => handleSendReminder(appointment.id)} style={btnSecondary}>
                    Nhắc Nhở
                  </button>
                )}
                <button
                  onClick={() => handleSelectTreatment(appointment)}
                  style={{ ...btnSecondary, backgroundColor: '#E8E3D8' }}
                >
                  📋 Xem Lịch Sử
                </button>
              </div>
            </div>
          ))}
          {scheduledAppointments.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
              Không có lịch hẹn nào sắp tới
            </div>
          )}
        </div>

        <div style={scheduleColumn}>
          <h3 style={{ margin: '0 0 16px 0', color: '#9CAF88', fontSize: isMobile ? '16px' : '18px' }}>
            Đang Thực Hiện ({inProgressAppointments.length})
          </h3>
          {inProgressAppointments.map(appointment => (
            <div key={appointment.id} style={cardItem}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#3D3D3D', fontSize: isMobile ? '14px' : '16px' }}>
                    {appointment.customer_name}
                  </div>
                  <div style={{ color: '#6B7280', fontSize: isMobile ? '12px' : '13px' }}>{appointment.service}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', color: '#9CAF88', fontSize: isMobile ? '14px' : '16px' }}>
                    {appointment.time}
                  </div>
                  <div style={{ color: '#6B7280', fontSize: isMobile ? '12px' : '13px' }}>
                    {new Date(appointment.date).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span style={pill}>💰 {appointment.price?.toLocaleString()}đ</span>
                <span style={pill}>📈 {salaryData?.serviceCommissionRate || 0}%</span>
              </div>

              {/* Photo capture buttons */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setShowPhotoCapture({ appointmentId: appointment.id, type: 'beforePhoto' })}
                  style={{ ...btnSecondary, fontSize: isMobile ? '12px' : '13px', padding: '6px 12px' }}
                >
                  📷 Chụp Trước
                </button>
                <button
                  onClick={() => setShowPhotoCapture({ appointmentId: appointment.id, type: 'afterPhoto' })}
                  style={{ ...btnSecondary, fontSize: isMobile ? '12px' : '13px', padding: '6px 12px' }}
                >
                  📷 Chụp Sau
                </button>
                <button
                  onClick={() => handleSelectTreatment(appointment)}
                  style={{ ...btnSecondary, fontSize: isMobile ? '12px' : '13px', padding: '6px 12px' }}
                >
                  📋 Lịch Sử
                </button>
              </div>

              {/* Treatment notes input */}
              <div style={{ marginBottom: '12px' }}>
                <textarea
                  placeholder="Ghi chú liệu trình chuyên nghiệp..."
                  value={treatmentNotes}
                  onChange={(e) => setTreatmentNotes(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '60px',
                    padding: '8px',
                    border: '1px solid #E8E3D8',
                    borderRadius: '6px',
                    fontSize: isMobile ? '12px' : '13px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
                <button
                  onClick={() => handleAddTreatmentLog(appointment.id)}
                  style={{ ...btnSecondary, marginTop: '8px', fontSize: isMobile ? '12px' : '13px', padding: '6px 12px' }}
                >
                  ➕ Thêm Nhật Ký Liệu Trình
                </button>
              </div>

              <button onClick={() => handleCompleteAppointment(appointment.id)} style={btnPrimary}>
                Hoàn Thành Liệu Trình
              </button>
            </div>
          ))}
          {inProgressAppointments.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
              Không có liệu trình nào đang thực hiện
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderHistoryTab = () => {
    if (isLoading) {
      return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div>Đang tải lịch sử trị liệu...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ textAlign: 'center', padding: '40px', color: '#C97070' }}>
          <div>Lỗi tải dữ liệu: {error}</div>
          <button onClick={refreshData} style={btnPrimary}>Thử lại</button>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '14px' : '18px' }}>
        <div style={notificationBar}>
          <h3 style={{ margin: '0 0 8px 0', color: '#9CAF88', fontSize: isMobile ? '16px' : '18px' }}>
            📋 Lịch Sử Trị Liệu Của Bạn
          </h3>
          <p style={{ margin: 0, color: '#6B7280', fontSize: isMobile ? '12px' : '13px' }}>
            Xem và chỉnh sửa nhật ký các buổi trị liệu bạn đã thực hiện.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {staffTreatmentLogs.map(log => (
            <div key={log.id} style={cardItem}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#3D3D3D', fontSize: isMobile ? '14px' : '16px' }}>
                    {log.service}
                  </div>
                  <div style={{ color: '#6B7280', fontSize: isMobile ? '12px' : '13px' }}>
                    Khách: {log.customer_name || 'N/A'}
                  </div>
                  <div style={{ color: '#6B7280', fontSize: '11px' }}>
                    {new Date(log.date).toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setEditingTreatment(log);
                    setEditNote(log.note || '');
                  }}
                  style={{ ...btnSecondary, fontSize: '12px', padding: '6px 12px' }}
                >
                  ✏️ Chỉnh Sửa
                </button>
              </div>

              <div style={{ color: '#3D3D3D', fontSize: isMobile ? '13px' : '14px', lineHeight: '1.4' }}>
                {log.note || 'Chưa có ghi chú'}
              </div>

              {log.images && Object.keys(log.images).length > 0 && (
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {Object.entries(log.images).map(([key, url]) => (
                    <img
                      key={key}
                      src={url}
                      alt={`Treatment ${key}`}
                      style={{
                        width: isMobile ? '60px' : '80px',
                        height: isMobile ? '60px' : '80px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #E8E3D8'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}

          {staffTreatmentLogs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
              Chưa có lịch sử trị liệu nào
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSalaryTab = () => {
    if (!salaryData || !staffData) {
      return (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
          Đang tải thông tin lương...
        </div>
      );
    }

    const completedAppointments = appointments.filter(a => a.status === 'Hoàn thành');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '14px' : '18px' }}>
        {/* Professional Salary Overview */}
        <div style={salaryCard}>
          <h3 style={{ margin: '0 0 16px 0', color: '#9CAF88', fontSize: isMobile ? '16px' : '18px' }}>
            📊 Tổng Quan Lương Tháng {new Date().toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ color: '#6B7280', fontSize: isMobile ? '12px' : '13px' }}>Lương Cơ Bản</div>
              <div style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: 'bold', color: '#9CAF88', marginTop: '4px' }}>
                {salaryData.baseSalary.toLocaleString()}đ
              </div>
              <div style={{ color: '#6B7280', fontSize: '11px', marginTop: '4px' }}>
                Theo hợp đồng
              </div>
            </div>
            <div>
              <div style={{ color: '#6B7280', fontSize: isMobile ? '12px' : '13px' }}>Hoa Hồng Dịch Vụ</div>
              <div style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: 'bold', color: '#9CAF88', marginTop: '4px' }}>
                {salaryData.totalCommission.toLocaleString()}đ
              </div>
              <div style={{ color: '#6B7280', fontSize: '11px', marginTop: '4px' }}>
                {salaryData.serviceCommissionRate}% / dịch vụ
              </div>
            </div>
            <div>
              <div style={{ color: '#6B7280', fontSize: isMobile ? '12px' : '13px' }}>Thưởng Tư Vấn</div>
              <div style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: 'bold', color: '#9CAF88', marginTop: '4px' }}>
                {salaryData.referralBonus.toLocaleString()}đ
              </div>
              <div style={{ color: '#6B7280', fontSize: '11px', marginTop: '4px' }}>
                {salaryData.consultCommissionRate}đ / giới thiệu
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #E8E3D8', marginTop: '16px', paddingTop: '16px' }}>
            <div style={{ color: '#6B7280', fontSize: isMobile ? '12px' : '13px' }}>Tổng Lương Thực Nhận</div>
            <div style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 'bold', color: '#9CAF88', marginTop: '4px' }}>
              {salaryData.totalSalary.toLocaleString()}đ
            </div>
            <div style={{ color: '#6B7280', fontSize: '11px', marginTop: '4px' }}>
              Đã bao gồm thuế và bảo hiểm (được khấu trừ)
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div style={salaryCard}>
          <h3 style={{ margin: '0 0 16px 0', color: '#9CAF88', fontSize: isMobile ? '16px' : '18px' }}>
            📈 Chỉ Số Hiệu Suất
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9CAF88' }}>{salaryData.completedCount}</div>
              <div style={{ color: '#6B7280', fontSize: '12px' }}>Liệu trình hoàn thành</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9CAF88' }}>
                {salaryData.completedCount > 0 ? Math.round(salaryData.totalCommission / salaryData.completedCount).toLocaleString() : 0}
              </div>
              <div style={{ color: '#6B7280', fontSize: '12px' }}>Hoa hồng TB/lần</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9CAF88' }}>
                {Math.round((salaryData.completedCount / appointments.length) * 100) || 0}%
              </div>
              <div style={{ color: '#6B7280', fontSize: '12px' }}>Tỷ lệ hoàn thành</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9CAF88' }}>{sharesOwned}</div>
              <div style={{ color: '#6B7280', fontSize: '12px' }}>Cổ phần sở hữu</div>
            </div>
          </div>
        </div>

        {/* Commission Breakdown */}
        <div style={salaryCard}>
          <h3 style={{ margin: '0 0 16px 0', color: '#9CAF88', fontSize: isMobile ? '16px' : '18px' }}>
            💰 Chi Tiết Hoa Hồng ({completedAppointments.length} liệu trình)
          </h3>
          {completedAppointments.map(appointment => (
            <div key={appointment.id} style={salaryRow}>
              <div>
                <span style={{ color: '#3D3D3D', fontSize: isMobile ? '13px' : '14px', fontWeight: '500' }}>
                  {appointment.customer_name}
                </span>
                <span style={{ color: '#6B7280', fontSize: '12px', marginLeft: '8px' }}>
                  {appointment.service}
                </span>
                <span style={{ color: '#6B7280', fontSize: '11px', marginLeft: '8px' }}>
                  {new Date(appointment.date).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <span style={{ color: '#9CAF88', fontWeight: 'bold', fontSize: isMobile ? '13px' : '14px' }}>
                +{(appointment.price * (salaryData.serviceCommissionRate / 100)).toLocaleString()}đ
              </span>
            </div>
          ))}
          {completedAppointments.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#6B7280' }}>
              Chưa có liệu trình hoàn thành trong tháng này
            </div>
          )}
        </div>

        {/* Salary Projection */}
        <div style={salaryCard}>
          <h3 style={{ margin: '0 0 16px 0', color: '#9CAF88', fontSize: isMobile ? '16px' : '18px' }}>
            🎯 Dự Báo Lương Tháng Sau
          </h3>
          <div style={{ color: '#6B7280', fontSize: '13px', marginBottom: '12px' }}>
            Dựa trên hiệu suất hiện tại và lịch hẹn sắp tới
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#6B7280', fontSize: '12px' }}>Lương dự kiến</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#9CAF88' }}>
                {(salaryData.baseSalary + (salaryData.totalCommission * 1.2)).toLocaleString()}đ
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#6B7280', fontSize: '12px' }}>Tiềm năng tăng</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#28a745' }}>
                +{(Math.round((salaryData.totalCommission * 0.2))).toLocaleString()}đ
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderChatTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '14px' : '18px' }}>
      <div style={notificationBar}>
        <h3 style={{ margin: '0 0 8px 0', color: '#9CAF88', fontSize: isMobile ? '16px' : '18px' }}>Chat với Chủ Spa</h3>
        <p style={{ margin: 0, color: '#6B7280', fontSize: isMobile ? '12px' : '13px' }}>
          Kết nối nhanh để báo cáo lịch, khách mới và hỗ trợ thực hiện.
        </p>
      </div>
      <div style={{ minHeight: '520px', borderRadius: '14px', overflow: 'hidden', border: '1px solid #E8E3D8' }}>
        <ChatBox receiverName="Chủ Spa" />
      </div>
    </div>
  );

  // Style objects - moved inside component to access isMobile/isTablet
  const container = {
    minHeight: '100vh',
    padding: isMobile ? '14px' : isTablet ? '18px' : '24px',
    backgroundColor: '#FAF7F2',
    color: '#3D3D3D',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  };

  const topBar = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: isMobile ? '12px' : '20px',
    marginBottom: isMobile ? '16px' : '22px',
    flexWrap: isMobile ? 'wrap' : 'nowrap'
  };

  const headerCard = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
    gap: isMobile ? '12px' : '18px',
    padding: isMobile ? '16px' : '22px',
    borderRadius: '16px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8E3D8',
    marginBottom: isMobile ? '16px' : '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
  };

  const headerValue = {
    fontSize: isMobile ? '24px' : isTablet ? '28px' : '32px',
    fontWeight: 'bold',
    color: '#9CAF88',
    marginTop: '8px'
  };

  const smallCard = {
    padding: isMobile ? '8px 10px' : '10px 14px',
    borderRadius: '12px',
    backgroundColor: '#F5F0E8',
    border: '1px solid #E8E3D8',
    fontSize: isMobile ? '12px' : '13px',
    color: '#3D3D3D'
  };

  const pill = {
    padding: isMobile ? '6px 10px' : '8px 12px',
    borderRadius: '999px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8E3D8',
    color: '#6B7280',
    fontSize: isMobile ? '12px' : '13px',
    whiteSpace: 'nowrap'
  };

  const btnLogout = {
    padding: isMobile ? '10px 14px' : '12px 18px',
    borderRadius: '12px',
    border: '1px solid #C97070',
    backgroundColor: '#C97070',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: isMobile ? '12px' : '14px',
    transition: 'all 0.2s ease',
    ':hover': { backgroundColor: '#B85D5D' }
  };

  const btnChatTop = {
    padding: isMobile ? '10px 12px' : '12px 16px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#E8E3D8',
    color: '#3D3D3D',
    cursor: 'pointer',
    fontSize: isMobile ? '12px' : '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    ':hover': { backgroundColor: '#D5CAB8' }
  };

  const tabContainerStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, minmax(0, 1fr))',
    gap: isMobile ? '8px' : '10px',
    marginBottom: isMobile ? '16px' : '20px'
  };

  const tabBase = {
    padding: isMobile ? '11px' : '14px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8E3D8',
    color: '#6B7280',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: isMobile ? '13px' : '14px',
    transition: 'all 0.2s ease',
    textAlign: 'center'
  };

  const tabInactive = tabBase;
  const tabActive = { ...tabBase, backgroundColor: '#9CAF88', color: 'white', border: '1px solid #8A9973' };

  const contentAreaStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? '14px' : '18px'
  };

  const gridScheduleStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : '1.4fr 1fr',
    gap: isMobile ? '14px' : '18px'
  };

  const scheduleColumn = {
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? '12px' : '14px'
  };

  const cardItem = {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8E3D8',
    borderRadius: '14px',
    padding: isMobile ? '14px' : '18px',
    transition: 'all 0.2s ease',
    ':hover': { backgroundColor: '#FDF9F5', borderColor: '#9CAF88' },
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
  };

  const notificationBar = {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8E3D8',
    borderRadius: '12px',
    padding: isMobile ? '12px' : '16px',
    marginBottom: isMobile ? '12px' : '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
  };

  const detailCard = {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8E3D8',
    borderRadius: '14px',
    padding: isMobile ? '16px' : '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
  };

  const detailRow = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: isMobile ? '10px' : '12px',
    color: '#6B7280',
    fontSize: isMobile ? '13px' : '14px',
    gap: '8px'
  };

  const btnPrimary = {
    padding: isMobile ? '9px 12px' : '10px 14px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#9CAF88',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: isMobile ? '12px' : '14px',
    transition: 'all 0.2s ease',
    ':hover': { backgroundColor: '#8A9973' }
  };

  const btnSecondary = {
    padding: isMobile ? '9px 12px' : '10px 14px',
    borderRadius: '10px',
    border: '1px solid #E8E3D8',
    backgroundColor: '#FFFFFF',
    color: '#6B7280',
    cursor: 'pointer',
    fontSize: isMobile ? '12px' : '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    ':hover': { backgroundColor: '#F5F0E8' }
  };

  const salaryCard = {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8E3D8',
    borderRadius: '14px',
    padding: isMobile ? '16px' : '20px',
    marginBottom: isMobile ? '12px' : '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
  };

  const chatContainer = {
    display: 'flex',
    height: isMobile ? '400px' : '500px',
    backgroundColor: '#FFFFFF',
    borderRadius: '14px',
    overflow: 'hidden',
    flexDirection: isMobile ? 'column' : 'row',
    border: '1px solid #E8E3D8',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
  };

  const chatSidebar = {
    width: isMobile ? '100%' : '200px',
    borderRight: isMobile ? 'none' : '1px solid #E8E3D8',
    borderBottom: isMobile ? '1px solid #E8E3D8' : 'none',
    padding: isMobile ? '10px' : '10px',
    overflowY: 'auto',
    display: isMobile ? 'flex' : 'flex',
    flexDirection: isMobile ? 'row' : 'column',
    gap: isMobile ? '8px' : '0'
  };

  const chatMain = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: isMobile ? '12px' : '20px'
  };

  const chatHistory = {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  };

  const chatInputArea = {
    display: 'flex',
    gap: '10px',
    marginTop: isMobile ? '10px' : '15px'
  };

  const msgLeft = {
    alignSelf: 'flex-start',
    backgroundColor: '#F5F0E8',
    color: '#3D3D3D',
    padding: isMobile ? '8px' : '10px',
    borderRadius: '10px 10px 10px 0',
    maxWidth: '80%',
    fontSize: isMobile ? '12px' : '13px'
  };

  const msgRight = {
    alignSelf: 'flex-end',
    backgroundColor: '#9CAF88',
    color: '#FFFFFF',
    padding: isMobile ? '8px' : '10px',
    borderRadius: '10px 10px 0 10px',
    maxWidth: '80%',
    fontSize: isMobile ? '12px' : '13px'
  };

  const photoUpload = {
    padding: isMobile ? '8px 12px' : '10px 16px',
    border: '1px solid #E8E3D8',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    color: '#6B7280',
    cursor: 'pointer',
    fontSize: isMobile ? '12px' : '13px',
    transition: 'all 0.2s ease'
  };

  const photoTag = {
    padding: isMobile ? '10px' : '12px',
    backgroundColor: '#F5F0E8',
    border: '1px solid #E8E3D8',
    borderRadius: '12px',
    color: '#6B7280',
    fontSize: isMobile ? '12px' : '13px'
  };

  const salaryRow = {
    display: 'flex',
    justifyContent: 'space-between',
    margin: isMobile ? '6px 0' : '8px 0',
    fontSize: isMobile ? '13px' : '14px',
    gap: '8px'
  };

  return (
    <div style={container}>
      <div style={topBar}>
        <h1 style={{ color: '#9CAF88', fontSize: isMobile ? '18px' : '22px', margin: 0 }}>Nhân Viên SPA</h1>
        <div style={{ display: 'flex', gap: isMobile ? '8px' : '12px', alignItems: 'center' }}>
          <button onClick={() => setActiveTab('chat')} style={btnChatTop}>💬 Chat với Chủ</button>
          <button onClick={onLogout} style={btnLogout}>Đăng Xuất</button>
        </div>
      </div>

      <div style={headerCard}>
        <div>
          <div style={{ color: '#6B7280', fontSize: isMobile ? '12px' : '13px' }}>Lương Tháng Này</div>
          <div style={headerValue}>{(salaryData?.totalSalary || 0).toLocaleString()}đ</div>
          <div style={{ color: '#6B7280', fontSize: '11px', marginTop: '4px' }}>
            {salaryData ? `${salaryData.completedCount} liệu trình` : 'Đang tải...'}
          </div>
        </div>
        <div>
          <div style={{ color: '#6B7280', fontSize: isMobile ? '12px' : '13px' }}>Hoa Hồng Hoàn Thành</div>
          <div style={headerValue}>{(salaryData?.totalCommission || 0).toLocaleString()}đ</div>
          <div style={{ color: '#6B7280', fontSize: '11px', marginTop: '4px' }}>
            {salaryData ? `${salaryData.serviceCommissionRate}% tỷ lệ` : 'Đang tải...'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: isMobile ? '8px' : '12px', marginBottom: isMobile ? '16px' : '20px', flexWrap: 'wrap' }}>
        <span style={smallCard}>Lịch hẹn mới: {newAppointmentsCount}</span>
        <span style={smallCard}>Hoa hồng: {(salaryData?.totalCommission || 0).toLocaleString()}đ</span>
        <span style={smallCard}>Thưởng tư vấn: {(salaryData?.referralBonus || 0).toLocaleString()}đ</span>
        <span style={smallCard}>Cổ phần: {sharesOwned}</span>
      </div>

      <div style={tabContainerStyle}>
        <button onClick={() => setActiveTab('schedule')} style={activeTab === 'schedule' ? tabActive : tabInactive}>Lịch Hẹn</button>
        <button onClick={() => setActiveTab('history')} style={activeTab === 'history' ? tabActive : tabInactive}>Lịch Sử Trị Liệu</button>
        <button onClick={() => setActiveTab('salary')} style={activeTab === 'salary' ? tabActive : tabInactive}>Lương</button>
        <button onClick={() => setActiveTab('chat')} style={activeTab === 'chat' ? tabActive : tabInactive}>Chat</button>
      </div>

      <div style={contentAreaStyle}>
        {activeTab === 'schedule' && renderScheduleTab()}
        {activeTab === 'history' && renderHistoryTab()}
        {activeTab === 'salary' && renderSalaryTab()}
        {activeTab === 'chat' && renderChatTab()}
      </div>

      {/* Treatment History Modal */}
      {showTreatmentHistory && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: isMobile ? '16px' : '24px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: isMobile ? '16px' : '24px',
            maxWidth: isMobile ? '95vw' : '700px',
            maxHeight: '80vh',
            overflow: 'auto',
            width: '100%'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#9CAF88', fontSize: isMobile ? '18px' : '20px' }}>
                📋 Lịch Sử Điều Trị Chuyên Nghiệp - {showTreatmentHistory.appointment?.customer_name}
              </h3>
              <button
                onClick={() => setShowTreatmentHistory(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6B7280'
                }}
              >
                ×
              </button>
            </div>

            {/* Current Appointment Info */}
            <div style={{
              border: '1px solid #E8E3D8',
              borderRadius: '8px',
              padding: '16px',
              backgroundColor: '#FAF7F2',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#3D3D3D', fontSize: '16px' }}>
                    {showTreatmentHistory.appointment?.service}
                  </div>
                  <div style={{ color: '#6B7280', fontSize: '12px' }}>
                    {showTreatmentHistory.appointment?.date} - {showTreatmentHistory.appointment?.time}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    color: showTreatmentHistory.appointment?.status === 'Hoàn thành' ? '#28a745' :
                           showTreatmentHistory.appointment?.status === 'Đang thực hiện' ? '#ffc107' : '#6B7280',
                    fontWeight: 'bold'
                  }}>
                    {showTreatmentHistory.appointment?.status}
                  </div>
                  <div style={{ color: '#9CAF88', fontWeight: 'bold', fontSize: '14px' }}>
                    {showTreatmentHistory.appointment?.price?.toLocaleString()}đ
                  </div>
                </div>
              </div>
              {showTreatmentHistory.appointment?.note && (
                <div style={{ color: '#6B7280', fontSize: '13px', marginBottom: '12px' }}>
                  <strong>Ghi chú:</strong> {showTreatmentHistory.appointment.note}
                </div>
              )}
            </div>

            {/* Treatment Logs */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#9CAF88', fontSize: '16px' }}>
                📝 Nhật Ký Liệu Trình ({showTreatmentHistory.logs?.length || 0})
              </h4>
              {showTreatmentHistory.logs && showTreatmentHistory.logs.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {showTreatmentHistory.logs.map(log => (
                    <div key={log.id} style={{
                      backgroundColor: '#FFFFFF',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #E8E3D8'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ fontSize: '12px', color: '#6B7280' }}>
                          {new Date(log.date).toLocaleDateString('vi-VN')} - {log.staff}
                        </div>
                        <div style={{ fontSize: '12px', color: '#9CAF88', fontWeight: 'bold' }}>
                          {log.service}
                        </div>
                      </div>

                      <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                        <strong>Ghi chú:</strong> {log.note}
                      </div>

                      {log.skinCondition && (
                        <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                          <strong>Tình trạng da:</strong> {log.skinCondition}
                        </div>
                      )}

                      {log.productsUsed && (
                        <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                          <strong>Sản phẩm sử dụng:</strong> {log.productsUsed}
                        </div>
                      )}

                      {log.nextStep && (
                        <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                          <strong>Bước tiếp theo:</strong> {log.nextStep}
                        </div>
                      )}

                      {log.sessionProgress && (
                        <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                          <strong>Tiến độ buổi:</strong> {log.sessionProgress}
                        </div>
                      )}

                      {/* Images would be displayed here if available */}
                      {log.images && Object.keys(log.images).length > 0 && (
                        <div style={{ marginTop: '8px' }}>
                          <div style={{ fontSize: '12px', color: '#9CAF88', marginBottom: '4px' }}>
                            📷 Ảnh liệu trình
                          </div>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {/* Placeholder for images */}
                            <div style={{
                              width: '60px',
                              height: '60px',
                              backgroundColor: '#E8E3D8',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '10px',
                              color: '#6B7280'
                            }}>
                              Ảnh
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#6B7280' }}>
                  Chưa có nhật ký liệu trình nào cho khách hàng này
                </div>
              )}
            </div>

            {/* Treatment Progress Summary */}
            {showTreatmentHistory.logs && showTreatmentHistory.logs.length > 0 && (
              <div style={{
                border: '1px solid #E8E3D8',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#F5F0E8'
              }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#9CAF88', fontSize: '16px' }}>
                  📊 Tóm Tắt Tiến Độ Điều Trị
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>Tổng số buổi</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#9CAF88' }}>
                      {showTreatmentHistory.logs.length}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>Buổi gần nhất</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#3D3D3D' }}>
                      {new Date(showTreatmentHistory.logs[0]?.date).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Photo Capture Modal */}
      {showPhotoCapture && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: isMobile ? '16px' : '24px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: isMobile ? '16px' : '24px',
            maxWidth: isMobile ? '95vw' : '500px',
            width: '100%',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#9CAF88', fontSize: isMobile ? '18px' : '20px' }}>
              Chụp Ảnh {showPhotoCapture.type === 'beforePhoto' ? 'Trước' : 'Sau'} Điều Trị
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <video 
                id="photoCaptureVideo"
                style={{ 
                  width: '100%', 
                  maxWidth: '400px', 
                  borderRadius: '8px',
                  border: '2px solid #E8E3D8'
                }}
                autoPlay
                playsInline
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => {
                  const video = document.getElementById('photoCaptureVideo');
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
                  canvas.width = video.videoWidth;
                  canvas.height = video.videoHeight;
                  ctx.drawImage(video, 0, 0);
                  const photoData = canvas.toDataURL('image/jpeg', 0.8);
                  
                  setAppointments(prev => prev.map(a =>
                    a.id === showPhotoCapture.appointmentId
                      ? { ...a, [showPhotoCapture.type]: photoData }
                      : a
                  ));
                  
                  // Stop camera stream
                  if (video.srcObject) {
                    video.srcObject.getTracks().forEach(track => track.stop());
                  }
                  
                  setShowPhotoCapture(null);
                  alert('Ảnh đã được chụp thành công!');
                }}
                style={btnPrimary}
              >
                📷 Chụp
              </button>
              <button 
                onClick={() => {
                  const video = document.getElementById('photoCaptureVideo');
                  if (video.srcObject) {
                    video.srcObject.getTracks().forEach(track => track.stop());
                  }
                  setShowPhotoCapture(null);
                }}
                style={btnSecondary}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

{/* Edit Treatment Modal */}
{editingTreatment && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: isMobile ? '16px' : '24px'
  }}>
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      padding: isMobile ? '16px' : '24px',
      maxWidth: isMobile ? '95vw' : '500px',
      width: '100%',
      textAlign: 'center'
    }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#9CAF88', fontSize: isMobile ? '18px' : '20px' }}>
        Chỉnh Sửa Nhật Ký Trị Liệu
      </h3>

      <div style={{ marginBottom: '20px', textAlign: 'left' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: '#3D3D3D', fontWeight: 'bold' }}>
          Ghi chú liệu trình:
        </label>
        <textarea
          value={editNote}
          onChange={(e) => setEditNote(e.target.value)}
          placeholder="Cập nhật diễn biến liệu trình..."
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '12px',
            border: '1px solid #E8E3D8',
            borderRadius: '8px',
            fontSize: '14px',
            resize: 'vertical'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button
          onClick={async () => {
            try {
              await updateTreatmentLog(editingTreatment.id, { note: editNote });
              setEditingTreatment(null);
              setEditNote('');
              alert('Đã cập nhật nhật ký trị liệu thành công!');
            } catch (error) {
              alert('Không thể cập nhật: ' + error.message);
            }
          }}
          style={btnPrimary}
        >
          💾 Lưu Thay Đổi
        </button>
        <button
          onClick={() => {
            setEditingTreatment(null);
            setEditNote('');
          }}
          style={btnSecondary}
        >
          Hủy
        </button>
      </div>
    </div>
  </div>
)}

export default EmployeeDashboard;
