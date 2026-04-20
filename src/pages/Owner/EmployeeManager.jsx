import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Trash2, UserPlus, RefreshCcw } from 'lucide-react';
import { fmt } from '../../utils/formatters';

const EmployeeManager = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tải danh sách nhân viên từ Supabase
  const fetchEmployees = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) setEmployees(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const deleteEmployee = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nhân viên này?")) {
      const { error } = await supabase.from('employees').delete().eq('id', id);
      if (!error) fetchEmployees();
    }
  };

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ margin: 0 }}>Danh sách nhân viên</h3>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={fetchEmployees} style={{ padding: 8, background: 'none', border: 'none', color: '#a78bfa', cursor: 'pointer' }}>
            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <UserPlus size={18} /> Thêm mới
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: 12, color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Nhân viên</th>
              <th style={{ padding: 12, color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Vai trò</th>
              <th style={{ padding: 12, color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Lương CB</th>
              <th style={{ padding: 12, color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: 12 }}>
                  <div style={{ fontWeight: 600 }}>{emp.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{emp.phone}</div>
                </td>
                <td style={{ padding: 12 }}>{emp.role}</td>
                <td style={{ padding: 12 }}>{fmt(emp.base_salary)}</td>
                <td style={{ padding: 12 }}>
                  <button onClick={() => deleteEmployee(emp.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <Trash2 size={18} />
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

export default EmployeeManager;