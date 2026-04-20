import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { fmt, calcSal } from '../../utils/formatters';
import { Users, TrendingUp, Award, DollarSign, ChevronRight } from 'lucide-react';

const EmployeeStats = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployeePerformance();
  }, []);

  const fetchEmployeePerformance = async () => {
    setLoading(true);
    // 1. Lấy danh sách nhân viên
    const { data: emps } = await supabase.from('employees').select('*');
    
    // 2. Lấy dữ liệu tour (appointments) để đếm số buổi làm việc
    const { data: appts } = await supabase
      .from('appointments')
      .select('employee_id, status')
      .eq('status', 'completed');

    if (emps) {
      const enrichedEmps = emps.map(emp => {
        const myTours = appts?.filter(a => a.employee_id === emp.id).length || 0;
        // Sử dụng hàm calcSal đã viết ở utils để tính lương thực tế
        const sal = calcSal({
          salary: emp.base_salary,
          cfg: emp.config,
          md: { tours: myTours, ...emp.md }
        });
        return { ...emp, performance: sal, tourCount: myTours };
      });
      setEmployees(enrichedEmps);
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Award color="#fbbf24" /> Hiệu suất nhân viên
        </h3>
        <button onClick={fetchEmployeePerformance} style={styles.refreshBtn}>Làm mới</button>
      </div>

      <div style={styles.list}>
        {loading ? (
          <p>Đang tính toán dữ liệu...</p>
        ) : (
          employees.map(emp => (
            <div key={emp.id} style={styles.card}>
              <div style={styles.mainRow}>
                <div style={styles.empInfo}>
                  <div style={styles.avatar}>{emp.name.charAt(0)}</div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{emp.name}</div>
                    <div style={{ fontSize: 12, opacity: 0.5 }}>{emp.role}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#10b981' }}>
                    {fmt(emp.performance.total)}
                  </div>
                  <div style={{ fontSize: 11, opacity: 0.5 }}>Lương tạm tính</div>
                </div>
              </div>

              <div style={styles.statsRow}>
                <div style={styles.statBox}>
                  <div style={styles.statLabel}>Số Tour</div>
                  <div style={styles.statValue}>{emp.tourCount}</div>
                </div>
                <div style={styles.statBox}>
                  <div style={styles.statLabel}>Phí Tour</div>
                  <div style={styles.statValue}>{fmt(emp.performance.tourAmt)}</div>
                </div>
                <div style={styles.statBox}>
                  <div style={styles.statLabel}>Hồng SP</div>
                  <div style={styles.statValue}>{fmt(emp.performance.prodCom + emp.performance.pkgCom)}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { marginTop: 20 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  refreshBtn: { background: 'none', border: '1px solid #ffffff33', color: '#fff', padding: '5px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer' },
  list: { display: 'flex', flexDirection: 'column', gap: 15 },
  card: { background: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 20, border: '1px solid rgba(255,255,255,0.05)' },
  mainRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  empInfo: { display: 'flex', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, background: '#a78bfa', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#1a1a2e' },
  statsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, paddingTop: 15, borderTop: '1px solid rgba(255,255,255,0.05)' },
  statBox: { textAlign: 'center' },
  statLabel: { fontSize: 10, opacity: 0.4, textTransform: 'uppercase', marginBottom: 4 },
  statValue: { fontSize: 13, fontWeight: 600 }
};

export default EmployeeStats;