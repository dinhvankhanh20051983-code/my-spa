import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { fmt, calcSal } from '../../utils/formatters';
import { 
  ClipboardList, 
  Wallet, 
  Fingerprint, 
  Zap, 
  CheckCircle, 
  Calendar,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import Attendance from './Attendance';

const EmployeePage = ({ user }) => {
  const [empData, setEmpData] = useState(user);
  const [myAppts, setMyAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('main'); // 'main' | 'attendance'

  useEffect(() => {
    fetchEmployeeData();
  }, [user.id, view]);

  const fetchEmployeeData = async () => {
    setLoading(true);
    try {
      // 1. Lấy dữ liệu profile nhân viên mới nhất
      const { data: profile } = await supabase
        .from('employees')
        .select('*')
        .eq('id', user.id)
        .single();
      if (profile) setEmpData(profile);

      // 2. Lấy danh sách lịch hẹn (Tours) nhân viên phục vụ
      const { data: appts } = await supabase
        .from('appointments')
        .select(`*, customers ( name )`)
        .eq('employee_id', user.id)
        .order('created_at', { ascending: false });
      
      if (appts) setMyAppts(appts);
    } catch (err) {
      console.error("Lỗi:", err);
    } finally {
      setLoading(false);
    }
  };

  // Tính toán lương tạm tính dựa trên logic nghiệp vụ
  const salaryDetail = calcSal({
    salary: empData.base_salary,
    cfg: empData.config,
    md: {
      tours: myAppts.filter(a => a.status === 'completed').length,
      prodSales: empData.md?.prodSales || 0,
      pkgSales: empData.md?.pkgSales || 0,
      other: empData.md?.other || 0
    }
  });

  // --- MÀN HÌNH CHÍNH (DASHBOARD NHÂN VIÊN) ---
  const MainView = () => (
    <>
      {/* THẺ THU NHẬP TẠM TÍNH */}
      <div style={styles.salaryCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.8, textTransform: 'uppercase', fontWeight: 700 }}>Thu nhập tháng này</div>
            <div style={{ fontSize: 32, fontWeight: 800, margin: '5px 0' }}>{fmt(salaryDetail.total)}</div>
          </div>
          <div style={styles.iconBox}><Zap size={24} color="#fff" /></div>
        </div>
        
        <div style={styles.statsGrid}>
          <div style={styles.statItem}>
            <div style={styles.statLabel}>Tiền Tour</div>
            <div style={styles.statVal}>{fmt(salaryDetail.tourAmt)}</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statLabel}>Hoa hồng SP</div>
            <div style={styles.statVal}>{fmt(salaryDetail.prodCom + salaryDetail.pkgCom)}</div>
          </div>
        </div>
      </div>

      {/* DANH SÁCH TOUR HÔM NAY */}
      <div style={styles.sectionHeader}>
        <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ClipboardList size={20} color="#10b981" /> Nhật ký phục vụ
        </h4>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Tháng {new Date().getMonth() + 1}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? <p style={{ textAlign: 'center', opacity: 0.5 }}>Đang tải...</p> : 
          myAppts.length > 0 ? myAppts.map(appt => (
          <div key={appt.id} style={styles.apptItem}>
            <div>
              <div style={{ fontWeight: 600 }}>{appt.service_name}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                👤 {appt.customers?.name || 'Khách vãng lai'} | 🕒 {appt.time}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>+{fmt(empData.config?.tourFee)}</div>
              <div style={{ fontSize: 10, color: appt.status === 'completed' ? '#10b981' : '#fbbf24', marginTop: 4 }}>
                {appt.status === 'completed' ? 'Đã xong' : 'Đang chờ'}
              </div>
            </div>
          </div>
        )) : (
          <div style={{ textAlign: 'center', padding: 30, background: 'rgba(255,255,255,0.02)', borderRadius: 20 }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', margin: 0 }}>Bạn chưa có tour nào trong tháng này.</p>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', paddingBottom: 100 }}>
      {/* HEADER NHÂN VIÊN */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 }}>
        <div>
          <h2 style={{ margin: 0 }}>Chào, {empData.name.split(' ').pop()}</h2>
          <p style={{ margin: 0, fontSize: 12, color: '#10b981' }}>{empData.role} đang hoạt động</p>
        </div>
        <button onClick={() => setView(view === 'main' ? 'attendance' : 'main')} style={styles.navToggle}>
          {view === 'main' ? <Fingerprint size={20} /> : <TrendingUp size={20} />}
          {view === 'main' ? 'Chấm công' : 'Xem lương'}
        </button>
      </div>

      {view === 'main' ? <MainView /> : <Attendance user={user} />}
    </div>
  );
};

const styles = {
  salaryCard: {
    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    borderRadius: 24, padding: 25, marginBottom: 30,
    boxShadow: '0 12px 24px rgba(16, 185, 129, 0.2)',
  },
  iconBox: { background: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 14 },
  statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginTop: 25, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 20 },
  statItem: { borderLeft: '2px solid rgba(255,255,255,0.3)', paddingLeft: 10 },
  statLabel: { fontSize: 11, opacity: 0.8, marginBottom: 4 },
  statVal: { fontSize: 15, fontWeight: 700 },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  apptItem: { 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 16, 
    border: '1px solid rgba(255,255,255,0.05)' 
  },
  navToggle: {
    display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(16, 185, 129, 0.1)',
    color: '#10b981', border: '1px solid #10b98133', padding: '8px 16px', borderRadius: 12,
    fontWeight: 600, cursor: 'pointer', fontSize: 13
  }
};

export default EmployeePage;