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
  SettingsSection,
  PaymentHistorySection,
  AnalyticsSection,
  MarketingSection,
  FinancialSection,
  HRSection,
  InventorySection
} from './sections';
import { OwnerDashboardModal } from './OwnerDashboardModal';
import { useInitialData } from './hooks/useInitialData';
import { useAppointmentHandlers } from './hooks/useAppointmentHandlers';
import { usePurchaseHandlers } from './hooks/usePurchaseHandlers';
import EmployeeManager from './EmployeeManager';

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

  // Sync data từ hook khi thay đổi (chỉ lần đầu khi initialData được load)
  useEffect(() => {
    if (initialData.onlineOrders && initialData.onlineOrders.length >= 0) {
      setOnlineOrders(initialData.onlineOrders);
      setCustomers(initialData.customers);
      setAppointments(initialData.appointments);
      setProducts(initialData.products);
      setPackages(initialData.packages);
      setStaffs(initialData.staffs);
      setSettings(initialData.settings);
    }
  }, [initialData.onlineOrders, initialData.customers, initialData.appointments, initialData.products, initialData.packages, initialData.staffs, initialData.settings]);

  // Setup real-time subscriptions for live updates
  useEffect(() => {
    console.log('Setting up real-time subscriptions...');
    
    const onlineOrdersSubscription = supabase
      .channel('online_orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'online_orders' }, (payload) => {
        const eventType = payload.eventType || payload.type || payload.event;
        console.log('🛒 Online order event:', eventType, payload);

        if (eventType === 'INSERT') {
          setOnlineOrders(prev => {
            if (!payload.new) {
              refreshOnlineOrders();
              return prev;
            }
            const exists = prev.some(o => o.id === payload.new.id);
            if (!exists) {
              const camelOrder = snakeToCamel(payload.new);
              console.log('Adding online order:', camelOrder);
              return [camelOrder, ...prev];
            }
            return prev;
          });
        } else if (eventType === 'UPDATE') {
          if (!payload.new) {
            refreshOnlineOrders();
            return;
          }
          setOnlineOrders(prev => prev.map(order => 
            order.id === payload.new.id ? snakeToCamel(payload.new) : order
          ));
        } else if (eventType === 'DELETE') {
          if (!payload.old) {
            refreshOnlineOrders();
            return;
          }
          setOnlineOrders(prev => prev.filter(order => order.id !== payload.old.id));
        } else {
          refreshOnlineOrders();
        }
      })
      .subscribe((status) => console.log('Online orders subscription status:', status));

    const customersSubscription = supabase
      .channel('customers_live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'customers' }, (payload) => {
        const eventType = payload.eventType || payload.type || payload.event;
        console.log('👥 Customer event:', eventType, payload);

        if (eventType === 'INSERT') {
          if (payload.new) {
            setCustomers(prev => {
              const exists = prev.some(customer => customer.id === payload.new.id);
              if (!exists) {
                return [snakeToCamel(payload.new), ...prev];
              }
              return prev;
            });
          }
        } else if (eventType === 'UPDATE') {
          if (payload.new) {
            setCustomers(prev => prev.map(customer => 
              customer.id === payload.new.id ? snakeToCamel(payload.new) : customer
            ));
          }
        } else if (eventType === 'DELETE') {
          if (payload.old) {
            setCustomers(prev => prev.filter(customer => customer.id !== payload.old.id));
          }
        }
      })
      .subscribe();

    const appointmentsSubscription = supabase
      .channel('appointments_live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, (payload) => {
        console.log('📅 Appointments change:', payload);
        if (payload.eventType === 'INSERT') {
          setAppointments(prev => {
            const exists = prev.some(a => a.id === payload.new.id);
            if (!exists) {
              return [snakeToCamel(payload.new), ...prev];
            }
            return prev;
          });
        } else if (payload.eventType === 'UPDATE') {
          setAppointments(prev => prev.map(app => 
            app.id === payload.new.id ? snakeToCamel(payload.new) : app
          ));
        } else if (payload.eventType === 'DELETE') {
          setAppointments(prev => prev.filter(app => app.id !== payload.old.id));
        }
      })
      .subscribe();

    // Subscribe to customer updates (points redemption, etc.)
    const customerUpdatesSubscription = supabase
      .channel('customer_updates')
      .on('broadcast', { event: 'points_redeemed' }, (payload) => {
        console.log('🎁 Customer points redeemed:', payload);
        setCustomers(prev => prev.map(customer => 
          customer.id === payload.payload.customerId 
            ? { ...customer, points: payload.payload.newPoints }
            : customer
        ));
      })
      .on('broadcast', { event: 'purchase_completed' }, (payload) => {
        console.log('💰 Customer purchase completed:', payload);
        setCustomers(prev => prev.map(customer => 
          customer.id === payload.payload.customerId 
            ? { ...customer, points: payload.payload.newPoints }
            : customer
        ));
      })
      .subscribe();

    return () => {
      console.log('Cleaning up subscriptions...');
      supabase.removeChannel(onlineOrdersSubscription);
      supabase.removeChannel(customersSubscription);
      supabase.removeChannel(appointmentsSubscription);
      supabase.removeChannel(customerUpdatesSubscription);
    };
  }, []);

  // UI State
  const [chatType, setChatType] = useState('staff');
  const [activeChat, setActiveChat] = useState(null);
  const [chatSearch, setChatSearch] = useState('');
  const [searchCustomer, setSearchCustomer] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isSupabaseLoading, setIsSupabaseLoading] = useState(true);

  const snakeToCamel = (row) => {
    // Special mapping for fields that are lowercase in DB
    const reverseMapping = {
      basesalary: 'baseSalary',
      servicecomm: 'serviceComm',
      consultcomm: 'consultComm',
      rewardpoints: 'rewardPoints',
      spaname: 'spaName',
      footernote: 'footerNote',
      packagepointrate: 'packagePointRate',
      productpointrate: 'productPointRate',
      currencysymbol: 'currencySymbol',
      taxrate: 'taxRate',
      reminderleadtime: 'reminderLeadTime',
      businesshours: 'businessHours',
      signaturenote: 'signatureNote',
      emailsupport: 'emailSupport',
      invoiceprefix: 'invoicePrefix',
      totalstocks: 'totalStocks',
      defaultbasesalary: 'defaultBaseSalary',
      defaultservicecomm: 'defaultServiceComm',
      defaultconsultcomm: 'defaultConsultComm',
      referralpoints: 'referralPoints',
      referralstocks: 'referralStocks'
    };
    
    return Object.entries(row || {}).reduce((acc, [key, value]) => {
      if (reverseMapping[key]) {
        // Use the mapped camelCase field name
        acc[reverseMapping[key]] = value;
      } else {
        // Convert other snake_case fields to camelCase
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        acc[camelKey] = value;
      }
      return acc;
    }, {});
  };

  const camelToSnake = (row) => {
    // Special mapping for fields that are lowercase in DB
    const fieldMapping = {
      baseSalary: 'basesalary',
      serviceComm: 'servicecomm',
      consultComm: 'consultcomm',
      rewardPoints: 'rewardpoints',
      spaName: 'spaname',
      footerNote: 'footernote',
      packagePointRate: 'packagepointrate',
      productPointRate: 'productpointrate',
      currencySymbol: 'currencysymbol',
      taxRate: 'taxrate',
      reminderLeadTime: 'reminderleadtime',
      businessHours: 'businesshours',
      signatureNote: 'signaturenote',
      emailSupport: 'emailsupport',
      invoicePrefix: 'invoiceprefix',
      totalStocks: 'totalstocks',
      defaultBaseSalary: 'defaultbasesalary',
      defaultServiceComm: 'defaultservicecomm',
      defaultConsultComm: 'defaultconsultcomm',
      referralPoints: 'referralpoints',
      referralStocks: 'referralstocks'
    };
    
    return Object.entries(row || {}).reduce((acc, [key, value]) => {
      if (fieldMapping[key]) {
        // Use the mapped lowercase field name
        acc[fieldMapping[key]] = value;
      } else {
        // Convert other fields to snake_case
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        acc[snakeKey] = value;
      }
      return acc;
    }, {});
  };

  const handleAddTreatmentLog = async (customerId, newLog) => {
    // Find customer
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    // Find active package (with remaining sessions > 0)
    const activePackage = customer.my_packages?.find(pkg => pkg.remaining_sessions > 0);
    if (!activePackage) {
      alert('Khách hàng không có gói trị liệu đang hoạt động!');
      return;
    }

    // Reduce remaining sessions
    const updatedMyPackages = customer.my_packages.map(pkg =>
      pkg === activePackage
        ? { ...pkg, remaining_sessions: pkg.remaining_sessions - 1 }
        : pkg
    );

    // Update customer in local state
    setCustomers(prev => prev.map(c =>
      c.id === customerId
        ? { ...c, history: [...(c.history || []), newLog], my_packages: updatedMyPackages }
        : c
    ));

    setSelectedCustomer(prev =>
      prev && prev.id === customerId
        ? { ...prev, history: [...(prev.history || []), newLog], my_packages: updatedMyPackages }
        : prev
    );

    setSelectedLog(newLog);

    // Update in Supabase
    const { error } = await supabase
      .from('customers')
      .update({ history: [...(customer.history || []), newLog], my_packages: updatedMyPackages })
      .eq('id', customerId);

    if (error) {
      console.error('Supabase update customer treatment failed:', error);
      alert('Đã thêm buổi trị liệu cục bộ, nhưng Supabase chưa đồng bộ được.');
    } else {
      // Update package stats after session used
      await updatePackageStats(activePackage.package_id);
      alert('Đã thêm buổi trị liệu và đồng bộ Supabase.');
    }
  };

  const safeFetchTable = async (table, defaultValue = []) => {
    const { data, error } = await supabase.from(table).select('*').order('id', { ascending: true });
    if (error) {
      console.error(`Supabase fetch ${table} failed:`, error);
    }
    const mapped = Array.isArray(data) ? data.map(snakeToCamel) : defaultValue;
    console.log(`Supabase fetch ${table}:`, mapped);
    return error || !data ? defaultValue : mapped;
  };

  const safeFetchSettings = async () => {
    const { data, error } = await supabase.from('settings').select('*').maybeSingle();
    if (error) {
      console.error('Supabase fetch settings failed:', error);
    }
    console.log('Supabase fetch settings:', data);
    
    if (error || !data) {
      return initialData.settings;
    }

    // Data is already in camelCase from DB
    return {
      ...initialData.settings,
      ...data,
      id: data.id,
      spaName: data.spaName,
      address: data.address,
      phone: data.phone,
      footerNote: data.footerNote,
      emailSupport: data.emailSupport,
      referralPoints: data.referralPoints,
      referralStocks: data.referralStocks,
      productPointRate: data.productPointRate,
      packagePointRate: data.packagePointRate,
      defaultBaseSalary: data.defaultBaseSalary,
      defaultServiceComm: data.defaultServiceComm,
      defaultConsultComm: data.defaultConsultComm,
      taxRate: data.taxRate,
      invoicePrefix: data.invoicePrefix
    };
  };

  const saveSettingsToSupabase = async (settingsToSave) => {
    try {
      const cleanSettings = {
        spaName: settingsToSave.spaName,
        address: settingsToSave.address,
        phone: settingsToSave.phone,
        footerNote: settingsToSave.footerNote,
        emailSupport: settingsToSave.emailSupport,
        referralPoints: Number(settingsToSave.referralPoints ?? 0),
        referralStocks: Number(settingsToSave.referralStocks ?? 0),
        productPointRate: Number(settingsToSave.productPointRate ?? 1),
        packagePointRate: Number(settingsToSave.packagePointRate ?? 1),
        defaultBaseSalary: Number(settingsToSave.defaultBaseSalary ?? 6000000),
        defaultServiceComm: Number(settingsToSave.defaultServiceComm ?? 10),
        defaultConsultComm: Number(settingsToSave.defaultConsultComm ?? 5),
        taxRate: Number(settingsToSave.taxRate ?? 10),
        invoicePrefix: settingsToSave.invoicePrefix || 'HD'
      };

      const saveAction = settingsToSave.id ?
        supabase.from('settings').update(cleanSettings).eq('id', settingsToSave.id) :
        supabase.from('settings').insert([cleanSettings]);

      const { data, error } = await saveAction.select().single();
      if (error) {
        console.error('Supabase save settings failed:', error);
        return { error };
      }

      return { data: {
        ...data,
        id: data.id,
        spaName: data.spaname,
        address: data.address,
        phone: data.phone,
        footerNote: data.footernote,
        emailSupport: data.emailsupport,
        referralPoints: data.referralpoints,
        referralStocks: data.referralstocks,
        productPointRate: data.productpointrate,
        packagePointRate: data.packagepointrate,
        defaultBaseSalary: data.defaultbasesalary,
        defaultServiceComm: data.defaultservicecomm,
        defaultConsultComm: data.defaultconsultcomm,
        taxRate: data.taxrate,
        invoicePrefix: data.invoiceprefix
      }};
    } catch (error) {
      console.error('Error saving settings:', error);
      return { error };
    }
  };

  const handleSaveSettings = async (updatedSettings) => {
    const { data, error } = await saveSettingsToSupabase(updatedSettings);
    if (error) {
      alert('Lưu cấu hình chưa thành công. Vui lòng thử lại.');
      return false;
    }
    if (data) {
      setSettings(data);
      alert('Đã lưu cấu hình hệ thống thành công!');
      return true;
    }
    return false;
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) return;
    const { error } = await deleteRow('customers', customerId, setCustomers);
    if (error) {
      alert('Xóa khách hàng cục bộ thành công, nhưng Supabase chưa đồng bộ được.');
    } else {
      alert('Đã xóa khách hàng thành công.');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) return;
    const { error } = await deleteRow('online_orders', orderId, setOnlineOrders);
    if (error) {
      alert('Xóa đơn hàng cục bộ thành công, nhưng Supabase chưa đồng bộ được.');
    } else {
      alert('Đã xóa đơn hàng thành công.');
    }
  };

  const handleDeletePackage = async (packageId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa gói này?')) return;
    const { error } = await deleteRow('packages', packageId, setPackages);
    if (error) {
      alert('Xóa gói cục bộ thành công, nhưng Supabase chưa đồng bộ được.');
    } else {
      alert('Đã xóa gói thành công.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    const { error } = await deleteRow('products', productId, setProducts);
    if (error) {
      alert('Xóa sản phẩm cục bộ thành công, nhưng Supabase chưa đồng bộ được.');
    } else {
      alert('Đã xóa sản phẩm thành công.');
    }
  };

  const insertRow = async (table, row, setter) => {
    const snakeRow = camelToSnake(row);
    const { data, error } = await supabase.from(table).insert([snakeRow]).select();
    if (error) {
      console.error(`Supabase insert ${table} failed:`, error);
      return { error };
    }
    const mapped = Array.isArray(data) ? data.map(snakeToCamel) : data;
    if (mapped && mapped.length > 0) {
      setter(prev => [...prev, mapped[0]]);
      return { data: mapped[0] };
    }
    return { data: row };
  };

  const updateRow = async (table, id, updates, setter) => {
    const snakeUpdates = camelToSnake(updates);
    const { data, error } = await supabase.from(table).update(snakeUpdates).eq('id', id).select();
    if (error) {
      console.error(`Supabase update ${table} failed:`, error);
      return { error };
    }
    const mapped = Array.isArray(data) ? data.map(snakeToCamel) : data;
    if (mapped && mapped.length > 0) {
      setter(prev => prev.map(item => item.id === id ? mapped[0] : item));
      return { data: mapped[0] };
    }
    return { data: null };
  };

  const deleteRow = async (table, id, setter) => {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      console.error(`Supabase delete ${table} failed:`, error);
      return { error };
    }
    setter(prev => prev.filter(item => item.id !== id));
    return { data: null };
  };

  const findCustomerByPhone = async (phone) => {
    const trimmedPhone = phone?.trim();
    if (!trimmedPhone) return null;
    const { data, error } = await supabase.from('customers').select('*').eq('phone', trimmedPhone).maybeSingle();
    if (error) {
      console.error('Supabase find customer by phone failed:', error);
      return null;
    }
    return data ? snakeToCamel(data) : null;
  };

  const createCustomerIfMissing = async ({ name, phone }) => {
    const trimmedName = name?.trim() || 'Khách mới';
    const trimmedPhone = phone?.trim();
    if (!trimmedPhone) {
      return { error: new Error('Số điện thoại khách hàng không hợp lệ.') };
    }

    const newCustomer = {
      name: trimmedName,
      phone: trimmedPhone,
      points: 0,
      stocks: 0,
      referral_code: trimmedPhone,
      referred_by: '',
      referral_rewarded: false,
      my_packages: [],
      history: []
    };

    const { data, error } = await supabase.from('customers').insert([camelToSnake(newCustomer)]).select().single();
    if (error) {
      console.error('Supabase create customer failed:', error);
      return { error };
    }

    const mapped = snakeToCamel(data);
    setCustomers(prev => [mapped, ...prev]);
    return { data: mapped };
  };

  const findOrCreateCustomer = async ({ name, phone }) => {
    const existingCustomer = await findCustomerByPhone(phone);
    if (existingCustomer) return { data: existingCustomer };
    return await createCustomerIfMissing({ name, phone });
  };

  const updateCustomerHistory = async (customerId, updatedHistory) => {
    const { data, error } = await supabase.from('customers').update({ history: updatedHistory }).eq('id', customerId).select();
    if (error) {
      console.error('Supabase update customer history failed:', error);
      return { error };
    }
    if (data && data.length > 0) {
      const mapped = data.map(snakeToCamel);
      setCustomers(prev => prev.map(c => c.id === customerId ? mapped[0] : c));
      if (selectedCustomer?.id === customerId) {
        setSelectedCustomer(mapped[0]);
      }
      return { data: mapped[0] };
    }
    return { data: null };
  };

  // Cập nhật thống kê gói trị liệu (số khách dùng, doanh thu)
  const updatePackageStats = async (packageId) => {
    try {
      // Tính số khách đang sử dụng gói
      const usersCount = customers.filter(customer =>
        customer.my_packages?.some(pkg =>
          pkg.package_id === packageId && pkg.remaining_sessions > 0
        )
      ).length;

      // Tính tổng doanh thu từ gói
      const revenue = customers.reduce((total, customer) => {
        const customerPackage = customer.my_packages?.find(pkg => pkg.package_id === packageId);
        if (customerPackage) {
          return total + (customerPackage.total_price || 0);
        }
        return total;
      }, 0);

      // Cập nhật vào database
      const { error } = await supabase
        .from('packages')
        .update({ usersCount, revenue })
        .eq('id', packageId);

      if (error) {
        console.error('Error updating package stats:', error);
      } else {
        // Cập nhật local state
        setPackages(prev => prev.map(pkg => 
          pkg.id === packageId 
            ? { ...pkg, usersCount, revenue }
            : pkg
        ));
      }
    } catch (error) {
      console.error('Error in updatePackageStats:', error);
    }
  };

  const updateOnlineOrderStatus = async (id, status) => {
    return updateRow('online_orders', id, { status }, setOnlineOrders);
  };

  const loadSupabaseData = async () => {
    setIsSupabaseLoading(true);
    const [productsData, packagesData, staffsData, customersData, appointmentsData, onlineOrdersData, settingsData] = await Promise.all([
      safeFetchTable('products', initialData.products),
      safeFetchTable('packages', initialData.packages),
      safeFetchTable('staffs', initialData.staffs),
      safeFetchTable('customers', initialData.customers),
      safeFetchTable('appointments', initialData.appointments),
      safeFetchTable('online_orders', initialData.onlineOrders),
      safeFetchSettings()
    ]);

    setProducts(productsData);
    setPackages(packagesData);
    setStaffs(staffsData);
    setCustomers(customersData);
    setAppointments(appointmentsData);
    setOnlineOrders(onlineOrdersData);
    setSettings(settingsData);
    setIsSupabaseLoading(false);
  };

  const refreshOnlineOrders = useCallback(async () => {
    setIsOrderSyncing(true);
    const { data, error } = await supabase
      .from('online_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOnlineOrders(Array.isArray(data) ? data.map(snakeToCamel) : []);
    }
    setIsOrderSyncing(false);
  }, [snakeToCamel]);

  useEffect(() => {
    loadSupabaseData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(refreshOnlineOrders, 10000);
    const handleFocus = () => refreshOnlineOrders();

    window.addEventListener('focus', handleFocus);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshOnlineOrders]);

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
    setOnlineOrders,
    updatePackageStats
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
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOnlineOrders(Array.isArray(data) ? data.map(snakeToCamel) : []);
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
  const handleSaveModal = async (data) => {

    if (modal.type === 'product') {
      const product = {
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
        rewardPoints: Number(data.rewardPoints || 0)
      };
      if (modal.data?.id) {
        // Update existing product
        const { error } = await updateRow('products', modal.data.id, product, setProducts);
        if (error) {
          alert('Cập nhật sản phẩm cục bộ thành công, nhưng Supabase chưa đồng bộ được.');
        } else {
          alert('Đã cập nhật sản phẩm và đồng bộ Supabase.');
        }
      } else {
        // Insert new product
        const { error } = await insertRow('products', product, setProducts);
        if (error) {
          alert('Lưu sản phẩm cục bộ thành công, nhưng Supabase chưa đồng bộ được.');
        } else {
          alert('Đã lưu sản phẩm và đồng bộ Supabase.');
        }
      }
    } else if (modal.type === 'package') {
      // Calculate users using this package and total revenue
      const usersCount = customers.filter(customer =>
        customer.my_packages?.some(pkg =>
          pkg.package_id === (modal.data?.id || 'new') && pkg.remaining_sessions > 0
        )
      ).length;
      
      const revenue = customers.reduce((total, customer) => {
        const customerPackage = customer.my_packages?.find(pkg => 
          pkg.package_id === (modal.data?.id || 'new')
        );
        if (customerPackage) {
          return total + (customerPackage.total_price || 0);
        }
        return total;
      }, 0);

      const packageData = {
        ...data,
        price: Number(data.price),
        sessions: Number(data.sessions),
        rewardPoints: Number(data.rewardPoints || 0),
        usersCount: usersCount,
        revenue: revenue
      };
      if (modal.data?.id) {
        // Update existing package
        const { error } = await updateRow('packages', modal.data.id, packageData, setPackages);
        if (error) {
          alert('Cập nhật gói liệu trình cục bộ thành công, nhưng Supabase chưa đồng bộ được.');
        } else {
          alert('Đã cập nhật gói liệu trình và đồng bộ Supabase.');
        }
      } else {
        // Insert new package
        const { error } = await insertRow('packages', packageData, setPackages);
        if (error) {
          alert('Lưu gói liệu trình cục bộ thành công, nhưng Supabase chưa đồng bộ được.');
        } else {
          alert('Đã lưu gói liệu trình và đồng bộ Supabase.');
        }
      }
    } else if (modal.type === 'staff') {
      const newStaff = {
        ...data,
        baseSalary: Number(data.baseSalary) || settings.defaultBaseSalary,
        serviceComm: Number(data.serviceComm) || settings.defaultServiceComm,
        consultComm: Number(data.consultComm) || settings.defaultConsultComm,
        stocks: 0
      };
      const { error } = await insertRow('staffs', newStaff, setStaffs);
      if (error) {
        alert('Lưu nhân viên cục bộ thành công, nhưng Supabase chưa đồng bộ được.');
      } else {
        alert('Đã lưu nhân viên và đồng bộ Supabase.');
      }
    } else if (modal.type === 'customer') {
      const newCustomer = {
        ...data,
        referral_code: data.phone,
        referred_by: data.referredBy || '',
        referral_rewarded: false,
        my_packages: [],
        points: 0,
        stocks: 0,
        history: []
      };
      const { error } = await insertRow('customers', newCustomer, setCustomers);
      if (error) {
        alert('Lưu khách hàng cục bộ thành công, nhưng Supabase chưa đồng bộ được.');
      } else {
        alert('Đã lưu khách hàng và đồng bộ Supabase.');
      }
    } else if (modal.type === 'customer_purchase') {
      await purchaseHandlers.handleCustomerPurchase(modal.data, data);
    } else if (modal.type === 'confirm_order') {
      try {
        await purchaseHandlers.handleConfirmOrder(modal.data);
        setModal({ show: false, type: '', data: null });
      } catch (error) {
        console.error('Error confirming order:', error);
        alert('Có lỗi xảy ra khi xác nhận đơn hàng. Vui lòng thử lại.');
      }
    } else if (modal.type === 'cancel_order') {
      await purchaseHandlers.handleCancelOrder(modal.data.id);
    } else if (modal.type === 'appointment') {
      if (!data.customerName || !data.customerPhone) {
        return alert('Vui lòng nhập đầy đủ tên khách hàng và số điện thoại.');
      }
      if (data.customerPhone.length < 9) {
        return alert('Số điện thoại phải có ít nhất 9 chữ số.');
      }

      let customerId = data.selectedCustomerId ? parseInt(data.selectedCustomerId, 10) : null;
      if (!customerId) {
        const { data: customerData, error: customerError } = await findOrCreateCustomer({
          name: data.customerName,
          phone: data.customerPhone
        });
        if (customerError || !customerData) {
          console.error('Không thể tạo hoặc tìm khách hàng:', customerError);
          return alert('Không thể lưu thông tin khách hàng. Vui lòng thử lại.');
        }
        customerId = customerData.id;
      }

      const newAppointment = {
        customerName: data.customerName.trim(),
        customerPhone: data.customerPhone.trim(),
        service: data.service,
        ktv: data.ktv,
        date: data.date,
        time: data.time,
        price: Number(data.price) || 0,
        status: 'Chờ phục vụ',
        isReminded: false,
        isApproved: false,
        sharedUpdate: false,
        createdAt: new Date().toISOString()
      };

      const { error } = await insertRow('appointments', newAppointment, setAppointments);
      if (error) {
        alert('Lưu lịch hẹn cục bộ thành công, nhưng Supabase chưa đồng bộ được.');
      } else {
        // Logic trừ gói trị liệu sau khi tạo appointment thành công
        if (customerId) {
          const customer = customers.find(c => c.id === customerId);
          if (customer && customer.my_packages && customer.my_packages.length > 0) {
            const availablePackage = customer.my_packages.find(pkg => pkg.remaining_sessions > 0);
            if (availablePackage) {
              const updatedPackages = customer.my_packages.map(pkg => 
                pkg.package_id === availablePackage.package_id 
                  ? { ...pkg, remaining_sessions: pkg.remaining_sessions - 1 }
                  : pkg
              );
              
              const { error: updateError } = await supabase
                .from('customers')
                .update({ my_packages: updatedPackages })
                .eq('id', customer.id);
              
              if (!updateError) {
                setCustomers(prevCustomers => 
                  prevCustomers.map(c => 
                    c.id === customer.id 
                      ? { ...c, my_packages: updatedPackages }
                      : c
                  )
                );
                const packageInfo = packages.find(p => p.id === availablePackage.package_id);
                alert(`✅ Đã tạo lịch hẹn và trừ 1 buổi từ gói "${packageInfo?.name || 'N/A'}". Còn ${availablePackage.remaining_sessions - 1} buổi.`);
              } else {
                console.error('Error updating package sessions:', updateError);
                alert('Đã tạo lịch hẹn thành công, nhưng không thể trừ buổi gói trị liệu.');
              }
            } else {
              alert('Đã tạo lịch hẹn thành công. Khách hàng không có gói trị liệu nào còn buổi.');
            }
          } else {
            alert('Đã tạo lịch hẹn thành công.');
          }
        } else {
          alert('Đã lưu lịch hẹn và đồng bộ Supabase.');
        }
      }
    } else if (modal.type === 'treatment') {
      const newLog = {
        customer_id: modal.data.id,
        date: data.date,
        service: data.service,
        staff: data.staff,
        note: data.note,
        images: {},
        created_at: new Date().toISOString()
      };
      const { data: saved, error } = await supabase.from('customer_treatment_logs').insert([newLog]).select();
      const resultLog = saved && saved.length > 0 ? saved[0] : newLog;

      setCustomers(customers.map(c =>
        c.id === modal.data.id
          ? { ...c, history: [...(c.history || []), resultLog] }
          : c
      ));
      setSelectedCustomer(prev =>
        prev && prev.id === modal.data.id
          ? { ...prev, history: [...(prev.history || []), resultLog] }
          : prev
      );
      setSelectedLog(resultLog);

      if (error) {
        alert('Đã thêm buổi điều trị cục bộ, nhưng Supabase chưa đồng bộ được.');
      } else {
        alert('Đã thêm buổi điều trị và đồng bộ Supabase.');
      }
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

      const [before, after] = await Promise.all([
        beforeFile ? processImage(beforeFile) : Promise.resolve(null),
        afterFile ? processImage(afterFile) : Promise.resolve(null)
      ]);

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

      if (modal.data.log.id) {
        const { error } = await supabase
          .from('customer_treatment_logs')
          .update({ images: imageData })
          .eq('id', modal.data.log.id);
        if (error) {
          console.error('Supabase treatment image update failed:', error);
          alert('Ảnh đã cập nhật cục bộ, nhưng Supabase chưa đồng bộ được.');
        } else {
          alert('Đã cập nhật ảnh liệu trình và đồng bộ Supabase.');
        }
      } else {
        alert('Đã cập nhật ảnh liệu trình cục bộ. Nếu đăng ký Supabase, ảnh sẽ được đồng bộ sau.');
      }
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
          { tab: 'orders_payments', label: '💰 Đơn & Thanh Toán', notify: onlineOrders.some(o => o.status === 'pending' || o.paymentStatus === 'pending') },
          { tab: 'treatment_history', label: '📜 Nhật Ký', notify: false },
          { tab: 'inventory', label: '📦 Kho Hàng', notify: false },
          { tab: 'staff', label: ' Quản Lý NV', notify: false },
          { tab: 'analytics', label: '📊 Phân Tích', notify: false },
          { tab: 'marketing', label: '🎯 Marketing', notify: false },
          { tab: 'financial', label: '💳 Tài Chính', notify: false },
          { tab: 'hr', label: '👥 Nhân Sự', notify: false },
          { tab: 'chat', label: '💬 Tin Nhắn', notify: true },
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

        {/* TEST BROADCAST BUTTON */}
        <button
          onClick={async () => {
            console.log('🧪 TESTING BROADCAST...');
            try {
              await supabase.channel('order_updates').httpSend('order_confirmed', {
                customerPhone: 'test_phone',
                rewardPoints: 100,
                orderId: 'test_order',
                customerId: 'test_customer',
                newPoints: 999,
                timestamp: new Date().toISOString()
              });
              console.log('✅ Test broadcast sent');
              alert('Test broadcast sent! Check customer dashboard console.');
            } catch (error) {
              console.error('❌ Test broadcast failed:', error);
              alert('Test broadcast failed: ' + error.message);
            }
          }}
          style={{
            marginTop: '20px',
            padding: '8px 12px',
            background: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          🧪 Test Broadcast
        </button>
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
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {activeTab === 'packages' && (
          <PackagesSection
            packages={packages}
            customers={customers}
            styles={styles}
            onSetModal={setModal}
            onDeletePackage={handleDeletePackage}
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
            searchQuery={customerSearch}
            onSearchChange={setCustomerSearch}
            onDeleteCustomer={handleDeleteCustomer}
          />
        )}

        {activeTab === 'online_orders' && (
          <OnlineOrdersSection
            onlineOrders={onlineOrders}
            styles={styles}
            onSetModal={setModal}
            onDeleteOrder={handleDeleteOrder}
          />
        )}

        {activeTab === 'payment_history' && (
          <PaymentHistorySection
            orders={onlineOrders}
            customers={customers}
            settings={settings}
            styles={styles}
          />
        )}

        {activeTab === 'orders_payments' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={styles.sectionTitle}>🛒 Quản lý đơn hàng online</h3>
              <OnlineOrdersSection
                onlineOrders={onlineOrders}
                styles={styles}
                onSetModal={setModal}
                onDeleteOrder={handleDeleteOrder}
              />
            </div>
            
            <div style={{ marginTop: '40px' }}>
              <h3 style={styles.sectionTitle}>💳 Lịch sử thanh toán</h3>
              <PaymentHistorySection
                orders={onlineOrders}
                customers={customers}
                settings={settings}
                styles={styles}
              />
            </div>
          </div>
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
          <EmployeeManager />
        )}

        {activeTab === 'inventory' && (
          <InventorySection
            products={products}
            styles={styles}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsSection
            appointments={appointments}
            onlineOrders={onlineOrders}
            customers={customers}
            staffs={staffs}
            products={products}
            packages={packages}
            styles={styles}
          />
        )}

        {activeTab === 'marketing' && (
          <MarketingSection
            customers={customers}
            styles={styles}
          />
        )}

        {activeTab === 'financial' && (
          <FinancialSection
            appointments={appointments}
            onlineOrders={onlineOrders}
            staffs={staffs}
            styles={styles}
          />
        )}

        {activeTab === 'hr' && (
          <HRSection
            staffs={staffs}
            styles={styles}
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
            onSaveSettings={handleSaveSettings}
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
