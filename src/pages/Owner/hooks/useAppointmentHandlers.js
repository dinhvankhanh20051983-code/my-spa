import { supabase } from '../../../lib/supabaseClient';

/**
 * Appointment-related handlers
 */
export const useAppointmentHandlers = ({
  appointments,
  customers,
  settings,
  setAppointments,
  setCustomers
}) => {
  // Update appointment status
  const handleUpdateStatus = async (id, newStatus) => {
    setAppointments(prev => 
      prev.map(a => a.id === id ? { ...a, status: newStatus } : a)
    );
    const { error } = await supabase.from('appointments').update({ status: newStatus }).eq('id', id);
    if (error) console.error('Supabase update appointment status failed:', error);
  };

  // Send reminder notification
  const handleRemind = (appointment) => {
    const message = `Chào ${appointment.customerName}, Spa nhắc bạn có lịch hẹn vào lúc ${appointment.time} hôm nay. Hẹn gặp lại bạn!`;
    console.log("Gửi nhắc lịch:", message);
    alert(`🔔 Đã gửi nhắc lịch thành công cho khách ${appointment.customerName}`);
    setAppointments(prev => 
      prev.map(a => 
        a.id === appointment.id ? { ...a, isReminded: true } : a
      )
    );
  };

  // Mark as complete and print invoice
  const handleComplete = async (item) => {
    setAppointments(prev => 
      prev.map(a => 
        a.id === item.id ? { ...a, status: 'Đã hoàn thành' } : a
      )
    );
    const { error } = await supabase.from('appointments').update({ status: 'Đã hoàn thành' }).eq('id', item.id);
    if (error) console.error('Supabase complete appointment failed:', error);
    printInvoice(item);
  };

  // Approve appointment
  const handleApproveAppointment = async (id) => {
    setAppointments(prev => 
      prev.map(a => a.id === id ? { ...a, isApproved: true } : a)
    );
    const { error } = await supabase.from('appointments').update({ isApproved: true }).eq('id', id);
    if (error) console.error('Supabase approve appointment failed:', error);
    alert('✅ Đã duyệt lịch hẹn thành công.');
  };

  // Share update with customer
  const handleShareUpdate = async (id) => {
    setAppointments(prev => 
      prev.map(a => a.id === id ? { ...a, sharedUpdate: true } : a)
    );
    const { error } = await supabase.from('appointments').update({ sharedUpdate: true }).eq('id', id);
    if (error) console.error('Supabase share update failed:', error);
    alert('📨 Cập nhật đã được chia sẻ với khách hàng.');
  };

  // Cancel appointment
  const handleCancel = async (id) => {
    if (window.confirm("Bạn có chắc muốn hủy lịch này không?")) {
      setAppointments(prev => prev.filter(item => item.id !== id));
      const { error } = await supabase.from('appointments').delete().eq('id', id);
      if (error) console.error('Supabase delete appointment failed:', error);
    }
  };

  // Print invoice
  const printInvoice = (data) => {
    const servicePrice = Number(data.price || 0);
    const tax = Math.round(servicePrice * (Number(settings.taxRate || 0) / 100));
    const total = servicePrice + tax;
    const invoiceNumber = `${settings.invoicePrefix || 'HD'}-${Date.now()}`;
    const issueDate = new Date().toLocaleDateString('vi-VN');

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Hóa đơn - ${invoiceNumber}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 24px; background: #f4f7fb; color: #1f2937; }
            .invoice-box { width: 100%; max-width: 800px; margin: auto; background: #fff; border-radius: 18px; padding: 30px; box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12); }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
            .brand { color: #0f766e; font-size: 26px; font-weight: 800; letter-spacing: 1px; }
            .meta { text-align: right; font-size: 13px; color: #4b5563; }
            .meta div { margin-bottom: 6px; }
            .section-title { margin: 30px 0 12px; font-size: 14px; color: #0f172a; text-transform: uppercase; letter-spacing: 0.08em; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { padding: 14px 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
            th { background: #f8fafc; color: #0f172a; text-align: left; }
            .total-row td { border-top: 2px solid #cbd5e1; font-weight: 700; }
            .text-right { text-align: right; }
            .footer { margin-top: 30px; color: #475569; font-size: 13px; line-height: 1.6; }
            .signature { margin-top: 40px; display: flex; justify-content: space-between; align-items: center; }
            .signature p { margin: 0; }
            button { display: inline-block; margin-top: 24px; padding: 12px 22px; background: #065f46; color: #fff; border: none; border-radius: 10px; cursor: pointer; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="header">
              <div>
                <div class="brand">${settings.spaName}</div>
                <div style="margin-top: 10px; color: #475569;">${settings.address}</div>
                <div style="margin-top: 6px; color: #475569;">Hotline: ${settings.phone} • Email: ${settings.emailSupport}</div>
                <div style="margin-top: 6px; color: #475569;">Giờ làm việc: ${settings.businessHours}</div>
              </div>
              <div class="meta">
                <div>HÓA ĐƠN: <strong>${invoiceNumber}</strong></div>
                <div>Ngày: ${issueDate}</div>
                <div>Khách hàng: <strong>${data.customerName}</strong></div>
              </div>
            </div>
            <div class="section-title">Chi tiết dịch vụ</div>
            <table>
              <thead>
                <tr>
                  <th>Dịch vụ</th>
                  <th>KTV</th>
                  <th class="text-right">Đơn giá</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${data.service}</td>
                  <td>${data.ktv || ''}</td>
                  <td class="text-right">${servicePrice.toLocaleString()}${settings.currencySymbol}</td>
                </tr>
                <tr>
                  <td colspan="2" class="text-right">Thuế ${settings.taxRate}%</td>
                  <td class="text-right">${tax.toLocaleString()}${settings.currencySymbol}</td>
                </tr>
                <tr class="total-row">
                  <td colspan="2" class="text-right">Tổng thanh toán</td>
                  <td class="text-right">${total.toLocaleString()}${settings.currencySymbol}</td>
                </tr>
              </tbody>
            </table>
            <div class="footer">
              <p>${settings.signatureNote}</p>
              <p>${settings.footerNote}</p>
            </div>
            <div class="signature">
              <p>Người lập: <strong>${settings.spaName}</strong></p>
              <button onclick="window.print()">IN HÓA ĐƠN</button>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return {
    handleUpdateStatus,
    handleRemind,
    handleComplete,
    handleApproveAppointment,
    handleShareUpdate,
    handleCancel,
    printInvoice
  };
};
