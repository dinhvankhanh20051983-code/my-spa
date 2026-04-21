/**
 * Centralized styling for OwnerDashboard
 * All style objects are defined here for maintainability
 */
export const useStyles = () => ({
  // Layout
  layout: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    color: 'white',
    fontFamily: 'sans-serif'
  },
  sidebar: {
    width: '240px',
    backgroundColor: '#1e293b',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    borderRight: '1px solid #334155'
  },
  mainContent: {
    flex: 1,
    padding: '40px',
    overflowY: 'auto'
  },
  sidebarMobile: {
    width: '100%',
    backgroundColor: '#1e293b',
    padding: '14px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    borderRight: 'none',
    borderBottom: '1px solid #334155',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    alignItems: 'center'
  },
  mainContentMobile: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto'
  },
  navBtnMobile: {
    flex: '1 1 120px',
    minWidth: '120px'
  },

  // Navigation buttons
  navBtn: {
    textAlign: 'left',
    padding: '12px',
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    borderRadius: '10px'
  },
  navBtnActive: {
    backgroundColor: '#10b981',
    color: 'white',
    fontWeight: 'bold'
  },

  // Sections & Cards
  section: {
    marginBottom: '40px'
  },
  sectionTitle: {
    color: '#10b981',
    marginBottom: '20px',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  flexHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  card: {
    backgroundColor: '#1e293b',
    padding: '20px',
    borderRadius: '15px',
    border: '1px solid #334155',
    position: 'relative'
  },

  // Grids
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px'
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '20px'
  },

  // Buttons
  btnPrimary: {
    padding: '10px 20px',
    backgroundColor: '#10b981',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  btnPrimaryFull: {
    width: '100%',
    padding: '15px',
    marginTop: '10px',
    backgroundColor: '#10b981',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  btnCancel: {
    width: '100%',
    padding: '15px',
    background: 'none',
    border: '1px solid #334155',
    color: 'white',
    borderRadius: '8px'
  },
  btnSmall: {
    padding: '5px 10px',
    border: '1px solid #10b981',
    color: '#10b981',
    background: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },

  // Tables
  tableContainer: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    border: '1px solid #334155',
    overflow: 'hidden',
    marginTop: '20px'
  },
  mainTable: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    color: '#e2e8f0'
  },
  theadRow: {
    backgroundColor: '#334155',
    borderBottom: '2px solid #475569'
  },
  thStyle: {
    padding: '15px',
    fontSize: '13px',
    textTransform: 'uppercase',
    color: '#94a3b8',
    fontWeight: '600'
  },
  tdStyle: {
    padding: '15px',
    borderBottom: '1px solid #334155',
    fontSize: '14px'
  },
  trHoverStyle: {
    transition: 'background 0.2s',
    cursor: 'default'
  },
  chatTab: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#334155',
    color: '#94a3b8',
    border: 'none',
    cursor: 'pointer'
  },

  // Forms & Inputs
  label: {
    fontSize: '12px',
    color: '#10b981',
    marginBottom: '5px',
    display: 'block',
    fontWeight: 'bold'
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    color: 'white',
    marginBottom: '15px',
    boxSizing: 'border-box'
  },

  // Modals
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100
  },
  formBox: {
    backgroundColor: '#1e293b',
    padding: '30px',
    borderRadius: '20px',
    width: '500px',
    maxHeight: '90vh',
    overflowY: 'auto'
  },

  // Text styles
  price: {
    color: '#fbbf24',
    fontSize: '22px',
    fontWeight: 'bold',
    margin: '10px 0'
  },
  subText: {
    color: '#94a3b8',
    fontSize: '13px',
    margin: '5px 0'
  },
  infoText: {
    fontSize: '14px',
    margin: '5px 0'
  },

  // Tags & Badges
  tagGreen: {
    backgroundColor: '#065f46',
    color: '#10b981',
    padding: '3px 8px',
    borderRadius: '5px',
    fontSize: '10px'
  },
  tagStaff: {
    backgroundColor: '#1e3a8a',
    color: '#60a5fa',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px'
  },
  tagCustomer: {
    backgroundColor: '#374151',
    color: '#94a3b8',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px'
  },

  // Chat
  chatContainer: {
    display: 'flex',
    height: '500px',
    backgroundColor: '#1e293b',
    borderRadius: '15px',
    overflow: 'hidden'
  },
  chatSidebar: {
    width: '200px',
    borderRight: '1px solid #334155',
    padding: '10px',
    overflowY: 'auto'
  },
  chatMain: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '20px'
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
    marginTop: '15px'
  },
  msgLeft: {
    alignSelf: 'flex-start',
    backgroundColor: '#334155',
    padding: '10px',
    borderRadius: '10px 10px 10px 0',
    maxWidth: '80%',
    fontSize: '13px'
  },
  msgRight: {
    alignSelf: 'flex-end',
    backgroundColor: '#10b981',
    padding: '10px',
    borderRadius: '10px 10px 0 10px',
    maxWidth: '80%',
    fontSize: '13px'
  },

  // Images
  imageGrid: {
    display: 'flex',
    gap: '20px',
    marginTop: '10px'
  },
  imgContainer: {
    flex: 1,
    height: '200px',
    backgroundColor: '#0f172a',
    borderRadius: '10px',
    border: '2px dashed #334155',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  }
});
