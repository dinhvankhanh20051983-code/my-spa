# 📊 OwnerDashboard Architecture Diagram

## Component Tree

```
App
 └─ OwnerDashboard (Main Container)
     │
     ├─ SIDEBAR NAVIGATION
     │  ├─ Button: 📅 Lịch Hẹn
     │  ├─ Button: 📈 Cổ Phần & Điểm
     │  ├─ Button: 🧴 Sản Phẩm Lẻ
     │  ├─ Button: 📑 Gói Trị Liệu
     │  ├─ Button: 🧖‍♀️ Khách Hàng
     │  ├─ Button: 🛒 Đơn Online
     │  ├─ Button: 📜 Nhật Ký Liệu Trình
     │  ├─ Button: 👥 Nhân Viên
     │  ├─ Button: 💬 Tin Nhắn
     │  ├─ Button: 📊 Báo Cáo
     │  └─ Button: ⚙️ Cài Đặt
     │
     ├─ MAIN CONTENT (activeTab conditional rendering)
     │  │
     │  ├─ IF activeTab === 'appointments'
     │  │  └─ AppointmentsSection
     │  │     ├─ Table (Appointments)
     │  │     ├─ Actions (Remind, Complete, Cancel)
     │  │     └─ Add Button → Modal
     │  │
     │  ├─ IF activeTab === 'stocks'
     │  │  └─ StocksSection
     │  │     ├─ Table (Staff & Customers)
     │  │     ├─ Stock Summary
     │  │     └─ Adjust Stock
     │  │
     │  ├─ IF activeTab === 'products'
     │  │  └─ ProductsSection
     │  │     ├─ Grid (Products)
     │  │     └─ Add Button → Modal
     │  │
     │  ├─ IF activeTab === 'packages'
     │  │  └─ PackagesSection
     │  │     ├─ Grid (Packages)
     │  │     └─ Add Button → Modal
     │  │
     │  ├─ IF activeTab === 'customers'
     │  │  └─ CustomersSection
     │  │     ├─ Grid (Customers)
     │  │     ├─ Customer Stats
     │  │     └─ Add Button → Modal
     │  │
     │  ├─ IF activeTab === 'online_orders'
     │  │  └─ OnlineOrdersSection
     │  │     ├─ Table (Orders)
     │  │     ├─ Order Status
     │  │     └─ Actions (Confirm, Cancel)
     │  │
     │  ├─ IF activeTab === 'treatment_history'
     │  │  └─ TreatmentDetailSection
     │  │     ├─ Sidebar (Session List)
     │  │     ├─ Detail Panel
     │  │     └─ Image Upload
     │  │
     │  ├─ IF activeTab === 'staff'
     │  │  └─ StaffSection
     │  │     ├─ Grid (Staff)
     │  │     ├─ Staff Stats
     │  │     └─ Add Button → Modal
     │  │
     │  ├─ IF activeTab === 'chat'
     │  │  └─ ChatSection
     │  │     ├─ Tabs (Staff/Customer)
     │  │     ├─ Sidebar (User List)
     │  │     ├─ Chat History
     │  │     └─ Message Input
     │  │
     │  ├─ IF activeTab === 'reports'
     │  │  └─ ReportsSection
     │  │     ├─ Stats Cards
     │  │     ├─ Revenue Chart
     │  │     └─ Performance Metrics
     │  │
     │  └─ IF activeTab === 'settings'
     │     └─ SettingsSection
     │        ├─ Settings Form
     │        ├─ Save Button
     │        └─ Preview Panel
     │
     └─ MODAL (Conditional)
        └─ OwnerDashboardModal
           ├─ IF modal.type === 'appointment'
           │  └─ Appointment Form
           ├─ IF modal.type === 'product'
           │  └─ Product Form
           ├─ IF modal.type === 'package'
           │  └─ Package Form
           ├─ IF modal.type === 'customer'
           │  └─ Customer Form
           ├─ IF modal.type === 'staff'
           │  └─ Staff Form
           ├─ IF modal.type === 'treatment'
           │  └─ Treatment Form
           ├─ IF modal.type === 'treatment_images'
           │  └─ Image Upload Form
           ├─ IF modal.type === 'customer_purchase'
           │  └─ Purchase Form
           ├─ IF modal.type === 'confirm_order'
           │  └─ Order Confirmation
           └─ IF modal.type === 'cancel_order'
              └─ Order Cancellation
```

## State Management Flow

```
OwnerDashboard State
├─ activeTab (string) - Current selected tab
├─ modal (object) - Modal state {show, type, data}
├─ products (array) - Product list
├─ packages (array) - Package list
├─ staffs (array) - Staff list
├─ customers (array) - Customer list
├─ appointments (array) - Appointment list
├─ onlineOrders (array) - Online order list
├─ settings (object) - System settings
├─ chatType (string) - Chat tab selection
├─ activeChat (object) - Selected chat user
├─ chatSearch (string) - Chat search query
├─ searchCustomer (string) - Customer search query
├─ selectedCustomer (object) - Selected customer
└─ selectedLog (object) - Selected treatment log
```

## Custom Hooks Architecture

