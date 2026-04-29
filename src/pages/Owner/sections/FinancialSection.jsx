import React, { useState, useMemo } from 'react';

/**
 * FinancialSection Component
 * 
 * Quản lý tài chính, invoice, hóa đơn, accounting, tax
 */
export const FinancialSection = ({ 
  appointments = [], 
  onlineOrders = [], 
  staffs = [],
  styles = {} 
}) => {
  const [financialTab, setFinancialTab] = useState('overview');
  const [invoices, setInvoices] = useState([
    { id: 'INV001', date: '2024-01-15', customer: 'Nguyễn Văn A', amount: 500000, status: 'paid', type: 'appointment' },
    { id: 'INV002', date: '2024-01-18', customer: 'Trần Thị B', amount: 1200000, status: 'paid', type: 'online_order' },
    { id: 'INV003', date: '2024-01-20', customer: 'Hoàng Văn C', amount: 750000, status: 'pending', type: 'appointment' },
  ]);
  const [expenses, setExpenses] = useState([
    { id: 1, date: '2024-01-15', category: 'Salary', amount: 50000000, description: 'Lương nhân viên tháng 1' },
    { id: 2, date: '2024-01-18', category: 'Supplies', amount: 5000000, description: 'Mua hóa chất làm đẹp' },
    { id: 3, date: '2024-01-20', category: 'Rent', amount: 15000000, description: 'Tiền thuê mặt bằng' },
  ]);
  const [paymentMethods, setPaymentMethods] = useState({
    cash: 120000000,
    bank: 85000000,
    momo: 35000000,
    card: 28000000,
  });
  const [taxSettings, setTaxSettings] = useState({
    taxRate: 10,
    vat: 8,
    businessTaxEnabled: true,
    financialYear: 2024,
  });

  // ==================== CALCULATIONS ====================

  const financialStats = useMemo(() => {
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalCash = Object.values(paymentMethods).reduce((sum, amount) => sum + amount, 0);
    const profit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) : 0;

    return {
      totalRevenue,
      totalExpenses,
      totalCash,
      profit,
      profitMargin,
      paidInvoices: invoices.filter(i => i.status === 'paid').length,
      pendingInvoices: invoices.filter(i => i.status === 'pending').length,
      totalInvoices: invoices.length,
    };
  }, [invoices, expenses, paymentMethods]);

  const expensesByCategory = useMemo(() => {
    const categories = {};
    expenses.forEach(exp => {
      if (!categories[exp.category]) {
        categories[exp.category] = 0;
      }
      categories[exp.category] += exp.amount;
    });
    return Object.entries(categories).map(([category, amount]) => ({
      category,
      amount,
      percentage: ((amount / financialStats.totalExpenses) * 100).toFixed(1)
    }));
  }, [expenses, financialStats.totalExpenses]);

  const taxCalculation = useMemo(() => {
    const revenue = financialStats.totalRevenue;
    const businessTax = taxSettings.businessTaxEnabled ? (revenue * taxSettings.taxRate / 100) : 0;
    const vat = revenue * taxSettings.vat / 100;
    const totalTax = businessTax + vat;

    return {
      revenue,
      businessTax,
      vat,
      totalTax,
      netIncome: revenue - financialStats.totalExpenses - totalTax,
    };
  }, [financialStats, taxSettings]);

  // ==================== RENDER FUNCTIONS ====================

  const renderOverview = () => (
    <div>
      <h3 style={styles.sectionTitle || {}}>💰 Tổng Quan Tài Chính</h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{
          background: '#f0fff4',
          padding: '20px',
          borderRadius: '8px',
          border: '2px solid #27ae60',
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>📈 Tổng Doanh Thu</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#27ae60', marginBottom: '5px' }}>
            ₫{financialStats.totalRevenue.toLocaleString('vi-VN')}
          </div>
          <div style={{ fontSize: '11px', color: '#666' }}>
            {financialStats.totalInvoices} hóa đơn, {financialStats.paidInvoices} đã thanh toán
          </div>
        </div>

        <div style={{
          background: '#fff5f0',
          padding: '20px',
          borderRadius: '8px',
          border: '2px solid #e74c3c',
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>📉 Tổng Chi Phí</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#e74c3c', marginBottom: '5px' }}>
            ₫{financialStats.totalExpenses.toLocaleString('vi-VN')}
          </div>
          <div style={{ fontSize: '11px', color: '#666' }}>
            {expenses.length} chi tiêu
          </div>
        </div>

        <div style={{
          background: '#f0f7ff',
          padding: '20px',
          borderRadius: '8px',
          border: '2px solid #3498db',
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>💵 Lợi Nhuận</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3498db', marginBottom: '5px' }}>
            ₫{financialStats.profit.toLocaleString('vi-VN')}
          </div>
          <div style={{ fontSize: '11px', color: '#666' }}>
            Lợi nhuận ròng: {financialStats.profitMargin}%
          </div>
        </div>

        <div style={{
          background: '#fdf8f0',
          padding: '20px',
          borderRadius: '8px',
          border: '2px solid #f39c12',
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>💳 Tiền Mặt</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f39c12', marginBottom: '5px' }}>
            ₫{financialStats.totalCash.toLocaleString('vi-VN')}
          </div>
          <div style={{ fontSize: '11px', color: '#666' }}>
            Trong tất cả tài khoản
          </div>
        </div>
      </div>

      {/* Financial Summary Chart */}
      <div style={{
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #ecf0f1'
      }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Dòng Tiền Năm {taxSettings.financialYear}</h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '15px',
          fontSize: '13px'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Doanh Thu:</span>
              <strong style={{ color: '#27ae60' }}>₫{financialStats.totalRevenue.toLocaleString('vi-VN')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Chi Phí:</span>
              <strong style={{ color: '#e74c3c' }}>₫{financialStats.totalExpenses.toLocaleString('vi-VN')}</strong>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              paddingTop: '8px',
              borderTop: '1px solid #bdc3c7'
            }}>
              <span>Lợi Nhuận Trước Thuế:</span>
              <strong style={{ color: '#3498db' }}>₫{financialStats.profit.toLocaleString('vi-VN')}</strong>
            </div>
          </div>
          <div style={{ background: 'white', padding: '15px', borderRadius: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
              <span>Thuế TNDN:</span>
              <strong style={{ color: '#f39c12' }}>₫{taxCalculation.businessTax.toLocaleString('vi-VN')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
              <span>VAT ({taxSettings.vat}%):</span>
              <strong style={{ color: '#f39c12' }}>₫{taxCalculation.vat.toLocaleString('vi-VN')}</strong>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              paddingTop: '8px',
              borderTop: '1px solid #bdc3c7',
              fontSize: '12px'
            }}>
              <span>Lợi Nhuận Sau Thuế:</span>
              <strong style={{ color: '#27ae60' }}>₫{taxCalculation.netIncome.toLocaleString('vi-VN')}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInvoices = () => (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={styles.sectionTitle || {}}>📄 Hóa Đơn & Biên Lai</h3>
        <button
          onClick={() => alert('Tính năng tạo hóa đơn sẽ sớm cập nhật')}
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
          + Tạo Hóa Đơn
        </button>
      </div>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '13px',
      }}>
        <thead>
          <tr style={{ background: '#ecf0f1' }}>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Số Hóa Đơn</th>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Ngày</th>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Khách Hàng</th>
            <th style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>Số Tiền (₫)</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Loại</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Trạng Thái</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #ecf0f1' }}>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{invoice.id}</td>
              <td style={{ padding: '10px' }}>{invoice.date}</td>
              <td style={{ padding: '10px' }}>{invoice.customer}</td>
              <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#27ae60' }}>
                ₫{invoice.amount.toLocaleString('vi-VN')}
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <span style={{
                  background: invoice.type === 'appointment' ? '#e3f2fd' : '#f0fff4',
                  color: invoice.type === 'appointment' ? '#1976d2' : '#27ae60',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  {invoice.type === 'appointment' ? 'Lịch Hẹn' : 'Đơn Online'}
                </span>
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <span style={{
                  background: invoice.status === 'paid' ? '#d4edda' : '#fff3cd',
                  color: invoice.status === 'paid' ? '#155724' : '#856404',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  {invoice.status === 'paid' ? '✓ Đã Thanh Toán' : '⏱ Chờ'}
                </span>
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <button
                  onClick={() => alert('Tính năng xem chi tiết sẽ sớm cập nhật')}
                  style={{
                    padding: '5px 10px',
                    background: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '11px'
                  }}
                >
                  Xem
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderExpenses = () => (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={styles.sectionTitle || {}}>💸 Quản Lý Chi Phí</h3>
        <button
          onClick={() => alert('Tính năng thêm chi phí sẽ sớm cập nhật')}
          style={{
            padding: '10px 20px',
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          + Thêm Chi Phí
        </button>
      </div>

      {/* Expenses by Category */}
      <div style={{
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #ecf0f1'
      }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Chi Phí Theo Danh Mục</h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          {expensesByCategory.map((category, idx) => (
            <div key={idx} style={{
              background: 'white',
              padding: '15px',
              borderRadius: '5px',
              border: '1px solid #ecf0f1'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '14px' }}>
                {category.category}
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#e74c3c', marginBottom: '5px' }}>
                ₫{category.amount.toLocaleString('vi-VN')}
              </div>
              <div style={{
                background: '#ecf0f1',
                height: '4px',
                borderRadius: '2px',
                overflow: 'hidden',
                marginBottom: '5px'
              }}>
                <div style={{
                  background: '#e74c3c',
                  height: '100%',
                  width: `${category.percentage}%`
                }} />
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {category.percentage}% tổng chi phí
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Expenses */}
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '13px',
      }}>
        <thead>
          <tr style={{ background: '#ecf0f1' }}>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Danh Mục</th>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Ngày</th>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Mô Tả</th>
            <th style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>Số Tiền (₫)</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #ecf0f1' }}>
              <td style={{ padding: '10px' }}>
                <span style={{
                  background: '#e74c3c20',
                  color: '#e74c3c',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  {expense.category}
                </span>
              </td>
              <td style={{ padding: '10px', fontSize: '12px' }}>{expense.date}</td>
              <td style={{ padding: '10px' }}>{expense.description}</td>
              <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#e74c3c' }}>
                ₫{expense.amount.toLocaleString('vi-VN')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPayments = () => (
    <div>
      <h3 style={styles.sectionTitle || {}}>💳 Phương Thức Thanh Toán</h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '20px'
      }}>
        {Object.entries(paymentMethods).map(([method, amount], idx) => {
          const icons = {
            cash: '💵',
            bank: '🏦',
            momo: '📱',
            card: '💳'
          };
          const labels = {
            cash: 'Tiền Mặt',
            bank: 'Chuyển Khoản',
            momo: 'Ví MoMo',
            card: 'Thẻ Tín Dụng'
          };
          return (
            <div key={idx} style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #ecf0f1'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>
                {icons[method]}
              </div>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '5px' }}>
                {labels[method]}
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2c3e50' }}>
                ₫{amount.toLocaleString('vi-VN')}
              </div>
              <div style={{ fontSize: '11px', color: '#666', marginTop: '10px' }}>
                {((amount / financialStats.totalCash) * 100).toFixed(1)}% tổng tiền
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderTax = () => (
    <div>
      <h3 style={styles.sectionTitle || {}}>🏛️ Quản Lý Thuế</h3>

      <div style={{
        background: '#f0f7ff',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '2px solid #3498db'
      }}>
        <h4 style={{ marginTop: 0, marginBottom: '15px', color: '#2c3e50' }}>Cấu Hình Thuế</h4>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '15px',
          marginBottom: '15px'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
              Năm Tài Chính
            </label>
            <input
              type="number"
              value={taxSettings.financialYear}
              onChange={(e) => setTaxSettings({
                ...taxSettings,
                financialYear: parseInt(e.target.value)
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
              Thuế TNDN (%)
            </label>
            <input
              type="number"
              value={taxSettings.taxRate}
              onChange={(e) => setTaxSettings({
                ...taxSettings,
                taxRate: parseFloat(e.target.value)
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
              VAT (%)
            </label>
            <input
              type="number"
              value={taxSettings.vat}
              onChange={(e) => setTaxSettings({
                ...taxSettings,
                vat: parseFloat(e.target.value)
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
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={taxSettings.businessTaxEnabled}
                onChange={(e) => setTaxSettings({
                  ...taxSettings,
                  businessTaxEnabled: e.target.checked
                })}
                style={{ marginRight: '8px' }}
              />
              <span style={{ fontSize: '12px' }}>Áp dụng Thuế TNDN</span>
            </label>
          </div>
        </div>

        <button
          onClick={() => alert('Cài đặt thuế đã được lưu!')}
          style={{
            width: '100%',
            padding: '12px',
            background: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Lưu Cài Đặt
        </button>
      </div>

      {/* Tax Summary */}
      <div style={{
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #ecf0f1'
      }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Tính Toán Thuế Năm {taxSettings.financialYear}</h4>
        
        <table style={{
          width: '100%',
          fontSize: '13px',
        }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #ecf0f1' }}>
              <td style={{ padding: '10px' }}>Doanh Thu:</td>
              <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#27ae60' }}>
                ₫{taxCalculation.revenue.toLocaleString('vi-VN')}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ecf0f1' }}>
              <td style={{ padding: '10px' }}>Chi Phí:</td>
              <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#e74c3c' }}>
                ₫{financialStats.totalExpenses.toLocaleString('vi-VN')}
              </td>
            </tr>
            <tr style={{ borderBottom: '2px solid #2c3e50', background: '#f0fff4' }}>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>Lợi Nhuận Trước Thuế:</td>
              <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#27ae60' }}>
                ₫{financialStats.profit.toLocaleString('vi-VN')}
              </td>
            </tr>
            {taxSettings.businessTaxEnabled && (
              <tr style={{ borderBottom: '1px solid #ecf0f1' }}>
                <td style={{ padding: '10px' }}>Thuế TNDN ({taxSettings.taxRate}%):</td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#f39c12' }}>
                  ₫{taxCalculation.businessTax.toLocaleString('vi-VN')}
                </td>
              </tr>
            )}
            <tr style={{ borderBottom: '1px solid #ecf0f1' }}>
              <td style={{ padding: '10px' }}>VAT ({taxSettings.vat}%):</td>
              <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#f39c12' }}>
                ₫{taxCalculation.vat.toLocaleString('vi-VN')}
              </td>
            </tr>
            <tr style={{ background: '#fff5f0' }}>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>Lợi Nhuận Sau Thuế:</td>
              <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#27ae60', fontSize: '16px' }}>
                ₫{taxCalculation.netIncome.toLocaleString('vi-VN')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
        paddingBottom: '15px',
        overflowX: 'auto'
      }}>
        {[
          { id: 'overview', label: '💰 Tổng Quan' },
          { id: 'invoices', label: '📄 Hóa Đơn' },
          { id: 'expenses', label: '💸 Chi Phí' },
          { id: 'payments', label: '💳 Thanh Toán' },
          { id: 'tax', label: '🏛️ Thuế' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFinancialTab(tab.id)}
            style={{
              padding: '10px 15px',
              background: financialTab === tab.id ? '#3498db' : 'transparent',
              color: financialTab === tab.id ? 'white' : '#666',
              border: financialTab === tab.id ? 'none' : '1px solid #ecf0f1',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {financialTab === 'overview' && renderOverview()}
      {financialTab === 'invoices' && renderInvoices()}
      {financialTab === 'expenses' && renderExpenses()}
      {financialTab === 'payments' && renderPayments()}
      {financialTab === 'tax' && renderTax()}
    </div>
  );
};

export default FinancialSection;
