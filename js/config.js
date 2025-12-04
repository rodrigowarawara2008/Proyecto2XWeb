/* CONFIG.JS - CONFIGURACIÓN RÁPIDA */
const CONFIG = {
    business: {
        name: "Happy Smile",
        phone: "+591 777 888 999",
        address: "Av. Principal #123, La Paz, Bolivia",
        email: "pedidos@happysmile.bo",
        hours: "Lun-Dom: 8:00 - 20:00"
    },
    
    delivery: {
        cost: 15,
        freeOver: 100,
        areas: ["Centro", "Zona Sur", "Miraflores", "Calacoto"]
    },
    
    payment: {
        methods: ["efectivo", "transferencia", "tarjeta", "qr"],
        currency: "BOB",
        symbol: "Bs."
    }
};

// Exportar configuración
window.AppConfig = CONFIG;