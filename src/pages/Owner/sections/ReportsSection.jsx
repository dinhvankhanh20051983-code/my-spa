import React from 'react';

export const ReportsSection = ({ appointments, styles }) => {
  const totalRevenue = appointments.reduce((sum, a) => sum + (Number(a.price) || 0), 0);
  const completedCount = appointments.filter(a => a.status === 'Đã hoàn thành').length;
  const upcomingCount = appointments.filter(a => a.status === 'Chờ phục vụ' || a.status === 'Đang thực hiện').length;
  const uniqueCustomers = new Set(appointments.map(a => a.customerName || a.customer_name)).size;
  const averageTicket = appointments.length ? Math.round(totalRevenue / appointments.length) : 0;
  const estimatedProfit = Math.round(totalRevenue * 0.45);

  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>📊 BÁO CÁO DOANH THU</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '20px' }}>
        <div style={styles.card}>
          <small style={{ color: '#94a3b8' }}>Tổng doanh thu</small>
          <h2 style={{ margin: 0, color: '#10b981' }}>{totalRevenue.toLocaleString()}đ</h2>
        </div>
        <div style={styles.card}>
          <small style={{ color: '#94a3b8' }}>Số KH trong hệ</small>
          <h2 style={{ margin: 0, color: '#10b981' }}>{uniqueCustomers}</h2>
        </div>
        <div style={styles.card}>
          <small style={{ color: '#94a3b8' }}>Lịch sắp tới</small>
          <h2 style={{ margin: 0, color: '#10b981' }}>{upcomingCount}</h2>
        </div>
        <div style={styles.card}>
          <small style={{ color: '#94a3b8' }}>Doanh thu TB/đơn</small>
          <h2 style={{ margin: 0, color: '#10b981' }}>{averageTicket.toLocaleString()}đ</h2>
        </div>
      </div>

      <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={styles.card}>
          <h4 style={{ marginTop: 0, color: '#fff' }}>Hiệu suất tháng</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '18px', color: '#94a3b8' }}>
            <span>Đã hoàn thành</span>
            <strong>{completedCount}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', color: '#94a3b8' }}>
            <span>Lợi nhuận ước tính</span>
            <strong>{estimatedProfit.toLocaleString()}đ</strong>
          </div>
        </div>
        <div style={styles.card}>
          <h4 style={{ marginTop: 0, color: '#fff' }}>Thống kê lịch hẹn</h4>
          <div style={{ marginTop: '10px', color: '#94a3b8' }}>
            <div>Tổng lịch hẹn: <strong>{appointments.length}</strong></div>
            <div style={{ marginTop: '8px' }}>Hoàn thành: <strong>{completedCount}</strong></div>
            <div style={{ marginTop: '8px' }}>Đang chờ: <strong>{upcomingCount}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
