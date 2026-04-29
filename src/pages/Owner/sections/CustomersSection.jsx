import React from 'react';

export const CustomersSection = ({
  customers,
  appointments,
  styles,
  onSetModal,
  onSetSelectedCustomer,
  onSetSelectedLog,
  onSetActiveTab,
  searchQuery,
  onSearchChange,
  onDeleteCustomer
}) => (
  <div style={styles.section}>
    <div style={styles.flexHeader}>
      <h3 style={styles.sectionTitle}>🧖‍♀️ HỒ SƠ KHÁCH HÀNG</h3>
      <button style={styles.btnPrimary} onClick={() => onSetModal({ show: true, type: 'customer' })}>
        + THÊM KHÁCH MỚI
      </button>
    </div>
    
    {/* Thanh tìm kiếm */}
    <div style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="🔍 Tìm khách hàng theo tên hoặc số điện thoại..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px solid #334155',
          backgroundColor: '#1e293b',
          color: '#e2e8f0',
          fontSize: '14px',
          outline: 'none'
        }}
      />
    </div>
    
    <div style={styles.grid2}>
      {customers
        .filter(c => 
          !searchQuery || 
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          (c.phone && c.phone.includes(searchQuery))
        )
        .map(c => {
        const lastVisit = c.history && c.history.length > 0 ? c.history[0] : null;
        const upcoming = appointments.find(a => (a.customerName || a.customer_name) === c.name && a.status !== 'Đã hoàn thành');
        const totalPackages = (c.myPackages || c.my_packages || []).reduce((sum, p) => sum + ((p.total || 0) - (p.used || 0)), 0);
        const totalVisits = c.history ? c.history.length : 0;

        return (
          <div key={c.id} style={styles.card}>
            <div style={styles.flexHeader}>
              <div>
                <strong>{c.name}</strong>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{c.phone}</div>
                { (c.referredBy || c.referred_by) && (
                  <div style={{ fontSize: '11px', color: '#a5b4fc', marginTop: '4px' }}>
                    Giới thiệu bởi: {c.referredBy || c.referred_by}
                  </div>
                ) }
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={styles.tagCustomer}>{c.referredBy || c.referred_by ? (c.referralRewarded || c.referral_rewarded ? 'Đã hoàn thành' : 'Chờ mua') : 'Khách VIP'}</span>
                <button 
                  onClick={() => onDeleteCustomer(c.id)}
                  style={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Xóa
                </button>
              </div>
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

            <div style={{ marginTop: '14px', display: 'grid', gap: '10px' }}>
              <button style={{ ...styles.btnPrimaryFull }} onClick={() => onSetModal({ show: true, type: 'appointment', data: c })}>
                Đặt lịch buổi làm
              </button>
              <button
                style={{ ...styles.btnCancel, width: '100%', marginTop: '0' }}
                onClick={() => {
                  onSetSelectedCustomer(c);
                  onSetSelectedLog(c.history && c.history.length > 0 ? c.history[0] : null);
                  onSetActiveTab('treatment_history');
                }}
              >
                Xem nhật ký liệu trình
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
