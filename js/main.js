// ===== 2X DELICIAS - JAVASCRIPT PRINCIPAL =====
// Archivo único para todas las funcionalidades del sitio

// ===== 1. CONFIGURACIÓN INICIAL =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('2X Delicias - Sitio web cargado correctamente');
    
    // Inicializar todas las funcionalidades
    initMobileMenu();
    initCartSystem();
    initForms();
    initAnimations();
    initNotifications();
    initCartBadge();
    
    console.log('Todas las funcionalidades inicializadas');
});

// ===== 2. MENÚ MÓVIL =====
function initMobileMenu() {
    const menuBtn = document.querySelector('.menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    // Verificar si los elementos existen
    if (!menuBtn || !navMenu) {
        console.log('Elementos del menú no encontrados, saltando inicialización');
        return;
    }
    
    console.log('Inicializando menú móvil');
    
    // Abrir/cerrar menú al hacer clic en el botón
    menuBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevenir que el clic se propague
        navMenu.classList.toggle('active');
        
        // Cambiar icono del botón
        const icon = menuBtn.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            // Restaurar icono del botón
            const icon = menuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
    
    // Cerrar menú al hacer clic fuera de él
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            navMenu.classList.remove('active');
            // Restaurar icono del botón
            const icon = menuBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
    
    // Cerrar menú al redimensionar la ventana (si se hace grande)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            const icon = menuBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
}

// ===== 3. SISTEMA DE CARRITO =====
function initCartSystem() {
    console.log('Inicializando sistema de carrito');
    
    // Añadir productos al carrito
    document.addEventListener('click', function(e) {
        // Verificar si se hizo clic en un botón "Añadir al Carrito"
        if (e.target.classList.contains('btn-add') || 
            (e.target.tagName === 'BUTTON' && e.target.textContent.includes('Añadir'))) {
            
            const producto = e.target.closest('.producto');
            if (!producto) {
                console.log('Producto no encontrado');
                return;
            }
            
            const nombre = producto.querySelector('h3')?.textContent || 'Producto';
            const precio = producto.querySelector('p')?.textContent || '$0.00';
            const imagen = producto.querySelector('img')?.src || '';
            
            console.log(`Añadiendo al carrito: ${nombre} - ${precio}`);
            
            // Mostrar notificación
            showNotification(`✅ ${nombre} añadido al carrito`, 'success');
            
            // Actualizar contador del carrito
            updateCartBadge(1);
            
            // Guardar en localStorage
            saveToCart({
                nombre: nombre,
                precio: precio,
                imagen: imagen,
                cantidad: 1,
                fecha: new Date().toISOString()
            });
            
            // Prevenir comportamiento por defecto
            e.preventDefault();
        }
        
        // Eliminar productos del carrito
        if (e.target.classList.contains('btn-remove') || 
            e.target.closest('.btn-remove') || 
            (e.target.tagName === 'BUTTON' && e.target.textContent.includes('Eliminar'))) {
            
            if (confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
                const fila = e.target.closest('tr') || e.target.closest('.producto-item');
                if (fila) {
                    // Animación de eliminación
                    fila.style.opacity = '0.5';
                    fila.style.transform = 'translateX(-20px)';
                    fila.style.transition = 'all 0.3s';
                    
                    setTimeout(() => {
                        fila.remove();
                        updateCartTotal();
                        showNotification('🗑️ Producto eliminado del carrito', 'error');
                        updateCartBadge(-1);
                    }, 300);
                }
            }
        }
    });
    
    // Actualizar cantidades en el carrito
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('cantidad-input')) {
            console.log('Cantidad actualizada:', e.target.value);
            updateCartTotal();
            
            // Actualizar en localStorage si es necesario
            const productoId = e.target.dataset.productId;
            if (productoId) {
                updateCartQuantity(productoId, parseInt(e.target.value));
            }
        }
    });
    
    // Inicializar total del carrito si estamos en la página del carrito
    if (document.querySelector('.carrito-table')) {
        updateCartTotal();
    }
}

