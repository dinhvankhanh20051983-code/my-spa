import React, { useState, useMemo } from 'react';

/**
 * AnalyticsSection Component
 * 
 * Biểu đồ, thống kê chi tiết, KPI, doanh thu
 * - Revenue analytics
 * - Customer analytics
 * - Staff performance
 * - Treatment trends
 * - Online order trends
 */
export const AnalyticsSection = ({ 
  appointments = [], 
  onlineOrders = [], 
  customers = [], 
  staffs = [], 
  products = [], 
  packages = [],
  styles = {} 
}) => {
  const [analyticsTab, setAnalyticsTab] = useState('revenue');
  const [timeRange, setTimeRange] = useState('month'); // week, month, year

  // ==================== CALCULATIONS ====================
  
  const revenueStats = useMemo(() => {
    const onlineRevenue = onlineOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const appointmentRevenue = appointments.reduce((sum, apt) => {
      const pkgPrice = packages.find(p => p.name === apt.packageName)?.price || 0;
      return sum + pkgPrice;
    }, 0);
    const totalRevenue = onlineRevenue + appointmentRevenue;

    return {
      total: totalRevenue,
      online: onlineRevenue,
      appointment: appointmentRevenue,
      average: appointments.length > 0 ? appointmentRevenue / appointments.length : 0,
      online_count: onlineOrders.length,
      appointment_count: appointments.length,
    };
  }, [onlineOrders, appointments, packages]);

  const customerStats = useMemo(() => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const loyalCustomers = customers.filter(c => (c.appointmentCount || 0) >= 5).length;
    const newCustomers = customers.filter(c => {
      if (!c.createdAt) return false;
      const created = new Date(c.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return created > thirtyDaysAgo;
    }).length;

    return {
      total: totalCustomers,
      active: activeCustomers,
      loyal: loyalCustomers,
      new: newCustomers,
      retention: totalCustomers > 0 ? ((activeCustomers / totalCustomers) * 100).toFixed(1) : 0,
      lifetime_value: totalCustomers > 0 ? (revenueStats.total / totalCustomers).toFixed(2) : 0,
    };
  }, [customers, revenueStats.total]);

  const staffStats = useMemo(() => {
    return staffs.map(staff => ({
      name: staff.name,
      phone: staff.phone,
      appointmentCount: appointments.filter(a => a.staffName === staff.name).length,
      revenue: packages.reduce((sum, pkg) => {
        const count = appointments.filter(a => a.staffName === staff.name && a.packageName === pkg.name).length;
        return sum + (count * (pkg.price || 0));
      }, 0),
      rating: staff.rating || 5,
      status: staff.status || 'active',
    }));
  }, [staffs, appointments, packages]);

  const packageStats = useMemo(() => {
    return packages.map(pkg => ({
      name: pkg.name,
      price: pkg.price,
      popularity: appointments.filter(a => a.packageName === pkg.name).length,
      revenue: appointments.filter(a => a.packageName === pkg.name).reduce((sum) => sum + (pkg.price || 0), 0),
    })).sort((a, b) => b.popularity - a.popularity);
  }, [packages, appointments]);

  const productStats = useMemo(() => {
    return products.map(prod => ({
      name: prod.name,
      price: prod.price,
      quantity: prod.quantity || 0,
      sold: onlineOrders.reduce((sum, order) => {
        const item = order.items?.find(i => i.name === prod.name);
        return sum + (item?.quantity || 0);
      }, 0),
    })).filter(p => p.quantity > 0 || p.sold > 0);
  }, [products, onlineOrders]);

  // ==================== RENDER FUNCTIONS ====================

  const renderRevenueAnalytics = () => (
    <div style={styles.analyticsContainer || {}}>
      <h3 style={styles.sectionTitle || {}}>📊 Phân Tích Doanh Thu</h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{
          background: '#f0f7ff',
          padding: '15px',
          borderRadius: '8px',
          border: '2px solid #3498db',
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Tổng Doanh Thu</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>
            ₫{revenueStats.total.toLocaleString('vi-VN')}
          </div>
        </div>

        <div style={{
          background: '#f0fff4',
          padding: '15px',
          borderRadius: '8px',
          border: '2px solid #27ae60',
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Doanh Thu Lịch Hẹn</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>
            ₫{revenueStats.appointment.toLocaleString('vi-VN')}
          </div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
            {revenueStats.appointment_count} lịch
          </div>
        </div>

        <div style={{
          background: '#fff5f0',
          padding: '15px',
          borderRadius: '8px',
          border: '2px solid #e74c3c',
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Doanh Thu Online</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>
            ₫{revenueStats.online.toLocaleString('vi-VN')}
          </div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
            {revenueStats.online_count} đơn
          </div>
        </div>

        <div style={{
          background: '#fdf8f0',
          padding: '15px',
          borderRadius: '8px',
          border: '2px solid #f39c12',
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Doanh Thu Trung Bình</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f39c12' }}>
            ₫{revenueStats.average.toLocaleString('vi-VN')}
          </div>
        </div>
      </div>

      {/* Revenue Trends Table */}
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '15px',
      }}>
        <thead>
          <tr style={{ background: '#ecf0f1' }}>
            <th style={{ padding: '10px', textAlign: 'left', fontSize: '13px', fontWeight: 'bold' }}>
              Loại Doanh Thu
            </th>
            <th style={{ padding: '10px', textAlign: 'right', fontSize: '13px', fontWeight: 'bold' }}>
              Số Lượng
            </th>
            <th style={{ padding: '10px', textAlign: 'right', fontSize: '13px', fontWeight: 'bold' }}>
              Doanh Thu (₫)
            </th>
            <th style={{ padding: '10px', textAlign: 'right', fontSize: '13px', fontWeight: 'bold' }}>
              Tỷ Lệ (%)
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #ecf0f1' }}>
            <td style={{ padding: '10px' }}>Lịch Hẹn</td>
            <td style={{ padding: '10px', textAlign: 'right' }}>{revenueStats.appointment_count}</td>
            <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>
              ₫{revenueStats.appointment.toLocaleString('vi-VN')}
            </td>
            <td style={{ padding: '10px', textAlign: 'right' }}>
              {revenueStats.total > 0 
                ? ((revenueStats.appointment / revenueStats.total) * 100).toFixed(1) 
                : 0}%
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #ecf0f1' }}>
            <td style={{ padding: '10px' }}>Đơn Hàng Online</td>
            <td style={{ padding: '10px', textAlign: 'right' }}>{revenueStats.online_count}</td>
            <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>
              ₫{revenueStats.online.toLocaleString('vi-VN')}
            </td>
            <td style={{ padding: '10px', textAlign: 'right' }}>
              {revenueStats.total > 0 
                ? ((revenueStats.online / revenueStats.total) * 100).toFixed(1) 
                : 0}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderCustomerAnalytics = () => (
    <div style={styles.analyticsContainer || {}}>
      <h3 style={styles.sectionTitle || {}}>👥 Phân Tích Khách Hàng</h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{
          background: '#f0f7ff',
          padding: '15px',
          borderRadius: '8px',
          border: '2px solid #3498db',
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Tổng Khách Hàng</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db' }}>
            {customerStats.total}
          </div>
        </div>

        <div style={{
          background: '#f0fff4',
          padding: '15px',
          borderRadius: '8px',
          border: '2px solid #27ae60',
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Khách Hàng Hoạt Động</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>
            {customerStats.active}
          </div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
            Giữ chân: {customerStats.retention}%
          </div>
        </div>

        <div style={{
          background: '#fff5e6',
          padding: '15px',
          borderRadius: '8px',
          border: '2px solid #f39c12',
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Khách Hàng Trung Thành</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f39c12' }}>
            {customerStats.loyal}
          </div>
        </div>

        <div style={{
          background: '#fff0f5',
          padding: '15px',
          borderRadius: '8px',
          border: '2px solid #9b59b6',
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Khách Hàng Mới</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9b59b6' }}>
            {customerStats.new}
          </div>
        </div>
      </div>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '15px',
      }}>
        <thead>
          <tr style={{ background: '#ecf0f1' }}>
            <th style={{ padding: '10px', textAlign: 'left', fontSize: '13px', fontWeight: 'bold' }}>
              Chỉ Số
            </th>
            <th style={{ padding: '10px', textAlign: 'right', fontSize: '13px', fontWeight: 'bold' }}>
              Giá Trị
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #ecf0f1' }}>
            <td style={{ padding: '10px' }}>Giá Trị Vòng Đời Trung Bình (CLV)</td>
            <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>
              ₫{customerStats.lifetime_value}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #ecf0f1' }}>
            <td style={{ padding: '10px' }}>Tỷ Lệ Giữ Chân (%)</td>
            <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>
              {customerStats.retention}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderStaffAnalytics = () => (
    <div style={styles.analyticsContainer || {}}>
      <h3 style={styles.sectionTitle || {}}>👨‍💼 Hiệu Suất Nhân Viên</h3>
      
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '15px',
        fontSize: '13px',
      }}>
        <thead>
          <tr style={{ background: '#ecf0f1' }}>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Tên</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Số Lịch</th>
            <th style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>Doanh Thu (₫)</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Rating</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          {staffStats.map((staff, idx) => (
            <tr key={idx} style={{ 
              borderBottom: '1px solid #ecf0f1',
              background: idx % 2 === 0 ? '#fafafa' : 'white'
            }}>
              <td style={{ padding: '10px' }}>
                <strong>{staff.name}</strong><br/>
                <span style={{ fontSize: '11px', color: '#666' }}>{staff.phone}</span>
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                {staff.appointmentCount}
              </td>
              <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>
                ₫{staff.revenue.toLocaleString('vi-VN')}
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <span style={{
                  background: '#fff9e6',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  color: '#f39c12'
                }}>
                  ⭐ {staff.rating}
                </span>
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <span style={{
                  background: staff.status === 'active' ? '#d4edda' : '#f8d7da',
                  color: staff.status === 'active' ? '#155724' : '#721c24',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  {staff.status === 'active' ? '✓ Hoạt Động' : '✗ Nghỉ'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPackageAnalytics = () => (
    <div style={styles.analyticsContainer || {}}>
      <h3 style={styles.sectionTitle || {}}>📦 Phân Tích Gói Dịch Vụ</h3>
      
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '15px',
        fontSize: '13px',
      }}>
        <thead>
          <tr style={{ background: '#ecf0f1' }}>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Gói Dịch Vụ</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Phổ Biến</th>
            <th style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>Giá (₫)</th>
            <th style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>Doanh Thu (₫)</th>
          </tr>
        </thead>
        <tbody>
          {packageStats.map((pkg, idx) => (
            <tr key={idx} style={{ 
              borderBottom: '1px solid #ecf0f1',
              background: idx % 2 === 0 ? '#fafafa' : 'white'
            }}>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{pkg.name}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <span style={{
                  background: '#e3f2fd',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  color: '#1976d2'
                }}>
                  {pkg.popularity}
                </span>
              </td>
              <td style={{ padding: '10px', textAlign: 'right' }}>
                ₫{pkg.price.toLocaleString('vi-VN')}
              </td>
              <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#27ae60' }}>
                ₫{pkg.revenue.toLocaleString('vi-VN')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderProductAnalytics = () => (
    <div style={styles.analyticsContainer || {}}>
      <h3 style={styles.sectionTitle || {}}>🛍️ Phân Tích Sản Phẩm</h3>
      
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '15px',
        fontSize: '13px',
      }}>
        <thead>
          <tr style={{ background: '#ecf0f1' }}>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Sản Phẩm</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Kho</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Bán Ra</th>
            <th style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>Giá (₫)</th>
          </tr>
        </thead>
        <tbody>
          {productStats.map((prod, idx) => (
            <tr key={idx} style={{ 
              borderBottom: '1px solid #ecf0f1',
              background: idx % 2 === 0 ? '#fafafa' : 'white'
            }}>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{prod.name}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <span style={{
                  background: prod.quantity < 5 ? '#f8d7da' : '#d4edda',
                  color: prod.quantity < 5 ? '#721c24' : '#155724',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  fontSize: '11px'
                }}>
                  {prod.quantity}
                </span>
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                {prod.sold}
              </td>
              <td style={{ padding: '10px', textAlign: 'right' }}>
                ₫{prod.price.toLocaleString('vi-VN')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // ==================== MAIN RENDER ====================

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
          { id: 'revenue', label: '📊 Doanh Thu', icon: '📊' },
          { id: 'customer', label: '👥 Khách Hàng', icon: '👥' },
          { id: 'staff', label: '👨‍💼 Nhân Viên', icon: '👨‍💼' },
          { id: 'package', label: '📦 Gói Dịch Vụ', icon: '📦' },
          { id: 'product', label: '🛍️ Sản Phẩm', icon: '🛍️' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setAnalyticsTab(tab.id)}
            style={{
              padding: '10px 15px',
              background: analyticsTab === tab.id ? '#3498db' : 'transparent',
              color: analyticsTab === tab.id ? 'white' : '#666',
              border: analyticsTab === tab.id ? 'none' : '1px solid #ecf0f1',
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

      {/* Analytics Content */}
      {analyticsTab === 'revenue' && renderRevenueAnalytics()}
      {analyticsTab === 'customer' && renderCustomerAnalytics()}
      {analyticsTab === 'staff' && renderStaffAnalytics()}
      {analyticsTab === 'package' && renderPackageAnalytics()}
      {analyticsTab === 'product' && renderProductAnalytics()}
    </div>
  );
};

export default AnalyticsSection;
