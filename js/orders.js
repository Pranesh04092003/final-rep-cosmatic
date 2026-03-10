// Order management functions backed by the API
class OrderManager {
  async createOrder(userDetails, items) {
    const payload = {
      user_id: userDetails.id ? String(userDetails.id) : null,
      email: userDetails.email,
      paymentMethod: userDetails.paymentMethod,
      shippingMethod: userDetails.shippingMethod,
      shippingAddress: {
        firstName: userDetails.shippingAddress.firstName,
        lastName: userDetails.shippingAddress.lastName,
        address: userDetails.shippingAddress.address,
        city: userDetails.shippingAddress.city,
        state: userDetails.shippingAddress.state,
        zipcode: userDetails.shippingAddress.zipcode,
        country: userDetails.shippingAddress.country,
        phone: userDetails.shippingAddress.phone,
      },
      items: items.map(item => ({ product_id: item.id, quantity: item.quantity })),
    };

    const res = await window.api.createOrderApi(payload);
    return {
      id: res.id,
      date: new Date().toLocaleDateString(),
      items,
      total: res.total,
      status: res.status,
      paymentMethod: userDetails.paymentMethod,
      shippingMethod: userDetails.shippingMethod,
      user: { email: userDetails.email, shippingAddress: userDetails.shippingAddress },
    };
  }

  async getOrders(userId = null) {
    return window.api.fetchOrdersApi(userId);
  }

  async getOrder(orderId) {
    return window.api.fetchOrderApi(orderId);
  }

  async updateOrderStatus(orderId, status) {
    return window.api.updateOrderStatusApi(orderId, status);
  }

  async deleteOrder(orderId) {
    return window.api.deleteOrderApi(orderId);
  }
}

const orderManager = new OrderManager();
