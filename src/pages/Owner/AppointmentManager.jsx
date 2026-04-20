import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { fmt } from '../../utils/formatters';
import { 
  Calendar, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  User, 
  Scissors,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';

const AppointmentManager = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('pending'); // pending, completed, all
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
    
    // Đăng ký Realtime để cập nhật khi khách hàng đặt lịch mới
    const subscription = supabase
      .channel('any')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
        fetchAppointments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [filter]);

  const fetchAppointments = async () => {
    setLoading(true);
    let query = supabase
      .from('appointments')
      .select(`
        *,
        customers ( name, phone ),
        employees ( name )
      `)
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data, error } = await query;
    if (!error) setAppointments(data);
    setLoading(false);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (!error) {
      fetchAppointments();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Calendar color="#a78bfa" />
          <h3 style={{ margin: 0 }}>Quản lý lịch hẹn</h3>
        </div>
        
        <div style={styles.filterBar}>
          {['pending', 'completed', 'all'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                ...styles.filterBtn,
                background: filter === f ? '#a78bfa' : 'rgba(255,255,255,0.05)',
                color: filter === f ? '#1a1a2e' : '#fff'
              }}
            >
              {f === 'pending' ? 'Đang chờ' : f === 'completed' ? 'Hoàn tất' : 'Tất cả'}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.list}>
        {loading && appointments.length === 0 ? (
          <div style={styles.center}><RefreshCw className="animate-spin" /></div>
        ) : appointments.length > 0 ? (
          appointments.map((appt) => (
            <div key={appt.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.custInfo}>
                  <div style={styles.avatar}>{appt.customers?.name?.charAt(0)}</div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{appt.customers?.name}</div>
                    <div style={{ fontSize: 12, opacity: 0.5 }}>{appt.customers?.phone}</div>
                  </div>
                </div>
                <div style={{ 
                  ...styles.statusBadge, 
                  background: appt.status === 'completed' ? '#10b98122' : '#fbbf2422',
                  color: appt.status === 'completed' ? '#10b981' : '#fbbf24'
                }}>
                  {appt.status === 'completed' ? 'Hoàn tất' : 'Chưa phục vụ'}
                </div>
              </div>

              <div style={styles.cardBody}>
                <div style={styles.detailRow}>
                  <Scissors size={14} color="#a78bfa" />
                  <span>Dịch vụ: <strong>{appt.service_name}</strong></span>
                </div>
                <div style={styles.detailRow}>
                  <User size={14} color="#a78bfa" />
                  <span>Kỹ thuật viên: {appt.employees?.name || 'Chưa chỉ định'}</span>
                </div>
                <div style={styles.detailRow}>
                  <Clock size={14} color="#a78bfa" />
                  <span>Thời gian: {appt.time} | {new Date(appt.date).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>

              <div style={styles.cardFooter}>
                <div style={styles.price}>{fmt(appt.price)}</div>
                {appt.status === 'pending' && (
                  <button 
                    onClick={() => handleStatusUpdate(appt.id, 'completed')}
                    style={styles.actionBtn}
                  >
                    Xác nhận hoàn tất
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div style={styles.empty}>Không có lịch hẹn nào trong mục này.</div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { background: 'rgba(255,255,255,0.02)', padding: 20, borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 15 },
  filterBar: { display: 'flex', gap: 8, background: 'rgba(0,0,0,0.2)', padding: 4, borderRadius: 12 },
  filterBtn: { border: 'none', padding: '6px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: '0.3s' },
  list: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 15 },
  card: { background: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 15, border: '1px solid rgba(255,255,255,0.05)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  custInfo: { display: 'flex', alignItems: 'center', gap: 10 },
  avatar: { width: 35, height: 35, background: '#a78bfa33', color: '#a78bfa', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 },
  statusBadge: { fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 6, textTransform: 'uppercase' },
  cardBody: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 15, padding: '0 5px' },
  detailRow: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, opacity: 0.8 },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)' },
  price: { fontWeight: 800, fontSize: 16, color: '#fff' },
  actionBtn: { background: '#10b981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer' },
  center: { display: 'flex', justifyContent: 'center', padding: 40, width: '100%' },
  empty: { textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 14, gridColumn: '1/-1' }
};

export default AppointmentManager;