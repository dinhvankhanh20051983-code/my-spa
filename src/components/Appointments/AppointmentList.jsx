import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { fmt } from '../../utils/formatters';
import { 
  Clock, 
  CheckCircle2, 
  User, 
  Scissors, 
  Loader2,
  AlertCircle,
  Phone
} from 'lucide-react';

const AppointmentList = ({ filterStatus = 'all', limit = 10 }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm lấy dữ liệu chính
  const fetchAppointments = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      let query = supabase
        .from('appointments')
        .select(`
          *,
          customers ( name, phone ),
          employees ( name )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error: dbError } = await query;
      
      if (dbError) throw dbError;
      setAppointments(data || []);
      setError(null);
    } catch (err) {
      console.error("Lỗi fetchAppointments:", err.message);
      setError("Không thể tải danh sách lịch hẹn.");
    } finally {
      setLoading(false);
    }
  }, [filterStatus, limit]);

  useEffect(() => {
    fetchAppointments();

    // Lắng nghe thay đổi Realtime từ database
    const channel = supabase
      .channel('appointment-realtime')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'appointments' }, 
        () => fetchAppointments(true) // Cập nhật ngầm, không hiện loading quay quay
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filterStatus, limit, fetchAppointments]);

  // Cập nhật trạng thái lịch hẹn
  const updateStatus = async (id, newStatus) => {
    try {
      const { error: updateError } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (updateError) throw updateError;

      // Optimistic Update: Cập nhật UI ngay lập tức
      setAppointments(prev => prev.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      ));
    } catch (err) {
      alert("Lỗi khi cập nhật trạng thái!");
      console.error(err);
    }
  };

  if (loading && appointments.length === 0) {
    return (
      <div style={styles.center}>
        <Loader2 className="animate-spin" color="#a78bfa" />
        <p style={{ fontSize: 13, opacity: 0.5 }}>Đang đồng bộ dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...styles.center, color: '#f87171' }}>
        <AlertCircle size={24} />
        <p>{error}</p>
        <button onClick={() => fetchAppointments()} style={styles.retryBtn}>Thử lại</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {appointments.length === 0 ? (
        <div style={styles.empty}>
          <p>Hiện không có lịch hẹn nào {filterStatus !== 'all' ? `đang ${filterStatus}` : ''}</p>
        </div>
      ) : (
        appointments.map((item) => (
          <div key={item.id} style={{
            ...styles.card,
            borderColor: item.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            background: item.status === 'completed' ? 'rgba(16, 185, 129, 0.02)' : 'rgba(255, 255, 255, 0.03)'
          }}>
            <div style={styles.row}>
              <div style={styles.info}>
                <div style={styles.custName}>
                  {item.customers?.name || 'Khách vãng lai'}
                </div>
                <div style={styles.phoneRow}>
                  <Phone size={10} /> {item.customers?.phone || 'Không có SĐT'}
                </div>
                
                <div style={styles.serviceTag}>
                  <Scissors size={12} /> {item.service_name}
                </div>
                
                <div style={styles.meta}>
                  <div style={styles.metaItem}><Clock size={12} /> {item.time}</div>
                  <div style={styles.metaItem}><User size={12} /> Thợ: {item.employees?.name || '---'}</div>
                </div>
              </div>
              
              <div style={styles.actionArea}>
                <div style={styles.price}>{fmt(item.price)}</div>
                {item.status === 'pending' ? (
                  <button 
                    onClick={() => updateStatus(item.id, 'completed')}
                    style={styles.doneBtn}
                  >
                    Xác nhận xong
                  </button>
                ) : (
                  <div style={styles.statusBadge}>
                    <CheckCircle2 size={14} /> Hoàn tất
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: 12 },
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 40 },
  card: {
    borderRadius: 20,
    padding: '18px',
    border: '1px solid',
    transition: 'transform 0.2s ease'
  },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 15 },
  info: { flex: 1 },
  custName: { fontWeight: 800, fontSize: 16, color: '#fff', marginBottom: 2 },
  phoneRow: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#a78bfa', marginBottom: 10 },
  serviceTag: { 
    display: 'inline-flex', alignItems: 'center', gap: 6, 
    fontSize: 13, fontWeight: 600, color: '#fff',
    background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: 8,
    marginBottom: 12
  },
  meta: { display: 'flex', flexWrap: 'wrap', gap: 12 },
  metaItem: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, opacity: 0.5 },
  actionArea: { textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 },
  price: { fontWeight: 900, fontSize: 17, color: '#fff' },
  doneBtn: {
    background: '#10b981', color: '#fff', border: 'none', 
    padding: '8px 16px', borderRadius: 10, fontSize: 12, 
    fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
  },
  statusBadge: { display: 'flex', alignItems: 'center', gap: 5, color: '#10b981', fontSize: 12, fontWeight: 700 },
  empty: { textAlign: 'center', padding: 40, opacity: 0.3, border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 20 },
  retryBtn: { background: 'none', border: '1px solid #fff', color: '#fff', padding: '5px 15px', borderRadius: 8, marginTop: 10, cursor: 'pointer' }
};

export default AppointmentList;