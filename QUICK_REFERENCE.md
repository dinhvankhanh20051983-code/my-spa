# 🚀 Quick Reference Guide - OwnerDashboard

## File Structure at a Glance

```
Owner/
├── OwnerDashboard.jsx              ← Main component (entry point)
├── OwnerDashboard.styles.js        ← All styles
├── OwnerDashboardModal.jsx         ← Modal form
├── hooks/
│   ├── useInitialData.js
│   ├── useAppointmentHandlers.js
│   └── usePurchaseHandlers.js
├── sections/
│   ├── index.js
│   ├── AppointmentsSection.jsx
│   ├── StocksSection.jsx
│   ├── ProductsSection.jsx
│   ├── PackagesSection.jsx
│   ├── CustomersSection.jsx
│   ├── OnlineOrdersSection.jsx
│   ├── TreatmentDetailSection.jsx
│   ├── StaffSection.jsx
│   ├── ChatSection.jsx
│   ├── ReportsSection.jsx
│   └── SettingsSection.jsx
└── README_PROFESSIONAL.md

ROOT/
├── OWNER_DASHBOARD_REWRITE.md      ← This summary
└── REWRITE_SUMMARY.js              ← Technical details
```

---

## How to Add a New Feature

### Scenario: Add a new "Promotions" section

#### Step 1: Create the section component
**File:** `sections/PromotionsSection.jsx`
```javascript
export const PromotionsSection = ({ promotions, styles, onSetModal }) => (
  <div style={styles.section}>
    <h3 style={styles.sectionTitle}>🎁 KHUYẾN MÃI</h3>
    {/* Component JSX */}
  </div>
);
```

#### Step 2: Export from index
**File:** `sections/index.js`
```javascript
export { PromotionsSection } from './PromotionsSection';
```

#### Step 3: Import in main component
**File:** `OwnerDashboard.jsx`
```javascript
import { ..., PromotionsSection } from './sections';
```

#### Step 4: Add state
**File:** `OwnerDashboard.jsx`
```javascript
const [promotions, setPromotions] = useState(initialData.promotions);
```

#### Step 5: Add navigation button
**File:** `OwnerDashboard.jsx` - in sidebar buttons
```javascript
{ tab: 'promotions', label: '🎁 Khuyến Mãi', notify: false }
```

#### Step 6: Add to render
**File:** `OwnerDashboard.jsx`
```javascript
{activeTab === 'promotions' && <PromotionsSection ... />}
```

---

## How to Add a New Handler Hook

### Scenario: Add handlers for promotions

**File:** `hooks/usePromotionHandlers.js`
```javascript
export const usePromotionHandlers = ({
  promotions,
  setPromotions,
  // other dependencies
}) => {
  const handleCreatePromotion = (data) => {
    // Logic here
  };

  const handleUpdatePromotion = (id, data) => {
    // Logic here
  };

  const handleDeletePromotion = (id) => {
    // Logic here
  };

  return {
    handleCreatePromotion,
    handleUpdatePromotion,
    handleDeletePromotion
  };
};
```

**Usage in OwnerDashboard.jsx:**
```javascript
const promotionHandlers = usePromotionHandlers({
  promotions,
  setPromotions,
  // other deps
});
```

---

## Common Tasks

### ✏️ Change a Button Color
**File:** `OwnerDashboard.styles.js`
```javascript
btnPrimary: {
  backgroundColor: '#10b981',  // ← Change here
  // ...
}
```

### ✏️ Change Table Header Text
**File:** `sections/AppointmentsSection.jsx`
```jsx
<th style={styles.thStyle}>Tên Mới</th>  // ← Change here
```

### ✏️ Add a Form Field
**File:** `OwnerDashboardModal.jsx`
```jsx
{modal.type === 'appointment' && (
  <>
    {/* Existing fields */}
    <label style={styles.label}>Trường Mới:</label>
    <input name="newField" style={styles.input} />
  </>
)}
```

### ✏️ Handle New Form Submission
**File:** `OwnerDashboard.jsx`
```javascript
const handleSaveModal = (e) => {
  // ...
  if (modal.type === 'newType') {
    // Handle new form type
  }
}
```

---

## State Management Pattern

