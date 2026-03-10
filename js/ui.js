// UI helper functions
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function showModal(title, content, onConfirm = null) {
  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        ${content}
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary modal-close">Cancel</button>
        <button class="btn btn-primary btn-confirm">Confirm</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  const closeBtn = modal.querySelector('.modal-close');
  const confirmBtn = modal.querySelector('.btn-confirm');
  
  closeBtn.addEventListener('click', () => modal.remove());
  confirmBtn.addEventListener('click', () => {
    if (onConfirm) onConfirm();
    modal.remove();
  });
}

function formatPrice(price) {
  return '₹' + price.toLocaleString('en-IN');
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = cartManager.getItemCount();
  }
}

function updateAuthUI() {
  const authContainer = document.getElementById('auth-links');
  if (!authContainer) return;
  
  if (authManager.isLoggedIn()) {
    authContainer.innerHTML = `
      <span class="user-name">${authManager.currentUser.name}</span>
      <a href="#" onclick="logout(); return false;">Logout</a>
      ${authManager.isAdmin() ? '<a href="pages/admin.html">Admin Panel</a>' : ''}
    `;
  } else {
    authContainer.innerHTML = `
      <a href="pages/login.html">Login</a>
      <a href="pages/signup.html">Sign Up</a>
    `;
  }
}

function logout() {
  // Create a smooth fade-out effect
  const body = document.body;
  body.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
  body.style.opacity = '0';
  body.style.transform = 'translateY(10px)';
  
  // Perform logout and redirect after animation
  setTimeout(() => {
    authManager.logout();
    updateAuthUI();
    window.location.href = '../index.html';
  }, 500);
}

function redirectToLogin() {
  window.location.href = 'pages/login.html';
}

function redirectToHome() {
  window.location.href = '../../index.html';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  updateCartBadge();
});
