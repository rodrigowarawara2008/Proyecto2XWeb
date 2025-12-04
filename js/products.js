/* ============================================
   PRODUCTS.JS - GESTIÓN DE PRODUCTOS
   ============================================ */

// Base de datos de productos
const productsDatabase = {
    galletas: [
        {
            id: 'galleta-chocolate',
            name: 'Galleta de Chocolate',
            description: 'Galleta crujiente con chispas de chocolate belga',
            price: 8.00,
            image: '🍪',
            category: 'galletas',
            tags: ['popular', 'chocolate'],
            inStock: true
        },
        {
            id: 'galleta-avena',
            name: 'Galleta de Avena',
            description: 'Galleta saludable con avena y pasas',
            price: 7.00,
            image: '🍪',
            category: 'galletas',
            tags: ['saludable'],
            inStock: true
        },
        {
            id: 'galleta-mantequilla',
            name: 'Galleta de Mantequilla',
            description: 'Galleta clásica hecha con mantequilla real',
            price: 6.00,
            image: '🍪',
            category: 'galletas',
            tags: ['clasica'],
            inStock: true
        },
        {
            id: 'galleta-coco',
            name: 'Galleta de Coco',
            description: 'Galleta tropical con ralladura de coco',
            price: 8.50,
            image: '🍪',
            category: 'galletas',
            tags: ['tropical'],
            inStock: true
        },
        {
            id: 'galleta-limón',
            name: 'Galleta de Limón',
            description: 'Galleta refrescante con sabor a limón',
            price: 7.50,
            image: '🍪',
            category: 'galletas',
            tags: ['citrico'],
            inStock: true
        },
        {
            id: 'galleta-especial',
            name: 'Galleta Especial Happy',
            description: 'Nuestra galleta premium con ingredientes secretos',
            price: 10.00,
            image: '🍪',
            category: 'galletas',
            tags: ['premium', 'especial'],
            inStock: true
        }
    ],
    
    donas: [
        {
            id: 'dona-glaseada',
            name: 'Dona Glaseada',
            description: 'Dona esponjosa con glaseado blanco',
            price: 12.00,
            image: '🍩',
            category: 'donas',
            tags: ['popular'],
            inStock: true
        },
        {
            id: 'dona-chocolate',
            name: 'Dona de Chocolate',
            description: 'Dona cubierta con chocolate derretido',
            price: 13.00,
            image: '🍩',
            category: 'donas',
            tags: ['chocolate'],
            inStock: true
        },
        {
            id: 'dona-colores',
            name: 'Dona Arcoíris',
            description: 'Dona con glaseado de colores y sprinkles',
            price: 14.00,
            image: '🍩',
            category: 'donas',
            tags: ['colorida'],
            inStock: true
        },
        {
            id: 'dona-rellena',
            name: 'Dona Rellena',
            description: 'Dona rellena de crema o mermelada',
            price: 15.00,
            image: '🍩',
            category: 'donas',
            tags: ['rellena'],
            inStock: true
        }
    ],
    
    pasteles: [
        {
            id: 'pastel-chocolate',
            name: 'Pastel de Chocolate',
            description: 'Pastel de chocolate con relleno de crema',
            price: 45.00,
            image: '🎂',
            category: 'pasteles',
            tags: ['popular', 'chocolate'],
            inStock: true
        },
        {
            id: 'pastel-vainilla',
            name: 'Pastel de Vainilla',
            description: 'Pastel clásico de vainilla con frosting',
            price: 40.00,
            image: '🎂',
            category: 'pasteles',
            tags: ['clasico'],
            inStock: true
        },
        {
            id: 'pastel-red-velvet',
            name: 'Pastel Red Velvet',
            description: 'Pastel rojo aterciopelado con queso crema',
            price: 50.00,
            image: '🎂',
            category: 'pasteles',
            tags: ['premium'],
            inStock: true
        },
        {
            id: 'pastel-frutas',
            name: 'Pastel de Frutas',
            description: 'Pastel con frutas frescas de temporada',
            price: 42.00,
            image: '🎂',
            category: 'pasteles',
            tags: ['frutal'],
            inStock: true
        }
    ],
    
    bebidas: [
        {
            id: 'cafe-boliviano',
            name: 'Café Boliviano',
            description: 'Café de altura de los Yungas de Bolivia',
            price: 15.00,
            image: '☕',
            category: 'bebidas',
            tags: ['popular', 'caliente'],
            inStock: true
        },
        {
            id: 'te-hierbas',
            name: 'Té de Hierbas',
            description: 'Infusión de hierbas naturales bolivianas',
            price: 12.00,
            image: '🍵',
            category: 'bebidas',
            tags: ['saludable'],
            inStock: true
        },
        {
            id: 'chocolate-caliente',
            name: 'Chocolate Caliente',
            description: 'Chocolate espeso hecho con cacao real',
            price: 14.00,
            image: '☕',
            category: 'bebidas',
            tags: ['chocolate'],
            inStock: true
        },
        {
            id: 'jugo-natural',
            name: 'Jugo Natural',
            description: 'Jugo recién exprimido de frutas de temporada',
            price: 10.00,
            image: '🍹',
            category: 'bebidas',
            tags: ['natural'],
            inStock: true
        },
        {
            id: 'smoothie-frutas',
            name: 'Smoothie de Frutas',
            description: 'Mezcla de frutas frescas con yogurt',
            price: 18.00,
            image: '🥤',
            category: 'bebidas',
            tags: ['saludable'],
            inStock: true
        }
    ]
};

