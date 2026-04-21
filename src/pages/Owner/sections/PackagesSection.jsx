import React from 'react';

export const PackagesSection = ({ packages, styles, onSetModal }) => (
  <div style={styles.section}>
    <div style={styles.flexHeader}>
      <h3 style={styles.sectionTitle}>📑 DANH MỤC GÓI TRỊ LIỆU</h3>
      <button style={styles.btnPrimary} onClick={() => onSetModal({ show: true, type: 'package' })}>
        + TẠO GÓI MỚI
      </button>
    </div>
    <div style={styles.grid2}>
      {packages.map(p => (
        <div key={p.id} style={styles.card}>
          <span style={styles.tagGreen}>GÓI COMBO</span>
          <h4 style={{ marginTop: '5px' }}>{p.name}</h4>
          <p style={styles.infoText}>Quy mô: <b>{p.sessions} buổi</b></p>
          <p style={styles.price}>{Number(p.price).toLocaleString()}đ</p>
          <p style={styles.subText}>Điểm thưởng: {p.rewardPoints || 0} điểm</p>
        </div>
      ))}
    </div>
  </div>
);
