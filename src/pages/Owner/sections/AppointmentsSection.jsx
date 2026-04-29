import React, { useMemo } from 'react';

export const AppointmentsSection = ({
  appointments,
  packages,
  products,
  staffs,
  customers,
  styles,
  handlers,
  onSetModal,
  onSetSelectedCustomer,
  onSetSelectedLog,
  onSetActiveTab
}) => {
  // Sắp xếp lịch hẹn theo ngày/giờ (soonest first)
  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => {
      const parseTime = (date, time) => {
        if (!date || !time) return new Date(0);
        try {
          // Thử parse từ DD/MM/YYYY hoặc YYYY-MM-DD format
          let dateObj;
          if (date.includes('-')) {
            dateObj = new Date(date); // YYYY-MM-DD
          } else if (date.includes('/')) {
            const [day, month, year] = date.split('/').map(Number);
            dateObj = new Date(year, month - 1, day);
          } else {
            return new Date(0);
          }
          const [hour, minute] = time.split(':').map(Number);
          dateObj.setHours(hour, minute, 0);
          return dateObj;
        } catch {
          return new Date(0);
        }
      };
      return parseTime(a.date, a.time) - parseTime(b.date, b.time);
    });
  }, [appointments]);
  return (
    <div style={styles.section}>
      <div style={styles.flexHeader}>
        <h3 style={styles.sectionTitle}>📅 DANH SÁCH ĐIỀU HÀNH LỊCH HẸN</h3>
        <button style={styles.btnPrimary} onClick={() => onSetModal({ show: true, type: 'appointment' })}>
          + ĐẶT LỊCH MỚI
        </button>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.mainTable}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.thStyle}>Khách Hàng</th>
              <th style={styles.thStyle}>Dịch Vụ</th>
              <th style={styles.thStyle}>KTV</th>
              <th style={styles.thStyle}>Thời Gian</th>
              <th style={styles.thStyle}>Trạng Thái</th>
              <th style={styles.thStyle}>Xác Nhận</th>
              <th style={styles.thStyle}>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {sortedAppointments.map((a) => (
              <tr key={a.id} style={styles.trHoverStyle}>
                <td style={styles.tdStyle}>
                  <div style={{ fontWeight: 'bold' }}>{a.customerName || a.customer_name}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{a.customerPhone || a.customer_phone || 'Chưa có'}</div>
                </td>
                <td style={styles.tdStyle}>{a.service}</td>
                <td style={styles.tdStyle}>
                  <span style={styles.tagStaff}>{a.ktv}</span>
                </td>
                <td style={styles.tdStyle}>
                  <div>{a.time}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{a.date}</div>
                </td>
                <td style={styles.tdStyle}>
                  <select
                    value={a.status}
                    onChange={(e) => handlers.handleUpdateStatus(a.id, e.target.value)}
                    style={{ backgroundColor: '#0f172a', color: 'white', border: '1px solid #334155', padding: '6px', borderRadius: '6px' }}
                  >
                    <option value="Chờ phục vụ">Chờ phục vụ</option>
                    <option value="Đang thực hiện">Đang thực hiện</option>
                    <option value="Đã hoàn thành">Đã hoàn thành</option>
                    <option value="Trễ hẹn">Trễ hẹn</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>
                </td>
                <td style={styles.tdStyle}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    backgroundColor: (a.isApproved || a.is_approved) ? '#10b98166' : '#fbbf2466',
                    color: (a.isApproved || a.is_approved) ? '#10b981' : '#fbbf24'
                  }}>
                    {(a.isApproved || a.is_approved) ? '✅ Đã xác nhận' : '⏳ Chờ xác nhận'}
                  </span>
                </td>
                <td style={styles.tdStyle}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button style={styles.btnSmall} onClick={() => handlers.handleRemind(a)}>🔔</button>
                    <button 
                      style={styles.btnSmall} 
                      onClick={() => handlers.handleApproveAppointment(a.id)}
                      disabled={a.isApproved || a.is_approved}
                    >
                      {a.isApproved || a.is_approved ? '✅' : '⏳'}
                    </button>
                    <button style={styles.btnSmall} onClick={() => handlers.handleComplete(a)}>✅</button>
                    <button style={styles.btnSmall} onClick={() => handlers.handleCancel(a.id)}>❌</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {appointments.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            Không có lịch hẹn nào.
          </div>
        )}
      </div>
    </div>
  );
};
