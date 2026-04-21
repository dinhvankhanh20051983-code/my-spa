/**
 * Initialize default data for Owner Dashboard
 */
export const useInitialData = () => {
  return {
    products: [
      { 
        id: 1, 
        name: "Massage Tinh Dầu", 
        price: 300000, 
        stock: 99, 
        rewardPoints: 300 
      },
      { 
        id: 2, 
        name: "Serum Vitamin C", 
        price: 850000, 
        stock: 15, 
        rewardPoints: 850 
      }
    ],

    packages: [
      { 
        id: 101, 
        name: "Liệu trình Trị mụn 10 buổi", 
        sessions: 10, 
        price: 5000000, 
        rewardPoints: 5000 
      },
      { 
        id: 102, 
        name: "Gói Trắng sáng da 5 buổi", 
        sessions: 5, 
        price: 3500000, 
        rewardPoints: 3500 
      }
    ],

    staffs: [
      { 
        id: 201, 
        name: "KTV Thảo", 
        phone: "0905111222", 
        baseSalary: 6000000, 
        serviceComm: 10, 
        consultComm: 5, 
        stocks: 5000 
      }
    ],

    customers: [
      { 
        id: 301,
        name: "Nguyễn Anh Thư",
        phone: "0905666777",
        points: 1200,
        stocks: 1000,
        referralCode: "0905666777",
        referredBy: '',
        referralRewarded: false,
        myPackages: [
          { 
            id: 1, 
            name: "Liệu trình Trị mụn 10 buổi", 
            used: 3, 
            total: 10 
          }
        ],
        history: [
          {
            date: "2026-04-10",
            service: "Trị mụn B1",
            staff: "Thảo",
            note: "Da bớt sưng, tiếp tục liệu trình.",
            skinCondition: "Da nhạy cảm, có mụn viêm và sẹo thâm.",
            productsUsed: "Sửa rửa mặt dịu, serum trị mụn, kem dưỡng phục hồi.",
            nextStep: "Giữ ẩm, hạn chế nặn mụn, hẹn tái khám sau 7 ngày.",
            images: {},
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
            images: {},
            sessionProgress: "Buổi 2/10"
          }
        ]
      }
    ],

    appointments: [
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
    ],

    onlineOrders: [
      {
        id: 1001,
        customerName: "Nguyễn Anh Thư",
        customerPhone: "0905666777",
        orderType: "package",
        itemId: 101,
        itemName: "Liệu trình Trị mụn 10 buổi",
        quantity: 1,
        totalPrice: 5000000,
        rewardPoints: 5000,
        paymentMethod: "bank_transfer",
        paymentProof: "https://example.com/proof.jpg",
        status: "pending",
        orderDate: "2026-04-20",
        notes: "Khách hàng mới, ưu tiên xử lý"
      }
    ],

    settings: {
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
      invoicePrefix: 'HD',
      totalStocks: 10000000
    }
  };
};
