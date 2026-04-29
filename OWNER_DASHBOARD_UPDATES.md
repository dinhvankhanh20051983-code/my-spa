# SPA Owner Dashboard - Professional Edition 🎉

## Các Tính Năng Mới Được Thêm Vào

### 1. 📊 Analytics Section (Phân Tích)
- **Revenue Analytics**: Phân tích doanh thu chi tiết từ lịch hẹn và đơn hàng online
- **Customer Analytics**: Thống kê khách hàng, tỷ lệ giữ chân, giá trị vòng đời (CLV)
- **Staff Performance**: Hiệu suất nhân viên, số lịch, doanh thu, rating
- **Package Analytics**: Phân tích độ phổ biến của các gói dịch vụ
- **Product Analytics**: Thống kê bán hàng sản phẩm lẻ, tồn kho

### 2. 🎯 Marketing Section (Marketing)
- **Promotions Management**: Quản lý khuyến mãi, giảm giá, flash sale
- **Marketing Campaigns**: Tạo và quản lý chiến dịch email/SMS
- **Loyalty Program**: 
  - Quản lý điểm thưởng
  - Cấp độ thành viên (Bronze, Silver, Gold)
  - Cài đặt tỉ lệ điểm và giá trị đổi
  - Theo dõi khách hàng theo cấp độ

### 3. 💳 Financial Section (Tài Chính)
- **Financial Overview**: 
  - Tổng doanh thu, chi phí, lợi nhuận
  - Dòng tiền theo năm
  - Lợi nhuận trước/sau thuế
- **Invoice Management**: Lịch sử hóa đơn, biên lai, trạng thái thanh toán
- **Expense Management**: Quản lý chi phí theo danh mục (Lương, Thuê, Vật tư)
- **Payment Methods**: Theo dõi tiền mặt, chuyển khoản, ví MoMo, thẻ
- **Tax Management**:
  - Tính toán thuế TNDN
  - Quản lý VAT
  - Báo cáo thuế hàng năm

### 4. 👥 HR Section (Nhân Sự)
- **Staff Management**: Thêm/xóa nhân viên, quản lý thông tin cơ bản
- **Attendance Tracking**: Chấm công, tỷ lệ có mặt
- **Payroll Management**:
  - Tính lương cơ bản, phụ cấp, thưởng
  - Tính toán bảo hiểm và thuế
  - Tính lương ròng
  - Quản lý thanh toán lương tháng
- **Performance Evaluation**: Đánh giá hiệu suất nhân viên, rating

### 5. 📦 Inventory Section (Kho Hàng)
- **Inventory Overview**: 
  - Tổng sản phẩm trong kho
  - Cảnh báo hàng sắp hết
  - Hàng hết
- **Product Inventory**: 
  - Danh sách sản phẩm với SKU
  - Tồn kho, mục tiêu tồn kho
  - Vị trí lưu trữ
  - Trạng thái (Tốt, Cảnh báo, Hết)
- **Transaction History**: 
  - Lịch sử nhập hàng
  - Lịch sử xuất hàng
  - Điều chỉnh kho
- **Supplier Management**: Quản lý danh sách nhà cung cấp

---

## Cấu Trúc File

```
src/pages/Owner/sections/
├── AnalyticsSection.jsx      ← 📊 Phân tích
├── MarketingSection.jsx      ← 🎯 Marketing
├── FinancialSection.jsx      ← 💳 Tài chính
├── HRSection.jsx             ← 👥 Nhân sự
├── InventorySection.jsx      ← 📦 Kho hàng
└── index.js                  ← Export tất cả sections
```

---

## Cách Sử Dụng

### Truy Cập Các Tính Năng Mới

1. **Analytics**: Nhấn menu "📊 Phân Tích" trên sidebar
   - Xem biểu đồ doanh thu
   - Phân tích khách hàng
   - Hiệu suất nhân viên
   - Phổ biến gói dịch vụ

2. **Marketing**: Nhấn menu "🎯 Marketing" trên sidebar
   - Tạo khuyến mãi mới
   - Quản lý chiến dịch
   - Cài đặt loyalty program

3. **Financial**: Nhấn menu "💳 Tài Chính" trên sidebar
   - Xem tổng quan tài chính
   - Quản lý hóa đơn
   - Theo dõi chi phí
   - Cài đặt thuế

4. **HR**: Nhấn menu "👥 Nhân Sự" trên sidebar
   - Quản lý nhân viên
   - Chấm công
   - Tính lương
   - Đánh giá hiệu suất

5. **Inventory**: Nhấn menu "📦 Kho Hàng" trên sidebar
   - Xem tồn kho
   - Quản lý sản phẩm
   - Lịch sử giao dịch
   - Quản lý nhà cung cấp

---

## Tính Năng Chính

### Analytics
- ✅ Tính toán doanh thu tự động
- ✅ Phân tích khách hàng chi tiết (tổng, hoạt động, trung thành, mới)
- ✅ Hiệu suất nhân viên (số lịch, doanh thu, rating)
- ✅ Phân tích sản phẩm (phổ biến, bán ra, tồn kho)

### Marketing
- ✅ Tạo/xóa khuyến mãi
- ✅ Quản lý cấp độ loyalty (Bronze, Silver, Gold)
- ✅ Cài đặt điểm thưởng
- ✅ Theo dõi chiến dịch marketing

### Financial
- ✅ Tính toán lợi nhuận tự động
- ✅ Quản lý hóa đơn
- ✅ Theo dõi chi phí theo danh mục
- ✅ Tính toán và báo cáo thuế
- ✅ Quản lý nhiều phương thức thanh toán

### HR
- ✅ Thêm/xóa nhân viên
- ✅ Chấm công tự động
- ✅ Tính lương chi tiết (brutto, bảo hiểm, thuế, ròng)
- ✅ Đánh giá hiệu suất

### Inventory
- ✅ Theo dõi tồn kho theo sản phẩm
- ✅ Cảnh báo tự động khi sắp hết hàng
- ✅ Lịch sử nhập/xuất hàng
- ✅ Quản lý nhà cung cấp

---

## Cải Tiến UI/UX

- 🎨 Thiết kế modern với các thẻ màu tương phản
- 📱 Responsive design cho tất cả thiết bị
- 📊 Bảng dữ liệu rõ ràng với phân trang
- 🎯 Navigation tabs trực quan
- ⚡ Tính toán dữ liệu nhanh chóng

---

## Dữ Liệu Mẫu

Tất cả sections đều có dữ liệu mẫu để bạn test ngay:
- 4 nhân viên mẫu
- 3 hóa đơn mẫu
- 4 sản phẩm kho hàng
- Lịch sử giao dịch mẫu
- Cấu hình thuế, lương

---

## Tính Năng Tiếp Theo Có Thể Thêm

- [ ] Export báo cáo PDF/Excel
- [ ] Biểu đồ doanh thu chi tiết
- [ ] Email/SMS integration
- [ ] Payment gateway integration
- [ ] Dashboard widgets tùy chỉnh
- [ ] Dark mode
- [ ] Multi-language support

---

## Build & Deploy

### Build Local
```bash
npm run build
```

### Preview
```bash
npm run preview
```

### Deploy to Vercel
```bash
vercel --prod
```

---

**Ngày cập nhật**: April 29, 2026
**Phiên bản**: Professional Edition v1.0