### Adding New Data State
```javascript
// Initialize from hook
const initialData = useInitialData();

// Create state
const [newData, setNewData] = useState(initialData.newData);

// Pass to sections & handlers
<Section data={newData} onSetData={setNewData} />
```

### Updating State
```javascript
// Using handler
const handleUpdate = (id, updates) => {
  setData(prev => prev.map(item =>
    item.id === id ? { ...item, ...updates } : item
  ));
};

// Using inline
setData([...data, newItem]);
```

---

## Styling Pattern

### Using Centralized Styles
```javascript
// ✅ DO THIS
<div style={styles.card}>
<div style={styles.btnPrimary}>

// ❌ DON'T DO THIS
<div style={{ padding: '20px', backgroundColor: '#1e293b' }}>
```

### Creating New Style Object
**File:** `OwnerDashboard.styles.js`
```javascript
myNewStyle: {
  padding: '15px',
  backgroundColor: '#1e293b',
  borderRadius: '10px',
  // ...
}
```

---

## Component Props Pattern

### Section Component
```javascript
<Section
  data={data}           // The data to display
  styles={styles}       // Centralized styles
  handlers={handlers}   // Function handlers
  onSetModal={setModal} // Callback to parent
/>
```

### Handler Function Return
```javascript
const handler = useHandlers({ dependencies }) => {
  return {
    handleAction1: () => { /* logic */ },
    handleAction2: () => { /* logic */ }
  };
};
```

---

## Performance Tips

### ✅ Use useCallback for handlers
```javascript
const getFilteredList = useCallback(() => {
  return list.filter(/* condition */);
}, [list]);
```

### ✅ Use useMemo for calculations
```javascript
const totalAmount = useMemo(() => {
  return data.reduce((sum, item) => sum + item.price, 0);
}, [data]);
```

### ✅ Keep components pure
```javascript
// ✅ GOOD - Pure, no side effects
const MySection = ({ data, styles }) => (
  <div style={styles.section}>
    {data.map(item => <div key={item.id}>{item.name}</div>)}
  </div>
);

// ❌ BAD - Has side effects
const MySection = ({ data }) => {
  console.log('Rendering');  // Side effect
  fetch('/api/data');        // Side effect
};
```

---

## Debugging

### Check Current Tab
```javascript
console.log('Active Tab:', activeTab);
```

### Check State Updates
```javascript
useEffect(() => {
  console.log('Appointments updated:', appointments);
}, [appointments]);
```

### Check Handler Calls
```javascript
const handleAction = () => {
  console.log('Handler called with:', data);
  // Rest of logic
};
```

---

## Common Patterns

### Conditional Rendering by Tab
```javascript
{activeTab === 'appointments' && <AppointmentsSection />}
{activeTab === 'products' && <ProductsSection />}
```

### Modal Form Submission
```javascript
const handleSaveModal = (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const data = Object.fromEntries(fd);
  
  // Process data
  setState([...state, newItem]);
  
  // Close modal
  setModal({ show: false });
};
```

### Grid Layout
```javascript
<div style={styles.grid2}>      {/* 2 columns */}
  <div>Column 1</div>
  <div>Column 2</div>
</div>

<div style={styles.grid3}>      {/* 3 columns */}
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>
```

---

## File Size Reference

- `OwnerDashboard.jsx` - ~390 lines (Main)
- `OwnerDashboard.styles.js` - ~240 lines (Styles)
- Each section - ~50-80 lines
- Each hook - ~80-140 lines

---

## Git Commit Message Examples

```
feat: Add promotions section to dashboard
fix: Correct appointment status update logic
style: Update primary button colors
refactor: Extract promotion logic to custom hook
docs: Update README with new features
```

---

## Resources

📚 Main Files:
- [OwnerDashboard.jsx](./OwnerDashboard.jsx)
- [README_PROFESSIONAL.md](./README_PROFESSIONAL.md)

📋 Sections:
- [sections/index.js](./sections/index.js)
- [All section components](./sections/)

🎣 Hooks:
- [useInitialData.js](./hooks/useInitialData.js)
- [useAppointmentHandlers.js](./hooks/useAppointmentHandlers.js)
- [usePurchaseHandlers.js](./hooks/usePurchaseHandlers.js)

---

**Last Updated:** 2026-04-21
**Version:** 2.0 Professional Rewrite
**Status:** Production Ready ✅
