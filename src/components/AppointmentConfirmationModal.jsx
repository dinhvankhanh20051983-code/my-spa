import React from 'react';

const AppointmentConfirmationModal = ({ appointment, onConfirm, onCancel, isLoading }) => {
  if (!appointment) return null;

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modalBox: {
      backgroundColor: '#1e293b',
      borderRadius: '20px',
      padding: '32px',
      maxWidth: '480px',
      width: '90%',
      border: '2px solid #10b981',
      boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
    },
    header: {
      textAlign: 'center',
      marginBottom: '24px',
      color: '#10b981',
      fontSize: '18px',
      fontWeight: 'bold'
    },
    detailRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 0',
      borderBottom: '1px solid #334155',
      color: '#e2e8f0'
    },
    detailLabel: {
      color: '#94a3b8',
      fontSize: '13px'
    },
    detailValue: {
      fontWeight: '600',
      color: '#fff',
      textAlign: 'right'
    },
    actionButtons: {
      display: 'flex',
      gap: '12px',
      marginTop: '28px'
    },
    btnConfirm: {
      flex: 1,
      padding: '14px',
      borderRadius: '14px',
      border: 'none',
      backgroundColor: '#10b981',
      color: 'white',
      fontWeight: 'bold',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      opacity: isLoading ? 0.7 : 1
    },
    btnCancel: {
      flex: 1,
      padding: '14px',
      borderRadius: '14px',
      border: '1px solid #475569',
      backgroundColor: 'transparent',
      color: '#e2e8f0',
      fontWeight: 'bold',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      opacity: isLoading ? 0.7 : 1
    }
  };

  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          ✅ KIỂM TRA LỊC HẸN
        </div>

        <div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Khách hàng</span>
            <span style={styles.detailValue}>{appointment.customer_name}</span>
          </div>

          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Số điện thoại</span>
            <span style={styles.detailValue}>{appointment.customer_phone}</span>
          </div>

          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Dịch vụ</span>
            <span style={styles.detailValue}>{appointment.service}</span>
          </div>

          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Kỹ thuật viên</span>
            <span style={styles.detailValue}>{appointment.ktv}</span>
          </div>

          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Ngày</span>
            <span style={styles.detailValue}>
              {new Date(appointment.date).toLocaleDateString('vi-VN')}
            </span>
          </div>

          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Giờ</span>
            <span style={styles.detailValue}>{appointment.time}</span>
          </div>

          <div style={{ ...styles.detailRow, borderBottom: 'none' }}>
            <span style={styles.detailLabel}>Trạng thái</span>
            <span style={{ ...styles.detailValue, color: '#fbbf24' }}>
              ⏳ Chờ xác nhận
            </span>
          </div>
        </div>

        <div style={styles.actionButtons}>
          <button
            style={styles.btnConfirm}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : '✅ XÁC NHẬN'}
          </button>
          <button
            style={styles.btnCancel}
            onClick={onCancel}
            disabled={isLoading}
          >
            ❌ HỦY BỎ
          </button>
        </div>

        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '12px', marginTop: '16px' }}>
          Vui lòng kiểm tra kỹ thông tin trước khi xác nhận
        </p>
      </div>
    </div>
  );
};

export default AppointmentConfirmationModal;
