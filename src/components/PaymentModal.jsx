import React, { useState } from 'react';

const PaymentModal = ({ product, customerName, customerPhone, onConfirm, onCancel, isLoading }) => {
  const [paymentProof, setPaymentProof] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);

  const transferNote = customerPhone
    ? `${customerName || 'Khách'} - ${product.name} - ${customerPhone}`
    : `${product.name} - ${customerName || 'Khách'}`;

  const bankInfo = {
    accountName: 'DINH KHAC HUNG',
    accountNumber: '19020343846012',
    bankName: 'TECHCOMBANK',
    bankCode: 'TCB'
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
        setPaymentProof(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    if (!paymentProof) {
      alert('Vui lòng tải lên ảnh chụp màn hình chuyển khoản để xác nhận.');
      return;
    }
    onConfirm(paymentProof);
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px'
    },
    modal: {
      backgroundColor: '#1e293b',
      borderRadius: '24px',
      padding: '32px',
      maxWidth: '500px',
      width: '100%',
      border: '2px solid #10b981',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      maxHeight: '90vh',
      overflowY: 'auto'
    },
    header: {
      textAlign: 'center',
      marginBottom: '24px',
      color: '#10b981',
      fontSize: '20px',
      fontWeight: 'bold'
    },
    productInfo: {
      backgroundColor: '#0f172a',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '24px',
      border: '1px solid #334155'
    },
    productTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '8px',
      color: '#fff'
    },
    productPrice: {
      fontSize: '16px',
      color: '#10b981',
      fontWeight: 'bold'
    },
    bankSection: {
      backgroundColor: '#0f172a',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '24px',
      border: '1px solid #334155'
    },
    bankTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: '#fff',
      textAlign: 'center'
    },
    bankDetail: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid #334155',
      color: '#e2e8f0'
    },
    bankLabel: {
      color: '#94a3b8',
      fontSize: '13px'
    },
    bankValue: {
      fontWeight: '600',
      color: '#fff',
      textAlign: 'right',
      fontFamily: 'monospace'
    },
    copyButton: {
      backgroundColor: '#475569',
      border: 'none',
      borderRadius: '6px',
      padding: '4px 8px',
      color: 'white',
      fontSize: '11px',
      cursor: 'pointer',
      marginLeft: '8px'
    },
    instructions: {
      backgroundColor: '#fef3c7',
      border: '1px solid #f59e0b',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '24px',
      color: '#92400e'
    },
    instructionTitle: {
      fontWeight: 'bold',
      marginBottom: '8px',
      color: '#78350f'
    },
    instructionList: {
      margin: 0,
      paddingLeft: '20px'
    },
    instructionItem: {
      marginBottom: '4px',
      fontSize: '13px'
    },
    uploadSection: {
      marginBottom: '24px'
    },
    uploadLabel: {
      display: 'block',
      marginBottom: '8px',
      color: '#fff',
      fontWeight: 'bold'
    },
    uploadArea: {
      border: '2px dashed #475569',
      borderRadius: '12px',
      padding: '20px',
      textAlign: 'center',
      cursor: 'pointer',
      backgroundColor: '#0f172a',
      transition: 'border-color 0.3s'
    },
    uploadAreaHover: {
      borderColor: '#10b981'
    },
    uploadText: {
      color: '#94a3b8',
      marginBottom: '8px'
    },
    uploadButton: {
      backgroundColor: '#10b981',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 16px',
      color: 'white',
      cursor: 'pointer',
      fontSize: '14px'
    },
    previewImage: {
      maxWidth: '100%',
      maxHeight: '200px',
      borderRadius: '8px',
      marginTop: '12px',
      border: '1px solid #334155'
    },
    actionButtons: {
      display: 'flex',
      gap: '12px'
    },
    btnConfirm: {
      flex: 1,
      padding: '16px',
      borderRadius: '12px',
      border: 'none',
      backgroundColor: '#10b981',
      color: 'white',
      fontWeight: 'bold',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      opacity: isLoading ? 0.7 : 1,
      fontSize: '16px'
    },
    btnCancel: {
      flex: 1,
      padding: '16px',
      borderRadius: '12px',
      border: '1px solid #475569',
      backgroundColor: 'transparent',
      color: '#e2e8f0',
      fontWeight: 'bold',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      opacity: isLoading ? 0.7 : 1,
      fontSize: '16px'
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Đã sao chép: ' + text);
  };

  // Only render modal if product exists
  if (!product) return null;

  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          💳 THANH TOÁN CHUYỂN KHOẢN
        </div>
        {customerName && customerPhone && (
          <div style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '16px' }}>
            Đơn hàng của: <strong>{customerName}</strong> • <strong>{customerPhone}</strong>
          </div>
        )}
        <div style={styles.productInfo}>
          <div style={styles.productTitle}>
            {product.img} {product.name}
          </div>
          <div style={styles.productPrice}>
            {product.label}
          </div>
        </div>

        <div style={styles.bankSection}>
          <div style={styles.bankTitle}>
            🏦 THÔNG TIN TÀI KHOẢN NGÂN HÀNG
          </div>

          <div style={styles.bankDetail}>
            <span style={styles.bankLabel}>Chủ tài khoản</span>
            <div>
              <span style={styles.bankValue}>{bankInfo.accountName}</span>
              <button
                style={styles.copyButton}
                onClick={() => copyToClipboard(bankInfo.accountName)}
              >
                Copy
              </button>
            </div>
          </div>

          <div style={styles.bankDetail}>
            <span style={styles.bankLabel}>Số tài khoản</span>
            <div>
              <span style={styles.bankValue}>{bankInfo.accountNumber}</span>
              <button
                style={styles.copyButton}
                onClick={() => copyToClipboard(bankInfo.accountNumber)}
              >
                Copy
              </button>
            </div>
          </div>

          <div style={styles.bankDetail}>
            <span style={styles.bankLabel}>Ngân hàng</span>
            <div>
              <span style={styles.bankValue}>{bankInfo.bankName}</span>
              <button
                style={styles.copyButton}
                onClick={() => copyToClipboard(bankInfo.bankName)}
              >
                Copy
              </button>
            </div>
          </div>

          <div style={{ ...styles.bankDetail, borderBottom: 'none' }}>
            <span style={styles.bankLabel}>Mã ngân hàng</span>
            <div>
              <span style={styles.bankValue}>{bankInfo.bankCode}</span>
              <button
                style={styles.copyButton}
                onClick={() => copyToClipboard(bankInfo.bankCode)}
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        <div style={styles.instructions}>
          <div style={styles.instructionTitle}>
            📋 HƯỚNG DẪN CHUYỂN KHOẢN
          </div>
          <ol style={styles.instructionList}>
            <li style={styles.instructionItem}>Mở app ngân hàng hoặc truy cập website ngân hàng của bạn</li>
            <li style={styles.instructionItem}>Chọn chức năng "Chuyển khoản" hoặc "Gửi tiền"</li>
            <li style={styles.instructionItem}>Nhập thông tin tài khoản bên trên</li>
            <li style={styles.instructionItem}>Nhập số tiền: <strong>{product.price.toLocaleString()}đ</strong></li>
            <li style={styles.instructionItem}>Nội dung chuyển khoản: <strong>"{transferNote}"</strong></li>
            <li style={styles.instructionItem}>Chụp màn hình xác nhận chuyển khoản</li>
            <li style={styles.instructionItem}>Tải ảnh lên bên dưới để hoàn tất</li>
          </ol>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', padding: '12px', backgroundColor: '#111827', borderRadius: '12px', border: '1px solid #334155' }}>
            <span style={{ color: '#cbd5e1', fontSize: '13px' }}>Nội dung chuyển khoản chuẩn</span>
            <button style={styles.copyButton} onClick={() => copyToClipboard(transferNote)}>
              Sao chép nội dung
            </button>
          </div>
        </div>

        <div style={styles.uploadSection}>
          <label style={styles.uploadLabel}>
            📸 TẢI LÊN ẢNH CHỤP MÀN HÌNH CHUYỂN KHOẢN
          </label>
          <div
            style={styles.uploadArea}
            onClick={() => document.getElementById('payment-proof-upload').click()}
          >
            <div style={styles.uploadText}>
              {uploadedImage ? '✅ Đã tải lên ảnh' : '📱 Click để chọn ảnh chụp màn hình'}
            </div>
            <input
              id="payment-proof-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            {uploadedImage && (
              <img
                src={uploadedImage}
                alt="Payment proof"
                style={styles.previewImage}
              />
            )}
          </div>
        </div>

        <div style={styles.actionButtons}>
          <button
            style={styles.btnConfirm}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : '✅ HOÀN TẤT THANH TOÁN'}
          </button>
          <button
            style={styles.btnCancel}
            onClick={onCancel}
            disabled={isLoading}
          >
            ❌ HỦY BỎ
          </button>
        </div>

        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '12px', marginTop: '16px' }}>
          Đơn hàng sẽ được xử lý sau khi xác nhận thanh toán thành công
        </p>
      </div>
    </div>
  );
};

export default PaymentModal;
