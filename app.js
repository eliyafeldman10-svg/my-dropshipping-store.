const products = [
    { id: 1, name: "שעון יד חכם - דגם 2026", price: 199, image: "p1.jpg" },
    { id: 2, name: "אוזניות אלחוטיות PRO", price: 250, image: "p2.jpg" },
    { id: 3, name: "מטען מהיר לנייד", price: 89, image: "p3.jpg" }
];

let cartCount = 0;

// פונקציה שרצה רק כשהדף סיים להיטען
window.onload = function() {
    const container = document.getElementById('products-container');
    const cartElement = document.getElementById('cart-count');

    if (!container) {
        console.error("שגיאה: לא נמצא אלמנט עם id בשם products-container");
        return;
    }

    products.forEach(product => {
        const productHTML = `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/200?text=Product+Image'">
                <h3>${product.name}</h3>
                <p class="price">₪${product.price}</p>
                <button class="buy-btn" onclick="addToCart(event)">הוסף לסל</button>
            </div>
        `;
        container.innerHTML += productHTML;
    });
};

function addToCart(event) {
    cartCount++;
    const cartElement = document.getElementById('cart-count');
    if (cartElement) {
        cartElement.innerText = `🛒 סל קניות (${cartCount})`;
    }
    
    const btn = event.target;
    btn.innerText = "נוסף! ✅";
    btn.style.backgroundColor = "#2ecc71";
    setTimeout(() => {
        btn.innerText = "הוסף לסל";
        btn.style.backgroundColor = "#ffd814";
    }, 1000);
}
