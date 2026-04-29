import React, { useState } from 'react';

/**
 * MarketingSection Component
 * 
 * Quản lý khuyến mãi, giảm giá, loyalty program, email/SMS
 */
export const MarketingSection = ({ customers = [], styles = {} }) => {
  const [marketingTab, setMarketingTab] = useState('promotions');
  const [promotions, setPromotions] = useState([
    { id: 1, name: 'Giảm 10% gói massage', type: 'discount', value: 10, expiry: '2024-12-31', status: 'active' },
    { id: 2, name: 'Mua 5 lần tặng 1', type: 'loyalty', value: 1, expiry: '2025-06-30', status: 'active' },
  ]);
  const [campaigns, setCampaigns] = useState([
    { id: 1, name: 'Email chào hàng mới', type: 'email', status: 'sent', count: 245 },
    { id: 2, name: 'SMS nhắc lịch hẹn', type: 'sms', status: 'scheduled', count: 189 },
  ]);
  const [loyaltySettings, setLoyaltySettings] = useState({
    pointsPerDollar: 1,
    pointsRedeemValue: 0.01,
    tierBronze: 100,
    tierSilver: 500,
    tierGold: 1000,
  });
  const [showPromotionForm, setShowPromotionForm] = useState(false);
  const [newPromotion, setNewPromotion] = useState({
    name: '',
    type: 'discount',
    value: '',
    expiry: '',
  });

  const handleAddPromotion = () => {
    if (newPromotion.name && newPromotion.value) {
      setPromotions([...promotions, {
        id: promotions.length + 1,
        ...newPromotion,
        status: 'active'
      }]);
      setNewPromotion({ name: '', type: 'discount', value: '', expiry: '' });
      setShowPromotionForm(false);
    }
  };

  const handleDeletePromotion = (id) => {
    setPromotions(promotions.filter(p => p.id !== id));
  };

  const renderPromotions = () => (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={styles.sectionTitle || {}}>🎉 Khuyến Mãi & Giảm Giá</h3>
        <button
          onClick={() => setShowPromotionForm(!showPromotionForm)}
          style={{
            padding: '10px 20px',
            background: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          + Thêm Khuyến Mãi
        </button>
      </div>

      {showPromotionForm && (
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '2px solid #ecf0f1'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '15px' }}>
            <input
              type="text"
              placeholder="Tên khuyến mãi"
              value={newPromotion.name}
              onChange={(e) => setNewPromotion({ ...newPromotion, name: e.target.value })}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #bdc3c7',
                fontSize: '13px'
              }}
            />
            <select
              value={newPromotion.type}
              onChange={(e) => setNewPromotion({ ...newPromotion, type: e.target.value })}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #bdc3c7',
                fontSize: '13px'
              }}
            >
              <option value="discount">Giảm giá (%)</option>
              <option value="loyalty">Loyalty (tặng)</option>
              <option value="flash">Flash Sale</option>
              <option value="referral">Giới thiệu bạn</option>
            </select>
            <input
              type="number"
              placeholder="Giá trị"
              value={newPromotion.value}
              onChange={(e) => setNewPromotion({ ...newPromotion, value: e.target.value })}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #bdc3c7',
                fontSize: '13px'
              }}
            />
            <input
              type="date"
              value={newPromotion.expiry}
              onChange={(e) => setNewPromotion({ ...newPromotion, expiry: e.target.value })}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #bdc3c7',
                fontSize: '13px'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleAddPromotion}
              style={{
                padding: '10px 20px',
                background: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Lưu
            </button>
            <button
              onClick={() => setShowPromotionForm(false)}
              style={{
                padding: '10px 20px',
                background: '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '13px',
      }}>
        <thead>
          <tr style={{ background: '#ecf0f1' }}>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Tên Khuyến Mãi</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Loại</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Giá Trị</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Hết Hạn</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Trạng Thái</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((promo, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #ecf0f1' }}>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{promo.name}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <span style={{
                  background: '#e3f2fd',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: '#1976d2'
                }}>
                  {promo.type}
                </span>
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <strong>{promo.value}{promo.type === 'discount' ? '%' : ''}</strong>
              </td>
              <td style={{ padding: '10px', textAlign: 'center', fontSize: '12px' }}>
                {promo.expiry}
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <span style={{
                  background: '#d4edda',
                  color: '#155724',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  ✓ {promo.status}
                </span>
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <button
                  onClick={() => handleDeletePromotion(promo.id)}
                  style={{
                    padding: '5px 10px',
                    background: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '11px'
                  }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCampaigns = () => (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={styles.sectionTitle || {}}>📢 Chiến Dịch Marketing</h3>
        <button
          onClick={() => alert('Tính năng tạo campaign sẽ sớm cập nhật')}
          style={{
            padding: '10px 20px',
            background: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          + Tạo Campaign
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '15px',
        marginBottom: '20px'
      }}>
        {campaigns.map((campaign, idx) => (
          <div
            key={idx}
            style={{
              background: '#f8f9fa',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #ecf0f1'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
              <div>
                <strong style={{ fontSize: '14px' }}>{campaign.name}</strong>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  Loại: {campaign.type.toUpperCase()}
                </div>
              </div>
              <span style={{
                background: campaign.status === 'sent' ? '#d4edda' : '#fff3cd',
                color: campaign.status === 'sent' ? '#155724' : '#856404',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 'bold'
              }}>
                {campaign.status === 'sent' ? '✓ Đã gửi' : '⏱ Sắp'}
              </span>
            </div>
            <div style={{
              fontSize: '13px',
              color: '#2c3e50',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              Người nhận: <span style={{ color: '#3498db' }}>{campaign.count}</span>
            </div>
            <button
              style={{
                width: '100%',
                padding: '8px',
                background: '#ecf0f1',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#666'
              }}
            >
              Xem Chi Tiết
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLoyaltyProgram = () => (
    <div>
      <h3 style={styles.sectionTitle || {}}>💎 Chương Trình Loyalty</h3>

      <div style={{
        background: '#f0f7ff',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '2px solid #3498db'
      }}>
        <h4 style={{ marginTop: 0, marginBottom: '15px', color: '#2c3e50' }}>Cấu Hình Điểm Thưởng</h4>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '15px',
          marginBottom: '15px'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
              Điểm/100,000 VND
            </label>
            <input
              type="number"
              value={loyaltySettings.pointsPerDollar}
              onChange={(e) => setLoyaltySettings({
                ...loyaltySettings,
                pointsPerDollar: parseFloat(e.target.value)
              })}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #bdc3c7',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
              Giá Trị 1 Điểm (VND)
            </label>
            <input
              type="number"
              value={loyaltySettings.pointsRedeemValue * 1000}
              onChange={(e) => setLoyaltySettings({
                ...loyaltySettings,
                pointsRedeemValue: parseFloat(e.target.value) / 1000
              })}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #bdc3c7',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        <h4 style={{ margin: '20px 0 15px 0', color: '#2c3e50' }}>Cấp Độ Thành Viên</h4>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '15px'
        }}>
          <div style={{
            background: 'white',
            padding: '15px',
            borderRadius: '8px',
            textAlign: 'center',
            border: '2px solid #bdc3c7'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>🥉</div>
            <strong style={{ display: 'block', marginBottom: '10px' }}>Bronze</strong>
            <label style={{ display: 'block', fontSize: '11px', marginBottom: '5px' }}>Từ điểm</label>
            <input
              type="number"
              value={loyaltySettings.tierBronze}
              onChange={(e) => setLoyaltySettings({
                ...loyaltySettings,
                tierBronze: parseFloat(e.target.value)
              })}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #bdc3c7',
                textAlign: 'center',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{
            background: 'white',
            padding: '15px',
            borderRadius: '8px',
            textAlign: 'center',
            border: '2px solid #f39c12'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>🥈</div>
            <strong style={{ display: 'block', marginBottom: '10px' }}>Silver</strong>
            <label style={{ display: 'block', fontSize: '11px', marginBottom: '5px' }}>Từ điểm</label>
            <input
              type="number"
              value={loyaltySettings.tierSilver}
              onChange={(e) => setLoyaltySettings({
                ...loyaltySettings,
                tierSilver: parseFloat(e.target.value)
              })}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #f39c12',
                textAlign: 'center',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{
            background: 'white',
            padding: '15px',
            borderRadius: '8px',
            textAlign: 'center',
            border: '2px solid #f1c40f'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>🥇</div>
            <strong style={{ display: 'block', marginBottom: '10px' }}>Gold</strong>
            <label style={{ display: 'block', fontSize: '11px', marginBottom: '5px' }}>Từ điểm</label>
            <input
              type="number"
              value={loyaltySettings.tierGold}
              onChange={(e) => setLoyaltySettings({
                ...loyaltySettings,
                tierGold: parseFloat(e.target.value)
              })}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #f1c40f',
                textAlign: 'center',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        <button
          onClick={() => alert('Cài đặt loyalty đã được lưu!')}
          style={{
            width: '100%',
            padding: '12px',
            background: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginTop: '20px'
          }}
        >
          Lưu Cài Đặt
        </button>
      </div>

      <h4 style={{ marginBottom: '15px' }}>👥 Khách Hàng Theo Cấp Độ</h4>
      
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '13px',
      }}>
        <thead>
          <tr style={{ background: '#ecf0f1' }}>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Cấp Độ</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Số Khách</th>
            <th style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>Tổng Doanh Thu (₫)</th>
          </tr>
        </thead>
        <tbody>
          {[
            { level: 'Bronze', count: customers.filter(c => (c.points || 0) >= 100).length, revenue: 0 },
            { level: 'Silver', count: customers.filter(c => (c.points || 0) >= 500).length, revenue: 0 },
            { level: 'Gold', count: customers.filter(c => (c.points || 0) >= 1000).length, revenue: 0 },
          ].map((tier, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #ecf0f1' }}>
              <td style={{ padding: '10px' }}>{tier.level}</td>
              <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>{tier.count}</td>
              <td style={{ padding: '10px', textAlign: 'right' }}>₫{tier.revenue.toLocaleString('vi-VN')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={{
      padding: '20px',
      background: 'white',
      borderRadius: '8px',
    }}>
      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        borderBottom: '2px solid #ecf0f1',
        paddingBottom: '15px'
      }}>
        {[
          { id: 'promotions', label: '🎉 Khuyến Mãi' },
          { id: 'campaigns', label: '📢 Chiến Dịch' },
          { id: 'loyalty', label: '💎 Loyalty' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setMarketingTab(tab.id)}
            style={{
              padding: '10px 15px',
              background: marketingTab === tab.id ? '#3498db' : 'transparent',
              color: marketingTab === tab.id ? 'white' : '#666',
              border: marketingTab === tab.id ? 'none' : '1px solid #ecf0f1',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {marketingTab === 'promotions' && renderPromotions()}
      {marketingTab === 'campaigns' && renderCampaigns()}
      {marketingTab === 'loyalty' && renderLoyaltyProgram()}
    </div>
  );
};

export default MarketingSection;
