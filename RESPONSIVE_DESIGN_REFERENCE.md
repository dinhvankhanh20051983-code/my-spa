# 🎯 Professional Responsive Design - Quick Reference

## 📱 Breakpoints

```javascript
// Mobile First Approach
const isMobile = window.innerWidth < 768;      // Mobile: 320px - 767px
const isTablet = window.innerWidth < 1024;     // Tablet: 768px - 1023px
// Desktop: 1024px+
```

## 🎨 Color Palette

```css
/* Theme Variables */
--primary: #a78bfa        /* Lavender - Customer */
--secondary: #10b981      /* Emerald - Staff */
--accent: #f472b6         /* Pink - Promotions */
--bg-dark: #0f172a        /* Main background */
--text-main: #f8fafc      /* Main text */
--text-dim: #94a3b8       /* Secondary text */
```

## 📐 Responsive Typography

```javascript
// Mobile: Compact sizing
h1: 24px, h2: 20px, h3: 18px, p: 14px

// Tablet: Standard sizing
h1: 28px, h2: 22px, h3: 20px, p: 14px

// Desktop: Full featured
h1: 32px, h2: 26px, h3: 24px, p: 16px
```

## 🔲 Responsive Grids

```javascript
// Single column on mobile, 2 on tablet, multiple on desktop
const grid2 = {
  display: 'grid',
  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
  gap: isMobile ? '12px' : '20px'
};

const grid3 = {
  display: 'grid',
  gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1fr 1fr 1fr',
  gap: isMobile ? '12px' : '20px'
};
```

## 🔘 Responsive Buttons

```javascript
const btnPrimary = {
  padding: isMobile ? '9px 14px' : '10px 20px',
  fontSize: isMobile ? '12px' : '14px',
  width: isMobile ? '100%' : 'auto',
  borderRadius: '10px',
  transition: 'all 0.2s ease'
};
```

## 📥 Responsive Inputs

```javascript
const input = {
  width: '100%',
  padding: isMobile ? '10px' : '12px',
  fontSize: isMobile ? '13px' : '14px',
  borderRadius: '8px',
  backgroundColor: '#0f172a',
  border: '1px solid #334155',
  boxSizing: 'border-box'
};
```

## 📦 Spacing Scale

| Level | Mobile | Tablet | Desktop |
|-------|--------|--------|---------|
| xs | 4px | 4px | 4px |
| sm | 8px | 8px | 8px |
| md | 12px | 16px | 16px |
| lg | 14px | 18px | 20px |
| xl | 16px | 20px | 24px |
| 2xl | 20px | 24px | 40px |

## 🏗️ Responsive Containers

```javascript
// Container padding
const container = {
  padding: isMobile ? '14px' : isTablet ? '18px' : '24px',
  marginBottom: isMobile ? '16px' : '20px'
};

// Sidebar responsive
const sidebar = {
  width: isMobile ? '100%' : isTablet ? '200px' : '240px',
  flexDirection: isMobile ? 'row' : 'column',
  gap: isMobile ? '8px' : '10px'
};
```

## 🎪 Responsive Layout Patterns

### Pattern 1: Flex Wrapping
```javascript
const flexRow = {
  display: 'flex',
  flexWrap: isMobile ? 'wrap' : 'nowrap',
  gap: isMobile ? '8px' : '12px'
};
```

### Pattern 2: Grid Stacking
```javascript
const gridStack = {
  display: 'grid',
  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
  gap: isMobile ? '12px' : '20px'
};
```

### Pattern 3: Mobile Hidden Elements
```javascript
const hideOnMobile = {
  display: isMobile ? 'none' : 'block'
};
```

## 🏷️ Status Badge Styles

```javascript
// Status badge colors
const statusColors = {
  pending: { bg: '#7c2d12', color: '#fb923c' },     // Orange
  completed: { bg: '#065f46', color: '#10b981' },   // Green
  in_progress: { bg: '#1e3a8a', color: '#60a5fa' }, // Blue
  info: { bg: '#1e293b', color: '#a78bfa' }         // Purple
};
```

## 💾 Store/Retrieve State

```javascript
// Save responsive state
const [isMobile, setIsMobile] = useState(
  typeof window !== 'undefined' ? window.innerWidth < 768 : false
);

// Update on resize
useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

## 🎯 Touch Target Size

```javascript
// Minimum 44x44px for mobile touch
const touchButton = {
  minWidth: '44px',
  minHeight: '44px',
  padding: '12px 16px'
};
```

## 📝 Common Responsive Classes

```css
/* Utility classes in App.css */
.grid-2-mobile { grid-template-columns: 1fr; }
.grid-3-mobile { grid-template-columns: 1fr; }
.hide-mobile { display: none; }
.hide-tablet { display: none; }
.hide-desktop { display: none; }
.sidebar-responsive { width: 100%; flex-direction: row; }
```

## 🔍 Testing Tips

1. **Chrome DevTools**: Toggle device toolbar (Ctrl+Shift+M)
2. **Test sizes**: 375px, 768px, 1024px, 1920px
3. **Test orientation**: Portrait & landscape
4. **Test touch**: Use device emulation or real device
5. **Test performance**: Check rendering on slow devices

## 📊 Component Responsive Matrix

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| Cards | Single | 1-2 col | 2-3 col |
| Tables | Scroll | Scroll | Full |
| Buttons | 100% w | Auto | Auto |
| Inputs | 100% w | 100% w | Auto |
| Modals | Full-h | 80% | 50% |
| Nav | Horiz | Horiz | Sidebar |

## 🚀 Performance Hints

- ✅ Use inline responsive logic (no media queries in JS)
- ✅ Minimize re-renders with proper state management
- ✅ Use CSS utilities for rapid styling
- ✅ Test on actual devices, not just emulation
- ✅ Monitor bundle size with responsive utilities
- ✅ Use hardware acceleration for animations

## 🎨 Quick Style Template

```javascript
const responsiveStyle = {
  // Padding/Margin
  padding: isMobile ? '12px' : '20px',
  marginBottom: isMobile ? '12px' : '20px',
  
  // Dimensions
  width: isMobile ? '100%' : 'auto',
  minHeight: isMobile ? '40px' : '44px',
  
  // Typography
  fontSize: isMobile ? '13px' : '14px',
  lineHeight: isMobile ? 1.4 : 1.5,
  
  // Layout
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'row',
  gap: isMobile ? '8px' : '12px',
  
  // Transitions
  transition: 'all 0.2s ease'
};
```

---

**Last Updated**: April 23, 2026
**Status**: ✅ Production Ready