// Inicializar página de productos
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    
    // Detectar qué página de productos estamos viendo
    if (path.includes('galletas.html')) {
        loadProducts('galletas');
    } else if (path.includes('donas.html')) {
        loadProducts('donas');
    } else if (path.includes('pasteles.html')) {
        loadProducts('pasteles');
    } else if (path.includes('bebidas.html')) {
        loadProducts('bebidas');
    }
    
    // Configurar eventos
    setupProductEvents();
});

// Cargar productos por categoría
function loadProducts(category) {
    const productsContainer = document.getElementById('productsContainer');
    const categoryTitle = document.getElementById('categoryTitle');
    
    if (!productsContainer || !categoryTitle) return;
    
    // Actualizar título
    const categoryNames = {
        'galletas': 'Galletas Artesanales',
        'donas': 'Donas Premium',
        'pasteles': 'Pasteles Elegantes',
        'bebidas': 'Bebidas Selectas'
    };
    
    categoryTitle.textContent = categoryNames[category] || category;
    
    // Limpiar contenedor
    productsContainer.innerHTML = '';
    
    // Obtener productos
    const products = productsDatabase[category] || [];
    
    // Crear tarjetas de productos
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
    
    // Actualizar contador
    updateProductCount(products.length);
}

// Crear tarjeta de producto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    card.dataset.category = product.category;
    
    card.innerHTML = `
        <div class="product-card-inner">
            <div class="product-image">
                <div class="image-placeholder product">
                    ${product.image}
                </div>
                ${!product.inStock ? '<div class="out-of-stock">Agotado</div>' : ''}
                ${product.tags.includes('popular') ? '<div class="popular-badge">🔥 Popular</div>' : ''}
                ${product.tags.includes('premium') ? '<div class="premium-badge">⭐ Premium</div>' : ''}
            </div>
            
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                
                <div class="product-footer">
                    <div class="product-price">
                        <span class="price">Bs. ${product.price.toFixed(2)}</span>
                        ${product.inStock ? '<span class="stock-status in-stock">Disponible</span>' : 
                                          '<span class="stock-status out-stock">Agotado</span>'}
                    </div>
                    
                    <div class="product-actions">
                        <div class="quantity-controls">
                            <button class="quantity-btn minus" ${!product.inStock ? 'disabled' : ''}>-</button>
                            <input type="number" class="quantity-input" value="1" min="1" max="10" 
                                   ${!product.inStock ? 'disabled' : ''}>
                            <button class="quantity-btn plus" ${!product.inStock ? 'disabled' : ''}>+</button>
                        </div>
                        
                        <button class="add-to-cart-product" 
                                data-id="${product.id}"
                                data-name="${product.name}"
                                data-price="${product.price}"
                                data-image="${product.image}"
                                ${!product.inStock ? 'disabled' : ''}>
                            <i class="fas fa-cart-plus"></i>
                            Añadir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Actualizar contador de productos
function updateProductCount(count) {
    const productCount = document.getElementById('productCount');
    if (productCount) {
        productCount.textContent = `${count} productos`;
    }
}

// Configurar eventos de productos
function setupProductEvents() {
    // Control de cantidad
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('quantity-btn')) {
            const button = e.target;
            const controls = button.closest('.quantity-controls');
            const input = controls.querySelector('.quantity-input');
            let value = parseInt(input.value);
            
            if (button.classList.contains('minus')) {
                if (value > 1) {
                    input.value = value - 1;
                }
            } else if (button.classList.contains('plus')) {
                if (value < 10) {
                    input.value = value + 1;
                }
            }
            
            // Disparar evento de cambio
            input.dispatchEvent(new Event('change'));
        }
    });
    
    // Cambio en cantidad
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('quantity-input')) {
            const input = e.target;
            let value = parseInt(input.value);
            
            if (value < 1) input.value = 1;
            if (value > 10) input.value = 10;
        }
    });
    
    // Añadir al carrito desde página de productos
    document.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-cart-product')) {
            const button = e.target.closest('.add-to-cart-product');
            if (button.disabled) return;
            
            const card = button.closest('.product-card');
            const quantityInput = card.querySelector('.quantity-input');
            const quantity = parseInt(quantityInput.value);
            
            const productId = button.dataset.id;
            const productName = button.dataset.name;
            const productPrice = parseFloat(button.dataset.price);
            const productImage = button.dataset.image;
            
            // Añadir múltiples unidades
            for (let i = 0; i < quantity; i++) {
                if (window.HappySmile && window.HappySmile.addToCart) {
                    window.HappySmile.addToCart(productId, productName, productPrice, productImage);
                }
            }
            
            // Animación de confirmación
            button.innerHTML = '<i class="fas fa-check"></i> Añadido';
            button.classList.add('added');
            
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-cart-plus"></i> Añadir';
                button.classList.remove('added');
            }, 2000);
            
            // Resetear cantidad
            quantityInput.value = 1;
        }
    });
    
    // Filtros (si se implementan)
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            filterProducts(filter);
        });
    });
}

// Filtrar productos
function filterProducts(filter) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        if (filter === 'all') {
            product.style.display = 'block';
        } else if (filter === 'available') {
            const inStock = !product.querySelector('.out-of-stock');
            product.style.display = inStock ? 'block' : 'none';
        } else if (filter === 'popular') {
            const isPopular = product.querySelector('.popular-badge');
            product.style.display = isPopular ? 'block' : 'none';
        }
    });
}

// Búsqueda de productos
function searchProducts(query) {
    const products = document.querySelectorAll('.product-card');
    const searchTerm = query.toLowerCase();
    
    products.forEach(product => {
        const name = product.querySelector('.product-name').textContent.toLowerCase();
        const description = product.querySelector('.product-description').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || description.includes(searchTerm)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Exportar funciones
window.ProductManager = {
    loadProducts,
    searchProducts,
    filterProducts
};