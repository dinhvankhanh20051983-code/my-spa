import React from 'react';

export const CustomersSection = ({
  customers,
  appointments,
  styles,
  onSetModal,
  onSetSelectedCustomer,
  onSetSelectedLog,
  onSetActiveTab
}) => (
  <div style={styles.section}>
    <div style={styles.flexHeader}>
      <h3 style={styles.sectionTitle}>🧖‍♀️ HỒ SƠ KHÁCH HÀNG</h3>
      <button style={styles.btnPrimary} onClick={() => onSetModal({ show: true, type: 'customer' })}>
        + THÊM KHÁCH MỚI
      </button>
    </div>
    <div style={styles.grid2}>
      {customers.map(c => {
        const lastVisit = c.history && c.history.length > 0 ? c.history[0] : null;
        const upcoming = appointments.find(a => a.customerName === c.name && a.status !== 'Đã hoàn thành');
        const totalPackages = c.myPackages.reduce((sum, p) => sum + (p.total - p.used), 0);
        const totalVisits = c.history ? c.history.length : 0;

        return (
          <div key={c.id} style={styles.card}>
            <div style={styles.flexHeader}>
              <div>
                <strong>{c.name}</strong>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{c.phone}</div>
              </div>
              <span style={styles.tagCustomer}>Khách VIP</span>
            </div>

            <div style={styles.grid2}>
              <div style={{ ...styles.card, padding: '10px 12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}>
                <strong>{c.points.toLocaleString()}</strong>
                <div style={styles.subText}>Điểm tích lũy</div>
              </div>
              <div style={{ ...styles.card, padding: '10px 12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}>
                <strong>{c.stocks.toLocaleString()}</strong>
                <div style={styles.subText}>Cổ phần</div>
              </div>
            </div>

            <div style={{ marginTop: '14px' }}>
              <button style={{ ...styles.btnPrimaryFull }} onClick={() => onSetModal({ show: true, type: 'appointment', data: c })}>
                Đặt lịch buổi làm
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
