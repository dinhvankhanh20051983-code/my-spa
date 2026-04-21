import React from 'react';

export const StaffSection = ({ staffs, appointments, styles, onSetModal }) => (
  <div style={styles.section}>
    <div style={styles.flexHeader}>
      <h3 style={styles.sectionTitle}>👥 ĐỘI NGŨ NHÂN VIÊN</h3>
      <button style={styles.btnPrimary} onClick={() => onSetModal({ show: true, type: 'staff' })}>
        + THÊM NHÂN VIÊN
      </button>
    </div>
    <div style={styles.grid2}>
      {staffs.map(s => {
        const assigned = appointments.filter(a => a.ktv === s.name);
        const completed = assigned.filter(a => a.status === 'Đã hoàn thành').length;
        const active = assigned.filter(a => a.status === 'Đang thực hiện' || a.status === 'Chờ phục vụ').length;
        const revenue = assigned.reduce((sum, a) => sum + (Number(a.price) || 0), 0);

        return (
          <div key={s.id} style={styles.card}>
            <div style={styles.flexHeader}>
              <div>
                <strong>{s.name}</strong>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{s.phone}</div>
              </div>
              <span style={styles.tagStaff}>KTV</span>
            </div>

            <div style={{ marginTop: '14px', color: '#94a3b8', fontSize: '13px' }}>
              <div>Lương cơ bản: <strong>{Number(s.baseSalary).toLocaleString()}đ</strong></div>
              <div>HH dịch vụ: <strong>{s.serviceComm}%</strong></div>
              <div>HH tư vấn: <strong>{s.consultComm}%</strong></div>
            </div>

            <div style={{ marginTop: '14px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ ...styles.card, padding: '10px 12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', flex: 1 }}>
                Đơn hiện tại: {active}
              </div>
              <div style={{ ...styles.card, padding: '10px 12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', flex: 1 }}>
                Hoàn thành: {completed}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
