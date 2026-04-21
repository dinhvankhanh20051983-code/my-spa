# OwnerDashboard - Cấu Trúc và Hướng Dẫn

## 📋 Tổng Quan

File `OwnerDashboard.jsx` đã được **tái cấu trúc chuyên nghiệp** theo các best practices:

### Cải tiến chính:
- ✅ **Modular Architecture**: Tách thành các component con độc lập
- ✅ **Custom Hooks**: Logic được tổ chức trong hooks riêng
- ✅ **Centralized Styling**: Tất cả styles trong một file riêng
- ✅ **Organized Data**: Dữ liệu khởi tạo tập trung
- ✅ **Code Reusability**: Handlers được sử dụng lại
- ✅ **Better Performance**: Sử dụng `useCallback` và `useMemo`

---

## 📂 Cấu Trúc Thư Mục

```
src/pages/Owner/
├── OwnerDashboard.jsx              # Main component (390 dòng)
├── OwnerDashboard.styles.js        # Tất cả styles (240+ dòng)
├── OwnerDashboardModal.jsx         # Modal form component
├── hooks/
│   ├── useInitialData.js           # Initial data definition
│   ├── useAppointmentHandlers.js   # Appointment logic
│   └── usePurchaseHandlers.js      # Purchase & order logic
└── sections/
    ├── index.js                    # Export all sections
    ├── AppointmentsSection.jsx     # Lịch hẹn
    ├── StocksSection.jsx           # Cổ phần & điểm
    ├── ProductsSection.jsx         # Sản phẩm lẻ
    ├── PackagesSection.jsx         # Gói trị liệu
    ├── CustomersSection.jsx        # Khách hàng
    ├── OnlineOrdersSection.jsx     # Đơn hàng online
    ├── TreatmentDetailSection.jsx  # Nhật ký liệu trình
    ├── StaffSection.jsx            # Nhân viên
    ├── ChatSection.jsx             # Tin nhắn
    ├── ReportsSection.jsx          # Báo cáo
    └── SettingsSection.jsx         # Cài đặt
```

---

## 🎯 Các Component Chính

### 1. **OwnerDashboard.jsx** (Main Component)
- Quản lý state chính (tab, modal, data)
- Điều phối giữa các sections
- Xử lý modal form submission
- Tính toán thống kê

### 2. **Custom Hooks**

#### `useInitialData()`
- Trả về dữ liệu mẫu ban đầu
- Products, Packages, Staffs, Customers
- Appointments, Orders, Settings

#### `useAppointmentHandlers()`
Cung cấp các hàm:
- `handleUpdateStatus()` - Cập nhật trạng thái lịch
- `handleRemind()` - Gửi nhắc nhở
- `handleComplete()` - Hoàn thành & in bill
- `handleApproveAppointment()` - Duyệt lịch
- `handleShareUpdate()` - Chia sẻ cập nhật
- `handleCancel()` - Hủy lịch
- `printInvoice()` - In hóa đơn

#### `usePurchaseHandlers()`
Cung cấp các hàm:
- `handleCustomerPurchase()` - Khách mua gói/sản phẩm
- `handleConfirmOrder()` - Xác nhận đơn online
- `handleCancelOrder()` - Hủy đơn online
- `handleAdjustStock()` - Điều chỉnh cổ phần

### 3. **Sections** (11 Component)

Mỗi section là component độc lập nhận `props`:
- **Data props**: appointments, customers, staffs, etc.
- **Handler props**: Các hàm xử lý
- **Callback props**: `onSetModal`, `onSetTab`, etc.
- **Style props**: Styles centralized

---

## 🎨 Styling Strategy

### File: `OwnerDashboard.styles.js`

```javascript
const styles = useStyles();

// Usage
style={styles.section}
style={styles.btnPrimary}
style={styles.tableContainer}
```

**Lợi ích:**
- Dễ bảo trì
- Thay đổi toàn cục một nơi
- Tái sử dụng dễ dàng
- Performance tốt hơn

---

## 📊 Data Flow

