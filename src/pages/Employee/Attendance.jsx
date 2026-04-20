import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { MapPin, Clock, CheckCircle, Fingerprint, Loader2 } from 'lucide-react';

const Attendance = ({ user }) => {
  const [status, setStatus] = useState(null); // 'in', 'out', or null
  const [loading, setLoading] = useState(false);
  const [todayLog, setTodayLog] = useState(null);

  useEffect(() => {
    fetchTodayStatus();
  }, [user.id]);

  const fetchTodayStatus = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('attendance')
      .select('*')
      .eq('employee_id', user.id)
      .eq('work_date', today)
      .single();
    
    if (data) {
      setTodayLog(data);
      if (data.check_out) setStatus('done');
      else if (data.check_in) setStatus('in');
    }
  };

  const handleAttendance = async () => {
    setLoading(true);
    const now = new Date();
    const timeString = now.toLocaleTimeString('vi-VN', { hour12: false });
    const dateString = now.toISOString().split('T')[0];

    try {
      if (!status) {
        // Check-in: Tạo dòng mới
        const { error } = await supabase.from('attendance').insert([{
          employee_id: user.id,
          work_date: dateString,
          check_in: timeString,
          status: 'present'
        }]);
        if (!error) setStatus('in');
      } else if (status === 'in') {
        // Check-out: Cập nhật dòng hiện tại
        const { error } = await supabase
          .from('attendance')
          .update({ check_out: timeString })
          .eq('employee_id', user.id)
          .eq('work_date', dateString);
        if (!error) setStatus('done');
      }
      fetchTodayStatus();
    } catch (err) {
      alert("Lỗi kết nối. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', color: '#fff' }}>
      <div style={{ textAlign: 'center', marginBottom: 30 }}>
        <div style={{ 
          width: 80, height: 80, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px'
        }}>
          <Fingerprint size={40} color="#10b981" />
        </div>
        <h3 style={{ margin: 0 }}>Chấm công hôm nay</h3>
        <p style={{ opacity: 0.5, fontSize: 13 }}>Ngày {new Date().toLocaleDateString('vi-VN')}</p>
      </div>

      <div style={{ 
        background: 'rgba(255,255,255,0.05)', borderRadius: 24, padding: 25,
        border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 30 }}>
          <div>
            <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 5 }}>Vào ca</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#10b981' }}>
              {todayLog?.check_in || '--:--'}
            </div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
          <div>
            <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 5 }}>Ra ca</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#f87171' }}>
              {todayLog?.check_out || '--:--'}
            </div>
          </div>
        </div>

        {status === 'done' ? (
          <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <CheckCircle size={20} /> Bạn đã hoàn thành ngày làm việc
          </div>
        ) : (
          <button
            onClick={handleAttendance}
            disabled={loading}
            style={{
              width: '100%', padding: 16, borderRadius: 16, border: 'none',
              background: status === 'in' ? '#ef4444' : '#10b981',
              color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
            }}
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              status === 'in' ? 'Check-out (Kết thúc)' : 'Check-in (Bắt đầu)'
            )}
          </button>
        )}
      </div>

      <div style={{ marginTop: 25, display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
        <MapPin size={14} /> Hệ thống đang ghi nhận vị trí của bạn
      </div>
    </div>
  );
};

export default Attendance;