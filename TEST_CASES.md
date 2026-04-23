# 🧪 TEST CASES - HỆ THỐNG LỊCH HẹN v2.0

## 🎯 Mục Đích
Kiểm tra các tính năng mới của hệ thống lịch hẹn trên 3 ứng dụng.

---

## ✅ TEST CASE 1: SỐ ĐIỆN THOẠI BẮT BUỘC (Chủ Tiệm)

### Bước Chuẩn Bị
1. Truy cập: http://localhost:5174/ → Chọn "Chủ Tiệm"
2. Tab: "📅 DANH SÁCH ĐIỀU HÀNH LỊCH HẸN"
3. Click "+ ĐẶT LỊCH MỚI"

### Test Cases

#### 1.1 - Không nhập SĐT
- **Input:**
  - Khách hàng: "Nguyễn Linh"
  - SĐT: "" (trống)
  - Dịch vụ: "Massage Body"
  - KTV: "KTV Thảo"
  - Ngày: "2026-04-23"
  - Giờ: "14:00"
- **Expected:** Alert "Vui lòng nhập đầy đủ tên khách hàng và số điện thoại."
- **Status:** ✅ PASS / ❌ FAIL

#### 1.2 - SĐT < 9 chữ số
- **Input:**
  - Khách hàng: "Nguyễn Linh"
  - SĐT: "090512" (6 chữ)
  - Dịch vụ: "Massage Body"
  - KTV: "KTV Thảo"
- **Expected:** Alert "Số điện thoại phải có ít nhất 9 chữ số."
- **Status:** ✅ PASS / ❌ FAIL

#### 1.3 - SĐT hợp lệ (≥ 9 chữ số)
- **Input:**
  - Khách hàng: "Nguyễn Linh"
  - SĐT: "0905123456"
  - Dịch vụ: "Massage Body"
  - KTV: "KTV Thảo"
  - Ngày: "2026-04-23"
  - Giờ: "14:00"
  - Giá: "900000"
- **Expected:**
  - Alert "Đã lưu lịch hẹn và đồng bộ Supabase"
  - Lịch hẹn xuất hiện trong bảng
  - SĐT hiển thị dưới tên khách
- **Status:** ✅ PASS / ❌ FAIL

#### 1.4 - SĐT với khoảng trắng (được trim)
- **Input:**
  - SĐT: "  0905123456  " (có khoảng trắng)
- **Expected:**
  - Lưu thành công
  - DB lưu "0905123456" (không có khoảng trắng)
- **Status:** ✅ PASS / ❌ FAIL

---

## ✅ TEST CASE 2: MODAL XÁC NHẬN LỊCH (Khách Hàng)

### Bước Chuẩn Bị
1. Truy cập: http://localhost:5174/ → Chọn "Khách Hàng"
2. Click "📅 ĐẶT LỊCH"

### Test Cases

#### 2.1 - Hiển thị modal xác nhận
- **Input:**
  - Chọn "Khách mới" (hoặc "Khách cũ")
  - Khách: "Trần Linh"
  - SĐT: "0912345678"
  - Ngày: "2026-04-25"
  - Giờ: "10:00"
  - KTV: "KTV Thảo"
  - Dịch vụ: "Massage Body"
  - Click "XÁC NHẬN ĐẶT LỊCH"
