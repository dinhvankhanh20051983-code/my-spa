import React, { useState, useMemo } from 'react';

/**
 * InventorySection Component
 * 
 * Quản lý kho hàng, xuất nhập, tracking, alert
 */
export const InventorySection = ({ products = [], styles = {} }) => {
  const [inventoryTab, setInventoryTab] = useState('overview');
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Tinh dầu spa premium', sku: 'SKU001', quantity: 15, minQuantity: 5, location: 'Kệ A1', unit: 'chai' },
    { id: 2, name: 'Mặt nạ dưỡng da', sku: 'SKU002', quantity: 3, minQuantity: 10, location: 'Kệ B2', unit: 'hộp' },
    { id: 3, name: 'Lotion dưỡng ẩm', sku: 'SKU003', quantity: 28, minQuantity: 10, location: 'Kệ C1', unit: 'chai' },
    { id: 4, name: 'Xà phòng tắm', sku: 'SKU004', quantity: 45, minQuantity: 20, location: 'Kệ D3', unit: 'bánh' },
  ]);
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2024-01-20', type: 'import', sku: 'SKU001', qty: 10, from: 'Nhà cung cấp A', note: 'Lô hàng tháng 1' },
    { id: 2, date: '2024-01-18', type: 'export', sku: 'SKU002', qty: 5, to: 'Bán hàng online', note: 'Đơn hàng #ORD001' },
    { id: 3, date: '2024-01-15', type: 'adjust', sku: 'SKU003', qty: 2, note: 'Điều chỉnh kho tồn kho' },
    { id: 4, date: '2024-01-12', type: 'import', sku: 'SKU004', qty: 30, from: 'Nhà cung cấp B', note: 'Lô hàng tháng 1' },
  ]);
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'Nhà cung cấp A', contact: '0912345678', email: 'supplier_a@email.com', status: 'active' },
    { id: 2, name: 'Nhà cung cấp B', contact: '0987654321', email: 'supplier_b@email.com', status: 'active' },
    { id: 3, name: 'Nhà cung cấp C', contact: '0901234567', email: 'supplier_c@email.com', status: 'inactive' },
  ]);
  const [showImportForm, setShowImportForm] = useState(false);
  const [newImport, setNewImport] = useState({
    sku: '',
    quantity: '',
    supplier: '',
    note: ''
  });

  // ==================== CALCULATIONS ====================

  const inventoryStats = useMemo(() => {
    const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
    const lowStockItems = inventory.filter(item => item.quantity < item.minQuantity);
    const outOfStockItems = inventory.filter(item => item.quantity === 0);
    const totalValue = 0; // Cần thêm giá để tính

    return {
      totalItems,
      lowStockItems: lowStockItems.length,
      outOfStockItems: outOfStockItems.length,
      totalValue,
      categories: inventory.length
    };
  }, [inventory]);

  const lowStockList = inventory.filter(item => item.quantity < item.minQuantity);

  const handleAddImport = () => {
    if (newImport.sku && newImport.quantity && newImport.supplier) {
      const item = inventory.find(i => i.sku === newImport.sku);
      if (item) {
        setInventory(inventory.map(i =>
          i.sku === newImport.sku
            ? { ...i, quantity: i.quantity + parseInt(newImport.quantity) }
            : i
        ));

        setTransactions([{
          id: transactions.length + 1,
          date: new Date().toISOString().split('T')[0],
          type: 'import',
          sku: newImport.sku,
          qty: parseInt(newImport.quantity),
          from: newImport.supplier,
          note: newImport.note
        }, ...transactions]);

        setNewImport({ sku: '', quantity: '', supplier: '', note: '' });
        setShowImportForm(false);
      }
    }
  };

  // ==================== RENDER FUNCTIONS ====================

  const renderOverview = () => (
    <div>
      <h3 style={styles.sectionTitle || {}}>📦 Tổng Quan Kho Hàng</h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{
          background: '#f0f7ff',
          padding: '20px',
          borderRadius: '8px',
          border: '2px solid #3498db',
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>Tổng Sản Phẩm</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3498db' }}>
            {inventoryStats.totalItems}
          </div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
            {inventoryStats.categories} loại hàng
          </div>
        </div>

        <div style={{
          background: '#fff5f0',
          padding: '20px',
          borderRadius: '8px',
          border: '2px solid #e74c3c',
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>Hàng Cảnh Báo</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#e74c3c' }}>
            {inventoryStats.lowStockItems}
          </div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
            Sắp hết hàng
          </div>
        </div>

        <div style={{
          background: '#f0fff4',
          padding: '20px',
          borderRadius: '8px',
          border: '2px solid #27ae60',
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>Hàng Tốt</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#27ae60' }}>
            {inventoryStats.categories - inventoryStats.lowStockItems}
          </div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
            Đủ tồn kho
          </div>
        </div>

        <div style={{
          background: '#fdf8f0',
          padding: '20px',
          borderRadius: '8px',
          border: '2px solid #f39c12',
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>Hết Hàng</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f39c12' }}>
            {inventoryStats.outOfStockItems}
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockList.length > 0 && (
        <div style={{
          background: '#fff3cd',
          border: '2px solid #ffc107',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#856404' }}>
            ⚠️ Cảnh Báo: {lowStockList.length} sản phẩm sắp hết hàng
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#856404' }}>
            {lowStockList.map(item => (
              <li key={item.id} style={{ marginBottom: '5px', fontSize: '13px' }}>
                <strong>{item.name}</strong> (tồn: {item.quantity}, mục tiêu: {item.minQuantity})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderProducts = () => (
    <div>
      <h3 style={styles.sectionTitle || {}}>📋 Danh Sách Sản Phẩm</h3>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '13px',
      }}>
        <thead>
          <tr style={{ background: '#ecf0f1' }}>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Tên Sản Phẩm</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>SKU</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Tồn Kho</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Mục Tiêu</th>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Vị Trí</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, idx) => {
            const status = item.quantity === 0 ? 'out' : item.quantity < item.minQuantity ? 'low' : 'good';
            return (
              <tr key={idx} style={{ borderBottom: '1px solid #ecf0f1' }}>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>{item.name}</td>
                <td style={{ padding: '10px', textAlign: 'center', fontSize: '11px', color: '#666' }}>
                  {item.sku}
                </td>
                <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                  {item.quantity} {item.unit}
                </td>
                <td style={{ padding: '10px', textAlign: 'center', color: '#666' }}>
                  {item.minQuantity} {item.unit}
                </td>
                <td style={{ padding: '10px' }}>
                  <span style={{
                    background: '#e3f2fd',
                    color: '#1976d2',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}>
                    {item.location}
                  </span>
                </td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <span style={{
                    background: status === 'good' ? '#d4edda' : status === 'low' ? '#fff3cd' : '#f8d7da',
                    color: status === 'good' ? '#155724' : status === 'low' ? '#856404' : '#721c24',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}>
                    {status === 'good' ? '✓ Tốt' : status === 'low' ? '⚠ Cảnh báo' : '✗ Hết'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderTransactions = () => (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={styles.sectionTitle || {}}>📤 Lịch Sử Giao Dịch</h3>
        <button
          onClick={() => setShowImportForm(!showImportForm)}
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
          + Nhập Hàng
        </button>
      </div>

      {showImportForm && (
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '2px solid #ecf0f1'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '15px' }}>
            <select
              value={newImport.sku}
              onChange={(e) => setNewImport({ ...newImport, sku: e.target.value })}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #bdc3c7',
                fontSize: '13px'
              }}
            >
              <option value="">Chọn sản phẩm</option>
              {inventory.map(item => (
                <option key={item.id} value={item.sku}>
                  {item.name} ({item.sku})
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Số lượng"
              value={newImport.quantity}
              onChange={(e) => setNewImport({ ...newImport, quantity: e.target.value })}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #bdc3c7',
                fontSize: '13px'
              }}
            />
            <select
              value={newImport.supplier}
              onChange={(e) => setNewImport({ ...newImport, supplier: e.target.value })}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #bdc3c7',
                fontSize: '13px'
              }}
            >
              <option value="">Chọn nhà cung cấp</option>
              {suppliers.map(sup => (
                <option key={sup.id} value={sup.name}>
                  {sup.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Ghi chú"
              value={newImport.note}
              onChange={(e) => setNewImport({ ...newImport, note: e.target.value })}
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
              onClick={handleAddImport}
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
              onClick={() => setShowImportForm(false)}
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
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Ngày</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Loại</th>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>SKU</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Số Lượng</th>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Từ/Đến</th>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Ghi Chú</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((trans, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #ecf0f1' }}>
              <td style={{ padding: '10px', fontSize: '12px' }}>{trans.date}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <span style={{
                  background: trans.type === 'import' ? '#d4edda' : trans.type === 'export' ? '#f8d7da' : '#fff3cd',
                  color: trans.type === 'import' ? '#155724' : trans.type === 'export' ? '#721c24' : '#856404',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  {trans.type === 'import' ? 'Nhập' : trans.type === 'export' ? 'Xuất' : 'Điều Chỉnh'}
                </span>
              </td>
              <td style={{ padding: '10px', fontSize: '11px', color: '#666' }}>{trans.sku}</td>
              <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                {trans.qty}
              </td>
              <td style={{ padding: '10px', fontSize: '12px' }}>
                {trans.from || trans.to}
              </td>
              <td style={{ padding: '10px', fontSize: '12px', color: '#666' }}>
                {trans.note}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderSuppliers = () => (
    <div>
      <h3 style={styles.sectionTitle || {}}>🤝 Nhà Cung Cấp</h3>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '13px',
      }}>
        <thead>
          <tr style={{ background: '#ecf0f1' }}>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Tên Nhà Cung Cấp</th>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Liên Hệ</th>
            <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Email</th>
            <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((sup, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #ecf0f1' }}>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{sup.name}</td>
              <td style={{ padding: '10px', fontSize: '12px' }}>{sup.contact}</td>
              <td style={{ padding: '10px', fontSize: '12px', color: '#3498db' }}>
                {sup.email}
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <span style={{
                  background: sup.status === 'active' ? '#d4edda' : '#f8d7da',
                  color: sup.status === 'active' ? '#155724' : '#721c24',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  {sup.status === 'active' ? '✓ Hoạt Động' : '✗ Nghỉ'}
                </span>
              </td>
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
          { id: 'overview', label: '📦 Tổng Quan' },
          { id: 'products', label: '📋 Sản Phẩm' },
          { id: 'transactions', label: '📤 Giao Dịch' },
          { id: 'suppliers', label: '🤝 Nhà Cung Cấp' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setInventoryTab(tab.id)}
            style={{
              padding: '10px 15px',
              background: inventoryTab === tab.id ? '#3498db' : 'transparent',
              color: inventoryTab === tab.id ? 'white' : '#666',
              border: inventoryTab === tab.id ? 'none' : '1px solid #ecf0f1',
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
      {inventoryTab === 'overview' && renderOverview()}
      {inventoryTab === 'products' && renderProducts()}
      {inventoryTab === 'transactions' && renderTransactions()}
      {inventoryTab === 'suppliers' && renderSuppliers()}
    </div>
  );
};

export default InventorySection;
