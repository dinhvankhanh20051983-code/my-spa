import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StockManagement = () => {
  const navigate = useNavigate();
  // Giả lập dữ liệu từ Database
  const [stocks, setStocks] = useState([
    { id: 1, name: 'Lê Thảo (Nhân viên)', amount: 5000, type: 'Staff' },
    { id: 2, name: 'Nguyễn Linh (Khách hàng)', amount: 2000, type: 'Customer' },
  ]);
  const [value, setValue] = useState('');
  const [selectedId, setSelectedId] = useState('');

  const handleUpdate = (action) => {
    if (!selectedId || !value) return alert("Vui lòng chọn đối tượng và nhập số lượng!");
    
    setStocks(stocks.map(s => {
      if (s.id === parseInt(selectedId)) {
        const newAmount = action === '+' ? s.amount + parseInt(value) : s.amount - parseInt(value);
        return { ...s, amount: Math.max(0, newAmount) };
      }
      return s;
    }));
    
    alert(`${action === '+' ? 'Phân phối' : 'Thu hồi'} thành công! App của ${stocks.find(s => s.id === parseInt(selectedId)).name} đã được cập nhật.`);
    setValue('');
  };

  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={() => navigate('/owner')} style={btnBack}>←</button>
        <h2 style={{ color: '#f472b6', margin: '0 auto' }}>Quản Lý Cổ Phần</h2>
      </div>

      <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '20px', marginBottom: '25px' }}>
        <label style={labelS}>Chọn người nhận/thu hồi</label>
        <select value={selectedId} onChange={e => setSelectedId(e.target.value)} style={inputS}>
          <option value="">-- Chọn thành viên --</option>
          {stocks.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        <label style={{ ...labelS, marginTop: '15px' }}>Số lượng cổ phần</label>
        <input type="number" placeholder="Ví dụ: 500" value={value} onChange={e => setValue(e.target.value)} style={inputS} />

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button onClick={() => handleUpdate('+')} style={{ ...btnAction, backgroundColor: '#10b981' }}>PHÂN PHỐI</button>
          <button onClick={() => handleUpdate('-')} style={{ ...btnAction, backgroundColor: '#ef4444' }}>THU HỒI</button>
        </div>
      </div>

      <h3 style={{ fontSize: '16px', color: '#94a3b8', marginBottom: '15px' }}>Danh sách sở hữu</h3>
      {stocks.map(s => (
        <div key={s.id} style={cardStock}>
          <div>
            <div style={{ fontWeight: 'bold' }}>{s.name}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>ID: 00{s.id}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#f472b6', fontWeight: 'bold', fontSize: '18px' }}>{s.amount.toLocaleString()}</div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>CỔ PHẦN</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const labelS = { fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' };
const inputS = { width: '100%', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#0f172a', color: 'white', boxSizing: 'border-box' };
const btnAction = { flex: 1, padding: '15px', borderRadius: '12px', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' };
const btnBack = { background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' };
const cardStock = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#1e293b', borderRadius: '15px', marginBottom: '10px', border: '1px solid #334155' };

export default StockManagement;