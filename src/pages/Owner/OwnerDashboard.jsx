import React, { useState } from 'react';

const OwnerDashboard = () => {
  console.log('OwnerDashboard component loaded');

  // --- 1. QUẢN LÝ TRẠNG THÁI (STATE) ---
  const [activeTab, setActiveTab] = useState('appointments');
  const [modal, setModal] = useState({ show: false, type: '', data: null });
  const [totalStocks] = useState(10000000);

  // Dữ liệu mẫu khởi tạo
  const [products, setProducts] = useState([
    { id: 1, name: "Massage Tinh Dầu", price: 300000, stock: 99, rewardPoints: 300 },
    { id: 2, name: "Serum Vitamin C", price: 850000, stock: 15, rewardPoints: 850 }
  ]);

  const [packages, setPackages] = useState([
    { id: 101, name: "Liệu trình Trị mụn 10 buổi", sessions: 10, price: 5000000, rewardPoints: 5000 },
    { id: 102, name: "Gói Trắng sáng da 5 buổi", sessions: 5, price: 3500000, rewardPoints: 3500 }
  ]);

  const [staffs, setStaffs] = useState([
    { id: 201, name: "KTV Thảo", phone: "0905111222", baseSalary: 6000000, serviceComm: 10, consultComm: 5, stocks: 5000 }
  ]);

  const [customers, setCustomers] = useState([
    { 
      id: 301,
      name: "Nguyễn Anh Thư",
      phone: "0905666777",
      points: 1200,
      stocks: 1000,
      referralCode: "0905666777", // Sử dụng số điện thoại làm mã giới thiệu
      referredBy: '',
      referralRewarded: false,
      myPackages: [{ id: 1, name: "Liệu trình Trị mụn 10 buổi", used: 3, total: 10 }],
      history: [
        {
          date: "2026-04-10",
          service: "Trị mụn B1",
          staff: "Thảo",
          note: "Da bớt sưng, tiếp tục liệu trình.",
          skinCondition: "Da nhạy cảm, có mụn viêm và sẹo thâm.",
          productsUsed: "Sửa rửa mặt dịu, serum trị mụn, kem dưỡng phục hồi.",
          nextStep: "Giữ ẩm, hạn chế nặn mụn, hẹn tái khám sau 7 ngày.",
          images: { before: 'https://via.placeholder.com/300x200/cccccc/000000?text=Before', after: 'https://via.placeholder.com/300x200/cccccc/000000?text=After' },
          sessionProgress: "Buổi 1/10"
        },
        {
          date: "2026-04-17",
          service: "Trị mụn B2",
          staff: "Thảo",
          note: "Nhân mụn đã khô, da sáng hơn, cần bôi kem tái tạo.",
          skinCondition: "Đã giảm sưng, tuyến bã điều chỉnh tốt.",
          productsUsed: "Kem làm dịu + serum phục hồi + mặt nạ thải độc.",
          nextStep: "Tiếp tục chăm sóc ẩm, hẹn buổi 3 trong 1 tuần.",
          images: { before: 'https://via.placeholder.com/300x200/cccccc/000000?text=Before', after: 'https://via.placeholder.com/300x200/cccccc/000000?text=After' },
          sessionProgress: "Buổi 2/10"
        }
      ]
    }
  ]);

  const [appointments, setAppointments] = useState([
    {
      id: 401,
      customerName: "Nguyễn Anh Thư",
      service: "Trị mụn (B4)",
      ktv: "Thảo",
      date: "2024-05-22",
      time: "10:30",
      status: "Chờ phục vụ",
      price: 500000,
      isReminded: false,
      isApproved: false,
      sharedUpdate: false
    }
  ]);

  const [settings, setSettings] = useState({
    spaName: "Hưng Linh Đường",
    address: "71 Bồ Đề - P. Bồ Đề - Tp. Hà Nội",
    phone: "0933251983",
    footerNote: "Cảm ơn quý khách và hẹn gặp lại!",
    defaultBaseSalary: 6000000,
    defaultServiceComm: 10,
    defaultConsultComm: 5,
    packagePointRate: 1,
    productPointRate: 1,
    referralPoints: 500,
    referralStocks: 200,
    currencySymbol: 'đ',
    taxRate: 10,
    reminderLeadTime: 60,
    businessHours: '08:00 - 20:00',
    signatureNote: 'Chân thành cảm ơn quý khách. Hẹn gặp lại lần sau!',
    emailSupport: 'support@hunglinhduong.vn',
    invoicePrefix: 'HD'
  });

  const [chatType, setChatType] = useState('staff');
  const [activeChat, setActiveChat] = useState(null);
  const [chatSearch, setChatSearch] = useState('');
  const [searchCustomer, setSearchCustomer] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);

  // Đơn hàng online từ app khách hàng
  const [onlineOrders, setOnlineOrders] = useState([
    {
      id: 1001,
      customerName: "Nguyễn Anh Thư",
      customerPhone: "0905666777",
      orderType: "package", // "package" hoặc "product"
      itemId: 101,
      itemName: "Liệu trình Trị mụn 10 buổi",
      quantity: 1,
      totalPrice: 5000000,
      rewardPoints: 5000,
      paymentMethod: "bank_transfer",
      paymentProof: "https://example.com/proof.jpg", // Ảnh minh chứng thanh toán
      status: "pending", // "pending", "confirmed", "cancelled"
      orderDate: "2026-04-20",
      notes: "Khách hàng mới, ưu tiên xử lý"
    }
  ]);

  // --- 3. STYLES ---
  const layoutStyle = { display:'flex', minHeight:'100vh', backgroundColor:'#0f172a', color:'white', fontFamily:'sans-serif' };
  const sidebarStyle = { width:'240px', backgroundColor:'#1e293b', padding:'20px', display:'flex', flexDirection:'column', gap:'10px', borderRight:'1px solid #334155' };
  const mainContentStyle = { flex:1, padding:'40px', overflowY:'auto' };
  const mBtn = { textAlign:'left', padding:'12px', background:'none', border:'none', color:'#94a3b8', cursor:'pointer', borderRadius:'10px' };
  const mActive = { ...mBtn, backgroundColor:'#10b981', color:'white', fontWeight:'bold' };
  const sectionStyle = { marginBottom:'40px' };
  const titleStyle = { color:'#10b981', marginBottom:'20px', fontSize:'18px', display:'flex', alignItems:'center', gap:'10px' };
  const flexHeader = { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' };
  const cardStyle = { backgroundColor:'#1e293b', padding:'20px', borderRadius:'15px', border:'1px solid #334155', position:'relative' };
  const grid2 = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' };
  const grid3 = { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'20px' };
  const btnPrimary = { padding:'10px 20px', backgroundColor:'#10b981', border:'none', borderRadius:'8px', color:'white', fontWeight:'bold', cursor:'pointer' };
  const btnPrimaryFull = { ...btnPrimary, width:'100%', padding:'15px', marginTop:'10px' };
  const btnCancel = { width:'100%', padding:'15px', background:'none', border:'1px solid #334155', color:'white', borderRadius:'8px' };
  const tableStyle = { width:'100%', borderCollapse:'collapse', backgroundColor:'#1e293b', borderRadius:'10px' };
  const theadStyle = { backgroundColor:'#334155', textAlign:'left' };
  const trStyle = { borderBottom:'1px solid #334155' };
  const lb = { fontSize:'12px', color:'#10b981', marginBottom:'5px', display:'block', fontWeight:'bold' };
  const inStyle = { width:'100%', padding:'12px', borderRadius:'8px', backgroundColor:'#0f172a', border:'1px solid #334155', color:'white', marginBottom:'15px', boxSizing:'border-box' };
  const overlayStyle = { position:'fixed', top:0, left:0, right:0, bottom:0, backgroundColor:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 };
  const formBoxStyle = { backgroundColor:'#1e293b', padding:'30px', borderRadius:'20px', width:'100%', maxWidth:'500px', maxHeight:'90vh', overflowY:'auto' };
  const priceStyle = { color:'#fbbf24', fontSize:'22px', fontWeight:'bold', margin:'10px 0' };
  const subText = { color:'#94a3b8', fontSize:'13px', margin:'5px 0' };
  const infoText = { fontSize:'14px', margin:'5px 0' };
  const tagGreen = { backgroundColor:'#065f46', color:'#10b981', padding:'3px 8px', borderRadius:'5px', fontSize:'10px' };
  const tagStaff = { backgroundColor: '#1e3a8a', color: '#60a5fa', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' };
  const tagCustomer = { backgroundColor: '#374151', color: '#94a3b8', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' };
  const packageBoxStyle = { margin:'15px 0', padding:'10px', backgroundColor:'#0f172a', borderRadius:'10px', fontSize:'13px' };
  const btnSmall = { padding:'5px 10px', border:'1px solid #10b981', color:'#10b981', background:'none', borderRadius:'5px', cursor:'pointer' };
  const searchItem = {
    padding: '10px',
    cursor: 'pointer',
    borderBottom: '1px solid #334155',
    fontSize: '13px'
  };

  const notifyDot = {
    color: '#ef4444',
    fontSize: '12px',
    marginLeft: '5px'
  };

  const chatContainer = { display: 'flex', height: '500px', backgroundColor: '#1e293b', borderRadius: '15px', overflow: 'hidden' };
  const chatSidebar = { width: '200px', borderRight: '1px solid #334155', padding: '10px', overflowY: 'auto' };
  const chatMain = { flex: 1, display: 'flex', flexDirection: 'column', padding: '20px' };
  const chatHistory = { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' };
  const chatInputArea = { display: 'flex', gap: '10px', marginTop: '15px' };

  const chatTab = { flex: 1, padding: '10px', backgroundColor: '#334155', color: '#94a3b8', border: 'none', cursor: 'pointer' };
  const chatTabActive = { ...chatTab, backgroundColor: '#10b981', color: 'white', fontWeight: 'bold' };

  const msgLeft = { alignSelf: 'flex-start', backgroundColor: '#334155', padding: '10px', borderRadius: '10px 10px 10px 0', maxWidth: '80%', fontSize: '13px' };
  const msgRight = { alignSelf: 'flex-end', backgroundColor: '#10b981', padding: '10px', borderRadius: '10px 10px 0 10px', maxWidth: '80%', fontSize: '13px' };
  const userItem = { padding: '10px', borderBottom: '1px solid #334155', cursor: 'pointer' };
  const userItemActive = { 
    ...userItem, 
    backgroundColor: '#334155', // Màu nền khi được chọn
    color: 'white',
    borderLeft: '4px solid #10b981' // Vạch xanh bên trái
  };
  const chatHeader = {
    padding: '10px 20px',
    borderBottom: '1px solid #334155',
    backgroundColor: '#1e293b',
    marginBottom: '15px'
  };

  const emptyChat = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    color: '#94a3b8',
    fontSize: '14px',
    backgroundColor: '#0f172a',
    borderRadius: '15px',
    padding: '20px'
  };

  const dropdownSearch = {
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '8px',
    marginTop: '5px',
    maxHeight: '150px',
    overflowY: 'auto',
    position: 'absolute',
    width: '100%',
    zIndex: 100
  };

  // --- STYLES CHO BẢNG ---
  const tableContainer = {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    border: '1px solid #334155',
    overflow: 'auto',
    marginTop: '20px'
  };

  const mainTable = {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    color: '#e2e8f0'
  };

  const theadRow = {
    backgroundColor: '#334155',
    borderBottom: '2px solid #475569'
  };

  const thStyle = {
    padding: '15px',
    fontSize: '13px',
    textTransform: 'uppercase',
    color: '#94a3b8',
    fontWeight: '600'
  };

  const tdStyle = {
    padding: '15px',
    borderBottom: '1px solid #334155',
    fontSize: '14px'
  };

  const trHoverStyle = {
    transition: 'background 0.2s',
    cursor: 'default'
  };

  const ktvBadge = {
    backgroundColor: '#334155',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    color: '#60a5fa'
  };

  const statusDropdown = (status) => ({
    backgroundColor: status === 'Đang thực hiện' ? '#1e3a8a' : status === 'Đã hoàn thành' ? '#064e3b' : '#451a03',
    color: status === 'Đang thực hiện' ? '#93c5fd' : status === 'Đã hoàn thành' ? '#6ee7b7' : '#fcd34d',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer'
  });

  const actionBtn = {
    border: 'none',
    padding: '8px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'transform 0.1s'
  };

  const actionBtnGreen = { ...actionBtn, backgroundColor: '#065f46', color: '#10b981' };
  const actionBtnBlue = { ...actionBtn, backgroundColor: '#1e3a8a', color: '#60a5fa' };
  const actionBtnRed = { ...actionBtn, backgroundColor: '#7f1d1d', color: '#ef4444' };

  // --- STYLES CHO NHẬT KÝ ---
  const sidebarList = {
    width: '250px',
    borderRight: '1px solid #334155',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  };

  const logItem = {
    padding: '12px',
    backgroundColor: '#1e293b',
    borderRadius: '8px',
    cursor: 'pointer',
    border: '1px solid #334155',
    color: '#94a3b8'
  };

  const logItemActive = {
    ...logItem,
    backgroundColor: '#10b981',
    color: 'white',
    borderColor: '#10b981'
  };

  const detailContent = { flex: 1, padding: '20px', overflowY: 'auto' };

  const infoBox = {
    backgroundColor: '#1e293b',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #334155',
    marginBottom: '15px',
    fontSize: '14px'
  };

  const smallCard = {
    padding: '10px 12px',
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '12px',
    fontSize: '13px',
    color: '#cbd5e1'
  };

  const imageGrid = { display: 'flex', gap: '20px', marginTop: '10px' };

  const imgContainer = {
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
  };

  const imgLabel = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px'
  };

  const imgPlaceholder = { color: '#475569', fontSize: '13px' };

  const gridChat = { display: 'flex', height: '600px', backgroundColor: '#1e293b', borderRadius: '15px', overflow: 'hidden' };

  // --- 4. CÁC HÀM XỬ LÝ LOGIC ---

  const getFilteredList = () => {
    const list = chatType === 'staff' ? staffs : customers;
    return list.filter(u =>
      u.name.toLowerCase().includes(chatSearch.toLowerCase()) ||
      (u.phone && u.phone.includes(chatSearch))
    );
  };

  // Hàm Hủy lịch
  const handleCancel = (id) => {
    if (window.confirm("Bạn có chắc muốn hủy lịch này không?")) {
      setAppointments(prev => prev.filter(item => item.id !== id));
    }
  };

  // Hàm Cập nhật trạng thái
  const handleUpdateStatus = (id, newStatus) => {
    setAppointments(prev => prev.map(a => 
      a.id === id ? { ...a, status: newStatus } : a
    ));
  };

  // Hàm Nhắc lịch
  const handleRemind = (appointment) => {
    const message = `Chào ${appointment.customerName}, Spa nhắc bạn có lịch hẹn vào lúc ${appointment.time} hôm nay. Hẹn gặp lại bạn!`;
    console.log("Đang gửi tin nhắn:", message);
    alert(`🔔 Đã gửi nhắc lịch thành công cho khách ${appointment.customerName}`);
    setAppointments(prev => prev.map(a => 
      a.id === appointment.id ? { ...a, isReminded: true } : a
    ));
  };

  // Hàm Hoàn thành & In bill
  const handleComplete = (item) => {
    setAppointments(prev => prev.map(a => 
      a.id === item.id ? { ...a, status: 'Đã hoàn thành' } : a
    ));
    printInvoice(item);
  };

  const handleApproveAppointment = (id) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, isApproved: true } : a));
    alert('✅ Đã duyệt lịch hẹn thành công.');
  };

  const handleShareUpdate = (id) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, sharedUpdate: true } : a));
    alert('📨 Cập nhật đã được chia sẻ với khách hàng.');
  };

  // Hàm In hóa đơn
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

  // Hàm Điều chỉnh cổ phần
  const handleAdjustStock = (userName, amount) => {
    setStaffs(staffs.map(s => 
      s.name === userName ? { ...s, stocks: (s.stocks || 0) + Number(amount) } : s
    ));
    setCustomers(customers.map(c => 
      c.name === userName ? { ...c, stocks: (c.stocks || 0) + Number(amount) } : c
    ));
    alert(`Đã điều chỉnh ${amount} cổ phần cho ${userName}`);
  };

  // Hàm Lưu dữ liệu từ Modal
  const handleSave = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd);
    const newItem = { id: Date.now(), ...data };

    if (modal.type === 'product') setProducts([...products, newItem]);
    if (modal.type === 'package') setPackages([...packages, newItem]);
    if (modal.type === 'staff') {
      setStaffs([...staffs, {
        ...newItem,
        baseSalary: Number(data.baseSalary) || settings.defaultBaseSalary,
        serviceComm: Number(data.serviceComm) || settings.defaultServiceComm,
        consultComm: Number(data.consultComm) || settings.defaultConsultComm,
        stocks: Number(data.stocks) || 0
      }]);
    }
    if (modal.type === 'customer') {
      const referralCode = data.phone; // Sử dụng số điện thoại làm mã giới thiệu
      setCustomers([...customers, {
        ...newItem,
        referralCode,
        referredBy: data.referredBy || '',
        referralRewarded: false,
        myPackages: [],
        points: 0,
        stocks: 0,
        history: []
      }]);
    }

    if (modal.type === 'customer_purchase') {
      const customer = modal.data;
      const purchaseType = data.purchaseType;
      const itemId = Number(data.purchaseItemId);
      const quantity = Number(data.quantity) || 1;
      const item = purchaseType === 'package'
        ? packages.find(p => p.id === itemId)
        : products.find(p => p.id === itemId);

      if (!item) {
        alert('Vui lòng chọn gói hoặc sản phẩm để mua.');
      } else {
        const rewardRate = purchaseType === 'package' ? settings.packagePointRate : settings.productPointRate;
        const purchasePoints = (item.rewardPoints || Math.round(item.price / 1000 * rewardRate)) * quantity;
        const referrer = customers.find(c => c.referralCode === customer.referredBy || c.name === customer.referredBy);

        const updatedCustomers = customers.map(c => {
          if (c.id === customer.id) {
            return {
              ...c,
              points: (c.points || 0) + purchasePoints,
              myPackages: purchaseType === 'package'
                ? [...(c.myPackages || []), { id: Date.now(), name: item.name, used: 0, total: Number(item.sessions || 1), price: item.price, rewardPoints: item.rewardPoints || 0, purchaseDate: new Date().toLocaleDateString('vi-VN') }]
                : [...(c.myPackages || [])],
              referralRewarded: c.referralRewarded || false
            };
          }
          if (referrer && c.id === referrer.id && !customer.referralRewarded) {
            return {
              ...c,
              points: (c.points || 0) + Number(settings.referralPoints || 0),
              stocks: (c.stocks || 0) + Number(settings.referralStocks || 0)
            };
          }
          return c;
        });

        if (referrer && !customer.referralRewarded) {
          updatedCustomers.forEach((u, idx) => {
            if (u.id === customer.id) {
              updatedCustomers[idx] = { ...u, referralRewarded: true };
            }
          });
          alert(`Khách giới thiệu ${referrer.name} đã nhận ${settings.referralPoints} điểm và ${settings.referralStocks} cổ phần.`);
        }

        setCustomers(updatedCustomers);
      }
    }

    if (modal.type === 'confirm_order') {
      const order = modal.data;
      const customer = customers.find(c => c.phone === order.customerPhone);
      const referrer = customers.find(c => c.referralCode === customer?.referredBy || c.name === customer?.referredBy);

      if (customer) {
        const updatedCustomers = customers.map(c => {
          if (c.id === customer.id) {
            return {
              ...c,
              points: (c.points || 0) + order.rewardPoints,
              myPackages: order.orderType === 'package'
                ? [...(c.myPackages || []), { 
                    id: Date.now(), 
                    name: order.itemName, 
                    used: 0, 
                    total: packages.find(p => p.id === order.itemId)?.sessions || 1, 
                    price: order.totalPrice, 
                    rewardPoints: order.rewardPoints || 0, 
                    purchaseDate: new Date().toLocaleDateString('vi-VN'),
                    orderId: order.id
                  }]
                : [...(c.myPackages || [])],
              referralRewarded: c.referralRewarded || false
            };
          }
          if (referrer && c.id === referrer.id && !customer.referralRewarded) {
            return {
              ...c,
              points: (c.points || 0) + Number(settings.referralPoints || 0),
              stocks: (c.stocks || 0) + Number(settings.referralStocks || 0)
            };
          }
          return c;
        });

        if (referrer && !customer.referralRewarded) {
          updatedCustomers.forEach((u, idx) => {
            if (u.id === customer.id) {
              updatedCustomers[idx] = { ...u, referralRewarded: true };
            }
          });
          alert(`Khách giới thiệu ${referrer.name} đã nhận ${settings.referralPoints} điểm và ${settings.referralStocks} cổ phần.`);
        }

        setCustomers(updatedCustomers);
      }

      // Cập nhật trạng thái đơn hàng
      setOnlineOrders(onlineOrders.map(o => 
        o.id === order.id ? { ...o, status: 'confirmed' } : o
      ));

      alert(`Đã xác nhận đơn hàng ${order.id} thành công! Khách hàng ${customer?.name} nhận ${order.rewardPoints} điểm thưởng.`);
    }

    if (modal.type === 'cancel_order') {
      setOnlineOrders(onlineOrders.map(o => 
        o.id === order.id ? { ...o, status: 'cancelled' } : o
      ));
      alert(`Đã hủy đơn hàng ${order.id}.`);
    }

    if (modal.type === 'appointment') {
      setAppointments([...appointments, {
        ...newItem,
        status: 'Chờ phục vụ',
        price: Number(data.price) || 0,
        isReminded: false,
        isApproved: false,
        sharedUpdate: false
      }]);
    }
    
    // Xử lý thêm buổi điều trị
    if (modal.type === 'treatment') {
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
      
      // Cập nhật selectedLog để hiển thị log mới
      setSelectedLog(newLog);
      alert('Đã thêm buổi điều trị thành công!');
    }
    
    // Xử lý upload ảnh
    if (modal.type === 'treatment_images') {
      const beforeFile = fd.get('beforeImage');
      const afterFile = fd.get('afterImage');
      
      if (beforeFile || afterFile) {
        const reader = new FileReader();
        reader.onload = () => {
          const imageData = { ...modal.data.log.images };
          if (beforeFile) imageData.before = reader.result;
          
          // Nếu có cả before và after, cần đọc file after
          if (afterFile) {
            const afterReader = new FileReader();
            afterReader.onload = () => {
              imageData.after = afterReader.result;
              
              // Cập nhật history với ảnh mới
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
            };
            afterReader.readAsDataURL(afterFile);
          } else {
            // Chỉ có before
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
          }
        };
        
        if (beforeFile) {
          reader.readAsDataURL(beforeFile);
        } else if (afterFile) {
          // Chỉ có after
          const afterReader = new FileReader();
          afterReader.onload = () => {
            const imageData = { ...modal.data.log.images, after: afterReader.result };
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
          };
          afterReader.readAsDataURL(afterFile);
        }
      }
    }

    // Reset form data
    setSearchCustomer('');
    setSelectedCustomer(null);
    setModal({ show: false, type: '', data: null });
  };

  // --- 3. CÁC PHẦN GIAO DIỆN ---

  // P1: Lịch Hẹn
  
  const renderAppointments = () => {
    // Logic lọc danh sách (có thể thêm ô tìm kiếm ở đây)
    const filteredList = appointments; 

    return (
      <div style={sectionStyle}>
        <div style={flexHeader}>
          <h3 style={titleStyle}>📅 DANH SÁCH ĐIỀU HÀNH LỊCH HẸN</h3>
          <button style={btnPrimary} onClick={() => setModal({show:true, type:'appointment'})}>
            + ĐẶT LỊCH MỚI
          </button>
        </div>

        <div style={tableContainer}>
          <table style={mainTable} className="responsive-table">
            <thead>
              <tr style={theadRow}>
                <th style={thStyle}>Khách Hàng</th>
                <th style={thStyle}>Dịch Vụ</th>
                <th style={thStyle}>Kỹ Thuật Viên</th>
                <th style={thStyle}>Thời Gian</th>
                <th style={thStyle}>Trạng Thái</th>
                <th style={thStyle} className="hide-on-mobile">Thao Tác Nhanh</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((a) => (
                <tr key={a.id} style={trHoverStyle}>
                  <td style={tdStyle}>
                    <div style={{fontWeight:'bold'}}>{a.customerName}</div>
                    <div style={{fontSize:'11px', color:'#94a3b8'}}>{a.phone || 'Chưa có SĐT'}</div>
                  </td>
                  <td style={tdStyle}>{a.service}</td>
                  <td style={tdStyle}>
                    <span style={ktvBadge}>{a.ktv}</span>
                  </td>
                  <td style={tdStyle}>
                    <div>{a.time}</div>
                    <div style={{fontSize:'11px', color:'#94a3b8'}}>{a.date}</div>
                  </td>
                  <td style={tdStyle}>
                    <select 
                      value={a.status} 
                      onChange={(e) => handleUpdateStatus(a.id, e.target.value)}
                      style={statusDropdown(a.status)}
                    >
                      <option value="Chờ phục vụ">Chờ phục vụ</option>
                      <option value="Đang thực hiện">Đang thực hiện</option>
                      <option value="Đã hoàn thành">Đã hoàn thành</option>
                      <option value="Trễ hẹn">Trễ hẹn</option>
                    </select>
                    <div style={{ marginTop: '8px', fontSize: '12px', color: a.isApproved ? '#34d399' : '#fbbf24' }}>
                      {a.isApproved ? 'Đã duyệt' : 'Chờ duyệt'}
                    </div>
                    {a.sharedUpdate && (
                      <div style={{ marginTop: '4px', fontSize: '12px', color: '#60a5fa' }}>
                        Đã chia sẻ cập nhật
                      </div>
                    )}
                  </td>
                  <td style={tdStyle} className="hide-on-mobile">
                    <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
                      <button title="Nhắc lịch" style={actionBtnBlue} onClick={() => handleRemind(a)}>🔔</button>
                      <button title="Hoàn thành & In" style={actionBtnGreen} onClick={() => handleComplete(a)}>✅</button>
                      <button title="Hủy lịch" style={actionBtnRed} onClick={() => handleCancel(a.id)}>❌</button>
                      {!a.isApproved && (
                        <button title="Duyệt lịch" style={actionBtnGreen} onClick={() => handleApproveAppointment(a.id)}>✔️</button>
                      )}
                      {a.isApproved && !a.sharedUpdate && (
                        <button title="Chia sẻ cập nhật" style={actionBtnBlue} onClick={() => handleShareUpdate(a.id)}>📤</button>
                      )}
                      <button title="Xem nhật ký liệu trình" style={actionBtnBlue} onClick={() => {
                        const customer = customers.find(c => c.name === a.customerName);
                        if (customer) {
                          setSelectedCustomer(customer);
                          setSelectedLog(customer.history && customer.history.length > 0 ? customer.history[0] : null);
                          setActiveTab('treatment_history');
                        }
                      }}>📋</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredList.length === 0 && (
            <div style={{padding:'40px', textAlign:'center', color:'#94a3b8'}}>
              Không có lịch hẹn nào trong danh sách.
            </div>
          )}
        </div>
      </div>
    );
  };



  // P1.1: Chi Tiết Liệu Trình
  
  const renderTreatmentDetail = (customer) => {
    return (
      <div style={sectionStyle}>
        <div style={flexHeader}>
          <h3 style={titleStyle}>📜 CHI TIẾT TRỊ LIỆU: {customer.name}</h3>
          <div style={{display:'flex', gap:'10px'}}>
            <button style={btnPrimary} onClick={() => setModal({show:true, type:'treatment', data:customer})}>+ THÊM BUỔI ĐIỀU TRỊ MỚI</button>
            <button style={btnSmall} onClick={() => setActiveTab('customers')}>← Quay lại</button>
          </div>
        </div>

        <div style={gridChat}>
          {/* Cột trái: Danh sách các buổi */}
          <div style={sidebarList}>
            {customer.history && customer.history.map((log, index) => (
              <div 
                key={index} 
                style={selectedLog === log ? logItemActive : logItem}
                onClick={() => setSelectedLog(log)}
              >
                <b>Buổi {customer.history.length - index}: {log.date}</b>
                <div style={{fontSize:'11px'}}>{log.service}</div>
              </div>
            ))}
          </div>

          {/* Cột phải: Nội dung chi tiết & Hình ảnh */}
          <div style={detailContent}>
            {selectedLog ? (
              <>
                <div style={grid2}>
                  <div>
                    <label style={lb}>Dịch vụ thực hiện:</label>
                    <div style={infoBox}>{selectedLog.service}</div>
                  </div>
                  <div>
                    <label style={lb}>KTV đảm nhiệm:</label>
                    <div style={infoBox}>{selectedLog.staff}</div>
                  </div>
                </div>

                <label style={lb}>Ghi chú tình trạng & Diễn biến:</label>
                <div style={{...infoBox, minHeight: '80px'}}>{selectedLog.note}</div>

                <div style={grid2}>
                  <div>
                    <label style={lb}>Tình trạng da hiện tại:</label>
                    <div style={infoBox}>{selectedLog.skinCondition || 'Chưa cập nhật'}</div>
                  </div>
                  <div>
                    <label style={lb}>Tiến độ buổi điều trị:</label>
                    <div style={infoBox}>{selectedLog.sessionProgress || 'Chưa cập nhật'}</div>
                  </div>
                </div>

                <label style={lb}>Sản phẩm sử dụng:</label>
                <div style={infoBox}>{selectedLog.productsUsed || 'Chưa cập nhật'}</div>

                <label style={lb}>Kế hoạch tiếp theo:</label>
                <div style={infoBox}>{selectedLog.nextStep || 'Chưa cập nhật'}</div>

                <label style={lb}>Hình ảnh đối chứng (Before & After):</label>
                <div style={imageGrid} className="responsive-image-grid">
                  <div style={imgContainer} className="img-container">
                    <span style={imgLabel}>Trước (Before)</span>
                    {selectedLog.images && selectedLog.images.before ? (
                      <img src={selectedLog.images.before} alt="Before" style={{width:'100%', height:'180px', objectFit:'cover', borderRadius:'8px'}} />
                    ) : (
                      <div style={imgPlaceholder}>📷 Chưa có ảnh</div>
                    )}
                  </div>
                  <div style={imgContainer} className="img-container">
                    <span style={imgLabel}>Sau (After)</span>
                    {selectedLog.images && selectedLog.images.after ? (
                      <img src={selectedLog.images.after} alt="After" style={{width:'100%', height:'180px', objectFit:'cover', borderRadius:'8px'}} />
                    ) : (
                      <div style={imgPlaceholder}>✨ Chưa có ảnh</div>
                    )}
                  </div>
                </div>
                
                <button style={{...btnPrimary, marginTop: '20px', width: '100%'}} onClick={() => setModal({show:true, type:'treatment_images', data:{customer, log: selectedLog}})}>
                  📤 CẬP NHẬT ẢNH BUỔI NÀY
                </button>
              </>
            ) : (
              <div style={{padding: '40px', textAlign: 'center', color: '#94a3b8'}}>
                Chưa có dữ liệu liệu trình cho khách hàng này.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // P2: Cổ Phần & Điểm
  const renderStocks = () => {
    const distributedStocks = [...staffs, ...customers].reduce((sum, u) => sum + (u.stocks || 0), 0);
    
    return (
      <div style={sectionStyle}>
        <div style={flexHeader}>
          <h3 style={titleStyle}>📈 QUẢN LÝ CỔ PHẦN & ĐIỂM</h3>
          <div style={{textAlign: 'right'}}>
            <small style={{color: '#94a3b8'}}>Tổng quỹ cổ phần:</small>
            <h4 style={{margin: 0, color: '#10b981'}}>{totalStocks.toLocaleString()} CP</h4>
            <small style={{color: '#fbbf24'}}>Còn lại: {(totalStocks - distributedStocks).toLocaleString()} CP</small>
          </div>
        </div>
        
        <table style={tableStyle}>
          <thead style={theadStyle}>
            <tr>
              <th style={tdStyle}>Thành viên</th>
              <th style={tdStyle}>Vai trò</th>
              <th style={tdStyle}>Cổ phần hiện có</th>
              <th style={tdStyle}>Tỷ lệ (%)</th>
              <th style={tdStyle}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {[...staffs, ...customers].map((u, i) => (
              <tr key={i} style={trStyle}>
                <td style={tdStyle}><b>{u.name}</b></td>
                <td style={tdStyle}>
                  <span style={u.baseSalary ? tagStaff : tagCustomer}>
                    {u.baseSalary ? "Nhân viên" : "Khách hàng"}
                  </span>
                </td>
                <td style={{...tdStyle, color:'#10b981', fontWeight: 'bold'}}>
                  {(u.stocks || 0).toLocaleString()} CP
                </td>
                <td style={tdStyle}>
                  {(((u.stocks || 0) / totalStocks) * 100).toFixed(2)}%
                </td>
                <td style={tdStyle}>
                  <button 
                    style={btnSmall} 
                    onClick={() => {
                      const val = prompt("Nhập số lượng cổ phần (Số dương để CẤP, số âm để THU HỒI):");
                      if (val) handleAdjustStock(u.name, val);
                    }}
                  >
                    ± Điều chỉnh
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // P6.1: Đơn hàng online
  const renderOnlineOrders = () => {
    const pendingOrders = onlineOrders.filter(o => o.status === 'pending');
    const confirmedOrders = onlineOrders.filter(o => o.status === 'confirmed');
    const cancelledOrders = onlineOrders.filter(o => o.status === 'cancelled');

    return (
      <div style={sectionStyle}>
        <div style={flexHeader}>
          <h3 style={titleStyle}>🛒 ĐƠN HÀNG ONLINE TỪ APP KHÁCH HÀNG</h3>
        </div>

        {/* Tabs trạng thái */}
        <div style={{ display: 'flex', marginBottom: '20px', backgroundColor: '#1e293b', borderRadius: '10px', overflow: 'hidden' }}>
          <button style={{ flex: 1, padding: '10px', backgroundColor: '#334155', color: '#94a3b8', border: 'none', cursor: 'pointer' }}>
            Chờ xác nhận ({pendingOrders.length})
          </button>
          <button style={{ flex: 1, padding: '10px', backgroundColor: '#065f46', color: '#10b981', border: 'none', cursor: 'pointer' }}>
            Đã xác nhận ({confirmedOrders.length})
          </button>
          <button style={{ flex: 1, padding: '10px', backgroundColor: '#7f1d1d', color: '#ef4444', border: 'none', cursor: 'pointer' }}>
            Đã hủy ({cancelledOrders.length})
          </button>
        </div>

        <div style={tableContainer}>
          <table style={mainTable} className="responsive-table">
            <thead>
              <tr style={theadRow}>
                <th style={thStyle}>Khách hàng</th>
                <th style={thStyle}>Sản phẩm/Gói</th>
                <th style={thStyle}>Thanh toán</th>
                <th style={thStyle}>Trạng thái</th>
                <th style={thStyle} className="hide-on-mobile">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {onlineOrders.map((order) => (
                <tr key={order.id} style={trStyle}>
                  <td style={tdStyle}>
                    <div style={{fontWeight:'bold'}}>{order.customerName}</div>
                    <div style={{fontSize:'11px', color:'#94a3b8'}}>{order.customerPhone}</div>
                    <div style={{fontSize:'11px', color:'#a78bfa'}}>Điểm thưởng: {order.rewardPoints}</div>
                  </td>
                  <td style={tdStyle}>
                    <div>{order.itemName}</div>
                    <div style={{fontSize:'11px', color:'#94a3b8'}}>
                      SL: {order.quantity} • {order.totalPrice.toLocaleString()}đ
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{fontSize:'12px'}}>
                      {order.paymentMethod === 'bank_transfer' ? '🏦 Chuyển khoản' : '💳 Thẻ tín dụng'}
                    </div>
                    {order.paymentProof && (
                      <button style={btnSmall} onClick={() => window.open(order.paymentProof, '_blank')}>
                        📷 Xem minh chứng
                      </button>
                    )}
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      backgroundColor: order.status === 'pending' ? '#451a03' : 
                                     order.status === 'confirmed' ? '#064e3b' : '#7f1d1d',
                      color: order.status === 'pending' ? '#fcd34d' : 
                           order.status === 'confirmed' ? '#6ee7b7' : '#fca5a5',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}>
                      {order.status === 'pending' ? 'Chờ xác nhận' : 
                       order.status === 'confirmed' ? 'Đã xác nhận' : 'Đã hủy'}
                    </span>
                    <div style={{fontSize:'11px', color:'#94a3b8', marginTop:'4px'}}>
                      {order.orderDate}
                    </div>
                  </td>
                  <td style={tdStyle} className="hide-on-mobile">
                    {order.status === 'pending' && (
                      <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
                        <button 
                          style={actionBtnGreen} 
                          onClick={() => setModal({show:true, type:'confirm_order', data:order})}
                        >
                          ✅ Xác nhận
                        </button>
                        <button 
                          style={actionBtnRed} 
                          onClick={() => setModal({show:true, type:'cancel_order', data:order})}
                        >
                          ❌ Hủy
                        </button>
                      </div>
                    )}
                    {order.status === 'confirmed' && (
                      <span style={{color:'#10b981', fontSize:'12px'}}>✅ Hoàn thành</span>
                    )}
                    {order.status === 'cancelled' && (
                      <span style={{color:'#ef4444', fontSize:'12px'}}>❌ Đã hủy</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {onlineOrders.length === 0 && (
            <div style={{padding:'40px', textAlign:'center', color:'#94a3b8'}}>
              Chưa có đơn hàng online nào.
            </div>
          )}
        </div>
      </div>
    );
  };

  // P3: Sản phẩm
  const renderProducts = () => (
    <div style={sectionStyle}>
      <div style={flexHeader}>
        <h3 style={titleStyle}>🧴 SẢN PHẨM & DỊCH VỤ LẺ</h3>
        <button style={btnPrimary} onClick={() => setModal({show:true, type:'product'})}>+ THÊM MỚI</button>
      </div>
      <div style={grid3} className="responsive-grid-3">
        {products.map(p => (
          <div key={p.id} style={cardStyle} className="responsive-card">
            <h4>{p.name}</h4>
            <p style={priceStyle}>{Number(p.price).toLocaleString()}đ</p>
            <p style={subText}>Tồn kho: {p.stock || 0}</p>
            <p style={subText}>Điểm thưởng: {p.rewardPoints || 0} điểm</p>
          </div>
        ))}
      </div>
    </div>
  );

  // P4: Gói trị liệu
  const renderPackages = () => (
    <div style={sectionStyle}>
      <div style={flexHeader}>
        <h3 style={titleStyle}>📑 DANH MỤC GÓI TRỊ LIỆU</h3>
        <button style={btnPrimary} onClick={() => setModal({show:true, type:'package'})}>+ TẠO GÓI MỚI</button>
      </div>
      <div style={grid2} className="responsive-grid-2">
        {packages.map(p => (
          <div key={p.id} style={cardStyle} className="responsive-card">
            <span style={tagGreen}>GÓI COMBO</span>
            <h4 style={{marginTop:'5px'}}>{p.name}</h4>
            <p style={infoText}>Quy mô: <b>{p.sessions} buổi</b></p>
            <p style={priceStyle}>{Number(p.price).toLocaleString()}đ</p>
            <p style={subText}>Điểm thưởng: {p.rewardPoints || 0} điểm</p>
          </div>
        ))}
      </div>
    </div>
  );

  // P5: Khách hàng
  const renderCustomers = () => (
    <div style={sectionStyle}>
      <div style={flexHeader}>
        <h3 style={titleStyle}>🧖‍♀️ HỒ SƠ KHÁCH HÀNG</h3>
        <button style={btnPrimary} onClick={() => setModal({show:true, type:'customer'})}>+ THÊM KHÁCH MỚI</button>
      </div>
      <div style={grid2} className="responsive-grid-2">
        {customers.map(c => {
          const lastVisit = c.history && c.history.length > 0 ? c.history[0] : null;
          const upcoming = appointments.find(a => a.customerName === c.name && a.status !== 'Đã hoàn thành');
          const totalPackages = c.myPackages.reduce((sum, p) => sum + (p.total - p.used), 0);
          const totalVisits = c.history ? c.history.length : 0;

          return (
            <div key={c.id} style={cardStyle} className="responsive-card">
              <div style={flexHeader}>
                <div>
                  <strong>{c.name}</strong>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{c.phone}</div>
                </div>
                <span style={tagCustomer}>Khách VIP</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '14px' }}>
                <div style={infoBox}><strong>{c.points.toLocaleString()}</strong><div style={subText}>Điểm tích lũy</div></div>
                <div style={infoBox}><strong>{c.stocks.toLocaleString()}</strong><div style={subText}>Cổ phần</div></div>
              </div>

              <div style={{ marginTop: '14px', border: '1px solid #334155', borderRadius: '14px', padding: '14px' }}>
                <div style={{ color: '#94a3b8', fontSize: '12px' }}>Gói hiện tại</div>
                {c.myPackages.map(p => (
                  <div key={p.id} style={{ marginTop: '8px' }}>
                    <strong>{p.name}</strong>
                    <div style={{ fontSize: '12px', color: '#a78bfa' }}>{p.total - p.used} buổi còn lại</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '14px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <div style={smallCard}>Lần khám: {totalVisits}</div>
                <div style={smallCard}>Còn gói: {totalPackages}</div>
                <div style={smallCard}>{upcoming ? 'Sắp có lịch' : 'Chưa có lịch'}</div>
              </div>

              <div style={{ marginTop: '16px', color: '#94a3b8', fontSize: '13px' }}>
                <div>Buổi gần nhất: {lastVisit ? `${lastVisit.date} • ${lastVisit.service}` : 'Chưa có'}</div>
                <div>Gợi ý điều trị: {lastVisit ? lastVisit.nextStep : 'Cập nhật sau khi khám'}</div>
                <div>Mã giới thiệu: {c.referralCode || 'Chưa có'}</div>
                <div>Được giới thiệu bởi: {c.referredBy || 'Không'}</div>
              </div>

              <div style={{display:'flex', gap:'10px', marginTop:'18px'}}>
                <button style={{...btnPrimaryFull, flex:1}} onClick={() => setModal({show:true, type:'appointment', data:c})}>Đặt lịch buổi làm</button>
                <button style={btnSmall} title="Mua gói/sản phẩm" onClick={() => setModal({show:true, type:'customer_purchase', data:c})}>🛒 Mua hàng</button>
                <button style={btnSmall} title="Xem nhật ký liệu trình" onClick={() => {
                  setSelectedCustomer(c);
                  setSelectedLog(lastVisit);
                  setActiveTab('treatment_history');
                }}>📋</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  };

  // P6: Nhân viên
  const renderStaff = () => (
    <div style={sectionStyle}>
      <div style={flexHeader}>
        <h3 style={titleStyle}>👥 ĐỘI NGŨ NHÂN VIÊN</h3>
        <button style={btnPrimary} onClick={() => setModal({show:true, type:'staff'})}>+ THÊM NHÂN VIÊN</button>
      </div>
      <div style={grid2}>
        {staffs.map(s => {
          const assigned = appointments.filter(a => a.ktv === s.name);
          const completed = assigned.filter(a => a.status === 'Đã hoàn thành').length;
          const active = assigned.filter(a => a.status === 'Đang thực hiện' || a.status === 'Chờ phục vụ').length;
          const revenue = assigned.reduce((sum, a) => sum + (Number(a.price) || 0), 0);

          return (
            <div key={s.id} style={cardStyle}>
              <div style={flexHeader}>
                <div>
                  <strong>{s.name}</strong>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{s.phone}</div>
                </div>
                <span style={tagStaff}>KTV</span>
              </div>

              <div style={{ marginTop: '14px', color: '#94a3b8', fontSize: '13px' }}>
                <div>Lương cơ bản: <strong>{Number(s.baseSalary).toLocaleString()}đ</strong></div>
                <div>Hoa hồng dịch vụ: <strong>{s.serviceComm}%</strong></div>
                <div>Hoa hồng tư vấn: <strong>{s.consultComm}%</strong></div>
              </div>

              <div style={{ marginTop: '14px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <div style={smallCard}>Đơn hiện tại: {active}</div>
                <div style={smallCard}>Hoàn thành: {completed}</div>
                <div style={smallCard}>Doanh thu: {revenue.toLocaleString()}đ</div>
              </div>

              <div style={{ marginTop: '16px', padding: '14px', backgroundColor: '#0f172a', borderRadius: '14px', border: '1px solid #334155' }}>
                <div style={{ marginBottom: '8px', color: '#94a3b8', fontSize: '12px' }}>Mục tiêu tiếp theo</div>
                <div style={{ color: '#fff', fontSize: '14px' }}>Hoàn thành 5 buổi trong tuần và giữ tỷ lệ hài lòng khách trên 95%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // P7: Doanh thu
  const renderReports = () => {
    const totalRevenue = appointments.reduce((sum, a) => sum + (Number(a.price) || 0), 0);
    const completedCount = appointments.filter(a => a.status === 'Đã hoàn thành').length;
    const upcomingCount = appointments.filter(a => a.status === 'Chờ phục vụ' || a.status === 'Đang thực hiện').length;
    const uniqueCustomers = new Set(appointments.map(a => a.customerName)).size;
    const averageTicket = appointments.length ? Math.round(totalRevenue / appointments.length) : 0;
    const estimatedProfit = Math.round(totalRevenue * 0.45);
    const revenueByService = appointments.reduce((acc, app) => {
      const key = app.service;
      acc[key] = (acc[key] || 0) + (Number(app.price) || 0);
      return acc;
    }, {});

    return (
      <div style={sectionStyle}>
        <h3 style={titleStyle}>📊 BÁO CÁO DOANH THU</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '20px' }}>
          <div style={cardStyle}><small>Tổng doanh thu</small><h2>{totalRevenue.toLocaleString()}đ</h2></div>
          <div style={cardStyle}><small>Số KH trong hệ thống</small><h2>{uniqueCustomers}</h2></div>
          <div style={cardStyle}><small>Lịch hẹn sắp tới</small><h2>{upcomingCount}</h2></div>
          <div style={cardStyle}><small>Doanh thu TB / đơn</small><h2>{averageTicket.toLocaleString()}đ</h2></div>
        </div>

        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={cardStyle}>
            <h4 style={{ marginTop: 0, color: '#fff' }}>Hiệu suất tháng</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '18px', color: '#94a3b8' }}>
              <span>Đã hoàn thành</span>
              <strong>{completedCount}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', color: '#94a3b8' }}>
              <span>Lợi nhuận ước tính</span>
              <strong>{estimatedProfit.toLocaleString()}đ</strong>
            </div>
          </div>
          <div style={cardStyle}>
            <h4 style={{ marginTop: 0, color: '#fff' }}>Doanh thu theo dịch vụ</h4>
            {Object.entries(revenueByService).map(([service, value]) => (
              <div key={service} style={{ marginTop: '10px', color: '#94a3b8' }}>
                <div>{service}</div>
                <div style={{ fontWeight: 'bold', color: '#fff' }}>{value.toLocaleString()}đ</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // P8: Cài đặt
  const renderSettings = () => {
    const handleUpdateSettings = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const raw = Object.fromEntries(fd);
      setSettings({
        ...settings,
        spaName: raw.spaName,
        address: raw.address,
        phone: raw.phone,
        footerNote: raw.footerNote,
        defaultBaseSalary: Number(raw.defaultBaseSalary) || settings.defaultBaseSalary,
        defaultServiceComm: Number(raw.defaultServiceComm) || settings.defaultServiceComm,
        defaultConsultComm: Number(raw.defaultConsultComm) || settings.defaultConsultComm,
        packagePointRate: Number(raw.packagePointRate) || settings.packagePointRate,
        productPointRate: Number(raw.productPointRate) || settings.productPointRate,
        referralPoints: Number(raw.referralPoints) || settings.referralPoints,
        referralStocks: Number(raw.referralStocks) || settings.referralStocks,
        currencySymbol: raw.currencySymbol || settings.currencySymbol,
        taxRate: Number(raw.taxRate) || settings.taxRate,
        reminderLeadTime: Number(raw.reminderLeadTime) || settings.reminderLeadTime,
        businessHours: raw.businessHours || settings.businessHours,
        signatureNote: raw.signatureNote || settings.signatureNote,
        emailSupport: raw.emailSupport || settings.emailSupport,
        invoicePrefix: raw.invoicePrefix || settings.invoicePrefix
      });
      alert("Đã lưu cấu hình hệ thống thành công!");
    };

    return (
      <div style={sectionStyle}>
        <h3 style={titleStyle}>⚙️ CÀI ĐẶT HỆ THỐNG</h3>
        <div style={cardStyle}>
          <form onSubmit={handleUpdateSettings} style={{ display: 'grid', gap: '20px' }}>
            <div>
              <label style={lb}>TÊN SPA (HIỂN THỊ TRÊN BILL)</label>
              <input name="spaName" defaultValue={settings.spaName} style={inStyle} required />
            </div>
            
            <div>
              <label style={lb}>ĐỊA CHỈ</label>
              <input name="address" defaultValue={settings.address} style={inStyle} required />
            </div>

            <div style={grid2}>
              <div>
                <label style={lb}>SỐ ĐIỆN THOẠI HOTLINE</label>
                <input name="phone" defaultValue={settings.phone} style={inStyle} required />
              </div>
              <div>
                <label style={lb}>LỜI CHÀO DƯỚI HÓA ĐƠN</label>
                <input name="footerNote" defaultValue={settings.footerNote} style={inStyle} />
              </div>
            </div>

            <div style={grid2}>
              <div>
                <label style={lb}>Lương cơ bản mặc định</label>
                <input name="defaultBaseSalary" type="number" defaultValue={settings.defaultBaseSalary} style={inStyle} />
              </div>
              <div>
                <label style={lb}>Hoa hồng dịch vụ mặc định (%)</label>
                <input name="defaultServiceComm" type="number" defaultValue={settings.defaultServiceComm} style={inStyle} />
              </div>
            </div>

            <div style={grid2}>
              <div>
                <label style={lb}>Hoa hồng tư vấn mặc định (%)</label>
                <input name="defaultConsultComm" type="number" defaultValue={settings.defaultConsultComm} style={inStyle} />
              </div>
              <div>
                <label style={lb}>Tỷ lệ điểm gói trị liệu (điểm/1000đ)</label>
                <input name="packagePointRate" type="number" defaultValue={settings.packagePointRate} style={inStyle} />
              </div>
            </div>

            <div style={grid2}>
              <div>
                <label style={lb}>Tỷ lệ điểm sản phẩm lẻ (điểm/1000đ)</label>
                <input name="productPointRate" type="number" defaultValue={settings.productPointRate} style={inStyle} />
              </div>
              <div>
                <label style={lb}>Điểm thưởng giới thiệu</label>
                <input name="referralPoints" type="number" defaultValue={settings.referralPoints} style={inStyle} />
              </div>
            </div>

            <div style={grid2}>
              <div>
                <label style={lb}>Cổ phần thưởng giới thiệu</label>
                <input name="referralStocks" type="number" defaultValue={settings.referralStocks} style={inStyle} />
              </div>
              <div>
                <label style={lb}>Ký hiệu tiền tệ</label>
                <input name="currencySymbol" defaultValue={settings.currencySymbol} style={inStyle} />
              </div>
            </div>

            <div style={grid2}>
              <div>
                <label style={lb}>Thuế VAT (%)</label>
                <input name="taxRate" type="number" defaultValue={settings.taxRate} style={inStyle} />
              </div>
              <div>
                <label style={lb}>Thời gian nhắc lịch trước (phút)</label>
                <input name="reminderLeadTime" type="number" defaultValue={settings.reminderLeadTime} style={inStyle} />
              </div>
            </div>

            <div style={grid2}>
              <div>
                <label style={lb}>Giờ hoạt động</label>
                <input name="businessHours" defaultValue={settings.businessHours} style={inStyle} />
              </div>
              <div>
                <label style={lb}>Email hỗ trợ</label>
                <input name="emailSupport" defaultValue={settings.emailSupport} style={inStyle} />
              </div>
            </div>

            <div>
              <label style={lb}>Tiền tố hóa đơn</label>
              <input name="invoicePrefix" defaultValue={settings.invoicePrefix} style={inStyle} />
            </div>

            <div>
              <label style={lb}>Chữ ký / ghi chú trên hóa đơn</label>
              <textarea name="signatureNote" defaultValue={settings.signatureNote} style={{ ...inStyle, minHeight: '90px' }} />
            </div>

            <button type="submit" style={{ ...btnPrimary, width: '200px', padding: '15px' }}>
              💾 LƯU CẤU HÌNH
            </button>
          </form>
        </div>

        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#0f172a', borderRadius: '15px', border: '1px dashed #334155' }}>
          <h4 style={{ color: '#94a3b8', marginBottom: '10px' }}>Xem trước thông tin in:</h4>
          <p style={{ margin: '5px 0' }}>🏠 {settings.spaName}</p>
          <p style={{ margin: '5px 0' }}>📍 {settings.address}</p>
          <p style={{ margin: '5px 0' }}>📞 {settings.phone}</p>
          <p style={{ margin: '5px 0' }}>✉️ {settings.emailSupport}</p>
          <p style={{ margin: '5px 0' }}>⏰ Giờ làm việc: {settings.businessHours}</p>
          <p style={{ margin: '5px 0', color: '#a78bfa' }}>Lương cơ bản mặc định: {Number(settings.defaultBaseSalary).toLocaleString()}đ</p>
          <p style={{ margin: '5px 0', color: '#a78bfa' }}>HH dịch vụ mặc định: {settings.defaultServiceComm}%</p>
          <p style={{ margin: '5px 0', color: '#a78bfa' }}>HH tư vấn mặc định: {settings.defaultConsultComm}%</p>
          <p style={{ margin: '5px 0', color: '#a78bfa' }}>Tỷ lệ điểm gói: {settings.packagePointRate} điểm/1000đ</p>
          <p style={{ margin: '5px 0', color: '#a78bfa' }}>Tỷ lệ điểm sản phẩm: {settings.productPointRate} điểm/1000đ</p>
          <p style={{ margin: '5px 0', color: '#a78bfa' }}>Điểm thưởng giới thiệu: {settings.referralPoints} điểm</p>
          <p style={{ margin: '5px 0', color: '#a78bfa' }}>Cổ phần thưởng giới thiệu: {settings.referralStocks} CP</p>
          <p style={{ margin: '5px 0', color: '#a78bfa' }}>Thuế VAT: {settings.taxRate}%</p>
          <p style={{ margin: '5px 0', color: '#a78bfa' }}>Nhắc lịch trước: {settings.reminderLeadTime} phút</p>
          <p style={{ margin: '5px 0', color: '#a78bfa' }}>Tiền tố hóa đơn: {settings.invoicePrefix}</p>
        </div>
      </div>
    );
  };

  // P9: Chat
  const renderChat = () => {
  const currentList = getFilteredList();

  return (
    <div style={sectionStyle}>
      <h3 style={titleStyle}>💬 TIN NHẮN & GIAO TIẾP</h3>
      
      {/* Tabs chuyển đổi Nội bộ / Khách hàng */}
      <div style={{ display: 'flex', marginBottom: '15px', backgroundColor: '#1e293b', borderRadius: '10px', overflow: 'hidden' }}>
        <button 
          style={chatType === 'staff' ? chatTabActive : chatTab} 
          onClick={() => { setChatType('staff'); setActiveChat(null); }}
        >
          💡 Nội bộ (Nhân viên)
        </button>
        <button 
          style={chatType === 'customer' ? chatTabActive : chatTab} 
          onClick={() => { setChatType('customer'); setActiveChat(null); }}
        >
          👤 Khách hàng
        </button>
      </div>

      <div style={chatContainer} className="responsive-chat">
        {/* SIDEBAR: Danh sách người chat & Tìm kiếm */}
        <div style={chatSidebar} className="responsive-chat-sidebar">
          <input 
            style={{ ...inStyle, padding: '8px', fontSize: '12px' }} 
            placeholder="🔍 Tìm tên hoặc SĐT..." 
            value={chatSearch}
            onChange={(e) => setChatSearch(e.target.value)}
          />
          
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {currentList.map(user => (
              <div 
                key={user.phone} 
                onClick={() => setActiveChat(user)}
                style={activeChat?.phone === user.phone ? userItemActive : userItem}
              >
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{user.name}</div>
                <div style={{ fontSize: '11px', color: '#10b981' }}>● Online</div>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN: Nội dung chat */}
        <div style={chatMain}>
          {activeChat ? (
            <>
              <div style={chatHeader}>
                <b>Chat với: {activeChat.name}</b>
              </div>
              <div style={chatHistory}>
                {/* Giả lập tin nhắn của người được chọn */}
                <div style={msgLeft}>
                  Chào Spa, tôi muốn hỏi về liệu trình {activeChat.service || 'chăm sóc da'}.
                </div>
                <div style={msgRight}>
                  Chào {activeChat.name}, Spa có thể giúp gì cho bạn ạ?
                </div>
              </div>
              <div style={chatInputArea}>
                <input style={{ ...inStyle, marginBottom: 0 }} placeholder="Nhập tin nhắn..." />
                <button style={btnPrimary}>GỬI</button>
              </div>
            </>
          ) : (
            <div style={emptyChat}>
              <p>Vui lòng chọn một người từ danh sách để bắt đầu trò chuyện</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // --- 6. GIAO DIỆN CHÍNH ---
  return (
    <div style={layoutStyle} className="responsive-layout">
      <div style={{color: 'white', padding: '10px', backgroundColor: 'red'}}>Owner Dashboard Loaded</div>
      {/* SIDEBAR NAVIGATION */}
      <div style={sidebarStyle} className="responsive-sidebar">
        <h2 style={{color:'#10b981', textAlign:'center', marginBottom:'40px'}}>SPA MASTER</h2>
        <button onClick={() => setActiveTab('appointments')} style={activeTab === 'appointments' ? mActive : mBtn} className="responsive-btn">📅 Lịch Hẹn</button>
        <button onClick={() => setActiveTab('stocks')} style={activeTab === 'stocks' ? mActive : mBtn} className="responsive-btn">📈 Cổ Phần & Điểm</button>
        <button onClick={() => setActiveTab('products')} style={activeTab === 'products' ? mActive : mBtn} className="responsive-btn">🧴 Sản Phẩm Lẻ</button>
        <button onClick={() => setActiveTab('packages')} style={activeTab === 'packages' ? mActive : mBtn} className="responsive-btn">📑 Gói Trị Liệu</button>
        <button onClick={() => setActiveTab('customers')} style={activeTab === 'customers' ? mActive : mBtn} className="responsive-btn">🧖‍♀️ Khách Hàng</button>
        <button onClick={() => setActiveTab('online_orders')} style={activeTab === 'online_orders' ? mActive : mBtn} className="responsive-btn">
          🛒 Đơn Online
          {onlineOrders.filter(o => o.status === 'pending').length > 0 && (
            <span style={notifyDot}>●</span>
          )}
        </button>
        <button onClick={() => setActiveTab('treatment_history')} style={activeTab === 'treatment_history' ? mActive : mBtn} className="responsive-btn">📜 Nhật Ký Liệu Trình</button>
        <button onClick={() => setActiveTab('staff')} style={activeTab === 'staff' ? mActive : mBtn} className="responsive-btn">👥 Nhân Viên</button>
        <button onClick={() => setActiveTab('chat')} style={activeTab === 'chat' ? mActive : mBtn} className="responsive-btn">
          💬 Tin Nhắn
          <span style={notifyDot}>●</span>
        </button>
        <button onClick={() => setActiveTab('reports')} style={activeTab === 'reports' ? mActive : mBtn} className="responsive-btn">📊 Doanh Thu</button>
        <button onClick={() => setActiveTab('settings')} style={activeTab === 'settings' ? mActive : mBtn} className="responsive-btn">⚙️ Cài Đặt</button>
      </div>

      {/* NỘI DUNG CHÍNH */}
      <div style={mainContentStyle} className="responsive-main-content">
        {activeTab === 'appointments' && renderAppointments()}
        {activeTab === 'stocks' && renderStocks()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'packages' && renderPackages()}
        {activeTab === 'customers' && renderCustomers()}
        {activeTab === 'online_orders' && renderOnlineOrders()}
        {activeTab === 'treatment_history' && selectedCustomer && renderTreatmentDetail(selectedCustomer)}
        {activeTab === 'staff' && renderStaff()}
        {activeTab === 'chat' && renderChat()}
        {activeTab === 'reports' && renderReports()}
        {activeTab === 'settings' && renderSettings()}
      </div>

      {/* --- FORM MODAL TỔNG HỢP --- */}
      {modal.show && (
        <div style={overlayStyle}>
          <form style={formBoxStyle} className="responsive-modal responsive-form" onSubmit={handleSave}>
            <h3 style={{color:'#10b981', marginBottom:'20px'}}>THÊM MỚI {modal.type.toUpperCase()}</h3>

            {/* Form Đặt Lịch */}
            {modal.type === 'appointment' && (
              <>
                <div style={{ position: 'relative', marginBottom: '15px' }}>
                  <label style={lb}>1. Tìm khách hàng (SĐT/Tên):</label>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <input
                      name="customerName"
                      style={{ ...inStyle, marginBottom: 0, flex: 1 }}
                      placeholder="Nhập 090... hoặc Tên khách hàng"
                      value={searchCustomer}
                      onChange={(e) => setSearchCustomer(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      style={{ ...btnPrimary, width: '120px', fontSize: '11px' }}
                      onClick={() => setModal({ show: true, type: 'customer' })}
                    >
                      + Khách mới
                    </button>
                  </div>

                  {/* Danh sách khách hàng tìm được */}
                  {searchCustomer && (
                    <div style={dropdownSearch}>
                      {customers
                        .filter(c =>
                          c.phone.includes(searchCustomer) ||
                          c.name.toLowerCase().includes(searchCustomer.toLowerCase())
                        )
                        .map(c => (
                          <div
                            key={c.id}
                            style={searchItem}
                            onClick={() => {
                              setSearchCustomer(c.name);
                              setSelectedCustomer(c);
                            }}
                          >
                            <b>{c.name}</b> - {c.phone}
                            {c.myPackages.length > 0 && (
                              <div style={{ fontSize: '11px', color: '#10b981', marginTop: '2px' }}>
                                Đang dùng: {c.myPackages[0].name}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <label style={lb}>2. Chọn Dịch vụ / Liệu trình:</label>
                <select name="service" style={inStyle} required>
                  <option value="">-- Chọn từ danh mục --</option>
                  <optgroup label="Gói trị liệu (Liệu trình)">
                    {packages.map(p => <option key={p.id} value={p.name}>{p.name} ({p.sessions} buổi)</option>)}
                  </optgroup>
                  <optgroup label="Sản phẩm lẻ (Dịch vụ nhanh)">
                    {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </optgroup>
                </select>

                <label style={lb}>3. Chọn Nhân viên thực hiện:</label>
                <select name="ktv" style={inStyle} required>
                  <option value="">-- Chọn KTV --</option>
                  {staffs.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>

                <div style={grid2}>
                  <div>
                    <label style={lb}>Ngày:</label>
                    <input name="date" type="date" style={inStyle} required />
                  </div>
                  <div>
                    <label style={lb}>Giờ:</label>
                    <input name="time" type="time" style={inStyle} required />
                  </div>
                </div>
                <div>
                  <label style={lb}>Giá dịch vụ / gói (VND)</label>
                  <input name="price" type="number" style={inStyle} placeholder="Nhập giá hoặc để 0 nếu linh hoạt" />
                </div>
              </>
            )}

            {/* Form Mua hàng cho khách */}
            {modal.type === 'customer_purchase' && (
              <>
                <h4 style={{color:'#10b981', marginBottom:'15px'}}>Mua hàng cho: {modal.data.name}</h4>
                <label style={lb}>Loại mua hàng:</label>
                <select name="purchaseType" style={inStyle} required>
                  <option value="">-- Chọn loại --</option>
                  <option value="package">Gói trị liệu</option>
                  <option value="product">Sản phẩm lẻ</option>
                </select>
                <label style={lb}>Chọn gói/sản phẩm:</label>
                <select name="purchaseItemId" style={inStyle} required>
                  <option value="">-- Chọn --</option>
                  {modal.data.purchaseType === 'package' ? (
                    packages.map(p => <option key={p.id} value={p.id}>{p.name} - {p.price.toLocaleString()}đ ({p.rewardPoints} điểm)</option>)
                  ) : (
                    products.map(p => <option key={p.id} value={p.id}>{p.name} - {p.price.toLocaleString()}đ ({p.rewardPoints} điểm)</option>)
                  )}
                </select>
                <label style={lb}>Số lượng:</label>
                <input name="quantity" type="number" style={inStyle} defaultValue="1" min="1" />
              </>
            )}

            {/* Form Sản phẩm */}
            {modal.type === 'product' && (
              <>
                <label style={lb}>Tên sản phẩm/dịch vụ:</label><input name="name" style={inStyle} required />
                <label style={lb}>Giá bán (VND):</label><input name="price" type="number" style={inStyle} required />
                <label style={lb}>Điểm thưởng:</label><input name="rewardPoints" type="number" style={inStyle} placeholder="Điểm thưởng khi mua" />
                <label style={lb}>Tồn kho ban đầu:</label><input name="stock" type="number" style={inStyle} />
              </>
            )}

            {/* Form Gói trị liệu */}
            {modal.type === 'package' && (
              <>
                <label style={lb}>Tên gói combo:</label><input name="name" style={inStyle} required />
                <label style={lb}>Số buổi thực hiện:</label><input name="sessions" type="number" style={inStyle} required />
                <label style={lb}>Giá trọn gói (VND):</label><input name="price" type="number" style={inStyle} required />
                <label style={lb}>Điểm thưởng:</label><input name="rewardPoints" type="number" style={inStyle} placeholder="Điểm thưởng khi mua" />
              </>
            )}

            {/* Form Khách hàng mới */}
            {modal.type === 'customer' && (
              <>
                <label style={lb}>Họ tên khách hàng:</label><input name="name" style={inStyle} required />
                <label style={lb}>Số điện thoại:</label><input name="phone" style={inStyle} required />
                <label style={lb}>Mã giới thiệu (nếu có):</label><input name="referredBy" style={inStyle} placeholder="Nhập mã giới thiệu hoặc tên người giới thiệu" />
              </>
            )}

            {/* Form Nhân viên mới */}
            {modal.type === 'staff' && (
              <>
                <label style={lb}>Họ tên nhân viên:</label><input name="name" style={inStyle} required />
                <label style={lb}>SĐT:</label><input name="phone" style={inStyle} required />
                <label style={lb}>Lương cơ bản:</label><input name="baseSalary" type="number" style={inStyle} />
                <div style={grid2}>
                  <div><label style={lb}>% HH Dịch vụ:</label><input name="serviceComm" style={inStyle} /></div>
                  <div><label style={lb}>% HH Tư vấn:</label><input name="consultComm" style={inStyle} /></div>
                </div>
              </>
            )}

            {/* Form Thêm buổi điều trị */}
            {modal.type === 'treatment' && (
              <>
                <h4 style={{color:'#10b981', marginBottom:'15px'}}>Thêm buổi điều trị cho: {modal.data.name}</h4>
                <label style={lb}>Ngày thực hiện:</label><input name="date" type="date" style={inStyle} defaultValue={new Date().toISOString().split('T')[0]} required />
                <label style={lb}>Dịch vụ thực hiện:</label>
                <select name="service" style={inStyle} required>
                  <option value="">-- Chọn dịch vụ --</option>
                  {packages.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
                <label style={lb}>KTV thực hiện:</label>
                <select name="staff" style={inStyle} required>
                  <option value="">-- Chọn KTV --</option>
                  {staffs.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
                <label style={lb}>Ghi chú tình trạng:</label><textarea name="note" style={{...inStyle, minHeight:'80px'}} placeholder="Mô tả tình trạng da, diễn biến sau điều trị..." required />
              </>
            )}

            {/* Form Upload ảnh */}
            {modal.type === 'treatment_images' && (
              <>
                <h4 style={{color:'#10b981', marginBottom:'15px'}}>Cập nhật ảnh cho buổi: {modal.data.log.date} - {modal.data.log.service}</h4>
                <div style={grid2}>
                  <div>
                    <label style={lb}>Ảnh trước điều trị (Before):</label>
                    <input name="beforeImage" type="file" accept="image/*" style={inStyle} />
                  </div>
                  <div>
                    <label style={lb}>Ảnh sau điều trị (After):</label>
                    <input name="afterImage" type="file" accept="image/*" style={inStyle} />
                  </div>
                </div>
              </>
            )}

            <div style={{display:'flex', gap:'10px', marginTop:'20px'}}>
              <button type="submit" style={btnPrimaryFull}>XÁC NHẬN LƯU</button>
              <button type="button" style={btnCancel} onClick={() => setModal({show:false})}>HỦY BỎ</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
