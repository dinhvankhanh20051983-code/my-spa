import React, { useEffect, useState } from 'react';

export const SettingsSection = ({ settings, onSaveSettings, styles }) => {
  const [activeTab, setActiveTab] = useState('business');
  const [validationErrors, setValidationErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formValues, setFormValues] = useState({
    spaName: settings.spaName || '',
    address: settings.address || '',
    phone: settings.phone || '',
    footerNote: settings.footerNote || '',
    emailSupport: settings.emailSupport || '',
    referralPoints: settings.referralPoints ?? 0,
    referralStocks: settings.referralStocks ?? 0,
    productPointRate: settings.productPointRate ?? 1,
    packagePointRate: settings.packagePointRate ?? 1,
    defaultBaseSalary: settings.defaultBaseSalary ?? 0,
    defaultServiceComm: settings.defaultServiceComm ?? 0,
    defaultConsultComm: settings.defaultConsultComm ?? 0,
    taxRate: settings.taxRate ?? 0,
    invoicePrefix: settings.invoicePrefix || 'INV',
    id: settings.id
  });

  useEffect(() => {
    setFormValues(prev => ({
      ...prev,
      spaName: settings.spaName || prev.spaName || '',
      address: settings.address || prev.address || '',
      phone: settings.phone || prev.phone || '',
      footerNote: settings.footerNote || prev.footerNote || '',
      emailSupport: settings.emailSupport || prev.emailSupport || '',
      referralPoints: settings.referralPoints ?? prev.referralPoints ?? 0,
      referralStocks: settings.referralStocks ?? prev.referralStocks ?? 0,
      productPointRate: settings.productPointRate ?? prev.productPointRate ?? 1,
      packagePointRate: settings.packagePointRate ?? prev.packagePointRate ?? 1,
      defaultBaseSalary: settings.defaultBaseSalary ?? prev.defaultBaseSalary ?? 0,
      defaultServiceComm: settings.defaultServiceComm ?? prev.defaultServiceComm ?? 0,
      defaultConsultComm: settings.defaultConsultComm ?? prev.defaultConsultComm ?? 0,
      taxRate: settings.taxRate ?? prev.taxRate ?? 0,
      invoicePrefix: settings.invoicePrefix || prev.invoicePrefix || 'INV',
      id: settings.id || prev.id
    }));
  }, [settings]);

  const validateForm = (formData) => {
    const errors = {};
    
    if (!formData.spaName?.trim()) errors.spaName = 'Tên SPA không được để trống';
    if (!formData.address?.trim()) errors.address = 'Địa chỉ không được để trống';
    if (!formData.phone?.trim()) errors.phone = 'Số điện thoại không được để trống';
    if (!/^\d{10}/.test(formData.phone?.replace(/\D/g, '') || '')) {
      errors.phone = 'Số điện thoại phải có ít nhất 10 chữ số';
    }
    if (formData.emailSupport && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailSupport)) {
      errors.emailSupport = 'Email không hợp lệ';
    }
    
    if (Number(formData.referralPoints || 0) < 0) errors.referralPoints = 'Điểm không thể âm';
    if (Number(formData.referralStocks || 0) < 0) errors.referralStocks = 'Cổ phần không thể âm';
    if (Number(formData.productPointRate || 0) < 0) errors.productPointRate = 'Tỷ lệ không thể âm';
    if (Number(formData.packagePointRate || 0) < 0) errors.packagePointRate = 'Tỷ lệ không thể âm';
    if (Number(formData.defaultBaseSalary || 0) < 0) errors.defaultBaseSalary = 'Lương không thể âm';
    if (Number(formData.taxRate || 0) < 0 || Number(formData.taxRate || 0) > 100) {
      errors.taxRate = 'Tỷ lệ thuế phải từ 0-100%';
    }
    
    return errors;
  };

  const handleInputChange = (field, value) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    const cleanedForm = {
      id: settings.id,
      spaName: formValues.spaName?.trim() || '',
      address: formValues.address?.trim() || '',
      phone: formValues.phone?.trim() || '',
      footerNote: formValues.footerNote?.trim() || '',
      emailSupport: formValues.emailSupport?.trim() || '',
      referralPoints: Number(formValues.referralPoints ?? 0),
      referralStocks: Number(formValues.referralStocks ?? 0),
      productPointRate: Number(formValues.productPointRate ?? 1),
      packagePointRate: Number(formValues.packagePointRate ?? 1),
      defaultBaseSalary: Number(formValues.defaultBaseSalary ?? 0),
      defaultServiceComm: Number(formValues.defaultServiceComm ?? 0),
      defaultConsultComm: Number(formValues.defaultConsultComm ?? 0),
      taxRate: Number(formValues.taxRate ?? 0),
      invoicePrefix: formValues.invoicePrefix?.trim() || 'INV'
    };

    const errors = validateForm(cleanedForm);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    const saved = await onSaveSettings(cleanedForm);
    if (saved) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const tabStyle = (isActive) => ({
    padding: '12px 20px',
    margin: '0 5px',
    border: 'none',
    background: isActive ? '#0ea5e9' : '#1e293b',
    color: '#fff',
    cursor: 'pointer',
    borderRadius: '8px 8px 0 0',
    fontWeight: isActive ? 'bold' : 'normal',
    transition: 'all 0.3s'
  });

  const inputGroupStyle = {
    marginBottom: '15px'
  };

  const errorStyle = {
    color: '#ef4444',
    fontSize: '12px',
    marginTop: '4px'
  };

  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>⚙️ CÀI ĐẶT HỆ THỐNG</h3>
      
      {saveSuccess && (
        <div style={{
          padding: '12px 20px',
          backgroundColor: '#10b981',
          color: '#fff',
          borderRadius: '8px',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          ✅ Đã lưu cấu hình thành công!
        </div>
      )}

      <div style={styles.card}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid #334155', marginBottom: '0' }}>
          <button
            onClick={() => setActiveTab('business')}
            style={tabStyle(activeTab === 'business')}
          >
            🏢 Thông Tin Kinh Doanh
          </button>
          <button
            onClick={() => setActiveTab('referral')}
            style={tabStyle(activeTab === 'referral')}
          >
            👥 Giới Thiệu & Điểm
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            style={tabStyle(activeTab === 'pricing')}
          >
            💰 Giá & Lương
          </button>
          <button
            onClick={() => setActiveTab('invoice')}
            style={tabStyle(activeTab === 'invoice')}
          >
            🧾 Hóa Đơn
          </button>
        </div>

        <form onSubmit={handleUpdateSettings} style={{ display: 'grid', gap: '20px', padding: '20px' }}>
          {/* Business Info Tab */}
          {activeTab === 'business' && (
            <>
              <div style={inputGroupStyle}>
                <label style={styles.label}>🏠 TÊN SPA</label>
                <input
                  name="spaName"
                  value={formValues.spaName || ''}
                  onChange={(e) => handleInputChange('spaName', e.target.value)}
                  style={{
                    ...styles.input,
                    borderColor: validationErrors.spaName ? '#ef4444' : undefined
                  }}
                  required
                />
                {validationErrors.spaName && <div style={errorStyle}>{validationErrors.spaName}</div>}
              </div>

              <div style={inputGroupStyle}>
                <label style={styles.label}>📍 ĐỊA CHỈ</label>
                <input
                  name="address"
                  value={formValues.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  style={{
                    ...styles.input,
                    borderColor: validationErrors.address ? '#ef4444' : undefined
                  }}
                  required
                />
                {validationErrors.address && <div style={errorStyle}>{validationErrors.address}</div>}
              </div>

              <div style={styles.grid2}>
                <div>
                  <label style={styles.label}>📞 SỐ ĐIỆN THOẠI</label>
                  <input
                    name="phone"
                    value={formValues.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    style={{
                      ...styles.input,
                      borderColor: validationErrors.phone ? '#ef4444' : undefined
                    }}
                    required
                  />
                  {validationErrors.phone && <div style={errorStyle}>{validationErrors.phone}</div>}
                </div>
                <div>
                  <label style={styles.label}>✉️ EMAIL HỖ TRỢ</label>
                  <input
                    name="emailSupport"
                    type="email"
                    value={formValues.emailSupport || ''}
                    onChange={(e) => handleInputChange('emailSupport', e.target.value)}
                    style={{
                      ...styles.input,
                      borderColor: validationErrors.emailSupport ? '#ef4444' : undefined
                    }}
                  />
                  {validationErrors.emailSupport && <div style={errorStyle}>{validationErrors.emailSupport}</div>}
                </div>
              </div>

              <div style={inputGroupStyle}>
                <label style={styles.label}>💬 LỜI CHÀO DỪI HÓA ĐƠN</label>
                <textarea
                  name="footerNote"
                  value={formValues.footerNote || ''}
                  onChange={(e) => handleInputChange('footerNote', e.target.value)}
                  style={{
                    ...styles.input,
                    minHeight: '80px',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Nhập lời chào, cảm ơn khách hàng..."
                />
              </div>
            </>
          )}

          {/* Referral Tab */}
          {activeTab === 'referral' && (
            <>
              <div style={{
                padding: '15px',
                backgroundColor: '#1e293b',
                borderRadius: '8px',
                marginBottom: '15px'
              }}>
                <p style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '13px' }}>
                  ℹ️ Cấu hình các thông số liên quan đến hệ thống giới thiệu khách hàng và điểm thưởng
                </p>
              </div>

              <div style={styles.grid2}>
                <div>
                  <label style={styles.label}>⭐ ĐIỂM THƯỞNG GIỚI THIỆU</label>
                  <input
                    name="referralPoints"
                    type="number"
                    min="0"
                    value={formValues.referralPoints ?? 0}
                    onChange={(e) => handleInputChange('referralPoints', e.target.value)}
                    style={{
                      ...styles.input,
                      borderColor: validationErrors.referralPoints ? '#ef4444' : undefined
                    }}
                  />
                  <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                    Điểm thưởng khi giới thiệu 1 khách hàng
                  </p>
                  {validationErrors.referralPoints && <div style={errorStyle}>{validationErrors.referralPoints}</div>}
                </div>
                <div>
                  <label style={styles.label}>📈 CỔ PHẦN KHI GIỚI THIỆU</label>
                  <input
                    name="referralStocks"
                    type="number"
                    min="0"
                    value={formValues.referralStocks ?? 0}
                    onChange={(e) => handleInputChange('referralStocks', e.target.value)}
                    style={{
                      ...styles.input,
                      borderColor: validationErrors.referralStocks ? '#ef4444' : undefined
                    }}
                  />
                  <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                    Cổ phần tích lũy khi giới thiệu
                  </p>
                  {validationErrors.referralStocks && <div style={errorStyle}>{validationErrors.referralStocks}</div>}
                </div>
              </div>

              <div style={styles.grid2}>
                <div>
                  <label style={styles.label}>🎁 TỶ LỆ ĐIỂM SẢN PHẨM</label>
                  <input
                    name="productPointRate"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formValues.productPointRate ?? 1}
                    onChange={(e) => handleInputChange('productPointRate', e.target.value)}
                    style={{
                      ...styles.input,
                      borderColor: validationErrors.productPointRate ? '#ef4444' : undefined
                    }}
                  />
                  <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                    Nhân số tiền / tỷ lệ này = Điểm (mua hàng)
                  </p>
                  {validationErrors.productPointRate && <div style={errorStyle}>{validationErrors.productPointRate}</div>}
                </div>
                <div>
                  <label style={styles.label}>🎯 TỶ LỆ ĐIỂM GÓI DỊCH VỤ</label>
                  <input
                    name="packagePointRate"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formValues.packagePointRate ?? 1}
                    onChange={(e) => handleInputChange('packagePointRate', e.target.value)}
                    style={{
                      ...styles.input,
                      borderColor: validationErrors.packagePointRate ? '#ef4444' : undefined
                    }}
                  />
                  <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                    Nhân số tiền / tỷ lệ này = Điểm (gói dịch vụ)
                  </p>
                  {validationErrors.packagePointRate && <div style={errorStyle}>{validationErrors.packagePointRate}</div>}
                </div>
              </div>
            </>
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <>
              <div style={{
                padding: '15px',
                backgroundColor: '#1e293b',
                borderRadius: '8px',
                marginBottom: '15px'
              }}>
                <p style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '13px' }}>
                  ℹ️ Cấu hình lương cơ bản và hoa hồng mặc định cho nhân viên
                </p>
              </div>

              <div style={styles.grid2}>
                <div>
                  <label style={styles.label}>💵 LƯƠNG CƠ BẢN MẶC ĐỊNH</label>
                  <input
                    name="defaultBaseSalary"
                    type="number"
                    min="0"
                    value={formValues.defaultBaseSalary ?? 0}
                    onChange={(e) => handleInputChange('defaultBaseSalary', e.target.value)}
                    style={{
                      ...styles.input,
                      borderColor: validationErrors.defaultBaseSalary ? '#ef4444' : undefined
                    }}
                  />
                  <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                    Áp dụng cho nhân viên mới
                  </p>
                  {validationErrors.defaultBaseSalary && <div style={errorStyle}>{validationErrors.defaultBaseSalary}</div>}
                </div>
              </div>

              <div style={styles.grid2}>
                <div>
                  <label style={styles.label}>🤝 HOA HỒNG DỊCH VỤ MẶC ĐỊNH (%)</label>
                  <input
                    name="defaultServiceComm"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formValues.defaultServiceComm ?? 0}
                    onChange={(e) => handleInputChange('defaultServiceComm', e.target.value)}
                    style={styles.input}
                  />
                  <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                    Phần trăm doanh thu dịch vụ
                  </p>
                </div>
                <div>
                  <label style={styles.label}>📞 HOA HỒNG TƯ VẤN MẶC ĐỊNH (%)</label>
                  <input
                    name="defaultConsultComm"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formValues.defaultConsultComm ?? 0}
                    onChange={(e) => handleInputChange('defaultConsultComm', e.target.value)}
                    style={styles.input}
                  />
                  <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                    Phần trăm doanh thu tư vấn
                  </p>
                </div>
              </div>

              <div style={inputGroupStyle}>
                <label style={styles.label}>🧾 TỶ LỆ THUẾ (%)</label>
                <input
                  name="taxRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formValues.taxRate ?? 0}
                  onChange={(e) => handleInputChange('taxRate', e.target.value)}
                  style={{
                    ...styles.input,
                    borderColor: validationErrors.taxRate ? '#ef4444' : undefined
                  }}
                />
                {validationErrors.taxRate && <div style={errorStyle}>{validationErrors.taxRate}</div>}
              </div>
            </>
          )}

          {/* Invoice Tab */}
          {activeTab === 'invoice' && (
            <>
              <div style={{
                padding: '15px',
                backgroundColor: '#1e293b',
                borderRadius: '8px',
                marginBottom: '15px'
              }}>
                <p style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '13px' }}>
                  ℹ️ Cấu hình định dạng hóa đơn và biên lai
                </p>
              </div>

              <div style={inputGroupStyle}>
                <label style={styles.label}>📋 TIỀN TỐ HÓA ĐƠN</label>
                <input
                  name="invoicePrefix"
                  value={formValues.invoicePrefix || 'INV'}
                  onChange={(e) => handleInputChange('invoicePrefix', e.target.value)}
                  style={styles.input}
                  placeholder="VD: INV, LS, HOA_DON..."
                />
                <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                  Ví dụ: {(formValues.invoicePrefix || 'INV')}-001 (tiền tố + số đơn hàng)
                </p>
              </div>

              <div style={{
                padding: '15px',
                backgroundColor: '#0f172a',
                borderRadius: '8px',
                border: '1px solid #334155'
              }}>
                <h4 style={{ color: '#94a3b8', marginTop: 0 }}>📌 Xem trước định dạng:</h4>
                <p style={{ margin: '10px 0', fontFamily: 'monospace', color: '#cbd5e1' }}>
                  {(formValues.invoicePrefix || 'INV')}-000001
                </p>
              </div>
            </>
          )}

          <button
            type="submit"
            style={{
              ...styles.btnPrimary,
              width: '100%',
              padding: '15px',
              marginTop: '10px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            💾 LƯU CẤU HÌNH
          </button>
        </form>
      </div>

      {/* Preview Card */}
      <div style={{
        marginTop: '30px',
        padding: '25px',
        backgroundColor: '#0f172a',
        borderRadius: '15px',
        border: '1px dashed #334155'
      }}>
        <h4 style={{ color: '#94a3b8', marginTop: 0, marginBottom: '15px' }}>📊 Xem trước thông tin SPA:</h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '15px'
        }}>
          <div style={{ padding: '10px', backgroundColor: '#1e293b', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '12px' }}>🏠 Tên SPA</p>
            <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 'bold' }}>{formValues.spaName}</p>
          </div>
          <div style={{ padding: '10px', backgroundColor: '#1e293b', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '12px' }}>📍 Địa chỉ</p>
            <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 'bold' }}>{formValues.address}</p>
          </div>
          <div style={{ padding: '10px', backgroundColor: '#1e293b', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '12px' }}>📞 Điện thoại</p>
            <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 'bold' }}>{formValues.phone}</p>
          </div>
          <div style={{ padding: '10px', backgroundColor: '#1e293b', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '12px' }}>✉️ Email</p>
            <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 'bold' }}>{formValues.emailSupport || 'Chưa cấu hình'}</p>
          </div>
          <div style={{ padding: '10px', backgroundColor: '#1e293b', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '12px' }}>⭐ Điểm giới thiệu</p>
            <p style={{ margin: 0, color: '#10b981', fontWeight: 'bold' }}>{formValues.referralPoints} điểm</p>
          </div>
          <div style={{ padding: '10px', backgroundColor: '#1e293b', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '12px' }}>🧾 Tiền tố hóa đơn</p>
            <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 'bold' }}>{formValues.invoicePrefix || 'INV'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
