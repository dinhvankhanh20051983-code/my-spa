import React, { useState } from 'react';

export const TreatmentDetailSection = ({
  customer,
  selectedLog,
  styles,
  onSetSelectedLog,
  onSetActiveTab,
  onSetModal,
  onAddTreatmentLog
}) => {
  const [treatmentNote, setTreatmentNote] = useState(selectedLog?.note || '');

  const handleAddTreatment = () => {
    if (!treatmentNote.trim()) {
      alert('Vui lòng nhập ghi chú liệu trình.');
      return;
    }
    const newLog = {
      date: new Date().toLocaleDateString('vi-VN'),
      service: 'Liệu trình mới',
      staff: 'KTV',
      note: treatmentNote,
      images: {}
    };

    onAddTreatmentLog(customer.id, newLog);
    setTreatmentNote('');
    alert('Đã thêm buổi liệu trình mới vào hồ sơ khách hàng!');
  };

  return (
    <div style={styles.section}>
      <div style={styles.flexHeader}>
        <h3 style={styles.sectionTitle}>📜 CHI TIẾT TRỊ LIỆU: {customer.name}</h3>
        <button style={styles.btnSmall} onClick={() => onSetActiveTab('customers')}>← Quay lại</button>
      </div>

      <div style={{ display: 'flex', height: '500px', backgroundColor: '#1e293b', borderRadius: '15px', overflow: 'hidden' }}>
        {/* Danh sách buổi */}
        <div style={{ width: '200px', borderRight: '1px solid #334155', padding: '10px', overflowY: 'auto' }}>
          {customer.history && customer.history.length > 0 ? (
            customer.history.map((log, index) => (
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
            ))
          ) : (
            <p style={{ color: '#94a3b8' }}>Chưa có liệu trình</p>
          )}
        </div>

        {/* Chi tiết */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          {selectedLog ? (
            <>
              <p><strong>Dịch vụ:</strong> {selectedLog.service}</p>
              <p><strong>KTV:</strong> {selectedLog.staff}</p>
              <p><strong>Ghi chú:</strong> {selectedLog.note}</p>
              {selectedLog.images && Object.keys(selectedLog.images).length > 0 && (
                <div style={{ marginTop: '15px' }}>
                  <p><strong>Ảnh:</strong></p>
                  {selectedLog.images.before && <img src={selectedLog.images.before} alt="Trước" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px', marginBottom: '10px' }} />}
                  {selectedLog.images.after && <img src={selectedLog.images.after} alt="Sau" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px' }} />}
                </div>
              )}
              <button style={{ ...styles.btnPrimary, marginTop: '20px' }} onClick={() => onSetModal({ show: true, type: 'treatment_images', data: { customer, log: selectedLog } })}>
                📤 CẬP NHẬT ẢNH
              </button>
            </>
          ) : (
            <div>
              <p style={{ color: '#94a3b8', marginBottom: '15px' }}>Thêm buổi liệu trình mới cho khách</p>
              <textarea
                value={treatmentNote}
                onChange={(e) => setTreatmentNote(e.target.value)}
                placeholder="Ghi chú liệu trình..."
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  backgroundColor: '#0f172a',
                  color: 'white',
                  minHeight: '100px',
                  marginBottom: '10px',
                  boxSizing: 'border-box'
                }}
              />
              <button onClick={handleAddTreatment} style={styles.btnPrimary}>
                ➕ THÊM BUỔI LIỆU TRÌNH
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
