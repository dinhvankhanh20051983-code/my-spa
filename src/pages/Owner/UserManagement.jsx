import React, { useState } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Lê Thảo', phone: '0912345678', role: 'Staff' },
    { id: 2, name: 'Trần Bình', phone: '0988777666', role: 'Customer' },
  ]);
  const [form, setForm] = useState({ name: '', phone: '', role: 'Customer' });

  const handleAdd = () => {
    if(!form.name || !form.phone) return alert("Nhập đủ thông tin");
    setUsers([...users, { ...form, id: Date.now() }]);
    setForm({ name: '', phone: '', role: 'Customer' });
  };

  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <h2 style={{ color: '#f472b6' }}>Quản Lý Thành Viên</h2>
      <div style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '15px', marginBottom: '20px' }}>
        <input placeholder="Tên" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inS} />
        <input placeholder="SĐT" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={{...inS, marginTop: '10px'}} />
        <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} style={{...inS, marginTop: '10px'}}>
          <option value="Customer">Khách hàng</option>
          <option value="Staff">Nhân viên</option>
        </select>
        <button onClick={handleAdd} style={{ width: '100%', marginTop: '15px', padding: '12px', backgroundColor: '#f472b6', border: 'none', borderRadius: '10px', color: 'white' }}>THÊM MỚI</button>
      </div>
      {users.map(u => (
        <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: '#1e293b', borderRadius: '12px', marginBottom: '10px' }}>
          <div>{u.name} <small style={{color: '#94a3b8'}}>({u.role})</small></div>
          <button onClick={() => setUsers(users.filter(x => x.id !== u.id))} style={{color: '#ef4444', background: 'none', border: 'none'}}>Xóa</button>
        </div>
      ))}
    </div>
  );
};
const inS = { width: '100%', padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: 'white' };
export default UserManagement;