// ===== 4. FORMULARIOS =====
function initForms() {
    console.log('Inicializando formularios');
    
    // Formulario de contacto (si existe)
    const contactoForm = document.getElementById('form-contacto');
    if (contactoForm) {
        contactoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validación básica
            const nombre = this.querySelector('input[type="text"]')?.value;
            const email = this.querySelector('input[type="email"]')?.value;
            const mensaje = this.querySelector('textarea')?.value;
            
            if (!nombre || !email || !mensaje) {
                showNotification('⚠️ Por favor, completa todos los campos', 'error');
                return;
            }
            
            // Simular envío
            showNotification('📧 Mensaje enviado. Te contactaremos pronto.', 'success');
            
            // Resetear formulario después de 1 segundo
            setTimeout(() => {
                this.reset();
            }, 1000);
            
            // Aquí normalmente enviarías los datos a un servidor
            console.log('Formulario enviado:', { nombre, email, mensaje });
        });
    }
    
    // Formulario de checkout (si existe)
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar campos requeridos
            const requiredInputs = this.querySelectorAll('input[required], select[required]');
            let isValid = true;
            
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = '#e74c3c';
                    isValid = false;
                } else {
                    input.style.borderColor = '#ddd';
                }
            });
            
            if (!isValid) {
                showNotification('⚠️ Por favor, completa todos los campos requeridos', 'error');
                return;
            }
            
            // Validar términos y condiciones
            const termsCheckbox = this.querySelector('input[type="checkbox"][required]');
            if (termsCheckbox && !termsCheckbox.checked) {
                showNotification('⚠️ Debes aceptar los términos y condiciones', 'error');
                return;
            }
            
            // Mostrar mensaje de confirmación
            showNotification('✅ Pedido confirmado. Redirigiendo...', 'success');
            
            // Simular procesamiento
            setTimeout(() => {
                // Aquí normalmente redirigirías a la página de confirmación
                // o enviarías los datos al servidor
                console.log('Checkout completado');
                
                // Limpiar carrito
                localStorage.removeItem('cart');
                localStorage.setItem('cartCount', '0');
                updateCartBadge(0);
                
                // Redirigir a página de confirmación si existe
                if (window.location.pathname.includes('checkout')) {
                    window.location.href = 'orden-confirmada.html';
                }
            }, 2000);
        });
        
        // Mostrar/ocultar campos de tarjeta según método de pago
        const paymentMethods = checkoutForm.querySelectorAll('input[name="payment"]');
        const cardInfo = document.getElementById('tarjeta-info');
        
        if (paymentMethods.length > 0 && cardInfo) {
            paymentMethods.forEach(method => {
                method.addEventListener('change', function() {
                    if (this.value === 'tarjeta') {
                        cardInfo.style.display = 'block';
                    } else {
                        cardInfo.style.display = 'none';
                    }
                });
            });
        }
    }
    
    // Todos los formularios generales
    document.querySelectorAll('form').forEach(form => {
        if (!form.id) { // Solo formularios sin ID específico
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                showNotification('✅ Formulario enviado correctamente', 'success');
                setTimeout(() => this.reset(), 1000);
            });
        }
    });
}

// ===== 5. NOTIFICACIONES =====
function initNotifications() {
    // Inyectar estilos CSS para notificaciones
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: #27ae60;
            color: white;
            border-radius: 8px;
            z-index: 10000;
            display: flex;
            justify-content: space-between;
            align-items: center;
            min-width: 300px;
            max-width: 400px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            animation: notificationSlideIn 0.3s ease-out;
            transform: translateX(0);
            opacity: 1;
        }
        
        .notification.error {
            background: #e74c3c;
        }
        
        .notification.warning {
            background: #f39c12;
        }
        
        .notification.info {
            background: #3498db;
        }
        
        .notification-content {
            flex: 1;
            margin-right: 10px;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        
        .notification-close:hover {
            opacity: 1;
        }
        
        @keyframes notificationSlideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes notificationSlideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

function showNotification(message, type = 'success') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">${message}</div>
        <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Agregar al documento
    document.body.appendChild(notification);
    
    // Auto-eliminar después de 4 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'notificationSlideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
    
    // Hacer la función globalmente accesible
    window.showNotification = showNotification;
}

// ===== 6. BADGE DEL CARRITO =====
function initCartBadge() {
    // Inicializar contador del carrito desde localStorage
    let cartCount = parseInt(localStorage.getItem('cartCount')) || 0;
    
    // Actualizar todos los badges en la página
    updateCartBadge(0); // Actualizar sin cambiar el contador
    
    console.log(`Carrito inicializado con ${cartCount} productos`);
}

function updateCartBadge(increment = 0) {
    // Obtener contador actual
    let cartCount = parseInt(localStorage.getItem('cartCount')) || 0;
    
    // Aplicar incremento (puede ser negativo)
    cartCount = Math.max(0, cartCount + increment);
    
    // Guardar en localStorage
    localStorage.setItem('cartCount', cartCount.toString());
    
    // Actualizar todos los badges en la página
    document.querySelectorAll('.cart-badge').forEach(badge => {
        badge.textContent = cartCount;
        badge.style.display = cartCount > 0 ? 'flex' : 'none';
    });
    
    return cartCount;
}

// ===== 7. LOCALSTORAGE (CARRITO) =====
function saveToCart(product) {
    try {
        // Obtener carrito actual
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Verificar si el producto ya existe
        const existingIndex = cart.findIndex(item => 
            item.nombre === product.nombre && item.precio === product.precio
        );
        
        if (existingIndex > -1) {
            // Incrementar cantidad si ya existe
            cart[existingIndex].cantidad += 1;
        } else {
            // Agregar nuevo producto
            cart.push(product);
        }
        
        // Guardar en localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        console.log('Carrito guardado:', cart);
        return true;
    } catch (error) {
        console.error('Error al guardar en el carrito:', error);
        return false;
    }
}

