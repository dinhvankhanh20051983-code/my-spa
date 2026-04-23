import React from 'react';

export const OnlineOrdersSection = ({ onlineOrders, styles, onSetModal }) => {
  const pendingOrders = onlineOrders.filter(o => o.status === 'pending');
  const confirmedOrders = onlineOrders.filter(o => o.status === 'confirmed');

  return (
    <div style={styles.section}>
      <div style={styles.flexHeader}>
        <h3 style={styles.sectionTitle}>🛒 ĐƠN HÀNG ONLINE TỪ APP KHÁCH HÀNG</h3>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.mainTable}>
          <thead style={styles.theadRow}>
            <tr>
              <th style={styles.thStyle}>Khách hàng</th>
              <th style={styles.thStyle}>Sản phẩm/Gói</th>
              <th style={styles.thStyle}>Thanh toán</th>
              <th style={styles.thStyle}>Trạng thái</th>
              <th style={styles.thStyle}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {onlineOrders.map((order) => (
              <tr key={order.id} style={{ borderBottom: '1px solid #334155' }}>
                <td style={styles.tdStyle}>
                  <div style={{ fontWeight: 'bold' }}>{order.customerName || order.customer_name}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{order.customerPhone || order.customer_phone}</div>
                </td>
                <td style={styles.tdStyle}>
                  <div>{order.itemName || order.item_name}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    SL: {order.quantity} • {(order.totalPrice || order.total_price || 0).toLocaleString()}đ
                  </div>
                </td>
                <td style={styles.tdStyle}>
                  <div style={{ fontSize: '12px' }}>
                    {order.payment_method === 'bank_transfer' ? '🏦 Chuyển khoản' : '💳 Thẻ'}
                  </div>
                </td>
                <td style={styles.tdStyle}>
                  <span style={{
                    backgroundColor: order.status === 'pending' ? '#451a03' : order.status === 'confirmed' ? '#064e3b' : '#7f1d1d',
                    color: order.status === 'pending' ? '#fcd34d' : order.status === 'confirmed' ? '#6ee7b7' : '#fca5a5',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}>
                    {order.status === 'pending' ? 'Chờ xác nhận' : order.status === 'confirmed' ? 'Đã xác nhận' : 'Đã hủy'}
                  </span>
                </td>
                <td style={styles.tdStyle}>
                  {order.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={styles.btnSmall} onClick={() => onSetModal({ show: true, type: 'confirm_order', data: order })}>
                        ✅ Xác nhận
                      </button>
                      <button style={styles.btnSmall} onClick={() => onSetModal({ show: true, type: 'cancel_order', data: order })}>
                        ❌ Hủy
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
