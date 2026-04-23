# 💳 HƯỚNG DẪN THANH TOÁN CHUYỂN KHOẢN

## 🎯 Tổng Quan
Hệ thống thanh toán chuyển khoản chuyên nghiệp cho cửa hàng Spa với xác nhận bằng ảnh chụp màn hình.

---

## 🏦 THÔNG TIN TÀI KHOẢN NGÂN HÀNG

| Thông tin | Chi tiết |
|-----------|---------|
| **Chủ tài khoản** | DINH KHAC HUNG |
| **Số tài khoản** | 19020343846012 |
| **Ngân hàng** | TECHCOMBANK |
| **Mã ngân hàng** | TCB |

---

## 📱 QUY TRÌNH THANH TOÁN

### Bước 1: Chọn sản phẩm
```
1. Vào app khách hàng → "🛒 Cửa hàng"
2. Chọn sản phẩm muốn mua
3. Click nút "💳 Thanh toán"
```

### Bước 2: Xem thông tin thanh toán
```
Modal hiển thị:
✅ Tên sản phẩm & giá tiền
✅ Thông tin tài khoản ngân hàng đầy đủ
✅ Hướng dẫn chuyển khoản chi tiết
✅ Khu vực tải lên ảnh xác nhận
```

### Bước 3: Chuyển khoản
```
1. Mở app ngân hàng hoặc website
2. Chọn "Chuyển khoản" / "Gửi tiền"
3. Nhập thông tin tài khoản (có thể copy từ modal)
4. Số tiền: Theo giá sản phẩm
5. Nội dung: "Tên sản phẩm - Spa"
6. Xác nhận chuyển khoản
```

### Bước 4: Tải lên ảnh xác nhận
```
1. Chụp màn hình xác nhận chuyển khoản
2. Click "📱 Click để chọn ảnh chụp màn hình"
3. Chọn file ảnh từ thiết bị
4. Xem preview ảnh đã tải lên
5. Click "✅ HOÀN TẤT THANH TOÁN"
```

### Bước 5: Hoàn tất
```
✅ Đơn hàng được tạo với status "pending_payment"
✅ Thông báo: "Đơn hàng đã được tạo! Chúng tôi sẽ xác nhận thanh toán trong vòng 24h"
✅ Đơn hàng lưu localStorage & Supabase
```

---

## 🔧 CHI TIẾT KỸ THUẬT

### Component Mới
- **[src/components/PaymentModal.jsx](src/components/PaymentModal.jsx)**: Modal thanh toán chuyên nghiệp
- **Features**:
  - Hiển thị thông tin tài khoản với nút Copy
  - Hướng dẫn chuyển khoản chi tiết
  - Upload ảnh xác nhận
  - Preview ảnh trước khi submit
  - Validation bắt buộc upload ảnh

### Cập Nhật Store.jsx
- **[src/pages/Customer/Store.jsx](src/pages/Customer/Store.jsx)**
- **Thay đổi**:
  - Import PaymentModal
  - Thêm state: `showPaymentModal`, `selectedProduct`
  - `handleBuy()`: Hiển thị modal thay vì mua trực tiếp
  - `handlePaymentConfirm()`: Xử lý thanh toán với ảnh proof
  - Nút "Mua ngay" → "💳 Thanh toán"

### Cấu Trúc Đơn Hàng
```javascript
{
  customer_name: 'Khách hàng văng lai',
  customer_phone: '',
  order_type: 'product',
  item_id: selectedProduct.id,
  item_name: selectedProduct.name,
  quantity: 1,
  total_price: selectedProduct.price,
  reward_points: selectedProduct.points,
  payment_method: 'bank_transfer',        // ← Mới
  payment_proof: base64ImageString,       // ← Mới
  status: 'pending_payment',              // ← Mới
  order_date: '2026-04-22',
  notes: 'Đơn hàng từ cửa hàng - Chờ xác nhận thanh toán',
  created_at: '2026-04-22T...'
}
```

### Database Schema
```sql
-- Bảng online_orders (đã tồn tại)
payment_method text,      -- 'bank_transfer'
payment_proof text,       -- Base64 image string
status text,              -- 'pending_payment'
```

---

## 🎨 GIAO DIỆN MODAL THANH TOÁN

### Header
```
💳 THANH TOÁN CHUYỂN KHOẢN
```

### Thông Tin Sản Phẩm
```
🧴 Serum Vitamin C
550.000đ
```

### Thông Tin Ngân Hàng
```
🏦 THÔNG TIN TÀI KHOẢN NGÂN HÀNG

Chủ tài khoản: DINH KHAC HUNG [Copy]
Số tài khoản: 19020343846012 [Copy]
Ngân hàng: TECHCOMBANK [Copy]
Mã ngân hàng: TCB [Copy]
```

