import React from 'react';

const Store = () => {
  const products = [
    { id: 1, name: "Serum Vitamin C", price: "550.000đ", points: "5.000đ", img: "🧴" },
    { id: 2, name: "Kem chống nắng", price: "320.000đ", points: "3.000đ", img: "☀️" },
    { id: 3, name: "Mặt nạ tế bào gốc", price: "150.000đ", points: "1.500đ", img: "🎭" },
  ];

  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <h2 style={{ color: '#10b981', marginBottom: '20px' }}>Cửa Hàng Mỹ Phẩm</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '15px' }}>
        {products.map(p => (
          <div key={p.id} style={productCard}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>{p.img}</div>
            <strong style={{ display: 'block', fontSize: '14px' }}>{p.name}</strong>
            <p style={{ color: '#10b981', fontWeight: 'bold', margin: '10px 0 5px' }}>{p.price}</p>
            <p style={{ color: '#fbbf24', fontSize: '11px' }}>Hoặc đổi: {p.points} Điểm</p>
            <button style={btnBuy}>Mua ngay</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const productCard = {
  backgroundColor: '#1e293b',
  padding: '15px',
  borderRadius: '15px',
  textAlign: 'center',
  border: '1px solid #334155'
};

const btnBuy = {
  marginTop: '10px',
  width: '100%',
  padding: '8px',
  backgroundColor: '#10b981',
  border: 'none',
  borderRadius: '8px',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer'
};

export default Store;