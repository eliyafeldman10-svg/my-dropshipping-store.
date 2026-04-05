const products = [
    { id: 1, name: "שעון יד חכם - דגם 2026", price: 199, image: "p1.jpg" },
    { id: 2, name: "אוזניות אלחוטיות PRO", price: 250, image: "p2.jpg" },
    { id: 3, name: "מטען מהיר לנייד", price: 89, image: "p3.jpg" }
];

let cartCount = 0;

window.onload = function() {
    const container = document.getElementById('products-container');
    if (!container) return;

    products.forEach(product => {
        const productHTML = `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/250?text=No+Image'">
                <h3>${product.name}</h3>
                <p class="price">₪${product.price}</p>
                <button class="buy-btn" onclick="openPayment(${product.id})">רכישה מהירה</button>
            </div>
        `;
        container.innerHTML += productHTML;
    });
};

// פונקציה לפתיחת חלונית תשלום
function openPayment(productId) {
    const product = products.find(p => p.id === productId);
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    cartCount++;
    document.getElementById('cart-count').innerText = `🛒 (${cartCount})`;

    modalBody.innerHTML = `
        <h2>רכישת ${product.name}</h2>
        <p style="margin: 15px 0;">מחיר: ₪${product.price}</p>
        
        <div style="background: #f4f4f4; padding: 20px; border: 1px dashed #000; margin-bottom: 15px;">
            כאן יוטמע אזור הסליקה המאובטח (פייפאל / אשראי)
        </div>
        
        <button class="buy-btn" onclick="closeModal()">המשך בקניות</button>
    `;
    modal.style.display = "block";
}

// פונקציה להצגת עמודי מידע
function showSection(section) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    let content = "";
    if (section === 'support') content = "<h2>שירות לקוחות</h2><p>זמינים בשבילך במייל:<br><strong>dropix.support@gmail.com</strong></p>";
    if (section === 'shipping') content = "<h2>מדיניות משלוחים</h2><p>משלוחים חינם לכל הארץ! זמן אספקה: 7-14 ימי עסקים.</p>";
    if (section === 'privacy') content = "<h2>פרטיות</h2><p>אנו שומרים על הפרטיות שלך ולא מעבירים מידע לצד ג'.</p>";
    if (section === 'terms') content = "<h2>תקנון</h2><p>הרכישה באתר מותרת מגיל 18 ומעלה...</p>";
    if (section === 'about') content = "<h2>אודותינו</h2><p>DROPIX הוקמה בשנת 2026 כדי להביא לכם את המוצרים הכי חמים במחירים הטובים ביותר.</p>";

    modalBody.innerHTML = content;
    modal.style.display = "block";
}

function closeModal() {
    document.getElementById('modal').style.display = "none";
}
