import React, { useState } from 'react';
import { Package, Users, TrendingUp, Edit3, Trash2 } from 'lucide-react';

export const PackagesSection = ({ packages, customers, styles, onSetModal, onDeletePackage }) => {
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Lấy dữ liệu từ database (hoặc tính từ customers nếu chưa lưu)
  const getPackageUsage = (packageId) => {
    const pkg = packages.find(p => p.id === packageId);
    // Nếu đã lưu usersCount trong database thì dùng nó
    if (pkg?.usersCount !== undefined && pkg.usersCount !== null) {
      return pkg.usersCount;
    }
    // Nếu không, tính từ customers
    return customers.filter(customer =>
      customer.my_packages?.some(pkgItem =>
        pkgItem.package_id === packageId && pkgItem.remaining_sessions > 0
      )
    ).length;
  };

  // Lấy doanh thu từ database hoặc tính từ customers
  const getPackageRevenue = (packageId) => {
    const pkg = packages.find(p => p.id === packageId);
    // Nếu đã lưu revenue trong database thì dùng nó
    if (pkg?.revenue !== undefined && pkg.revenue !== null) {
      return Number(pkg.revenue) || 0;
    }
    // Nếu không, tính từ customers
    return customers.reduce((total, customer) => {
      const customerPackage = customer.my_packages?.find(pkgItem => pkgItem.package_id === packageId);
      if (customerPackage) {
        return total + (customerPackage.total_price || 0);
      }
      return total;
    }, 0);
  };

  return (
    <div style={styles.section}>
      <div style={styles.flexHeader}>
        <h3 style={styles.sectionTitle}>
          <Package size={24} style={{ marginRight: '10px' }} />
          QUẢN LÝ GÓI TRỊ LIỆU
        </h3>
        <button
          style={styles.btnPrimary}
          onClick={() => onSetModal({ show: true, type: 'package' })}
        >
          + TẠO GÓI MỚI
        </button>
      </div>

      {/* Thống kê tổng quan */}
      <div style={{ ...styles.grid4, marginBottom: '20px' }}>
        <div style={styles.statCard}>
          <Package size={20} color="#10b981" />
          <div>
            <div style={styles.statNumber}>{packages.length}</div>
            <div style={styles.statLabel}>Tổng gói</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <Users size={20} color="#3b82f6" />
          <div>
            <div style={styles.statNumber}>
              {customers.reduce((total, customer) =>
                total + (customer.my_packages?.length || 0), 0
              )}
            </div>
            <div style={styles.statLabel}>Gói đang sử dụng</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <TrendingUp size={20} color="#f59e0b" />
          <div>
            <div style={styles.statNumber}>
              {packages.reduce((total, pkg) => total + pkg.sessions, 0)}
            </div>
            <div style={styles.statLabel}>Tổng buổi trị liệu</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            {packages.reduce((total, pkg) => total + Number(pkg.price), 0).toLocaleString()}đ
          </div>
          <div style={styles.statLabel}>Tổng giá trị gói</div>
        </div>
      </div>

      {/* Danh sách gói chi tiết */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '16px', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600' }}>GÓI TRỊ LIỆU</th>
              <th style={{ padding: '16px', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600' }}>SỐ BUỔI</th>
              <th style={{ padding: '16px', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600' }}>GIÁ</th>
              <th style={{ padding: '16px', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600' }}>ĐIỂM THƯỞNG</th>
              <th style={{ padding: '16px', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600' }}>ĐANG SỬ DỤNG</th>
              <th style={{ padding: '16px', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600' }}>DOANH THU</th>
              <th style={{ padding: '16px', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600' }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {packages.map(pkg => (
              <tr key={pkg.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }} onClick={() => setSelectedPackage(selectedPackage?.id === pkg.id ? null : pkg)}>
                <td style={{ padding: '16px' }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#fff', marginBottom: '4px' }}>{pkg.name}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                      ID: {pkg.id} • Tạo: {new Date(pkg.created_at).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{ background: '#10b981', color: '#fff', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
                    {pkg.sessions} buổi
                  </span>
                </td>
                <td style={{ padding: '16px', fontWeight: '600', color: '#10b981' }}>
                  {Number(pkg.price).toLocaleString()}đ
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{ background: '#f59e0b', color: '#fff', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
                    +{pkg.rewardPoints || 0} điểm
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={16} color="#3b82f6" />
                    <span style={{ fontWeight: '600' }}>{getPackageUsage(pkg.id)}</span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>khách</span>
                  </div>
                </td>
                <td style={{ padding: '16px', fontWeight: '600', color: '#3b82f6' }}>
                  {getPackageRevenue(pkg.id).toLocaleString()}đ
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetModal({ show: true, type: 'package', data: pkg });
                      }}
                      style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: '4px' }}
                      title="Chỉnh sửa"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePackage(pkg.id);
                      }}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chi tiết gói khi click */}
      {selectedPackage && (
        <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
          <h4 style={{ marginBottom: '16px', color: '#fff' }}>
            📊 Chi tiết gói: {selectedPackage.name}
          </h4>

          <div style={styles.grid3}>
            <div style={styles.infoCard}>
              <h5>Khách hàng đang sử dụng</h5>
              {customers
                .filter(customer => customer.my_packages?.some(pkg => pkg.package_id === selectedPackage.id))
                .map(customer => {
                  const customerPackage = customer.my_packages.find(pkg => pkg.package_id === selectedPackage.id);
                  return (
                    <div key={customer.id} style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '8px' }}>
                      <div style={{ fontWeight: '600' }}>{customer.name}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                        Còn {customerPackage.remaining_sessions}/{selectedPackage.sessions} buổi
                      </div>
                    </div>
                  );
                })}
            </div>

            <div style={styles.infoCard}>
              <h5>Thống kê sử dụng</h5>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Tổng khách đã mua:</span>
                <span style={{ fontWeight: '600' }}>
                  {customers.filter(customer =>
                    customer.my_packages?.some(pkg => pkg.package_id === selectedPackage.id)
                  ).length}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Tổng buổi đã sử dụng:</span>
                <span style={{ fontWeight: '600' }}>
                  {customers.reduce((total, customer) => {
                    const pkg = customer.my_packages?.find(p => p.package_id === selectedPackage.id);
                    return total + (pkg ? (selectedPackage.sessions - pkg.remaining_sessions) : 0);
                  }, 0)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Tổng doanh thu:</span>
                <span style={{ fontWeight: '600', color: '#10b981' }}>
                  {getPackageRevenue(selectedPackage.id).toLocaleString()}đ
                </span>
              </div>
            </div>

            <div style={styles.infoCard}>
              <h5>Thông tin gói</h5>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Giá gốc:</span>
                <span>{Number(selectedPackage.price).toLocaleString()}đ</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Điểm thưởng:</span>
                <span>+{selectedPackage.rewardPoints || 0} điểm</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Ngày tạo:</span>
                <span>{new Date(selectedPackage.created_at).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
