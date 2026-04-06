// הגדרות Firebase שלך
const firebaseConfig = {
  apiKey: "AIzaSyDlSzbnHSzF3pqCSAzP9-4uttDxnyaQOAI",
  authDomain: "dropix-bf5f6.firebaseapp.com",
  projectId: "dropix-bf5f6",
  storageBucket: "dropix-bf5f6.firebasestorage.app",
  messagingSenderId: "660480064549",
  appId: "1:660480064549:web:2240b990ae88cbd74513cc"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// רשימת 6 המוצרים המלאה
const products = [
    { id: 1, name: "שעון יד חכם - דגם 2026", price: 199, image: "p1.jpg" },
    { id: 2, name: "אוזניות אלחוטיות PRO", price: 250, image: "p2.jpg" },
    { id: 3, name: "מטען מהיר לנייד", price: 89, image: "p3.jpg" },
    { id: 4, name: "רמקול בלוטות' Ortizan – עמיד במים", price: 149, image: "p4.jpg" },
    { id: 5, name: "מעמד מגנטי לנייד לרכב", price: 45, image: "p5.jpg" },
    { id: 6, name: "מנורת שולחן חכמה LED", price: 120, image: "p6.jpg" }
];

window.onload = () => renderProducts(products);

function renderProducts(list) {
    const container = document.getElementById('products-container');
    container.innerHTML = list.map(p => `
        <div class="product-card">
            <img src="${p.image}" onerror="this.src='https://via.placeholder.com/250'">
            <h3>${p.name}</h3>
            <p class="price">₪${p.price}</p>
            <button class="buy-btn" onclick="openPayment(${p.id})">פרטים ורכישה</button>
        </div>
    `).join('');
}

function filterProducts() {
    const term = document.getElementById('search-input').value.toLowerCase();
    renderProducts(products.filter(p => p.name.toLowerCase().includes(term)));
}

function openPayment(id) {
    const p = products.find(prod => prod.id === id);
    const modal = document.getElementById('modal');
    document.getElementById('modal-body').innerHTML = `
        <div style="direction:rtl; text-align:right;">
            <h2>${p.name}</h2>
            <p>מחיר: ₪${p.price}</p>
            <button class="buy-btn" style="background:#25D366;" onclick="window.open('https://wa.me/972501234567?text=אני רוצה להזמין את ${p.name}')">המשך לרכישה בוואטסאפ</button>
            <hr>
            <h3>תגובות</h3>
            <div id="reviews-list">טוען...</div>
            <input type="text" id="rev-name" placeholder="שם">
            <textarea id="rev-text" placeholder="תגובה"></textarea>
            <button onclick="saveReview(${id})">שלח</button>
        </div>`;
    modal.style.display = "block";
    loadReviews(id);
}

async function saveReview(productId) {
    const name = document.getElementById('rev-name').value;
    const text = document.getElementById('rev-text').value;
    if(!name || !text) return;
    await db.collection("reviews").add({ productId, name, text, timestamp: firebase.firestore.FieldValue.serverTimestamp() });
    loadReviews(productId);
}

async function loadReviews(productId) {
    const list = document.getElementById('reviews-list');
    const snap = await db.collection("reviews").where("productId", "==", productId).orderBy("timestamp", "desc").get();
    list.innerHTML = snap.empty ? "אין תגובות" : "";
    snap.forEach(doc => {
        const r = doc.data();
        list.innerHTML += `<p><strong>${r.name}:</strong> ${r.text}</p>`;
    });
}

function showSection(type) {
    const modal = document.getElementById('modal');
    let content = type === 'support' ? "צור קשר: dropix.help@gmail.com" : "משלוחים חינם לכל הארץ!";
    document.getElementById('modal-body').innerHTML = `<div style="direction:rtl; padding:20px;">${content}</div>`;
    modal.style.display = "block";
}

function closeModal() { document.getElementById('modal').style.display = "none"; }
