import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const Store = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const products = [
    { id: 1, name: "Serum Vitamin C", price: 550000, label: "550.000đ", points: 5000, img: "🧴" },
    { id: 2, name: "Kem chống nắng", price: 320000, label: "320.000đ", points: 3000, img: "☀️" },
    { id: 3, name: "Mặt nạ tế bào gốc", price: 150000, label: "150.000đ", points: 1500, img: "🎭" },
  ];

  const saveOrderToSupabase = async (orderData) => {
    const { data, error } = await supabase.from('online_orders').insert([orderData]);
    if (error) {
      console.error('Supabase lưu đơn hàng thất bại:', error);
      return { error };
    }
    console.log('Supabase lưu đơn hàng thành công:', data);
    return { data };
  };

  const handleBuy = async (product) => {
    const order = {
      customer_name: 'Khách hàng vãng lai',
      product_name: product.name,
      price: product.price,
      reward_points: product.points,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    setIsSubmitting(true);
    const localOrders = JSON.parse(localStorage.getItem('spa_customer_orders') || '[]');
    localStorage.setItem('spa_customer_orders', JSON.stringify([...localOrders, order]));

    try {
      const { error } = await saveOrderToSupabase(order);
      if (error) {
        setMessage('Đã lưu đơn hàng cục bộ. Supabase chưa lưu được.');
      } else {
        setMessage('Mua hàng thành công. Đơn đã đồng bộ lên Supabase.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Có lỗi khi mua hàng. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#0f172a', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <button onClick={() => navigate('/customer')} style={btnBack}>← Quay lại</button>
        <button onClick={onLogout} style={btnLogout}>Đăng xuất</button>
      </div>

      <h2 style={{ color: '#10b981', marginBottom: '8px' }}>Cửa hàng Spa</h2>
      <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Mua sản phẩm chất lượng cao, tích điểm và đồng bộ đơn hàng với Supabase.</p>

      {message && <div style={messageBox}>{message}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        {products.map(product => (
          <div key={product.id} style={productCard}>
            <div style={{ fontSize: '40px', marginBottom: '14px' }}>{product.img}</div>
            <strong style={{ display: 'block', fontSize: '16px', marginBottom: '8px' }}>{product.name}</strong>
            <p style={{ color: '#10b981', fontWeight: 'bold', margin: '10px 0 5px' }}>{product.label}</p>
            <p style={{ color: '#fbbf24', fontSize: '12px', marginBottom: '15px' }}>Hoặc đổi {product.points.toLocaleString()} điểm</p>
            <button onClick={() => handleBuy(product)} disabled={isSubmitting} style={btnBuy}>
              {isSubmitting ? 'Đang xử lý...' : 'Mua ngay'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const productCard = {
  backgroundColor: '#1e293b',
  padding: '20px',
  borderRadius: '20px',
  textAlign: 'center',
  border: '1px solid #334155',
  minHeight: '260px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
};

const btnBuy = {
  padding: '14px',
  width: '100%',
  border: 'none',
  borderRadius: '14px',
  backgroundColor: '#10b981',
  color: 'white',
  fontWeight: '700',
  cursor: 'pointer'
};

const btnBack = {
  padding: '12px 16px',
  borderRadius: '14px',
  border: '1px solid #334155',
  backgroundColor: '#111827',
  color: 'white',
  cursor: 'pointer'
};

const btnLogout = {
  padding: '12px 16px',
  borderRadius: '14px',
  border: '1px solid #ef4444',
  backgroundColor: '#ef4444',
  color: 'white',
  cursor: 'pointer'
};

const messageBox = {
  marginBottom: '16px',
  padding: '14px 16px',
  borderRadius: '16px',
  backgroundColor: '#111827',
  color: '#f8fafc',
  border: '1px solid #334155'
};

export default Store;