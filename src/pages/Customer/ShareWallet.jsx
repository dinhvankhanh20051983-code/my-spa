import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { fmt } from '../../utils/formatters';
import { 
  TrendingUp, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownLeft, 
  DollarSign,
  Info
} from 'lucide-react';

const ShareWallet = ({ user }) => {
  const [sharesInfo, setSharesInfo] = useState({ shares: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWalletData = useCallback(async () => {
    setLoading(true);
    // 1. Lấy thông tin cổ phần hiện tại
    const { data: profile } = await supabase
      .from('customers')
      .select('shares, balance')
      .eq('id', user.id)
      .single();
    
    if (profile) setSharesInfo(profile);

    // 2. Lấy lịch sử biến động số dư (Share Transactions)
    // Giả định bạn có bảng share_transactions để ghi lại lịch sử nạp/rút/chia cổ tức
    const { data: trans } = await supabase
      .from('share_transactions')
      .select('*')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false });

    if (trans) setTransactions(trans);
    setLoading(false);
  }, [user.id]);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', color: '#fff' }}>
      <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <PieChart color="#a78bfa" /> Ví Cổ Phần & Đầu Tư
      </h3>

      {/* Thẻ Tổng Quan Cổ Phần */}
      <div style={{ 
        background: 'rgba(255,255,255,0.05)', 
        borderRadius: 24, padding: 25, 
        border: '1px solid rgba(167, 139, 250, 0.2)',
        marginBottom: 25 
      }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 5 }}>Tỷ lệ sở hữu</div>
          <div style={{ fontSize: 48, fontWeight: 800, color: '#a78bfa' }}>
            {sharesInfo.shares}<span style={{ fontSize: 20 }}>%</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: 15, borderRadius: 16 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 5 }}>Giá trị ví</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{fmt(sharesInfo.balance)}</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: 15, borderRadius: 16 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 5 }}>Lợi nhuận dự tính</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#4ade80' }}>+{fmt(sharesInfo.balance * 0.05)}</div>
          </div>
        </div>
      </div>

      {/* Lịch sử giao dịch ví */}
      <div style={{ marginBottom: 15, display: 'flex', justifyContent: 'space-between' }}>
        <h4 style={{ margin: 0, fontSize: 16 }}>Lịch sử biến động</h4>
        <Info size={16} color="rgba(255,255,255,0.3)" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
          <p style={{ textAlign: 'center', opacity: 0.5 }}>Đang tải dữ liệu...</p>
        ) : transactions.length > 0 ? (
          transactions.map(item => (
            <div key={item.id} style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 16px', background: 'rgba(255,255,255,0.02)', 
              borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ 
                  width: 40, height: 40, borderRadius: 12, 
                  background: item.amount > 0 ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {item.amount > 0 ? <ArrowUpRight color="#4ade80" size={20} /> : <ArrowDownLeft color="#f87171" size={20} />}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{item.type || 'Chia cổ tức'}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                    {new Date(item.created_at).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
              <div style={{ 
                fontWeight: 700, 
                color: item.amount > 0 ? '#4ade80' : '#fff' 
              }}>
                {item.amount > 0 ? '+' : ''}{fmt(item.amount)}
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: 30, background: 'rgba(255,255,255,0.01)', borderRadius: 20 }}>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>Chưa có giao dịch cổ phần nào.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareWallet;