/**
 * Customer purchase handlers
 */
export const usePurchaseHandlers = ({
  customers,
  packages,
  products,
  settings,
  setCustomers,
  setOnlineOrders
}) => {
  // Handle customer purchase
  const handleCustomerPurchase = (customer, purchaseData) => {
    const purchaseType = purchaseData.purchaseType;
    const itemId = Number(purchaseData.purchaseItemId);
    const quantity = Number(purchaseData.quantity) || 1;
    
    const item = purchaseType === 'package'
      ? packages.find(p => p.id === itemId)
      : products.find(p => p.id === itemId);

    if (!item) {
      alert('Vui lòng chọn gói hoặc sản phẩm để mua.');
      return;
    }

    const rewardRate = purchaseType === 'package' 
      ? settings.packagePointRate 
      : settings.productPointRate;
    const purchasePoints = (item.rewardPoints || Math.round(item.price / 1000 * rewardRate)) * quantity;
    const referrer = customers.find(c => 
      c.referralCode === customer.referredBy || c.name === customer.referredBy
    );

    let updatedCustomers = customers.map(c => {
      if (c.id === customer.id) {
        return {
          ...c,
          points: (c.points || 0) + purchasePoints,
          myPackages: purchaseType === 'package'
            ? [
                ...(c.myPackages || []), 
                { 
                  id: Date.now(), 
                  name: item.name, 
                  used: 0, 
                  total: Number(item.sessions || 1), 
                  price: item.price, 
                  rewardPoints: item.rewardPoints || 0, 
                  purchaseDate: new Date().toLocaleDateString('vi-VN') 
                }
              ]
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
      updatedCustomers = updatedCustomers.map((u, idx) => 
        u.id === customer.id ? { ...u, referralRewarded: true } : u
      );
      alert(`Khách giới thiệu ${referrer.name} đã nhận ${settings.referralPoints} điểm và ${settings.referralStocks} cổ phần.`);
    }

    setCustomers(updatedCustomers);
  };

  // Confirm online order
  const handleConfirmOrder = (order) => {
    const customer = customers.find(c => c.phone === order.customerPhone);
    if (!customer) {
      alert('Không tìm thấy khách hàng.');
      return;
    }

    const referrer = customers.find(c => 
      c.referralCode === customer.referredBy || c.name === customer.referredBy
    );

    let updatedCustomers = customers.map(c => {
      if (c.id === customer.id) {
        return {
          ...c,
          points: (c.points || 0) + order.rewardPoints,
          myPackages: order.orderType === 'package'
            ? [
                ...(c.myPackages || []), 
                { 
                  id: Date.now(), 
                  name: order.itemName, 
                  used: 0, 
                  total: packages.find(p => p.id === order.itemId)?.sessions || 1, 
                  price: order.totalPrice, 
                  rewardPoints: order.rewardPoints || 0, 
                  purchaseDate: new Date().toLocaleDateString('vi-VN'),
                  orderId: order.id
                }
              ]
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
      updatedCustomers = updatedCustomers.map(u =>
        u.id === customer.id ? { ...u, referralRewarded: true } : u
      );
      alert(`Khách giới thiệu ${referrer.name} đã nhận ${settings.referralPoints} điểm và ${settings.referralStocks} cổ phần.`);
    }

    setCustomers(updatedCustomers);
    setOnlineOrders(prev => 
      prev.map(o => o.id === order.id ? { ...o, status: 'confirmed' } : o)
    );
    alert(`Đã xác nhận đơn hàng ${order.id} thành công! Khách hàng ${customer.name} nhận ${order.rewardPoints} điểm thưởng.`);
  };

  // Cancel online order
  const handleCancelOrder = (orderId) => {
    setOnlineOrders(prev => 
      prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o)
    );
    alert(`Đã hủy đơn hàng ${orderId}.`);
  };

  // Adjust stock
  const handleAdjustStock = (userName, amount) => {
    setCustomers(customers.map(c => 
      c.name === userName 
        ? { ...c, stocks: (c.stocks || 0) + Number(amount) } 
        : c
    ));
    alert(`Đã điều chỉnh ${amount} cổ phần cho ${userName}`);
  };

  return {
    handleCustomerPurchase,
    handleConfirmOrder,
    handleCancelOrder,
    handleAdjustStock
  };
};
