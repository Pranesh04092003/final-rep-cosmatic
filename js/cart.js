// Cart management functions
class CartManager {
  constructor() {
    this.cart = this.loadCart();
  }

  loadCart() {
    const stored = localStorage.getItem('cosmetic_cart');
    return stored ? JSON.parse(stored) : [];
  }

  saveCart() {
    localStorage.setItem('cosmetic_cart', JSON.stringify(this.cart));
  }

  addItem(product, quantity = 1) {
    const existingItem = this.cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({ ...product, quantity });
    }
    this.saveCart();
    return { success: true, message: `${product.name} added to cart` };
  }

  removeItem(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
  }

  updateQuantity(productId, quantity) {
    const item = this.cart.find(item => item.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.saveCart();
    }
  }

  getCart() {
    return this.cart;
  }

  getTotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getItemCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  clear() {
    this.cart = [];
    this.saveCart();
  }
}

const cartManager = new CartManager();
