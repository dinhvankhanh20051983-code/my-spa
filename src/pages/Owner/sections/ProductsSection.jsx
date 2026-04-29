import React, { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export const ProductsSection = ({ products, styles, onSetModal, onDeleteProduct }) => {
  const [loading, setLoading] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Filter products based on search
  const filteredProducts = products.filter(p =>
    (p.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (p.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'stock') return (b.stock || 0) - (a.stock || 0);
    return 0;
  });

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa sản phẩm này?')) return;
    
    setLoading(productId);
    try {
      await onDeleteProduct(productId);
    } finally {
      setLoading(null);
    }
  };

  const handleEditProduct = (product) => {
    onSetModal({
      show: true,
      type: 'product',
      data: product
    });
  };

  return (
    <div style={styles.section}>
      {/* Header */}
      <div style={styles.flexHeader}>
        <h3 style={styles.sectionTitle}>🧴 SẢN PHẨM & DỊCH VỤ LẺ</h3>
        <button 
          style={styles.btnPrimary} 
          onClick={() => onSetModal({ show: true, type: 'product', data: null })}
        >
          ➕ THÊM MỚI
        </button>
      </div>

      {/* Search & Filter */}
      <div style={{
        display: 'flex',
        gap: '15px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder="🔍 Tìm kiếm sản phẩm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '12px 15px',
            borderRadius: '10px',
            border: '1px solid #334155',
            backgroundColor: '#0f172a',
            color: 'white',
            fontSize: '14px'
          }}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '12px 15px',
            borderRadius: '10px',
            border: '1px solid #334155',
            backgroundColor: '#0f172a',
            color: 'white',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <option value="name">Tên (A-Z)</option>
          <option value="price-high">Giá cao nhất</option>
          <option value="price-low">Giá thấp nhất</option>
          <option value="stock">Tồn kho nhiều nhất</option>
        </select>
      </div>

      {/* Products Table */}
      <div style={styles.tableContainer}>
        <table style={styles.mainTable}>
          <thead style={styles.theadRow}>
            <tr>
              <th style={styles.thStyle}>Tên sản phẩm</th>
              <th style={styles.thStyle}>Mô tả</th>
              <th style={styles.thStyle}>Giá</th>
              <th style={styles.thStyle}>Tồn kho</th>
              <th style={styles.thStyle}>Điểm thưởng</th>
              <th style={styles.thStyle}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={styles.tdStyle}>
                    <div style={{ fontWeight: 'bold', color: '#e2e8f0' }}>
                      {product.name}
                    </div>
                  </td>
                  <td style={styles.tdStyle}>
                    <div style={{ fontSize: '13px', color: '#94a3b8', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {product.description || 'Không có mô tả'}
                    </div>
                  </td>
                  <td style={styles.tdStyle}>
                    <div style={{ fontWeight: 'bold', color: '#10b981' }}>
                      {Number(product.price || 0).toLocaleString()}đ
                    </div>
                  </td>
                  <td style={styles.tdStyle}>
                    <div style={{
                      backgroundColor: (product.stock || 0) > 0 ? '#064e3b22' : '#7f1d1d22',
                      color: (product.stock || 0) > 0 ? '#6ee7b7' : '#fca5a5',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}>
                      {product.stock || 0} cái
                    </div>
                  </td>
                  <td style={styles.tdStyle}>
                    <div style={{ color: '#fbbf24', fontWeight: 'bold' }}>
                      {product.rewardPoints || 0} pts
                    </div>
                  </td>
                  <td style={styles.tdStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEditProduct(product)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          transition: '0.3s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        disabled={loading === product.id}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: loading === product.id ? '#7f1d1d' : '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: loading === product.id ? 'not-allowed' : 'pointer',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          transition: '0.3s',
                          opacity: loading === product.id ? 0.6 : 1
                        }}
                        onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#b91c1c')}
                        onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#dc2626')}
                      >
                        {loading === product.id ? '⏳ Xóa...' : '🗑️ Xóa'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  📦 Không có sản phẩm nào. <br />
                  <button
                    onClick={() => onSetModal({ show: true, type: 'product', data: null })}
                    style={{
                      marginTop: '15px',
                      padding: '10px 20px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    ➕ Thêm sản phẩm đầu tiên
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginTop: '25px'
      }}>
        <div style={{
          padding: '15px',
          backgroundColor: '#0f172a',
          borderRadius: '12px',
          border: '1px solid #334155'
        }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>📦 Tổng sản phẩm</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{products.length}</div>
        </div>

        <div style={{
          padding: '15px',
          backgroundColor: '#0f172a',
          borderRadius: '12px',
          border: '1px solid #334155'
        }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>💰 Tổng giá trị tồn kho</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fbbf24' }}>
            {Number(products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0)).toLocaleString()}đ
          </div>
        </div>

        <div style={{
          padding: '15px',
          backgroundColor: '#0f172a',
          borderRadius: '12px',
          border: '1px solid #334155'
        }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>📊 Tổng tồn kho</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#a78bfa' }}>
            {products.reduce((sum, p) => sum + (p.stock || 0), 0)} cái
          </div>
        </div>
      </div>
    </div>
  );
};
