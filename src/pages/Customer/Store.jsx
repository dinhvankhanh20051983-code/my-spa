import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import PaymentModal from '../../components/PaymentModal';

const Store = ({ currentCustomer, onLogout }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Sử dụng currentCustomer từ props, fallback về localStorage
  const customer = currentCustomer || JSON.parse(localStorage.getItem('spa_customer_info') || 'null');

  const products = [
    { id: 1, name: "Serum Vitamin C", price: 550000, label: "550.000đ", points: 5000, img: "🧴" },
    { id: 2, name: "Kem chống nắng", price: 320000, label: "320.000đ", points: 3000, img: "☀️" },
    { id: 3, name: "Mặt nạ tế bào gốc", price: 150000, label: "150.000đ", points: 1500, img: "🎭" },
  ];

  const saveOrderToSupabase = async (orderData) => {
    const { data, error } = await supabase.from('online_orders').insert([orderData]).select();
    if (error) {
      console.error('Supabase lưu đơn hàng thất bại:', error);
      return { error };
    }
    console.log('Supabase lưu đơn hàng thành công:', data);
    return { data: data?.[0] ?? null };
  };

  const handleBuy = (product) => {
    if (!customer) {
      setMessage('Vui lòng đăng nhập lại để mua hàng với thông tin người dùng chính xác.');
      return;
    }

    // Kiểm tra số điện thoại hợp lệ trước khi mở modal
    const phoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/;
    if (!phoneRegex.test(customer.phone)) {
      setMessage('Số điện thoại không hợp lệ. Vui lòng cập nhật thông tin cá nhân.');
      return;
    }

    setSelectedProduct(product);
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = async (paymentProof) => {
    if (!selectedProduct) return;

    const order = {
      customer_name: customer?.name || 'Khách hàng',
      customer_phone: customer?.phone || '',
      order_type: 'product',
      item_id: selectedProduct.id,
      item_name: selectedProduct.name,
      quantity: 1,
      total_price: selectedProduct.price,
      reward_points: selectedProduct.points,
      payment_method: 'bank_transfer',
      payment_proof: paymentProof,
      status: 'pending_payment',
      order_date: new Date().toISOString().split('T')[0],
      notes: 'Đơn hàng từ cửa hàng - Chờ xác nhận thanh toán',
      created_at: new Date().toISOString()
    };

    setIsSubmitting(true);
    setShowPaymentModal(false);

    const localOrders = JSON.parse(localStorage.getItem('spa_customer_orders') || '[]');
    localStorage.setItem('spa_customer_orders', JSON.stringify([...localOrders, order]));

    try {
      const { error } = await saveOrderToSupabase(order);
      if (error) {
        setMessage('Đã lưu đơn hàng cục bộ. Supabase chưa lưu được. Vui lòng liên hệ hỗ trợ.');
      } else {
        setMessage('✅ Đơn hàng đã được tạo! Chúng tôi sẽ xác nhận thanh toán trong vòng 24h.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Có lỗi khi tạo đơn hàng. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
      setSelectedProduct(null);
    }
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#0f172a', color: 'white' }}>
      {showPaymentModal && <PaymentModal
        product={selectedProduct}
        customerName={customer?.name}
        customerPhone={customer?.phone}
        onConfirm={handlePaymentConfirm}
        onCancel={() => {
          setShowPaymentModal(false);
          setSelectedProduct(null);
        }}
        isLoading={isSubmitting}
      />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <button onClick={() => navigate('/customer')} style={btnBack}>← Quay lại</button>
        <button onClick={onLogout} style={btnLogout}>Đăng xuất</button>
      </div>

      <h2 style={{ color: '#10b981', marginBottom: '8px' }}>Cửa hàng Spa</h2>
      <p style={{ color: '#94a3b8', marginBottom: '8px' }}>Mua sản phẩm chất lượng cao với thanh toán chuyển khoản an toàn. Tích điểm và đồng bộ đơn hàng với Supabase.</p>
      {customer ? (
        <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Đơn hàng sẽ được ghi nhận cho: <strong>{customer.name}</strong> • {customer.phone}</p>
      ) : (
        <p style={{ color: '#fbbf24', marginBottom: '20px' }}>Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại để đơn hàng đúng chủ.</p>
      )}

      {message && <div style={messageBox}>{message}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        {products.map(product => (
          <div key={product.id} style={productCard}>
            <div style={{ fontSize: '40px', marginBottom: '14px' }}>{product.img}</div>
            <strong style={{ display: 'block', fontSize: '16px', marginBottom: '8px' }}>{product.name}</strong>
            <p style={{ color: '#10b981', fontWeight: 'bold', margin: '10px 0 5px' }}>{product.label}</p>
            <p style={{ color: '#fbbf24', fontSize: '12px', marginBottom: '15px' }}>Hoặc đổi {product.points.toLocaleString()} điểm</p>
            <button onClick={() => handleBuy(product)} disabled={isSubmitting} style={btnBuy}>
              {isSubmitting ? 'Đang xử lý...' : '💳 Thanh toán'}
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