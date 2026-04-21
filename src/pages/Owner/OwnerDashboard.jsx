import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useStyles } from './OwnerDashboard.styles';
import {
  AppointmentsSection,
  StocksSection,
  ProductsSection,
  PackagesSection,
  CustomersSection,
  OnlineOrdersSection,
  TreatmentDetailSection,
  StaffSection,
  ChatSection,
  ReportsSection,
  SettingsSection
} from './sections';
import { OwnerDashboardModal } from './OwnerDashboardModal';
import { useInitialData } from './hooks/useInitialData';
import { useAppointmentHandlers } from './hooks/useAppointmentHandlers';
import { usePurchaseHandlers } from './hooks/usePurchaseHandlers';

/**
 * OwnerDashboard Component
 * 
 * Quản lý dashboard chính cho chủ SPA
 * - Lịch hẹn, sản phẩm, gói dịch vụ
 * - Khách hàng, nhân viên, cổ phần
 * - Đơn hàng online, báo cáo doanh thu
 * - Cài đặt hệ thống, tin nhắn
 */
const OwnerDashboard = () => {
  // ==================== STATES ====================
  const [activeTab, setActiveTab] = useState('appointments');
  const [modal, setModal] = useState({ show: false, type: '', data: null });

  // Initialize data
  const initialData = useInitialData();
  const [products, setProducts] = useState(initialData.products);
  const [packages, setPackages] = useState(initialData.packages);
  const [staffs, setStaffs] = useState(initialData.staffs);
  const [customers, setCustomers] = useState(initialData.customers);
  const [appointments, setAppointments] = useState(initialData.appointments);
  const [onlineOrders, setOnlineOrders] = useState(initialData.onlineOrders);
  const [settings, setSettings] = useState(initialData.settings);

  // UI State
  const [chatType, setChatType] = useState('staff');
  const [activeChat, setActiveChat] = useState(null);
  const [chatSearch, setChatSearch] = useState('');
  const [searchCustomer, setSearchCustomer] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);

  const handleAddTreatmentLog = (customerId, newLog) => {
    setCustomers(prev => prev.map(c =>
      c.id === customerId ? { ...c, history: [...(c.history || []), newLog] } : c
    ));

    setSelectedCustomer(prev =>
      prev && prev.id === customerId
        ? { ...prev, history: [...(prev.history || []), newLog] }
        : prev
    );

    setSelectedLog(newLog);
  };

  // ==================== HOOKS ====================
  const appointmentHandlers = useAppointmentHandlers({
    appointments,
    customers,
    settings,
    setAppointments,
    setCustomers
  });

  const purchaseHandlers = usePurchaseHandlers({
    customers,
    packages,
    products,
    settings,
    setCustomers,
    setOnlineOrders
  });

  const styles = useStyles();
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 900 : false);
  const [isOrderSyncing, setIsOrderSyncing] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadOnlineOrders = async () => {
      setIsOrderSyncing(true);
      const { data, error } = await supabase
        .from('online_orders')
        .select('*')
        .order('orderDate', { ascending: false });

      if (!error && data) {
        setOnlineOrders(data);
      }
      setIsOrderSyncing(false);
    };

    loadOnlineOrders();
  }, []);

  const layoutStyle = isMobile ? { ...styles.layout, flexDirection: 'column' } : styles.layout;
  const sidebarStyle = isMobile ? styles.sidebarMobile : styles.sidebar;
  const mainContentStyle = isMobile ? styles.mainContentMobile : styles.mainContent;

  const tabButtonStyle = (baseStyle, active) => {
    const style = active ? { ...baseStyle, ...styles.navBtnActive } : baseStyle;
    return isMobile ? { ...style, ...styles.navBtnMobile } : style;
  };

  // ==================== UTILITY FUNCTIONS ====================
  
  // Filter chat list by search query
  const getFilteredChatList = useCallback(() => {
    const list = chatType === 'staff' ? staffs : customers;
    return list.filter(u =>
      u.name.toLowerCase().includes(chatSearch.toLowerCase()) ||
      (u.phone && u.phone.includes(chatSearch))
    );
  }, [chatType, chatSearch, staffs, customers]);

  // Calculate total distributed stocks
  const distributedStocks = useMemo(() => {
    return [...staffs, ...customers].reduce((sum, u) => sum + (u.stocks || 0), 0);
  }, [staffs, customers]);

  // Handle modal form submission
  const handleSaveModal = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd);

    // Route to appropriate handler
    if (modal.type === 'product') {
      setProducts([...products, { id: Date.now(), ...data, price: Number(data.price), stock: Number(data.stock) }]);
    } else if (modal.type === 'package') {
      setPackages([...packages, { id: Date.now(), ...data, price: Number(data.price), sessions: Number(data.sessions) }]);
    } else if (modal.type === 'staff') {
      setStaffs([...staffs, {
        id: Date.now(),
        ...data,
        baseSalary: Number(data.baseSalary) || settings.defaultBaseSalary,
        serviceComm: Number(data.serviceComm) || settings.defaultServiceComm,
        consultComm: Number(data.consultComm) || settings.defaultConsultComm,
        stocks: 0
      }]);
    } else if (modal.type === 'customer') {
      setCustomers([...customers, {
        id: Date.now(),
        ...data,
        referralCode: data.phone,
        referredBy: data.referredBy || '',
        referralRewarded: false,
        myPackages: [],
        points: 0,
        stocks: 0,
        history: []
      }]);
    } else if (modal.type === 'customer_purchase') {
      purchaseHandlers.handleCustomerPurchase(modal.data, data);
    } else if (modal.type === 'confirm_order') {
      purchaseHandlers.handleConfirmOrder(modal.data);
    } else if (modal.type === 'cancel_order') {
      purchaseHandlers.handleCancelOrder(modal.data.id);
    } else if (modal.type === 'appointment') {
      setAppointments([...appointments, {
        id: Date.now(),
        ...data,
        date: data.date,
        time: data.time,
        price: Number(data.price) || 0,
        status: 'Chờ phục vụ',
        isReminded: false,
        isApproved: false,
        sharedUpdate: false
      }]);
    } else if (modal.type === 'treatment') {
      const newLog = {
        date: data.date,
        service: data.service,
        staff: data.staff,
        note: data.note,
        images: {}
      };
      setCustomers(customers.map(c =>
        c.id === modal.data.id
          ? { ...c, history: [...(c.history || []), newLog] }
          : c
      ));
      setSelectedLog(newLog);
      alert('Đã thêm buổi điều trị thành công!');
    } else if (modal.type === 'treatment_images') {
      const beforeFile = fd.get('beforeImage');
      const afterFile = fd.get('afterFile');
      
      if (!beforeFile && !afterFile) {
        alert('Vui lòng chọn ít nhất một ảnh.');
        return;
      }

      const processImage = (file) => new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });

      Promise.all([
        beforeFile ? processImage(beforeFile) : Promise.resolve(null),
        afterFile ? processImage(afterFile) : Promise.resolve(null)
      ]).then(([before, after]) => {
        const imageData = { ...modal.data.log.images };
        if (before) imageData.before = before;
        if (after) imageData.after = after;

        setCustomers(customers.map(c =>
          c.id === modal.data.customer.id
            ? {
                ...c,
                history: c.history.map(log =>
                  log === modal.data.log ? { ...log, images: imageData } : log
                )
              }
            : c
        ));
        alert('Đã cập nhật ảnh thành công!');
      });
    }

    setSearchCustomer('');
    setSelectedCustomer(null);
    setModal({ show: false, type: '', data: null });
  };

  // ==================== RENDER ====================
  return (
    <div style={layoutStyle}>
      {/* SIDEBAR */}
      <div style={sidebarStyle}>
        <h2 style={{ color: '#10b981', textAlign: 'center', marginBottom: '40px' }}>SPA MASTER</h2>
        
        {[
          { tab: 'appointments', label: '📅 Lịch Hẹn', notify: false },
          { tab: 'stocks', label: '📈 Cổ Phần & Điểm', notify: false },
          { tab: 'products', label: '🧴 Sản Phẩm Lẻ', notify: false },
          { tab: 'packages', label: '📑 Gói Trị Liệu', notify: false },
          { tab: 'customers', label: '🧖‍♀️ Khách Hàng', notify: false },
          { tab: 'online_orders', label: '🛒 Đơn Online', notify: onlineOrders.some(o => o.status === 'pending') },
          { tab: 'treatment_history', label: '📜 Nhật Ký', notify: false },
          { tab: 'staff', label: '👥 Nhân Viên', notify: false },
          { tab: 'chat', label: '💬 Tin Nhắn', notify: true },
          { tab: 'reports', label: '📊 Doanh Thu', notify: false },
          { tab: 'settings', label: '⚙️ Cài Đặt', notify: false }
        ].map(({ tab, label, notify }) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={tabButtonStyle(styles.navBtn, activeTab === tab)}
          >
            {label}
            {notify && <span style={{ color: '#ef4444', marginLeft: '5px' }}>●</span>}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.mainContent}>
        {activeTab === 'appointments' && (
          <AppointmentsSection
            appointments={appointments}
            packages={packages}
            products={products}
            staffs={staffs}
            customers={customers}
            styles={styles}
            handlers={appointmentHandlers}
            onSetModal={setModal}
            onSetSelectedCustomer={setSelectedCustomer}
            onSetSelectedLog={setSelectedLog}
            onSetActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'stocks' && (
          <StocksSection
            staffs={staffs}
            customers={customers}
            settings={settings}
            styles={styles}
            distributedStocks={distributedStocks}
            onAdjustStock={purchaseHandlers.handleAdjustStock}
          />
        )}

        {activeTab === 'products' && (
          <ProductsSection
            products={products}
            styles={styles}
            onSetModal={setModal}
          />
        )}

        {activeTab === 'packages' && (
          <PackagesSection
            packages={packages}
            styles={styles}
            onSetModal={setModal}
          />
        )}

        {activeTab === 'customers' && (
          <CustomersSection
            customers={customers}
            appointments={appointments}
            styles={styles}
            onSetModal={setModal}
            onSetSelectedCustomer={setSelectedCustomer}
            onSetSelectedLog={setSelectedLog}
            onSetActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'online_orders' && (
          <OnlineOrdersSection
            onlineOrders={onlineOrders}
            styles={styles}
            onSetModal={setModal}
          />
        )}

        {activeTab === 'treatment_history' && !selectedCustomer && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📜 Nhật ký liệu trình</h3>
            <p style={{ color: '#cbd5e1', marginTop: '10px' }}>
              Chọn khách hàng trong mục “🧖‍♀️ Khách Hàng” để xem hoặc cập nhật nhật ký liệu trình.
            </p>
          </div>
        )}

        {activeTab === 'treatment_history' && selectedCustomer && (
          <TreatmentDetailSection
            customer={selectedCustomer}
            selectedLog={selectedLog}
            styles={styles}
            onSetSelectedLog={setSelectedLog}
            onSetActiveTab={setActiveTab}
            onSetModal={setModal}
            onAddTreatmentLog={handleAddTreatmentLog}
          />
        )}

        {activeTab === 'staff' && (
          <StaffSection
            staffs={staffs}
            appointments={appointments}
            styles={styles}
            onSetModal={setModal}
          />
        )}

        {activeTab === 'chat' && (
          <ChatSection
            chatType={chatType}
            setChatType={setChatType}
            activeChat={activeChat}
            setActiveChat={setActiveChat}
            chatSearch={chatSearch}
            setChatSearch={setChatSearch}
            filteredList={getFilteredChatList()}
            styles={styles}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsSection
            appointments={appointments}
            styles={styles}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsSection
            settings={settings}
            onSetSettings={setSettings}
            styles={styles}
          />
        )}
      </div>

      {/* MODAL */}
      <OwnerDashboardModal
        modal={modal}
        onClose={() => setModal({ show: false, type: '', data: null })}
        onSave={handleSaveModal}
        styles={styles}
        data={{
          customers,
          packages,
          products,
          staffs,
          searchCustomer,
          setSearchCustomer,
          setSelectedCustomer
        }}
      />
    </div>
  );
};

export default OwnerDashboard;