### Hướng Dẫn
```
📋 HƯỚNG DẪN CHUYỂN KHOẢN

1. Mở app ngân hàng hoặc truy cập website ngân hàng của bạn
2. Chọn chức năng "Chuyển khoản" hoặc "Gửi tiền"
3. Nhập thông tin tài khoản bên trên
4. Nhập số tiền: 550.000đ
5. Nội dung: "Serum Vitamin C - Spa"
6. Chụp màn hình xác nhận chuyển khoản
7. Tải ảnh lên bên dưới để hoàn tất
```

### Upload Ảnh
```
📸 TẢI LÊN ẢNH CHỤP MÀN HÌNH CHUYỂN KHOẢN

[📱 Click để chọn ảnh chụp màn hình]

[Preview ảnh sau khi upload]
```

### Action Buttons
```
[✅ HOÀN TẤT THANH TOÁN] [❌ HỦY BỎ]
```

---

## 🔄 TRẠNG THÁI ĐƠN HÀNG

| Status | Ý Nghĩa | Mô tả |
|--------|---------|-------|
| `pending_payment` | Chờ xác nhận thanh toán | Khách đã upload ảnh, chờ admin duyệt |
| `confirmed` | Đã xác nhận | Admin đã kiểm tra và xác nhận thanh toán |
| `processing` | Đang xử lý | Đơn hàng đang được chuẩn bị |
| `shipped` | Đã giao | Đơn hàng đã gửi cho khách |
| `completed` | Hoàn thành | Khách đã nhận hàng |
| `cancelled` | Đã hủy | Đơn hàng bị hủy |

---

## 📋 QUY TRÌNH XỬ LÝ CHO ADMIN

### 1. Nhận Đơn Hàng
```
- Đơn hàng mới với status = 'pending_payment'
- Có payment_proof (ảnh chụp màn hình)
```

### 2. Kiểm Tra Thanh Toán
```
- Xem ảnh payment_proof
- Kiểm tra số tiền, nội dung chuyển khoản
- Verify với lịch sử giao dịch ngân hàng
```

### 3. Xác Nhận / Từ Chối
```
✅ Xác nhận: status = 'confirmed'
❌ Từ chối: status = 'cancelled' + ghi chú lý do
```

### 4. Xử Lý Đơn Hàng
```
- confirmed → processing → shipped → completed
- Thông báo cho khách qua app/email
```

---

## 🛡️ BẢO MẬT & XÁC THỰC

### Validation
- ✅ **Bắt buộc upload ảnh** trước khi submit
- ✅ **Kiểm tra file type**: Chỉ chấp nhận image/*
- ✅ **Preview ảnh** trước khi xác nhận
- ✅ **Base64 encoding** cho lưu trữ

### Bảo Mật
- 🔒 **Không lưu thông tin thẻ tín dụng**
- 🔒 **Chỉ lưu ảnh chụp màn hình** (không lưu thông tin ngân hàng)
- 🔒 **Xác thực thủ công** bởi admin
- 🔒 **Không tự động trừ tiền**

---

## 🚀 CÁCH SỬ DỤNG

### Cho Khách Hàng
```
1. Vào cửa hàng → Chọn sản phẩm
2. Click "💳 Thanh toán"
3. Đọc kỹ hướng dẫn
4. Chuyển khoản theo thông tin
5. Upload ảnh xác nhận
6. Hoàn tất đơn hàng
```

### Cho Admin
```
1. Vào dashboard → Tab "🛒 Đơn hàng online"
2. Xem đơn hàng status "pending_payment"
3. Click xem chi tiết → Xem payment_proof
4. Verify thanh toán
5. Cập nhật status tương ứng
```

---

## 📞 HỖ TRỢ

### Nếu có vấn đề
1. **Không thể upload ảnh**: Kiểm tra định dạng file (JPG/PNG)
2. **Ảnh không hiển thị**: Refresh trang và thử lại
3. **Chuyển khoản thất bại**: Liên hệ hotline ngân hàng
4. **Đơn hàng không tạo**: Kiểm tra kết nối internet

### Liên Hệ
- **Hotline**: Theo thông tin trên modal
- **Email**: support@spa-app.com
- **Chat**: Trong app khách hàng

---

## 📊 THỐNG KÊ & BÁO CÁO

### Metrics Theo Dõi
- **Tỷ lệ chuyển đổi**: Số đơn thanh toán thành công / Tổng đơn
- **Thời gian xử lý**: Từ upload ảnh → xác nhận thanh toán
- **Phương thức thanh toán**: % sử dụng chuyển khoản
- **Lỗi thường gặp**: Upload ảnh, xác nhận thanh toán

---

**Ngày tạo:** 22/04/2026  
**Phiên bản:** v1.0  
**Trạng thái:** ✅ Hoàn thành & Sẵn sàng sử dụng
