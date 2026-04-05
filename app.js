// רשימת המוצרים שלך - כאן תוכל להוסיף כמה שתרצה
const products = [
    {
        id: 1,
        name: "שעון יד חכם - דגם 2026",
        price: 199,
        image: "images/p1.jpg" // ודא שיש לך תמונה כזו בתיקיית images
    },
    {
        id: 2,
        name: "אוזניות אלחוטיות PRO",
        price: 250,
        image: "images/p2.jpg"
    },
    {
        id: 3,
        name: "מטען מהיר לנייד",
        price: 89,
        image: "images/p3.jpg"
    }
];

const container = document.getElementById('products-container');

// פונקציה שמציגה את המוצרים על המסך
function displayProducts() {
    products.forEach(product => {
        const productHTML = `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">₪${product.price}</p>
                <button class="buy-btn" onclick="addToCart(${product.id})">הוסף לסל</button>
            </div>
        `;
        container.innerHTML += productHTML;
    });
}

function addToCart(id) {
    alert("המוצר נוסף לסל! (בהמשך נחבר את זה לתשלום)");
}

// הפעלת הפונקציה
displayProducts();