- **Expected:**
  - Modal popup với border xanh (#10b981)
  - Tiêu đề: "✅ KIỂM TRA LỊCH HẸN"
  - Hiển thị 6 fields:
    1. Khách hàng: "Trần Linh"
    2. Số điện thoại: "0912345678"
    3. Dịch vụ: "Massage Body"
    4. Kỹ thuật viên: "KTV Thảo"
    5. Ngày: "25/04/2026" (format DD/MM/YYYY)
    6. Giờ: "10:00"
    7. Trạng thái: "⏳ Chờ xác nhận" (vàng)
  - 2 nút: "✅ XÁC NHẬN" (xanh) | "❌ HỦY BỎ" (xám)
- **Status:** ✅ PASS / ❌ FAIL

#### 2.2 - Click HỦY BỎ modal
- **Input:**
  - Trong modal, click "❌ HỦY BỎ"
- **Expected:**
  - Modal đóng
  - Quay về form booking
  - Dữ liệu form vẫn giữ nguyên
- **Status:** ✅ PASS / ❌ FAIL

#### 2.3 - Click XÁC NHẬN modal
- **Input:**
  - Trong modal, click "✅ XÁC NHẬN"
- **Expected:**
  - Modal đóng
  - Button disabled (không thể click lại)
  - Text "Đang lưu..." (hoặc loading)
  - Alert: "Đã đặt lịch thành công và đồng bộ dữ liệu lên Supabase"
  - Navigate về customer dashboard
  - Lịch hẹn xuất hiện trong "Lịch hẹn của tôi"
- **Status:** ✅ PASS / ❌ FAIL

#### 2.4 - Click overlay (ngoài modal)
- **Input:**
  - Trong modal, click vào vùng xám bên ngoài modal
- **Expected:**
  - Modal đóng (tương tự như click "❌ HỦY BỎ")
- **Status:** ✅ PASS / ❌ FAIL

---

## ✅ TEST CASE 3: SẮP XẾP LỊCH HẸN THEO THỜI GIAN

### Bước Chuẩn Bị
1. Tạo 3 lịch hẹn với thời gian khác nhau
2. Kiểm tra hiển thị trên 3 ứng dụng

### Test Cases

#### 3.1 - Sắp xếp trên App Chủ Tiệm
- **Input:**
  - Tạo 3 lịch:
    - Lịch A: 2026-04-25 10:00
    - Lịch B: 2026-04-24 14:00
    - Lịch C: 2026-04-25 09:00
  - Vào tab "📅 DANH SÁCH ĐIỀU HÀNH LỊCH HẸN"
- **Expected:**
  - Thứ tự trong bảng (từ trên xuống):
    1. Lịch B: 2026-04-24 14:00 (soonest)
    2. Lịch C: 2026-04-25 09:00
    3. Lịch A: 2026-04-25 10:00 (latest)
- **Status:** ✅ PASS / ❌ FAIL

#### 3.2 - Sắp xếp trên App Nhân Viên
- **Input:**
  - Vào tab "👔 NHÂN VIÊN" → "📅 LỊCH HẸN"
- **Expected:**
  - Lịch hẹn hiển thị theo thứ tự soonest first
  - Tương tự như app chủ tiệm
- **Status:** ✅ PASS / ❌ FAIL

#### 3.3 - Sắp xếp với format ngày khác nhau
- **Input:**
  - Lịch 1: "2026-04-25" (YYYY-MM-DD)
  - Lịch 2: "24/04/2026" (DD/MM/YYYY)
  - Lịch 3: "2026-04-26" (YYYY-MM-DD)
- **Expected:**
  - Parse đúng cả 2 format
  - Sắp xếp chính xác
- **Status:** ✅ PASS / ❌ FAIL

---

## ✅ TEST CASE 4: TRẠNG THÁI XÁC NHẬN (Dashboard Chủ Tiệm)

### Bước Chuẩn Bị
1. Vào app chủ tiệm → Tab "📅 DANH SÁCH ĐIỀU HÀNH LỊCH HẸN"

### Test Cases

#### 4.1 - Cột "Xác Nhận" hiển thị
- **Expected:**
  - Bảng có cột "Xác Nhận" (giữa cột "Trạng Thái" và "Thao Tác")
  - Hiển thị badge với màu xanh/vàng
- **Status:** ✅ PASS / ❌ FAIL

#### 4.2 - Badge "⏳ Chờ xác nhận" mặc định
- **Input:**
  - Tạo lịch hẹn mới
- **Expected:**
  - Cột "Xác Nhận" = "⏳ Chờ xác nhận" (màu vàng #fbbf2466)
  - Text: "⏳ Chờ xác nhận"
- **Status:** ✅ PASS / ❌ FAIL

#### 4.3 - Badge "✅ Đã xác nhận" khi khách xác nhận
- **Input:**
  - Khách xác nhận lịch hẹn (qua app khách)
  - Chủ tiệm refresh bảng
- **Expected:**
  - Cột "Xác Nhận" = "✅ Đã xác nhận" (màu xanh #10b98166)
  - Text: "✅ Đã xác nhận"
- **Status:** ✅ PASS / ❌ FAIL

---

## ✅ TEST CASE 5: TRẠNG THÁI XÁC NHẬN (Dashboard Khách Hàng)

### Bước Chuẩn Bị
1. Vào app khách hàng → "Lịch hẹn của tôi"
2. Có ít nhất 1 lịch hẹn được tạo

### Test Cases

#### 5.1 - Nút "✅ XÁC NHẬN" hiển thị
- **Expected:**
  - Nếu lịch chưa xác nhận: Nút "✅ XÁC NHẬN" xuất hiện (màu xanh)
  - Nút nằm trước nút "Hủy"
- **Status:** ✅ PASS / ❌ FAIL

#### 5.2 - Trạng thái lịch "⏳ Đang chờ xác nhận"
- **Expected:**
  - Hiển thị text: "⏳ Đang chờ xác nhận" (màu vàng)
- **Status:** ✅ PASS / ❌ FAIL

#### 5.3 - Click "✅ XÁC NHẬN"
- **Input:**
  - Click nút "✅ XÁC NHẬN"
- **Expected:**
  - Alert: "Bạn đã xác nhận lịch hẹn. Chủ tiệm sẽ được thông báo."
  - Nút "✅ XÁC NHẬN" biến mất
  - Trạng thái đổi thành: "✅ Đã xác nhận bởi chủ tiệm"
- **Status:** ✅ PASS / ❌ FAIL

#### 5.4 - Trạng thái vẫn "✅ Đã xác nhận" sau refresh
- **Input:**
  - F5 refresh trang
- **Expected:**
  - Trạng thái vẫn giữ "✅ Đã xác nhận"
  - Nút "✅ XÁC NHẬN" vẫn không hiển thị
- **Status:** ✅ PASS / ❌ FAIL

---

## ✅ TEST CASE 6: TRẠNG THÁI XÁC NHẬN (Dashboard Nhân Viên)

### Bước Chuẩn Bị
1. Vào app nhân viên → Tab "📅 LỊCH HẸN"

### Test Cases

#### 6.1 - Badge "⏳ Chờ khách xác nhận"
- **Input:**
  - Chủ tiệm đặt lịch, khách chưa xác nhận
- **Expected:**
  - Lịch hẹn hiển thị: "⏳ Chờ khách xác nhận" (màu vàng, font nhỏ dưới tên khách)
- **Status:** ✅ PASS / ❌ FAIL

#### 6.2 - Badge "✅ Khách xác nhận rồi"
- **Input:**
  - Khách xác nhận lịch hẹn
  - Nhân viên refresh hoặc reload page
- **Expected:**
  - Badge đổi thành: "✅ Khách xác nhận rồi" (màu xanh)
- **Status:** ✅ PASS / ❌ FAIL

#### 6.3 - Chi tiết lịch hẹn có cột "Xác Nhận"
- **Input:**
  - Click vào lịch hẹn để xem detail panel
- **Expected:**
  - Detail panel có dòng: "Xác Nhận" | "✅ Đã xác nhận" hoặc "⏳ Chờ xác nhận"
- **Status:** ✅ PASS / ❌ FAIL

---

## ✅ TEST CASE 7: SUPABASE INTEGRATION

### Bước Chuẩn Bị
1. Mở browser DevTools (F12)
2. Network tab
3. Supabase dashboard: https://app.supabase.com → appointments table

### Test Cases

#### 7.1 - `customer_phone` lưu vào Supabase
- **Input:**
  - Chủ tiệm đặt lịch với SĐT
- **Expected:**
  - Supabase appointments table:
    - `customer_phone` = "0905123456"
    - `customer_name` = "Nguyễn Linh"
- **Status:** ✅ PASS / ❌ FAIL

#### 7.2 - `is_approved` lưu vào Supabase
- **Input:**
  - Chủ tiệm đặt lịch
- **Expected:**
  - `is_approved` = false (mặc định)
  - Khách xác nhận → `is_approved` = true
- **Status:** ✅ PASS / ❌ FAIL

#### 7.3 - camelToSnake conversion
- **Input:**
  - Form submit với camelCase: `{customerName, customerPhone, ...}`
- **Expected:**
  - Supabase nhận snake_case: `{customer_name, customer_phone, ...}`
  - DevTools Network: JSON payload có snake_case fields
- **Status:** ✅ PASS / ❌ FAIL

---

## ✅ TEST CASE 8: EDGE CASES

#### 8.1 - SĐT bắt đầu bằng 0 hoặc +84
- **Input:**
  - SĐT: "0905123456" hoặc "+84905123456"
- **Expected:**
  - Cả 2 format được chấp nhận
- **Status:** ✅ PASS / ❌ FAIL

#### 8.2 - Tên khách hàng với ký tự đặc biệt
- **Input:**
  - Tên: "Nguyễn Văn Á-B'C"
- **Expected:**
  - Lưu & hiển thị chính xác
- **Status:** ✅ PASS / ❌ FAIL

#### 8.3 - Giờ trùng nhau
- **Input:**
  - Tạo 2 lịch cùng ngày, cùng giờ
- **Expected:**
  - Cả 2 được lưu (không bị duplicate/conflict)
  - Hiển thị theo thứ tự tạo (hoặc ID)
- **Status:** ✅ PASS / ❌ FAIL

#### 8.4 - Ngày quá khứ
- **Input:**
  - Tạo lịch: 2026-01-01
- **Expected:**
  - Vẫn được lưu (không validate ngày hiện tại)
- **Status:** ✅ PASS / ❌ FAIL

---

## 📊 BẢNG TỔNG HỢP KẾT QUẢ

| Test Case | Mô Tả | Kết Quả | Ghi Chú |
|-----------|-------|---------|--------|
| 1.1 | Không nhập SĐT | ✅/❌ | |
| 1.2 | SĐT < 9 chữ số | ✅/❌ | |
| 1.3 | SĐT hợp lệ | ✅/❌ | |
| 1.4 | SĐT với khoảng trắng | ✅/❌ | |
| 2.1 | Modal xác nhận | ✅/❌ | |
| 2.2 | Hủy modal | ✅/❌ | |
| 2.3 | Xác nhận modal | ✅/❌ | |
| 2.4 | Click overlay | ✅/❌ | |
| 3.1 | Sắp xếp - Chủ tiệm | ✅/❌ | |
| 3.2 | Sắp xếp - Nhân viên | ✅/❌ | |
| 3.3 | Sắp xếp - Format mix | ✅/❌ | |
| 4.1 | Cột "Xác Nhận" hiển thị | ✅/❌ | |
| 4.2 | Badge "Chờ xác nhận" | ✅/❌ | |
| 4.3 | Badge "Đã xác nhận" | ✅/❌ | |
| 5.1 | Nút "XÁC NHẬN" hiển thị | ✅/❌ | |
| 5.2 | Trạng thái chờ xác nhận | ✅/❌ | |
| 5.3 | Click xác nhận | ✅/❌ | |
| 5.4 | Trạng thái persist | ✅/❌ | |
| 6.1 | Badge Nhân viên - Chờ | ✅/❌ | |
| 6.2 | Badge Nhân viên - Đã xác | ✅/❌ | |
| 6.3 | Detail panel | ✅/❌ | |
| 7.1 | Supabase - customer_phone | ✅/❌ | |
| 7.2 | Supabase - is_approved | ✅/❌ | |
| 7.3 | camelToSnake conversion | ✅/❌ | |
| 8.1 | SĐT format 0/+84 | ✅/❌ | |
| 8.2 | Tên với ký tự đặc biệt | ✅/❌ | |
| 8.3 | Giờ trùng nhau | ✅/❌ | |
| 8.4 | Ngày quá khứ | ✅/❌ | |

---

## 📝 HƯỚNG DẪN KIỂM TRA

1. **Lần đầu tiên**: Chạy hết tất cả test cases
2. **Khi có lỗi**: Ghi lại test case ID + hiện tượng
3. **Fix xong**: Chạy lại test case đó + test cases liên quan
4. **Trước release**: Chạy lại toàn bộ 1 lần

---

**Ngày tạo:** 22/04/2026  
**Phiên bản:** v1.0  
**Người tạo:** Developer
