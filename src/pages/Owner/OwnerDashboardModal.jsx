import React, { useState } from 'react';

export const OwnerDashboardModal = ({ modal, onClose, onSave, styles, data }) => {
  const [searchCustomer, setSearchCustomer] = data.searchCustomer !== undefined ? [data.searchCustomer, data.setSearchCustomer] : useState('');

  if (!modal.show) return null;

  return (
    <div style={styles.overlay}>
      <form style={styles.formBox} onSubmit={onSave}>
        <h3 style={{ color: '#10b981', marginBottom: '20px' }}>THÊM MỚI {modal.type.toUpperCase()}</h3>

        {/* APPOINTMENT FORM */}
        {modal.type === 'appointment' && (
          <>
            <label style={styles.label}>Khách hàng:</label>
            <input
              name="customerName"
              style={styles.input}
              placeholder="Nhập tên hoặc SĐT"
              value={searchCustomer}
              onChange={(e) => setSearchCustomer(e.target.value)}
              required
            />

            <label style={styles.label}>Số điện thoại:</label>
            <input
              name="customerPhone"
              style={styles.input}
              placeholder="0xx xxxx xxxx"
              required
            />

            <label style={styles.label}>Dịch vụ:</label>
            <select name="service" style={styles.input} required>
              <option value="">-- Chọn dịch vụ --</option>
              {data.packages.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              {data.products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select>

            <label style={styles.label}>KTV:</label>
            <select name="ktv" style={styles.input} required>
              <option value="">-- Chọn KTV --</option>
              {data.staffs.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>

            <div style={styles.grid2}>
              <div>
                <label style={styles.label}>Ngày:</label>
                <input name="date" type="date" style={styles.input} required />
              </div>
              <div>
                <label style={styles.label}>Giờ:</label>
                <input name="time" type="time" style={styles.input} required />
              </div>
            </div>

            <label style={styles.label}>Giá (VND):</label>
            <input name="price" type="number" style={styles.input} placeholder="0" />
          </>
        )}

        {/* PRODUCT FORM */}
        {modal.type === 'product' && (
          <>
            <label style={styles.label}>Tên sản phẩm:</label>
            <input name="name" style={styles.input} required />

            <label style={styles.label}>Giá bán (VND):</label>
            <input name="price" type="number" style={styles.input} required />

            <label style={styles.label}>Điểm thưởng:</label>
            <input name="rewardPoints" type="number" style={styles.input} />

            <label style={styles.label}>Tồn kho:</label>
            <input name="stock" type="number" style={styles.input} />
          </>
        )}

        {/* PACKAGE FORM */}
        {modal.type === 'package' && (
          <>
            <label style={styles.label}>Tên gói:</label>
            <input name="name" style={styles.input} required />

            <label style={styles.label}>Số buổi:</label>
            <input name="sessions" type="number" style={styles.input} required />

            <label style={styles.label}>Giá trọn gói (VND):</label>
            <input name="price" type="number" style={styles.input} required />

            <label style={styles.label}>Điểm thưởng:</label>
            <input name="rewardPoints" type="number" style={styles.input} />
          </>
        )}

        {/* CUSTOMER FORM */}
        {modal.type === 'customer' && (
          <>
            <label style={styles.label}>Họ tên:</label>
            <input name="name" style={styles.input} required />

            <label style={styles.label}>Số điện thoại:</label>
            <input name="phone" style={styles.input} required />

            <label style={styles.label}>Mã giới thiệu:</label>
            <input name="referredBy" style={styles.input} placeholder="Nếu có" />
          </>
        )}

        {/* STAFF FORM */}
        {modal.type === 'staff' && (
          <>
            <label style={styles.label}>Họ tên:</label>
            <input name="name" style={styles.input} required />

            <label style={styles.label}>Số điện thoại:</label>
            <input name="phone" style={styles.input} required />

            <label style={styles.label}>Lương cơ bản:</label>
            <input name="baseSalary" type="number" style={styles.input} />

            <div style={styles.grid2}>
              <div>
                <label style={styles.label}>% HH Dịch vụ:</label>
                <input name="serviceComm" type="number" style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>% HH Tư vấn:</label>
                <input name="consultComm" type="number" style={styles.input} />
              </div>
            </div>
          </>
        )}

        {/* TREATMENT FORM */}
        {modal.type === 'treatment' && (
          <>
            <h4 style={{ color: '#10b981' }}>Thêm buổi điều trị cho: {modal.data.name}</h4>
            
            <label style={styles.label}>Ngày thực hiện:</label>
            <input name="date" type="date" style={styles.input} defaultValue={new Date().toISOString().split('T')[0]} required />

            <label style={styles.label}>Dịch vụ:</label>
            <select name="service" style={styles.input} required>
              <option value="">-- Chọn dịch vụ --</option>
              {data.packages.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              {data.products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select>

            <label style={styles.label}>KTV:</label>
            <select name="staff" style={styles.input} required>
              <option value="">-- Chọn KTV --</option>
              {data.staffs.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>

            <label style={styles.label}>Ghi chú:</label>
            <textarea name="note" style={{ ...styles.input, minHeight: '80px' }} required />
          </>
        )}

        {/* IMAGES FORM */}
        {modal.type === 'treatment_images' && (
          <>
            <h4 style={{ color: '#10b981' }}>Cập nhật ảnh buổi: {modal.data.log.date}</h4>

            <label style={styles.label}>Ảnh trước (Before):</label>
            <input name="beforeImage" type="file" accept="image/*" style={styles.input} />

            <label style={styles.label}>Ảnh sau (After):</label>
            <input name="afterImage" type="file" accept="image/*" style={styles.input} />
          </>
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="submit" style={styles.btnPrimaryFull}>✅ XÁC NHẬN</button>
          <button type="button" style={styles.btnCancel} onClick={onClose}>❌ HỦY BỎ</button>
        </div>
      </form>
    </div>
  );
};
