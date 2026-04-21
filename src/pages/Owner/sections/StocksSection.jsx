import React from 'react';

export const StocksSection = ({ staffs, customers, settings, styles, distributedStocks, onAdjustStock }) => {
  const totalStocks = settings.totalStocks || 10000000;
  
  return (
    <div style={styles.section}>
      <div style={styles.flexHeader}>
        <h3 style={styles.sectionTitle}>📈 QUẢN LÝ CỔ PHẦN & ĐIỂM</h3>
        <div style={{ textAlign: 'right' }}>
          <small style={{ color: '#94a3b8' }}>Tổng quỹ cổ phần:</small>
          <h4 style={{ margin: 0, color: '#10b981' }}>{totalStocks.toLocaleString()} CP</h4>
          <small style={{ color: '#fbbf24' }}>Còn lại: {(totalStocks - distributedStocks).toLocaleString()} CP</small>
        </div>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.mainTable}>
          <thead style={styles.theadRow}>
            <tr>
              <th style={styles.thStyle}>Thành viên</th>
              <th style={styles.thStyle}>Vai trò</th>
              <th style={styles.thStyle}>Cổ phần</th>
              <th style={styles.thStyle}>Tỷ lệ (%)</th>
              <th style={styles.thStyle}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {[...staffs, ...customers].map((u, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #334155' }}>
                <td style={styles.tdStyle}><b>{u.name}</b></td>
                <td style={styles.tdStyle}>
                  <span style={u.baseSalary ? styles.tagStaff : styles.tagCustomer}>
                    {u.baseSalary ? "Nhân viên" : "Khách hàng"}
                  </span>
                </td>
                <td style={{ ...styles.tdStyle, color: '#10b981', fontWeight: 'bold' }}>
                  {(u.stocks || 0).toLocaleString()} CP
                </td>
                <td style={styles.tdStyle}>
                  {(((u.stocks || 0) / totalStocks) * 100).toFixed(2)}%
                </td>
                <td style={styles.tdStyle}>
                  <button
                    style={styles.btnSmall}
                    onClick={() => {
                      const val = prompt("Nhập số lượng (dương để cấp, âm để thu hồi):");
                      if (val) onAdjustStock(u.name, val);
                    }}
                  >
                    ± Điều chỉnh
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
