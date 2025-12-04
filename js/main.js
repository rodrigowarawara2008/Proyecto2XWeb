/* ============================================
   MAIN.JS - FUNCIONALIDADES PRINCIPALES
   ============================================ */

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Happy Smile - Página cargada');
    
    // Inicializar carrito
    initCart();
    
    // Inicializar productos destacados
    initFeaturedProducts();
    
    // Inicializar testimonios
    initTestimonials();
    
    // Inicializar animaciones
    initAnimations();
    
    // Configurar eventos
    setupEventListeners();
});

/* ========== CARRITO DE COMPRAS ========== */

// Variable global del carrito
let cart = JSON.parse(localStorage.getItem('happySmileCart')) || [];

// Inicializar carrito
function initCart() {
    updateCartCount();
    updateCartTotal();
}

// Actualizar contador del carrito
function updateCartCount() {
    const cartCount = document.querySelectorAll('.cart-count, .cart-badge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCount.forEach(element => {
        element.textContent = totalItems;
    });
}

// Actualizar total del carrito
function updateCartTotal() {
    const cartTotal = document.querySelector('.cart-total');
    if (cartTotal) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `Bs. ${total.toFixed(2)}`;
    }
}

// Añadir producto al carrito
function addToCart(productId, productName, productPrice, productImage) {
    // Buscar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Incrementar cantidad
        existingItem.quantity += 1;
    } else {
        // Añadir nuevo producto
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }
    
    // Guardar en localStorage
    localStorage.setItem('happySmileCart', JSON.stringify(cart));
    
    // Actualizar interfaz
    updateCartCount();
    updateCartTotal();
    
    // Mostrar notificación
    showNotification('Producto añadido al carrito', 'success');
    
    // Reproducir sonido (opcional)
    playAddToCartSound();
}

// Eliminar producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('happySmileCart', JSON.stringify(cart));
    updateCartCount();
    updateCartTotal();
}

// Actualizar cantidad de producto
function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity < 1) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            localStorage.setItem('happySmileCart', JSON.stringify(cart));
            updateCartCount();
            updateCartTotal();
        }
    }
}

// Vaciar carrito
function clearCart() {
    cart = [];
    localStorage.removeItem('happySmileCart');
    updateCartCount();
    updateCartTotal();
}

/* ========== PRODUCTOS DESTACADOS ========== */

// Datos de productos destacados
const featuredProducts = [
    {
        id: 'galleta-premium',
        name: 'Galleta de Chocolate Premium',
        price: 8.00,
        image: '🍪',
        category: 'galletas',
        description: 'Galleta artesanal con chispas de chocolate belga'
    },
    {
        id: 'dona-glaseada',
        name: 'Dona Glaseada Especial',
        price: 12.00,
        image: '🍩',
        category: 'donas',
        description: 'Dona esponjosa con glaseado de vainilla premium'
    },
    {
        id: 'pastel-chocolate',
        name: 'Pastel de Chocolate',
        price: 45.00,
        image: '🎂',
        category: 'pasteles',
        description: 'Pastel de chocolate con relleno de crema'
    },
    {
        id: 'cafe-boliviano',
        name: 'Café Boliviano Premium',
        price: 15.00,
        image: '☕',
        category: 'bebidas',
        description: 'Café de altura de los Yungas de Bolivia'
    }
];

// Inicializar productos destacados
function initFeaturedProducts() {
    const featuredContainer = document.getElementById('featuredProducts');
    if (!featuredContainer) return;
    
    featuredProducts.forEach(product => {
        const productCard = createProductCard(product);
        featuredContainer.appendChild(productCard);
    });
}

