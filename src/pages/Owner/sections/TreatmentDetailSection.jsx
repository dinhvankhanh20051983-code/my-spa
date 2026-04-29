import React, { useState } from 'react';
import { ESignature } from '../../../components/ESignature/ESignature';

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
  const [showSignature, setShowSignature] = useState(null);

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
              
              {/* Signature status */}
              <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#0f172a', borderRadius: '8px' }}>
                {selectedLog.is_signed ? (
                  <p style={{ color: '#10B981', fontWeight: 'bold', margin: 0 }}>
                    ✅ Khách đã ký xác nhận
                  </p>
                ) : (
                  <p style={{ color: '#FBBF24', fontWeight: 'bold', margin: '0 0 10px 0' }}>
                    ⏳ Chờ khách ký xác nhận
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                <button style={{ ...styles.btnPrimary }} onClick={() => onSetModal({ show: true, type: 'treatment_images', data: { customer, log: selectedLog } })}>
                  📤 CẬP NHẬT ẢNH
                </button>
                {!selectedLog.is_signed && (
                  <button style={{ ...styles.btnPrimary, backgroundColor: '#10B981' }} onClick={() => setShowSignature(selectedLog)}>
                    ✍️ CHO KÝ ĐIỆN TỬ
                  </button>
                )}
              </div>
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

      {/* E-Signature Modal */}
      {showSignature && (
        <ESignature
          customerName={customer.name}
          onSign={async (signatureData) => {
            try {
              // Mark the treatment log as signed
              if (selectedLog?.id) {
                // Update the log locally
                onSetSelectedLog({
                  ...selectedLog,
                  is_signed: true,
                  signature_date: new Date().toLocaleDateString('vi-VN'),
                  signature_data: signatureData
                });
                alert('✅ Khách hàng đã ký xác nhận liệu trình thành công!');
              } else {
                alert('⚠️ Không thể lưu chữ ký. Vui lòng thử lại.');
              }
            } catch (err) {
              console.error('Error saving signature:', err);
              alert('❌ Có lỗi xảy ra khi lưu chữ ký.');
            } finally {
              setShowSignature(null);
            }
          }}
          onCancel={() => setShowSignature(null)}
        />
      )}
    </div>
  );
};