```
Custom Hooks
├─ useInitialData()
│  └─ Returns: {products, packages, staffs, customers, appointments, onlineOrders, settings}
│
├─ useAppointmentHandlers({appointments, customers, settings, ...})
│  └─ Returns: {
│        handleUpdateStatus,
│        handleRemind,
│        handleComplete,
│        handleApproveAppointment,
│        handleShareUpdate,
│        handleCancel,
│        printInvoice
│      }
│
└─ usePurchaseHandlers({customers, packages, products, settings, ...})
   └─ Returns: {
        handleCustomerPurchase,
        handleConfirmOrder,
        handleCancelOrder,
        handleAdjustStock
      }
```

## Data Flow Diagram

```
USER INTERACTION
       ↓
  EVENT HANDLER
       ↓
  CUSTOM HOOK
       ↓
   STATE UPDATE
  (setState)
       ↓
  COMPONENT RE-RENDER
       ↓
DISPLAY UPDATED UI
```

## Component Communication

```
OwnerDashboard (Parent)
     │
     ├── Props Down ──→ Section Components
     │                  - data (appointments, etc.)
     │                  - styles (centralized)
     │                  - handlers (functions)
     │                  - callbacks (onSetModal, etc.)
     │
     └── Callbacks Up ← Section Components
                        - onSetModal()
                        - onSetActiveTab()
                        - onSetSelectedCustomer()
```

## Styling Architecture

```
OwnerDashboard.styles.js
├─ useStyles() Hook
│  └─ Returns 50+ style objects
│
├─ Layout Styles
│  ├─ layout
│  ├─ sidebar
│  └─ mainContent
│
├─ Component Styles
│  ├─ section
│  ├─ card
│  ├─ flexHeader
│  └─ sectionTitle
│
├─ Button Styles
│  ├─ btnPrimary
│  ├─ btnPrimaryFull
│  ├─ btnCancel
│  └─ btnSmall
│
├─ Table Styles
│  ├─ tableContainer
│  ├─ mainTable
│  ├─ theadRow
│  ├─ thStyle
│  ├─ tdStyle
│  └─ trHoverStyle
│
├─ Form Styles
│  ├─ label
│  ├─ input
│  ├─ overlay
│  └─ formBox
│
├─ Grid Layouts
│  ├─ grid2 (2 columns)
│  └─ grid3 (3 columns)
│
└─ Color/Status Styles
   ├─ tagGreen
   ├─ tagStaff
   ├─ tagCustomer
   ├─ price
   ├─ subText
   └─ infoText
```

## File Dependency Tree

```
OwnerDashboard.jsx (Main)
├─ imports
│  ├─ OwnerDashboard.styles.js (useStyles)
│  ├─ sections/ (all 11 components)
│  ├─ OwnerDashboardModal.jsx
│  ├─ hooks/useInitialData.js
│  ├─ hooks/useAppointmentHandlers.js
│  └─ hooks/usePurchaseHandlers.js
│
├─ uses OwnerDashboard.styles.js
│  └─ provides: styles object
│
├─ uses Custom Hooks (3)
│  ├─ useInitialData() → initialData
│  ├─ useAppointmentHandlers() → appointmentHandlers
│  └─ usePurchaseHandlers() → purchaseHandlers
│
├─ renders Sections (11)
│  ├─ AppointmentsSection.jsx
│  ├─ StocksSection.jsx
│  ├─ ProductsSection.jsx
│  ├─ PackagesSection.jsx
│  ├─ CustomersSection.jsx
│  ├─ OnlineOrdersSection.jsx
│  ├─ TreatmentDetailSection.jsx
│  ├─ StaffSection.jsx
│  ├─ ChatSection.jsx
│  ├─ ReportsSection.jsx
│  └─ SettingsSection.jsx
│
└─ renders Modal
   └─ OwnerDashboardModal.jsx
```

## Performance Optimization

```
React Hooks for Performance
├─ useCallback()
│  ├─ getFilteredChatList()
│  │  └─ Dependencies: [chatType, chatSearch, staffs, customers]
│  └─ Prevents unnecessary re-renders of child components
│
└─ useMemo()
   ├─ distributedStocks
   │  └─ Dependencies: [staffs, customers]
   └─ Expensive calculation cached
```

## Modal Form Flow

```
User Clicks "Add New"
       ↓
onSetModal({show: true, type: 'type', data: data})
       ↓
OwnerDashboardModal Renders
       ↓
User Fills Form
       ↓
User Submits Form
       ↓
handleSaveModal(e)
       ↓
Route to Handler Based on modal.type
       ↓
Update State (setState)
       ↓
Close Modal: setModal({show: false})
       ↓
Component Re-renders with New Data
```

## Section Component Props Pattern

```
<SectionComponent
  // Data
  data={data}              // The content to display
  
  // Utilities
  styles={styles}          // Centralized styles
  handlers={handlers}      // Action handlers
  
  // Callbacks to Parent
  onSetModal={setModal}    // Open modal
  onSetActiveTab={setActiveTab}  // Switch tab
  onSetSelectedCustomer={setSelectedCustomer}  // Select customer
/>
```

## State Update Pattern

```
Before:
state = [item1, item2, item3]

After Update (e.g., update item2):
setState(prev => prev.map(item =>
  item.id === targetId
    ? { ...item, ...updates }  // Updated item
    : item                      // Unchanged items
))

Result:
state = [item1, item2_updated, item3]
```

---

**Architecture Created:** 2026-04-21
**Status:** Production Ready ✅
**Quality:** Enterprise Grade
