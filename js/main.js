// ===== 2X DELICIAS - JAVASCRIPT PRINCIPAL =====
// Archivo único para todas las funcionalidades del sitio

// ===== 1. CONFIGURACIÓN INICIAL =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('2X Delicias - Sitio cargado correctamente');
    
    // Inicializar todas las funcionalidades
    initMobileMenu();
    initCartSystem();
    initForms();
    initAnimations();
    updateCartBadge();
});

// ===== 2. MENÚ MÓVIL =====
function initMobileMenu() {
    const menuBtn = document.querySelector('.menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!menuBtn || !navMenu) return;
    
    menuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        navMenu.classList.toggle('active');
    });
    
    // Cerrar menú al hacer clic en enlace
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
}

// ===== 3. SISTEMA DE CARRITO =====
function initCartSystem() {
    // Añadir productos al carrito
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-add')) {
            const producto = e.target.closest('.producto');
            if (!producto) return;
            
            const nombre = producto.querySelector('h3').textContent;
            const precio = producto.querySelector('p').textContent;
            
            showNotification(`✓ ${nombre} añadido al carrito`, 'success');
            updateCartBadge(1);
            
            // Guardar en localStorage
            saveToCart({ nombre, precio, cantidad: 1 });
        }
        
        // Eliminar productos del carrito
        if (e.target.classList.contains('btn-remove') || e.target.closest('.btn-remove')) {
            if (confirm('¿Eliminar producto del carrito?')) {
                const fila = e.target.closest('tr');
                if (fila) {
                    fila.style.animation = 'fadeOut 0.3s ease-out';
                    setTimeout(() => {
                        fila.remove();
                        updateCartTotal();
                        showNotification('Producto eliminado', 'error');
                        updateCartBadge(-1);
                    }, 300);
                }
            }
        }
    });
    
    // Actualizar cantidades
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('cantidad-input')) {
            updateCartTotal();
        }
    });
}

// ===== 4. FORMULARIOS =====
function initForms() {
    // Formulario de contacto
    const contactoForm = document.getElementById('form-contacto');
    if (contactoForm) {
        contactoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('✓ Mensaje enviado. Te contactaremos pronto.', 'success');
            setTimeout(() => this.reset(), 1000);
        });
    }
    
    // Formulario de checkout
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validación básica
            const inputs = this.querySelectorAll('input[required], select[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = '#e74c3c';
                    isValid = false;
                } else {
                    input.style.borderColor = '#ddd';
                }
            });
            
            if (isValid) {
                showNotification('✓ Pedido confirmado. Redirigiendo...', 'success');
                setTimeout(() => {
                    window.location.href = 'orden-confirmada.html';
                }, 2000);
            } else {
                showNotification('⚠ Completa todos los campos requeridos', 'error');
            }
        });
    }
}

// ===== 5. FUNCIONES AUXILIARES =====
function showNotification(message, type = 'success') {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Estilos dinámicos
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        background: type === 'success' ? '#27ae60' : '#e74c3c',
        color: 'white',
        borderRadius: '5px',
        zIndex: '10000',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minWidth: '300px',
        animation: 'slideIn 0.3s ease-out',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
    });
    
    document.body.appendChild(notification);
    
    // Auto-eliminar
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

function updateCartBadge(increment = 0) {
    let cartCount = parseInt(localStorage.getItem('cartCount') || '0');
    cartCount = Math.max(0, cartCount + increment);
    localStorage.setItem('cartCount', cartCount);
    
    // Actualizar badge en todas las páginas
    document.querySelectorAll('.cart-badge').forEach(badge => {
        badge.textContent = cartCount;
        badge.style.display = cartCount > 0 ? 'flex' : 'none';
    });
    
    return cartCount;
}

function saveToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartTotal() {
    let total = 0;
    document.querySelectorAll('.carrito-table tbody tr').forEach(row => {
        const priceText = row.cells[1].textContent.replace('$', '');
        const price = parseFloat(priceText) || 0;
        const quantity = parseInt(row.querySelector('.cantidad-input')?.value) || 1;
        const subtotal = price * quantity;
        
        if (row.cells[3]) {
            row.cells[3].textContent = '$' + subtotal.toFixed(2);
        }
        
        total += subtotal;
    });
    
    // Actualizar resumen si existe
    const subtotalElement = document.querySelector('.resumen-item:first-child span:last-child');
    const totalElement = document.querySelector('.resumen-item.total span:last-child');
    
    if (subtotalElement) {
        subtotalElement.textContent = '$' + total.toFixed(2);
    }
    
    if (totalElement) {
        const shipping = 3.00;
        totalElement.textContent = '$' + (total + shipping).toFixed(2);
    }
}

// ===== 6. ANIMACIONES =====
function initAnimations() {
    // Observador para animaciones al scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    // Animar productos
    document.querySelectorAll('.producto').forEach(producto => {
        producto.style.opacity = '0';
        producto.style.transform = 'translateY(20px)';
        producto.style.transition = 'all 0.5s ease-out';
        observer.observe(producto);
    });
}

// ===== 7. INYECTAR ESTILOS GLOBALES =====
(function injectGlobalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        .cart-badge {
            position: absolute;
            top: -8px;
            right: -8px;
            background: #e74c3c;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 12px;
            display: none;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
        
        .notification button {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            margin-left: 10px;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .notification button:hover {
            opacity: 0.8;
        }
        
        input:focus, textarea:focus, select:focus {
            outline: none;
            border-color: #3498db !important;
            box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2) !important;
        }
    `;
    document.head.appendChild(style);
})();

// ===== 8. HACER FUNCIONES GLOBALES =====
window.showNotification = showNotification;
window.updateCartTotal = updateCartTotal;
window.updateCartBadge = updateCartBadge;