function getCart() {
    try {
        return JSON.parse(localStorage.getItem('cart')) || [];
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        return [];
    }
}

function clearCart() {
    localStorage.removeItem('cart');
    localStorage.setItem('cartCount', '0');
    updateCartBadge(0);
    console.log('Carrito limpiado');
}

function updateCartQuantity(productId, quantity) {
    // Implementar si necesitas actualizar cantidades específicas
    console.log(`Actualizando cantidad del producto ${productId} a ${quantity}`);
}

// ===== 8. CÁLCULO DEL TOTAL DEL CARRITO =====
function updateCartTotal() {
    // Esta función solo funciona en la página del carrito
    const carritoTable = document.querySelector('.carrito-table tbody');
    if (!carritoTable) return;
    
    let subtotal = 0;
    
    // Calcular subtotal de cada producto
    carritoTable.querySelectorAll('tr').forEach(row => {
        const priceCell = row.cells[1];
        const quantityInput = row.querySelector('.cantidad-input');
        const totalCell = row.cells[3];
        
        if (priceCell && quantityInput && totalCell) {
            const price = parseFloat(priceCell.textContent.replace('$', '')) || 0;
            const quantity = parseInt(quantityInput.value) || 1;
            const productTotal = price * quantity;
            
            // Actualizar total del producto
            totalCell.textContent = '$' + productTotal.toFixed(2);
            
            // Sumar al subtotal
            subtotal += productTotal;
        }
    });
    
    // Actualizar resumen
    updateCartSummary(subtotal);
}

function updateCartSummary(subtotal) {
    const subtotalElement = document.querySelector('.resumen-item:first-child span:last-child');
    const totalElement = document.querySelector('.resumen-item.total span:last-child');
    
    if (subtotalElement && totalElement) {
        const shipping = 3.00; // Costo de envío fijo
        const total = subtotal + shipping;
        
        subtotalElement.textContent = '$' + subtotal.toFixed(2);
        totalElement.textContent = '$' + total.toFixed(2);
    }
}

// ===== 9. ANIMACIONES =====
function initAnimations() {
    // Animación para productos al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar productos para animarlos al aparecer
    document.querySelectorAll('.producto').forEach(producto => {
        producto.style.opacity = '0';
        producto.style.transform = 'translateY(20px)';
        producto.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(producto);
    });
    
    // Animación para elementos con clase "animate"
    document.querySelectorAll('.animate').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    });
}

// ===== 10. FUNCIONALIDADES ADICIONALES =====

// Contador de visitas (simple)
function initVisitCounter() {
    let visits = localStorage.getItem('pageVisits') || 0;
    visits = parseInt(visits) + 1;
    localStorage.setItem('pageVisits', visits.toString());
    console.log(`Visita número: ${visits}`);
}

// Cambiar tema oscuro/claro (simple)
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode);
            showNotification(isDarkMode ? '🌙 Modo oscuro activado' : '☀️ Modo claro activado', 'info');
        });
        
        // Cargar preferencia guardada
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
    }
}

// Validar formularios en tiempo real
function initFormValidation() {
    document.querySelectorAll('input[required], textarea[required]').forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.style.borderColor = '#e74c3c';
            } else {
                this.style.borderColor = '#27ae60';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = '#ddd';
            }
        });
    });
}

// ===== 11. MANEJO DE ERRORES =====
window.addEventListener('error', function(e) {
    console.error('Error capturado:', e.error);
    // Aquí podrías enviar el error a un servicio de monitoreo
});

// ===== 12. INICIALIZACIÓN COMPLETA =====

// Verificar si estamos en una página específica
function checkPageContext() {
    const path = window.location.pathname;
    
    if (path.includes('carrito')) {
        console.log('Página: Carrito de compras');
        // Inicializar funcionalidades específicas del carrito
    } else if (path.includes('checkout')) {
        console.log('Página: Checkout');
        // Inicializar funcionalidades específicas del checkout
    } else if (path.includes('productos')) {
        console.log('Página: Productos');
        // Inicializar funcionalidades específicas de productos
    } else {
        console.log('Página: Inicio');
    }
}

// Hacer funciones disponibles globalmente
window.updateCartTotal = updateCartTotal;
window.updateCartBadge = updateCartBadge;
window.showNotification = showNotification;
window.clearCart = clearCart;
window.getCart = getCart;

// Inicialización final
checkPageContext();
initVisitCounter();
initThemeToggle();
initFormValidation();

console.log('✅ main.js cargado completamente');