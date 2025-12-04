/* ============================================
   CART.JS - CARRITO DE COMPRAS PREMIUM
   ============================================ */

// VARIABLES GLOBALES
let cart = JSON.parse(localStorage.getItem('happySmileCart')) || [];
const CART_KEY = 'happySmileCart';

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', function() {
    initCart();
    setupCartEvents();
});

// INICIALIZAR CARRITO
function initCart() {
    updateCartUI();
    updateMiniCart();
}

// ACTUALIZAR INTERFAZ DEL CARRITO
function updateCartUI() {
    updateCartCount();
    updateCartTotal();
    
    // Si estamos en página del carrito, cargar items
    if (window.location.pathname.includes('carrito.html')) {
        renderCartItems();
        updateCartSummary();
    }
    
    // Si estamos en checkout, actualizar resumen
    if (window.location.pathname.includes('checkout.html')) {
        updateCheckoutSummary();
    }
}

// ACTUALIZAR CONTADOR DEL CARRITO
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Actualizar todos los contadores en la página
    document.querySelectorAll('.cart-count, .cart-badge').forEach(element => {
        element.textContent = totalItems;
        element.style.display = totalItems > 0 ? 'flex' : 'none';
    });
    
    // Mostrar/ocultar mensaje de carrito vacío
    const emptyMsg = document.querySelector('.empty-cart-msg');
    if (emptyMsg) {
        emptyMsg.style.display = totalItems === 0 ? 'block' : 'none';
    }
}

// ACTUALIZAR TOTAL DEL CARRITO
function updateCartTotal() {
    const total = calculateTotal();
    document.querySelectorAll('.cart-total, .mini-cart-total').forEach(element => {
        element.textContent = `Bs. ${total.toFixed(2)}`;
    });
}

// CALCULAR TOTAL
function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// CALCULAR ENVÍO
function calculateShipping(subtotal) {
    return subtotal >= 100 ? 0 : 15;
}

// RENDERIZAR ITEMS DEL CARRITO
function renderCartItems() {
    const container = document.getElementById('cartItems');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Tu carrito está vacío</h3>
                <p>Añade productos deliciosos desde nuestro catálogo</p>
                <a href="../index.html" class="btn btn-primary">
                    <i class="fas fa-utensils"></i> Ver Productos
                </a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="item-image">
                <div class="image-placeholder">${item.image}</div>
            </div>
            <div class="item-info">
                <h4>${item.name}</h4>
                <p class="item-price">Bs. ${item.price.toFixed(2)} c/u</p>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn minus" onclick="updateQuantity('${item.id}', -1)">-</button>
                <input type="number" class="quantity-input" 
                       value="${item.quantity}" min="1" max="10"
                       onchange="updateQuantity('${item.id}', parseInt(this.value), true)">
                <button class="quantity-btn plus" onclick="updateQuantity('${item.id}', 1)">+</button>
            </div>
            <div class="item-total">
                <span>Bs. ${(item.price * item.quantity).toFixed(2)}</span>
            </div>
            <button class="remove-item" onclick="removeItem('${item.id}')" aria-label="Eliminar">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

// ACTUALIZAR RESUMEN DEL CARRITO
function updateCartSummary() {
    const subtotal = calculateTotal();
    const shipping = calculateShipping(subtotal);
    const total = subtotal + shipping;
    
    // Actualizar elementos
    document.getElementById('cartSubtotal').textContent = `Bs. ${subtotal.toFixed(2)}`;
    document.getElementById('cartShipping').textContent = shipping === 0 ? '¡GRATIS!' : `Bs. ${shipping.toFixed(2)}`;
    document.getElementById('cartTotal').textContent = `Bs. ${total.toFixed(2)}`;
    
    // Mensaje de envío gratis
    const freeShippingMsg = document.getElementById('freeShippingMsg');
    if (freeShippingMsg) {
        if (subtotal < 100) {
            const needed = (100 - subtotal).toFixed(2);
            freeShippingMsg.innerHTML = `<i class="fas fa-truck"></i> Añade Bs. ${needed} más para envío gratis`;
            freeShippingMsg.classList.add('visible');
        } else {
            freeShippingMsg.classList.remove('visible');
        }
    }
    
    // Habilitar/deshabilitar botón checkout
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
    }
}

