import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import InvoiceModule from '../../../utils/InvoiceModule';
import PaymentConfirmationModal from '../../../components/PaymentConfirmationModal';

export const PaymentHistorySection = ({ orders = [], customers = [], settings, styles }) => {
  const [paymentRecords, setPaymentRecords] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentSummary, setPaymentSummary] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState(null);

  useEffect(() => {
    loadPaymentRecords();
    const summary = InvoiceModule.calculatePaymentSummary(orders);
    setPaymentSummary(summary);
  }, [orders]);

  const loadPaymentRecords = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payment_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load payment records:', error);
        // If table doesn't exist, show empty array
        if (error.code === 'PGRST205') {
          console.warn('Payment records table does not exist. Please create it in Supabase dashboard.');
          setPaymentRecords([]);
        }
      } else {
        console.log('Payment records loaded:', data);
        setPaymentRecords(data || []);
      }
    } catch (err) {
      console.error('Error loading payment records:', err);
      setPaymentRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async (order) => {
    if (!order || !order.id) {
      alert('Vui lòng chọn đơn hàng hợp lệ');
      return;
    }

    setSelectedOrderForPayment(order);
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = async (paymentData) => {
    if (!selectedOrderForPayment) return;

    const order = selectedOrderForPayment;
    setLoading(true);

    console.log('Recording payment for order:', order);
    console.log('Payment data:', paymentData);

    try {
      const paymentRecord = InvoiceModule.createPaymentRecord(
        paymentData.invoiceNumber,
        paymentData.amount,
        paymentData.paymentMethod,
        order.customerId
      );

      // Add order_id and notes
      paymentRecord.order_id = order.id;
      if (paymentData.notes) {
        paymentRecord.notes = paymentData.notes;
      }

      console.log('Payment record to insert:', paymentRecord);

      const { data, error } = await supabase
        .from('payment_records')
        .insert([paymentRecord])
        .select();

      if (error) {
        console.error('Payment insert error:', error);
        alert('Lỗi ghi nhận thanh toán: ' + error.message);
        return;
      }

      console.log('Payment record inserted:', data);

      // Update order payment status
      const newAmountPaid = (order.amountPaid || 0) + paymentData.amount;
      const newPaymentStatus = newAmountPaid >= order.totalAmount ? 'paid' : 'partial';

      console.log('Updating order payment status:', {
        orderId: order.id,
        newAmountPaid,
        newPaymentStatus
      });

      const { error: updateError } = await supabase
        .from('online_orders')
        .update({
          amount_paid: newAmountPaid,
          payment_status: newPaymentStatus
        })
        .eq('id', order.id);

      if (updateError) {
        console.error('Order update error:', updateError);
        alert('Lỗi cập nhật trạng thái đơn hàng: ' + updateError.message);
        return;
      }

      alert('✅ Đã ghi nhận thanh toán thành công!');
      setShowPaymentModal(false);
      setSelectedOrderForPayment(null);
      loadPaymentRecords(); // Refresh payment records
    } catch (err) {
      console.error('Error recording payment:', err);
      alert('Có lỗi xảy ra khi ghi nhận thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.paymentStatus === filterStatus;
    const matchesSearch = !searchQuery || 
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone?.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const statusColors = {
    'paid': '#10b981',
    'pending': '#f59e0b',
    'partial': '#8b5cf6',
    'overdue': '#ef4444',
    'cancelled': '#6b7280'
  };

  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>💳 LỊCH SỬ THANH TOÁN & HÓA ĐƠN</h3>

      {/* Payment Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div style={{
          padding: '20px',
          backgroundColor: '#0f172a',
          borderRadius: '12px',
          border: '1px solid #334155'
        }}>
          <p style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '13px' }}>📊 Tổng Đơn Hàng</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#0ea5e9' }}>
            {paymentSummary.totalOrders || 0}
          </p>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#0f172a',
          borderRadius: '12px',
          border: '1px solid #334155'
        }}>
          <p style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '13px' }}>💰 Tổng Doanh Thu</p>
          <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>
            {InvoiceModule.formatCurrency(paymentSummary.totalRevenue || 0)}
          </p>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#0f172a',
          borderRadius: '12px',
          border: '1px solid #334155'
        }}>
          <p style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '13px' }}>✅ Đã Thanh Toán</p>
          <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#6ee7b7' }}>
            {InvoiceModule.formatCurrency(paymentSummary.totalPaid || 0)}
          </p>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#0f172a',
          borderRadius: '12px',
          border: '1px solid #334155'
        }}>
          <p style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '13px' }}>⏳ Chờ Thanh Toán</p>
          <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>
            {InvoiceModule.formatCurrency(paymentSummary.totalPending || 0)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '15px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <button
          onClick={() => loadPaymentRecords()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#0ea5e9',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          🔄 Refresh
        </button>

        <input
          type="text"
          placeholder="🔍 Tìm kiếm khách hàng, SĐT..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            ...styles.input,
            flex: 1,
            minWidth: '200px'
          }}
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            ...styles.input,
            minWidth: '150px'
          }}
        >
          <option value="all">📋 Tất Cả Trạng Thái</option>
          <option value="paid">✅ Đã Thanh Toán</option>
          <option value="pending">⏳ Chờ Thanh Toán</option>
          <option value="partial">⚡ Thanh Toán Một Phần</option>
          <option value="overdue">⚠️ Quá Hạn</option>
        </select>
      </div>

      {/* Orders Table */}
      <div style={styles.card}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>⏳ Đang tải...</p>
        ) : filteredOrders.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>
            📭 Không có đơn hàng nào
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #334155', backgroundColor: '#1e293b' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#94a3b8' }}>Mã Đơn</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#94a3b8' }}>Khách Hàng</th>
                  <th style={{ padding: '12px', textAlign: 'right', color: '#94a3b8' }}>Tổng Tiền</th>
                  <th style={{ padding: '12px', textAlign: 'right', color: '#94a3b8' }}>Đã Thanh Toán</th>
                  <th style={{ padding: '12px', textAlign: 'right', color: '#94a3b8' }}>Còn Lại</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#94a3b8' }}>Trạng Thái</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#94a3b8' }}>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    style={{
                      borderBottom: '1px solid #334155',
                      backgroundColor: selectedOrder?.id === order.id ? '#1e293b' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                  >
                    <td style={{ padding: '12px', color: '#cbd5e1', fontWeight: 'bold' }}>
                      {InvoiceModule.generateInvoiceNumber(settings.invoicePrefix || 'INV', order.id, order.invoiceCode)}
                    </td>
                    <td style={{ padding: '12px', color: '#e2e8f0' }}>
                      {order.customerName}
                      <br />
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>📞 {order.customerPhone}</span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', color: '#cbd5e1', fontWeight: 'bold' }}>
                      {InvoiceModule.formatCurrency(order.totalAmount || order.totalPrice || order.total_price || 0)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', color: '#10b981' }}>
                      {InvoiceModule.formatCurrency(order.amountPaid || order.amount_paid || 0)}
                    </td>
                    <td style={{ 
                      padding: '12px', 
                      textAlign: 'right', 
                      color: (order.totalAmount || order.totalPrice || order.total_price || 0) - (order.amountPaid || order.amount_paid || 0) > 0 ? '#f59e0b' : '#10b981',
                      fontWeight: 'bold'
                    }}>
                      {InvoiceModule.formatCurrency((order.totalAmount || order.totalPrice || order.total_price || 0) - (order.amountPaid || order.amount_paid || 0))}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{
                        padding: '6px 12px',
                        backgroundColor: statusColors[order.paymentStatus] || '#64748b',
                        color: '#fff',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {InvoiceModule.getPaymentStatusLabel(order.paymentStatus)}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRecordPayment(order);
                        }}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#0ea5e9',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      >
                        💳 Ghi Nhận
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details */}
      {selectedOrder && (
        <div style={{
          marginTop: '30px',
          padding: '25px',
          backgroundColor: '#0f172a',
          borderRadius: '12px',
          border: '2px solid #0ea5e9'
        }}>
          <h4 style={{ color: '#0ea5e9', marginTop: 0 }}>
            📋 Chi Tiết Đơn Hàng: {InvoiceModule.generateInvoiceNumber(settings.invoicePrefix || 'INV', selectedOrder.id, selectedOrder.invoiceCode)}
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h5 style={{ color: '#94a3b8', marginTop: 0 }}>Thông Tin Khách Hàng:</h5>
              <p style={{ margin: '8px 0', color: '#cbd5e1' }}>👤 {selectedOrder.customerName}</p>
              <p style={{ margin: '8px 0', color: '#cbd5e1' }}>📞 {selectedOrder.customerPhone}</p>
              <p style={{ margin: '8px 0', color: '#cbd5e1' }}>📧 {selectedOrder.customerEmail || 'N/A'}</p>
            </div>

            <div>
              <h5 style={{ color: '#94a3b8', marginTop: 0 }}>Thông Tin Thanh Toán:</h5>
              <p style={{ margin: '8px 0', color: '#cbd5e1' }}>
                💰 Tổng Tiền: <span style={{ fontWeight: 'bold', color: '#0ea5e9' }}>
                  {InvoiceModule.formatCurrency(selectedOrder.totalAmount || 0)}
                </span>
              </p>
              <p style={{ margin: '8px 0', color: '#cbd5e1' }}>
                ✅ Đã Thanh Toán: <span style={{ fontWeight: 'bold', color: '#10b981' }}>
                  {InvoiceModule.formatCurrency(selectedOrder.amountPaid || 0)}
                </span>
              </p>
              <p style={{ margin: '8px 0', color: '#cbd5e1' }}>
                ⏳ Còn Lại: <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>
                  {InvoiceModule.formatCurrency((selectedOrder.totalAmount || 0) - (selectedOrder.amountPaid || 0))}
                </span>
              </p>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h5 style={{ color: '#94a3b8', marginTop: 0 }}>Chi Tiết Mặt Hàng:</h5>
            <div style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '8px' }}>
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                selectedOrder.items.map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: idx < selectedOrder.items.length - 1 ? '1px solid #334155' : 'none',
                    color: '#cbd5e1'
                  }}>
                    <span>{item.name || item.itemName} x{item.quantity}</span>
                    <span style={{ fontWeight: 'bold' }}>
                      {InvoiceModule.formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))
              ) : (
                <p style={{ color: '#94a3b8' }}>Không có chi tiết mặt hàng</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Confirmation Modal */}
      {showPaymentModal && selectedOrderForPayment && (
        <PaymentConfirmationModal
          order={selectedOrderForPayment}
          settings={settings}
          onConfirm={handlePaymentConfirm}
          onCancel={() => {
            setShowPaymentModal(false);
            setSelectedOrderForPayment(null);
          }}
          isLoading={loading}
        />
      )}
    </div>
  );
};

export default PaymentHistorySection;