// Crear tarjeta de producto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card-featured';
    card.innerHTML = `
        <div class="product-image-featured">
            <div class="image-placeholder">
                ${product.image}
            </div>
        </div>
        <div class="product-info-featured">
            <h4>${product.name}</h4>
            <p class="product-description">${product.description}</p>
            <div class="product-price-featured">
                <span class="price">Bs. ${product.price.toFixed(2)}</span>
                <button class="add-to-cart-btn" 
                        data-id="${product.id}"
                        data-name="${product.name}"
                        data-price="${product.price}"
                        data-image="${product.image}">
                    <i class="fas fa-plus"></i> Añadir
                </button>
            </div>
        </div>
    `;
    
    return card;
}

/* ========== TESTIMONIOS ========== */

// Datos de testimonios
const testimonials = [
    {
        name: "María González",
        text: "Las mejores galletas que he probado en La Paz. Siempre frescas y deliciosas.",
        rating: 5
    },
    {
        name: "Carlos Rodríguez",
        text: "El servicio de delivery es increíblemente rápido. ¡Llegan en menos de 30 minutos!",
        rating: 5
    },
    {
        name: "Ana Martínez",
        text: "Los pasteles personalizados son una obra de arte. Perfectos para cumpleaños.",
        rating: 4
    },
    {
        name: "Juan Pérez",
        text: "Excelente calidad y precios justos. Mi familia los ama.",
        rating: 5
    }
];

// Inicializar testimonios
function initTestimonials() {
    const track = document.getElementById('testimonialsTrack');
    const dots = document.getElementById('sliderDots');
    
    if (!track || !dots) return;
    
    // Crear slides
    testimonials.forEach((testimonial, index) => {
        // Slide
        const slide = document.createElement('div');
        slide.className = 'testimonial-slide';
        slide.innerHTML = `
            <div class="testimonial-content">
                <div class="testimonial-rating">
                    ${'⭐'.repeat(testimonial.rating)}
                </div>
                <p class="testimonial-text">"${testimonial.text}"</p>
                <p class="testimonial-author">- ${testimonial.name}</p>
            </div>
        `;
        track.appendChild(slide);
        
        // Dot
        const dot = document.createElement('button');
        dot.className = 'slider-dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dots.appendChild(dot);
    });
    
    // Inicializar slider
    currentSlide = 0;
    slideCount = testimonials.length;
}

// Control deslizante de testimonios
let currentSlide = 0;
let slideCount = 0;

function goToSlide(index) {
    const track = document.getElementById('testimonialsTrack');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (!track || !dots) return;
    
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slideCount;
    goToSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
    goToSlide(currentSlide);
}

/* ========== ANIMACIONES ========== */

function initAnimations() {
    // Animación de scroll
    window.addEventListener('scroll', handleScroll);
    
    // Animación de entrada
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación
    document.querySelectorAll('.category-card, .info-item').forEach(el => {
        observer.observe(el);
    });
}

function handleScroll() {
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
}

/* ========== NOTIFICACIONES ========== */

function showNotification(message, type = 'info') {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Añadir al cuerpo
    document.body.appendChild(notification);
    
    // Mostrar
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/* ========== SONIDOS ========== */

function playAddToCartSound() {
    // Crear sonido simple
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
}

/* ========== EVENT LISTENERS ========== */

function setupEventListeners() {
    // Botón volver arriba
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Botones de añadir al carrito
    document.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-cart-btn')) {
            const button = e.target.closest('.add-to-cart-btn');
            const id = button.dataset.id;
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            const image = button.dataset.image;
            
            addToCart(id, name, price, image);
        }
    });
    
    // Botones de slider de testimonios
    const nextBtn = document.querySelector('.slider-next');
    const prevBtn = document.querySelector('.slider-prev');
    
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Cambio de tema (si se implementa)
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Auto-slide de testimonios
    setInterval(nextSlide, 5000);
}

/* ========== TEMA OSCURO/CLARO ========== */

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('happySmileTheme', isDark ? 'dark' : 'light');
    
    // Cambiar ícono
    const icon = document.querySelector('.theme-toggle i');
    if (icon) {
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Cargar tema guardado
const savedTheme = localStorage.getItem('happySmileTheme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
}

// Exportar funciones para uso global
window.HappySmile = {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    showNotification
};