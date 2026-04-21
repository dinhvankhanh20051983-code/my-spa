import React from 'react';

export const TreatmentDetailSection = ({
  customer,
  selectedLog,
  styles,
  onSetSelectedLog,
  onSetActiveTab,
  onSetModal
}) => (
  <div style={styles.section}>
    <div style={styles.flexHeader}>
      <h3 style={styles.sectionTitle}>📜 CHI TIẾT TRỊ LIỆU: {customer.name}</h3>
      <button style={styles.btnSmall} onClick={() => onSetActiveTab('customers')}>← Quay lại</button>
    </div>

    <div style={{ display: 'flex', height: '500px', backgroundColor: '#1e293b', borderRadius: '15px', overflow: 'hidden' }}>
      {/* Danh sách buổi */}
      <div style={{ width: '200px', borderRight: '1px solid #334155', padding: '10px', overflowY: 'auto' }}>
        {customer.history && customer.history.map((log, index) => (
          <div
            key={index}
            onClick={() => onSetSelectedLog(log)}
            style={{
              padding: '12px',
              backgroundColor: selectedLog === log ? '#10b981' : '#1e293b',
              borderRadius: '8px',
              cursor: 'pointer',
              border: '1px solid #334155',
              marginBottom: '10px',
              color: selectedLog === log ? 'white' : '#94a3b8'
            }}
          >
            <b>Buổi {customer.history.length - index}: {log.date}</b>
            <div style={{ fontSize: '11px' }}>{log.service}</div>
          </div>
        ))}
      </div>

      {/* Chi tiết */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        {selectedLog ? (
          <>
            <p><strong>Dịch vụ:</strong> {selectedLog.service}</p>
            <p><strong>KTV:</strong> {selectedLog.staff}</p>
            <p><strong>Ghi chú:</strong> {selectedLog.note}</p>
            <button style={{ ...styles.btnPrimary, marginTop: '20px' }} onClick={() => onSetModal({ show: true, type: 'treatment_images', data: { customer, log: selectedLog } })}>
              📤 CẬP NHẬT ẢNH
            </button>
          </>
        ) : (
          <div style={{ color: '#94a3b8' }}>Chưa có dữ liệu liệu trình.</div>
        )}
      </div>
    </div>
  </div>
);
