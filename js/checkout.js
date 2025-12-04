/* CHECKOUT.JS - VERSIÓN RÁPIDA */
document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.pathname.includes('checkout.html')) return;
    
    initCheckout();
    loadCartItems();
    setupCheckoutEvents();
});

function initCheckout() {
    updateOrderSummary();
    setupFormValidation();
}

function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('happySmileCart')) || [];
    const container = document.getElementById('orderItems');
    if (!container) return;
    
    container.innerHTML = cart.map(item => `
        <div class="order-item">
            <span>${item.name} x${item.quantity}</span>
            <span>Bs. ${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
}

function updateOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('happySmileCart')) || [];
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 100 ? 0 : 15;
    const total = subtotal + shipping;
    
    document.getElementById('orderSubtotal').textContent = `Bs. ${subtotal.toFixed(2)}`;
    document.getElementById('orderShipping').textContent = shipping === 0 ? 'GRATIS' : `Bs. ${shipping.toFixed(2)}`;
    document.getElementById('orderTotal').textContent = `Bs. ${total.toFixed(2)}`;
}

function setupFormValidation() {
    const form = document.getElementById('checkoutForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            processOrder();
        }
    });
}

function validateForm() {
    const required = ['name', 'phone', 'address', 'payment'];
    let isValid = true;
    
    required.forEach(field => {
        const element = document.getElementById(field);
        if (!element || !element.value.trim()) {
            showError(`${field} es requerido`);
            isValid = false;
        }
    });
    
    return isValid;
}

function processOrder() {
    const order = {
        id: 'ORD-' + Date.now(),
        date: new Date().toISOString(),
        customer: {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            notes: document.getElementById('notes').value
        },
        items: JSON.parse(localStorage.getItem('happySmileCart')) || [],
        payment: document.querySelector('input[name="payment"]:checked').value,
        total: document.getElementById('orderTotal').textContent
    };
    
    // Guardar orden
    localStorage.setItem('lastOrder', JSON.stringify(order));
    
    // Limpiar carrito
    localStorage.removeItem('happySmileCart');
    
    // Redirigir a confirmación
    window.location.href = 'orden-confirmada.html';
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.querySelector('.checkout-form').prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
}

function setupCheckoutEvents() {
    // Cambio de método de pago
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.querySelectorAll('.payment-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            e.target.closest('.payment-option').classList.add('selected');
        });
    });
}