// ACTUALIZAR RESUMEN DE CHECKOUT
function updateCheckoutSummary() {
    const subtotal = calculateTotal();
    const shipping = calculateShipping(subtotal);
    const total = subtotal + shipping;
    
    // Actualizar elementos
    document.getElementById('orderSubtotal').textContent = `Bs. ${subtotal.toFixed(2)}`;
    document.getElementById('orderShipping').textContent = shipping === 0 ? 'GRATIS' : `Bs. ${shipping.toFixed(2)}`;
    document.getElementById('orderTotal').textContent = `Bs. ${total.toFixed(2)}`;
    
    // Renderizar items en checkout
    const container = document.getElementById('orderItems');
    if (container) {
        container.innerHTML = cart.map(item => `
            <div class="order-item">
                <span>${item.name} x${item.quantity}</span>
                <span>Bs. ${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');
    }
}

// AÑADIR AL CARRITO
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        if (existingItem.quantity < 10) {
            existingItem.quantity += 1;
        } else {
            showNotification('Máximo 10 unidades por producto', 'warning');
            return;
        }
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification('Producto añadido al carrito', 'success');
    playAddSound();
}

// ELIMINAR ITEM
function removeItem(productId) {
    if (!confirm('¿Eliminar este producto del carrito?')) return;
    
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    showNotification('Producto eliminado', 'info');
}

// ACTUALIZAR CANTIDAD
function updateQuantity(productId, change, setExact = false) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    let newQuantity;
    
    if (setExact) {
        newQuantity = Math.max(1, Math.min(10, change));
    } else {
        newQuantity = item.quantity + change;
        
        if (newQuantity < 1) {
            removeItem(productId);
            return;
        }
        
        if (newQuantity > 10) {
            showNotification('Máximo 10 unidades por producto', 'warning');
            newQuantity = 10;
        }
    }
    
    item.quantity = newQuantity;
    saveCart();
    updateCartUI();
}

// VACIAR CARRITO
function clearCart() {
    if (!confirm('¿Vaciar todo el carrito?')) return;
    
    cart = [];
    saveCart();
    updateCartUI();
    showNotification('Carrito vaciado', 'info');
}

// GUARDAR CARRITO EN LOCALSTORAGE
function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// MINI CARRITO
function updateMiniCart() {
    const miniCart = document.querySelector('.mini-cart');
    if (!miniCart) return;
    
    const itemsContainer = miniCart.querySelector('.mini-cart-items');
    const totalElement = miniCart.querySelector('.mini-cart-total');
    
    if (!itemsContainer || !totalElement) return;
    
    if (cart.length === 0) {
        itemsContainer.innerHTML = '<p class="empty">Carrito vacío</p>';
        totalElement.textContent = 'Bs. 0.00';
        return;
    }
    
    // Mostrar primeros 3 items
    itemsContainer.innerHTML = cart.slice(0, 3).map(item => `
        <div class="mini-item">
            <span class="mini-item-image">${item.image}</span>
            <div class="mini-item-info">
                <span class="mini-item-name">${item.name}</span>
                <span class="mini-item-quantity">${item.quantity} x Bs. ${item.price.toFixed(2)}</span>
            </div>
        </div>
    `).join('');
    
    // Si hay más de 3 items, mostrar contador
    if (cart.length > 3) {
        itemsContainer.innerHTML += `
            <div class="mini-more-items">
                +${cart.length - 3} producto(s) más
            </div>
        `;
    }
    
    totalElement.textContent = `Bs. ${calculateTotal().toFixed(2)}`;
}

// TOGGLE MINI CARRITO
function toggleMiniCart() {
    const miniCart = document.querySelector('.mini-cart');
    if (miniCart) {
        miniCart.classList.toggle('active');
    }
}

// CONFIGURAR EVENTOS
function setupCartEvents() {
    // Botón vaciar carrito
    const clearBtn = document.getElementById('clearCartBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearCart);
    }
    
    // Botón checkout
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                window.location.href = 'pages/checkout.html';
            }
        });
    }
    
    // Botones del mini carrito
    document.querySelectorAll('.cart-button, .cart-btn-premium').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleMiniCart();
        });
    });
    
    // Cerrar mini carrito al hacer clic fuera
    document.addEventListener('click', (e) => {
        const miniCart = document.querySelector('.mini-cart');
        if (miniCart && !miniCart.contains(e.target) && 
            !e.target.closest('.cart-button') && 
            !e.target.closest('.cart-btn-premium')) {
            miniCart.classList.remove('active');
        }
    });
}

// OBTENER RESUMEN DEL PEDIDO
function getOrderSummary() {
    const subtotal = calculateTotal();
    const shipping = calculateShipping(subtotal);
    const total = subtotal + shipping;
    
    return {
        items: [...cart],
        subtotal: subtotal,
        shipping: shipping,
        total: total,
        itemCount: cart.reduce((sum, item) => sum + item.quantity, 0)
    };
}

// NOTIFICACIONES
function showNotification(message, type = 'info') {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
        <span>${message}</span>
    `;
    
    // Añadir al body
    document.body.appendChild(notification);
    
    // Mostrar
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// SONIDO DE AÑADIR AL CARRITO
function playAddSound() {
    // Sonido simple sin archivos externos
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
        // Silenciar error si AudioContext no está soportado
    }
}

// EXPORTAR FUNCIONES PARA USO GLOBAL
window.CartManager = {
    addToCart,
    removeItem,
    updateQuantity,
    clearCart,
    getOrderSummary,
    updateCartUI
};