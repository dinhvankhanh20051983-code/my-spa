/**
 * Centralized styling for OwnerDashboard
 * Professional responsive design with mobile-first approach
 * Healing & Friendly theme with 60-30-10 color rule
 */
export const useStyles = () => {
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const isTablet = typeof window !== 'undefined' ? window.innerWidth < 1024 : false;

  return ({
    // Layout - Responsive - Theme Healing
    layout: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#FAF7F2',
      color: '#3D3D3D',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      flexDirection: isMobile ? 'column' : 'row'
    },
    sidebar: {
      width: isMobile ? '100%' : isTablet ? '200px' : '240px',
      backgroundColor: '#FFFFFF',
      padding: isMobile ? '12px' : '20px',
      display: 'flex',
      flexDirection: isMobile ? 'row' : 'column',
      gap: isMobile ? '8px' : '10px',
      borderRight: isMobile ? 'none' : '1px solid #E8E3D8',
      borderBottom: isMobile ? '1px solid #E8E3D8' : 'none',
      flexWrap: isMobile ? 'wrap' : 'nowrap',
      overflowX: isMobile ? 'auto' : 'visible',
      boxShadow: isMobile ? '0 2px 4px rgba(0, 0, 0, 0.05)' : 'none'
    },
    mainContent: {
      flex: 1,
      padding: isMobile ? '16px' : isTablet ? '24px' : '40px',
      overflowY: 'auto',
      backgroundColor: '#FAF7F2'
    },

    // Navigation buttons - Responsive
    navBtn: {
      textAlign: 'center',
      padding: isMobile ? '9px 10px' : '12px',
      background: 'transparent',
      border: '1px solid #E8E3D8',
      color: '#6B7280',
      cursor: 'pointer',
      borderRadius: '10px',
      fontSize: isMobile ? '12px' : '14px',
      fontWeight: '600',
      whiteSpace: 'nowrap',
      flex: isMobile ? '1 1 auto' : 'auto',
      minWidth: isMobile ? '90px' : 'auto',
      transition: 'all 0.2s ease'
    },
    navBtnActive: {
      backgroundColor: '#9CAF88',
      color: '#FFFFFF',
      fontWeight: 'bold',
      border: 'none'
    },

    // Sections & Cards - Responsive
    section: {
      marginBottom: isMobile ? '24px' : '40px'
    },
    sectionTitle: {
      color: '#9CAF88',
      marginBottom: isMobile ? '14px' : '20px',
      fontSize: isMobile ? '16px' : '18px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontWeight: 'bold'
    },
    flexHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: isMobile ? '14px' : '20px',
      gap: '10px',
      flexWrap: isMobile ? 'wrap' : 'nowrap'
    },
    card: {
      backgroundColor: '#FFFFFF',
      padding: isMobile ? '16px' : '20px',
      borderRadius: '14px',
      border: '1px solid #E8E3D8',
      position: 'relative',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    },

    // Grids - Responsive
    grid2: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: isMobile ? '12px' : '20px'
    },
    grid3: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1fr 1fr 1fr',
      gap: isMobile ? '12px' : '20px'
    },
    grid4: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1fr 1fr 1fr 1fr',
      gap: isMobile ? '12px' : '20px'
    },

    // Buttons - Responsive
    btnPrimary: {
      padding: isMobile ? '9px 14px' : '10px 20px',
      backgroundColor: '#9CAF88',
      border: 'none',
      borderRadius: '10px',
      color: '#FFFFFF',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: isMobile ? '12px' : '14px',
      transition: 'all 0.2s ease',
      ':hover': { backgroundColor: '#8A9973' }
    },
    btnPrimaryFull: {
      width: '100%',
      padding: isMobile ? '11px' : '15px',
      marginTop: '10px',
      backgroundColor: '#9CAF88',
      border: 'none',
      borderRadius: '10px',
      color: '#FFFFFF',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: isMobile ? '13px' : '14px',
      transition: 'all 0.2s ease'
    },
    btnCancel: {
      width: '100%',
      padding: isMobile ? '11px' : '15px',
      background: 'transparent',
      border: '1px solid #E8E3D8',
      color: '#6B7280',
      borderRadius: '10px',
      fontSize: isMobile ? '13px' : '14px',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    btnSmall: {
      padding: isMobile ? '6px 10px' : '8px 12px',
      border: '1px solid #9CAF88',
      color: '#9CAF88',
      background: 'transparent',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: isMobile ? '11px' : '12px',
      fontWeight: '600',
      transition: 'all 0.2s ease'
    },
    btnSecondary: {
      padding: isMobile ? '8px 12px' : '10px 16px',
      border: '1px solid #E8E3D8',
      backgroundColor: 'transparent',
      color: '#6B7280',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: isMobile ? '12px' : '13px',
      fontWeight: '600',
      transition: 'all 0.2s ease'
    },

    // Tables - Responsive
    tableContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      border: '1px solid #E8E3D8',
      overflow: isMobile ? 'auto' : 'hidden',
      marginTop: isMobile ? '14px' : '20px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
    },
    mainTable: {
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'left',
      color: '#3D3D3D',
      fontSize: isMobile ? '12px' : '14px'
    },
    theadRow: {
      backgroundColor: '#F5F0E8',
      borderBottom: '1px solid #E8E3D8'
    },
    thStyle: {
      padding: isMobile ? '10px' : '15px',
      fontSize: isMobile ? '11px' : '13px',
      textTransform: 'uppercase',
      color: '#6B7280',
      fontWeight: '600'
    },
    tdStyle: {
      padding: isMobile ? '10px' : '15px',
      borderBottom: '1px solid #E8E3D8',
      fontSize: isMobile ? '12px' : '14px'
    },
    trHoverStyle: {
      transition: 'background 0.2s',
      cursor: 'default',
      ':hover': { backgroundColor: '#FAF7F2' }
    },

    // Forms & Inputs - Responsive
    label: {
      fontSize: isMobile ? '11px' : '12px',
      color: '#9CAF88',
      marginBottom: '6px',
      display: 'block',
      fontWeight: 'bold'
    },
    input: {
      width: '100%',
      padding: isMobile ? '10px' : '12px',
      borderRadius: '8px',
      backgroundColor: '#FFFFFF',
      border: '1px solid #E8E3D8',
      color: '#3D3D3D',
      marginBottom: isMobile ? '12px' : '15px',
      boxSizing: 'border-box',
      fontSize: isMobile ? '13px' : '14px'
    },
    textarea: {
      width: '100%',
      padding: isMobile ? '10px' : '12px',
      borderRadius: '8px',
      backgroundColor: '#FFFFFF',
      border: '1px solid #E8E3D8',
      color: '#3D3D3D',
      marginBottom: isMobile ? '12px' : '15px',
      boxSizing: 'border-box',
      fontSize: isMobile ? '13px' : '14px',
      fontFamily: 'inherit',
      resize: 'vertical'
    },

    // Modals - Responsive
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(61, 61, 61, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: isMobile ? '16px' : '0',
      backdropFilter: 'blur(4px)'
    },
    formBox: {
      backgroundColor: '#FFFFFF',
      padding: isMobile ? '20px' : '30px',
      borderRadius: '16px',
      width: isMobile ? '100%' : '500px',
      maxWidth: '100%',
      maxHeight: isMobile ? '90vh' : '90vh',
      overflowY: 'auto',
      border: '1px solid #E8E3D8',
      boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)'
    },

    // Text styles
    price: {
      color: '#D4A574',
      fontSize: isMobile ? '18px' : '22px',
      fontWeight: 'bold',
      margin: '10px 0'
    },
    subText: {
      color: '#6B7280',
      fontSize: isMobile ? '12px' : '13px',
      margin: '5px 0'
    },
    infoText: {
      fontSize: isMobile ? '13px' : '14px',
      margin: '5px 0',
      color: '#3D3D3D'
    },

    // Tags & Badges
    tagGreen: {
      backgroundColor: 'rgba(108, 181, 136, 0.15)',
      color: '#6CB588',
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: isMobile ? '10px' : '11px',
      fontWeight: '600'
    },
    tagStaff: {
      backgroundColor: 'rgba(168, 216, 234, 0.15)',
      color: '#A8D8EA',
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: isMobile ? '10px' : '11px'
    },
    tagCustomer: {
      backgroundColor: 'rgba(212, 165, 116, 0.1)',
      color: '#D4A574',
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: isMobile ? '10px' : '11px'
    },
    statusPending: {
      backgroundColor: 'rgba(212, 165, 116, 0.15)',
      color: '#D4A574',
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: isMobile ? '10px' : '11px',
      fontWeight: '600'
    },
    statusCompleted: {
      backgroundColor: 'rgba(108, 181, 136, 0.15)',
      color: '#6CB588',
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: isMobile ? '10px' : '11px',
      fontWeight: '600'
    },

    // Chat - Responsive
    chatContainer: {
      display: 'flex',
      height: isMobile ? '400px' : '500px',
      backgroundColor: '#FFFFFF',
      borderRadius: '14px',
      overflow: 'hidden',
      flexDirection: isMobile ? 'column' : 'row',
      border: '1px solid #E8E3D8',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    },
    chatSidebar: {
      width: isMobile ? '100%' : '200px',
      borderRight: isMobile ? 'none' : '1px solid #E8E3D8',
      borderBottom: isMobile ? '1px solid #E8E3D8' : 'none',
      padding: isMobile ? '10px' : '10px',
      overflowY: 'auto',
      display: isMobile ? 'flex' : 'flex',
      flexDirection: isMobile ? 'row' : 'column',
      gap: isMobile ? '8px' : '0'
    },
    chatMain: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: isMobile ? '12px' : '20px'
    },
    chatHistory: {
      flex: 1,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    chatInputArea: {
      display: 'flex',
      gap: '10px',
      marginTop: isMobile ? '10px' : '15px'
    },
    msgLeft: {
      alignSelf: 'flex-start',
      backgroundColor: '#F5F0E8',
      color: '#3D3D3D',
      padding: isMobile ? '8px' : '10px',
      borderRadius: '10px 10px 10px 0',
      maxWidth: '80%',
      fontSize: isMobile ? '12px' : '13px'
    },
    msgRight: {
      alignSelf: 'flex-end',
      backgroundColor: '#9CAF88',
      color: '#FFFFFF',
      padding: isMobile ? '8px' : '10px',
      borderRadius: '10px 10px 0 10px',
      maxWidth: '80%',
      fontSize: isMobile ? '12px' : '13px'
    },

    // Images - Responsive
    imageGrid: {
      display: 'flex',
      gap: isMobile ? '10px' : '20px',
      marginTop: '10px',
      flexDirection: isMobile ? 'column' : 'row'
    },
    imgContainer: {
      flex: 1,
      height: isMobile ? '150px' : '200px',
      backgroundColor: '#FAF7F2',
      borderRadius: '10px',
      border: '2px dashed #E8E3D8',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    },

    // Additional utilities
    spacer: {
      marginBottom: isMobile ? '12px' : '20px'
    },
    flexBetween: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '10px'
    },
    flexCenter: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px'
    }
  });
};
