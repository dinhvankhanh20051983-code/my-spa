import React from 'react';

export const ProductsSection = ({ products, styles, onSetModal }) => (
  <div style={styles.section}>
    <div style={styles.flexHeader}>
      <h3 style={styles.sectionTitle}>🧴 SẢN PHẨM & DỊCH VỤ LẺ</h3>
      <button style={styles.btnPrimary} onClick={() => onSetModal({ show: true, type: 'product' })}>
        + THÊM MỚI
      </button>
    </div>
    <div style={styles.grid3}>
      {products.map(p => (
        <div key={p.id} style={styles.card}>
          <h4>{p.name}</h4>
          <p style={styles.price}>{Number(p.price).toLocaleString()}đ</p>
          <p style={styles.subText}>Tồn kho: {p.stock || 0}</p>
          <p style={styles.subText}>Điểm thưởng: {p.rewardPoints || 0} điểm</p>
        </div>
      ))}
    </div>
  </div>
);