```
OwnerDashboard
  ├── State Management
  │   ├── activeTab
  │   ├── modal
  │   ├── products, packages, staffs, customers
  │   ├── appointments, onlineOrders
  │   └── settings
  │
  ├── Custom Hooks
  │   ├── useAppointmentHandlers()
  │   └── usePurchaseHandlers()
  │
  ├── Utility Functions
  │   ├── getFilteredChatList()
  │   ├── distributedStocks (useMemo)
  │   └── handleSaveModal()
  │
  └── Render Sections
      └── Based on activeTab
          ├── AppointmentsSection
          ├── StocksSection
          ├── ProductsSection
          ├── PackagesSection
          ├── CustomersSection
          ├── OnlineOrdersSection
          ├── TreatmentDetailSection
          ├── StaffSection
          ├── ChatSection
          ├── ReportsSection
          └── SettingsSection
```

---

## 🔄 Quy Trình Sử Dụng Modal

### 1. Mở Modal
```javascript
onSetModal({ 
  show: true, 
  type: 'appointment',  // hoặc 'product', 'customer', etc.
  data: null 
})
```

### 2. Điền Form
```html
<input name="customerName" ... />
<input name="date" type="date" ... />
<input name="time" type="time" ... />
```

### 3. Submit
```javascript
const handleSaveModal = (e) => {
  if (modal.type === 'appointment') {
    // Xử lý tạo appointment mới
  } else if (modal.type === 'product') {
    // Xử lý tạo sản phẩm mới
  }
  // ... etc
}
```

---

## 🚀 Cách Mở Rộng

### Thêm Section Mới

1. Tạo file `sections/NewSection.jsx`:
```javascript
export const NewSection = ({ data, styles, handlers, onSetModal }) => (
  <div style={styles.section}>
    {/* Content */}
  </div>
);
```

2. Export từ `sections/index.js`:
```javascript
export { NewSection } from './NewSection';
```

3. Import vào `OwnerDashboard.jsx`:
```javascript
import { NewSection } from './sections';
```

4. Thêm vào render:
```javascript
{activeTab === 'newTab' && <NewSection ... />}
```

### Thêm Hook Xử Lý Mới

1. Tạo `hooks/useNewHandlers.js`:
```javascript
export const useNewHandlers = ({ data, setData }) => {
  const handleSomething = () => { /* logic */ };
  return { handleSomething };
};
```

2. Sử dụng trong component:
```javascript
const newHandlers = useNewHandlers({ data, setData });
```

---

## 📝 Các Tab Chính

| Tab | Icon | Description |
|-----|------|-------------|
| appointments | 📅 | Quản lý lịch hẹn |
| stocks | 📈 | Cổ phần & điểm thưởng |
| products | 🧴 | Sản phẩm lẻ |
| packages | 📑 | Gói trị liệu |
| customers | 🧖‍♀️ | Hồ sơ khách hàng |
| online_orders | 🛒 | Đơn hàng online |
| treatment_history | 📜 | Nhật ký liệu trình |
| staff | 👥 | Đội ngũ nhân viên |
| chat | 💬 | Tin nhắn & giao tiếp |
| reports | 📊 | Báo cáo doanh thu |
| settings | ⚙️ | Cài đặt hệ thống |

---

## 🎯 Best Practices Được Áp Dụng

✅ **Single Responsibility Principle** - Mỗi component một trách nhiệm
✅ **DRY (Don't Repeat Yourself)** - Tái sử dụng code
✅ **Prop Drilling Minimized** - Truyền props một cách hợp lý
✅ **Performance Optimized** - useCallback, useMemo
✅ **Type Safety Ready** - Dễ thêm TypeScript sau
✅ **Scalable Architecture** - Dễ mở rộng
✅ **Maintainable Code** - Dễ bảo trì & sửa lỗi
✅ **Clear Documentation** - Comment rõ ràng

---

## 🔧 Tips Bảo Trì

### Khi thêm features mới:
1. Tạo hook riêng nếu logic phức tạp
2. Tách component nếu render logic dài
3. Cập nhật styles.js nếu cần UI mới
4. Viết comment cho logic phức tạp

### Khi fix bug:
1. Xác định bug ở component nào
2. Check hook tương ứng
3. Review data flow
4. Test state changes

---

## 📞 Liên Hệ

Nếu cần sửa đổi hoặc thêm tính năng, tuân theo cấu trúc này để giữ code sạch và dễ bảo trì.
