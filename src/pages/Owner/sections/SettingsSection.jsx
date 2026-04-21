import React from 'react';

export const SettingsSection = ({ settings, onSetSettings, styles }) => {
  const handleUpdateSettings = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const raw = Object.fromEntries(fd);
    onSetSettings({
      ...settings,
      spaName: raw.spaName,
      address: raw.address,
      phone: raw.phone,
      footerNote: raw.footerNote,
      emailSupport: raw.emailSupport
    });
    alert("Đã lưu cấu hình hệ thống!");
  };

  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>⚙️ CÀI ĐẶT HỆ THỐNG</h3>
      
      <div style={styles.card}>
        <form onSubmit={handleUpdateSettings} style={{ display: 'grid', gap: '20px' }}>
          <div>
            <label style={styles.label}>TÊN SPA</label>
            <input name="spaName" defaultValue={settings.spaName} style={styles.input} required />
          </div>

          <div>
            <label style={styles.label}>ĐỊA CHỈ</label>
            <input name="address" defaultValue={settings.address} style={styles.input} required />
          </div>

          <div style={styles.grid2}>
            <div>
              <label style={styles.label}>SỐ ĐIỆN THOẠI</label>
              <input name="phone" defaultValue={settings.phone} style={styles.input} required />
            </div>
            <div>
              <label style={styles.label}>EMAIL HỖ TRỢ</label>
              <input name="emailSupport" defaultValue={settings.emailSupport} style={styles.input} />
            </div>
          </div>

          <div>
            <label style={styles.label}>LỜI CHÀO DỪI HÓA ĐƠN</label>
            <input name="footerNote" defaultValue={settings.footerNote} style={styles.input} />
          </div>

          <button type="submit" style={{ ...styles.btnPrimary, width: '200px', padding: '15px' }}>
            💾 LƯU CẤU HÌNH
          </button>
        </form>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#0f172a', borderRadius: '15px', border: '1px dashed #334155' }}>
        <h4 style={{ color: '#94a3b8', marginBottom: '10px' }}>Xem trước thông tin:</h4>
        <p style={{ margin: '5px 0' }}>🏠 {settings.spaName}</p>
        <p style={{ margin: '5px 0' }}>📍 {settings.address}</p>
        <p style={{ margin: '5px 0' }}>📞 {settings.phone}</p>
        <p style={{ margin: '5px 0' }}>✉️ {settings.emailSupport}</p>
      </div>
    </div>
  );
};
