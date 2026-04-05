const products = [
    { id: 1, name: "שעון יד חכם - דגם 2026", price: 199, image: "p1.jpg" },
    { id: 2, name: "אוזניות אלחוטיות PRO", price: 250, image: "p2.jpg" },
    { id: 3, name: "מטען מהיר לנייד", price: 89, image: "p3.jpg" }
];

let cartCount = 0;
const container = document.getElementById('products-container');
const cartElement = document.getElementById('cart-count');

function displayProducts() {
    products.forEach(product => {
        const productHTML = `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/200?text=Missing+Image'">
                <h3>${product.name}</h3>
                <p class="price">₪${product.price}</p>
                <button class="buy-btn" onclick="addToCart()">הוסף לסל</button>
            </div>
        `;
        container.innerHTML += productHTML;
    });
}

function addToCart() {
    cartCount++;
    cartElement.innerText = `🛒 סל קניות (${cartCount})`;
    
    // אפקט נחמד של הצלחה
    const btn = event.target;
    btn.innerText = "נוסף! ✅";
    btn.style.backgroundColor = "#2ecc71";
    setTimeout(() => {
        btn.innerText = "הוסף לסל";
        btn.style.backgroundColor = "#ffd814";
    }, 1000);
}

displayProducts();
