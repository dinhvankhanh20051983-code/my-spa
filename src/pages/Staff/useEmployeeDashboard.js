import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

/**
 * Custom hook for Employee Dashboard data management
 * Handles fetching and updating appointments, treatment logs, salary data, and chat messages
 */
export const useEmployeeDashboard = (user) => {
  const [appointments, setAppointments] = useState([]);
  const [treatmentLogs, setTreatmentLogs] = useState([]);
  const [staffData, setStaffData] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch staff data
  const fetchStaffData = async () => {
    if (!user?.phone) return null;

    try {
      const { data, error } = await supabase
        .from('staffs')
        .select('*')
        .eq('phone', user.phone)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching staff data:', err);
      return null;
    }
  };

  // Fetch appointments for staff
  const fetchAppointments = async () => {
    if (!user?.name) return [];

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('ktv', user.name)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching appointments:', err);
      return [];
    }
  };

  // Fetch treatment logs for customers
  const fetchTreatmentLogs = async (customerIds) => {
    if (!customerIds || customerIds.length === 0) return [];

    try {
      const { data, error } = await supabase
        .from('customer_treatment_logs')
        .select('*')
        .in('customer_id', customerIds)
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching treatment logs:', err);
      return [];
    }
  };

  // Fetch chat messages
  const fetchChatMessages = async () => {
    if (!user?.phone) return [];

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .or(`sender.eq.${user.phone},target_phone.eq.${user.phone}`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching chat messages:', err);
      return [];
    }
  };

  // Load all data
  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [staff, appts] = await Promise.all([
        fetchStaffData(),
        fetchAppointments()
      ]);

      setStaffData(staff);
      setAppointments(appts);

      // Get customer IDs from appointments for treatment logs
      const customerPhones = [...new Set(appts.map(a => a.customer_phone).filter(Boolean))];
      if (customerPhones.length > 0) {
        // First get customer IDs from phones
        const { data: customers } = await supabase
          .from('customers')
          .select('id, phone')
          .in('phone', customerPhones);

        const customerIds = customers?.map(c => c.id) || [];
        const logs = await fetchTreatmentLogs(customerIds);
        setTreatmentLogs(logs);
      }

      const messages = await fetchChatMessages();
      setChatMessages(messages);

    } catch (err) {
      setError(err.message);
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update appointment status
  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', appointmentId)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setAppointments(prev => prev.map(a =>
        a.id === appointmentId ? { ...a, status } : a
      ));

      return data;
    } catch (err) {
      console.error('Error updating appointment:', err);
      throw err;
    }
  };

  // Add treatment log
  const addTreatmentLog = async (customerId, logData) => {
    try {
      const { data, error } = await supabase
        .from('customer_treatment_logs')
        .insert([{
          customer_id: customerId,
          date: new Date().toISOString().split('T')[0],
          service: logData.service,
          staff: user?.name || 'Nhân viên',
          note: logData.note,
          images: logData.images || {},
          skinCondition: logData.skinCondition,
          productsUsed: logData.productsUsed,
          nextStep: logData.nextStep,
          sessionProgress: logData.sessionProgress
        }])
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setTreatmentLogs(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error adding treatment log:', err);
      throw err;
    }
  };

  // Send chat message
  const sendChatMessage = async (message, targetPhone = 'owner') => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([{
          chat_type: 'staff_owner',
          sender: user?.phone || user?.name,
          target_phone: targetPhone,
          text: message
        }])
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setChatMessages(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  };

  // Calculate salary data
  const calculateSalaryData = () => {
    if (!staffData || !appointments.length) return null;

    const completedAppointments = appointments.filter(a => a.status === 'Hoàn thành');
    const totalCommission = completedAppointments.reduce((sum, a) => sum + (a.price * (staffData.serviceComm / 100)), 0);

    // Calculate referral bonus from completed appointments with referral
    const referralBonus = completedAppointments
      .filter(a => a.referral_type === 'Giới thiệu')
      .reduce((sum) => sum + (staffData.consultComm || 0), 0);

    const baseSalary = staffData.baseSalary || 0;
    const totalSalary = baseSalary + totalCommission + referralBonus;

    return {
      baseSalary,
      totalCommission,
      referralBonus,
      totalSalary,
      completedCount: completedAppointments.length,
      serviceCommissionRate: staffData.serviceComm,
      consultCommissionRate: staffData.consultComm
    };
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  return {
    appointments,
    treatmentLogs,
    staffData,
    chatMessages,
    isLoading,
    error,
    salaryData: calculateSalaryData(),
    updateAppointmentStatus,
    addTreatmentLog,
    sendChatMessage,
    refreshData: loadData
  };
};