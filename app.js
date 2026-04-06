// הגדרות Firebase - מבוסס על צילומי המסך שלך
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

const adminPassword = "1234"; 

// רשימת המוצרים המלאה (6 פריטים)
const products = [
    { id: 1, name: "שעון יד חכם - דגם 2026", price: 199, image: "p1.jpg" },
    { id: 2, name: "אוזניות אלחוטיות PRO", price: 250, image: "p2.jpg" },
    { id: 3, name: "מטען מהיר לנייד", price: 89, image: "p3.jpg" },
    { id: 4, name: "רמקול בלוטות' Ortizan – עמיד במים", price: 149, image: "p4.jpg" },
    { id: 5, name: "מעמד מגנטי לנייד לרכב", price: 45, image: "p5.jpg" },
    { id: 6, name: "מנורת שולחן חכמה LED", price: 120, image: "p6.jpg" }
];

window.onload = function() {
    renderProducts(products);
};

// פונקציית החיפוש שביקשת
function filterProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm));
    renderProducts(filtered);
}

function renderProducts(productsArray) {
    const container = document.getElementById('products-container');
    if (!container) return;
    container.innerHTML = ""; 
    productsArray.forEach(product => {
        container.innerHTML += `
            <div class="product-card" style="background:#fff; border: 1px solid #eee; border-radius:12px; padding:15px; text-align:center; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                <img src="${product.image}" alt="${product.name}" style="width:100%; border-radius:8px; margin-bottom:10px;" onerror="this.src='https://via.placeholder.com/250'">
                <h3 style="color:#000; font-size:16px; margin: 10px 0;">${product.name}</h3>
                <p style="color:#333; font-weight:bold; font-size:18px;">₪${product.price}</p>
                <button class="buy-btn" style="background:#000; color:#fff; border-radius:25px; padding:10px; border:none; cursor:pointer; width:100%; font-weight:bold;" onclick="openPayment(${product.id})">פרטים ורכישה</button>
            </div>`;
    });
}

function openPayment(productId) {
    const product = products.find(p => p.id === productId);
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    const finalTotal = product.price - 5; // הנחה קטנה כמו באלי

    const myPhone = "972501234567"; // המספר שלך
    const message = encodeURIComponent(`שלום! אני מעוניין להזמין את: ${product.name}\nמחיר סופי: ₪${finalTotal}`);
    const whatsappLink = `https://api.whatsapp.com/send?phone=${myPhone}&text=${message}`;

    modalBody.innerHTML = `
        <div style="direction: rtl; text-align: right; color: #000; background: #fff;">
            <h2 style="font-size: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">אישור הזמנה</h2>
            
            <div style="display: flex; align-items: center; gap: 15px; margin: 20px 0;">
                <img src="${product.image}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 5px;" onerror="this.src='https://via.placeholder.com/70'">
                <div>
                    <p style="margin: 0; font-weight: bold;">${product.name}</p>
                    <p style="margin: 5px 0; color: #666;">₪${product.price}</p>
                </div>
            </div>

            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>סיכום ביניים</span>
                    <span>₪${product.price}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>דמי משלוח</span>
                    <span style="color: #27ae60;">חינם</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: bold; border-top: 1px solid #ddd; padding-top: 10px; margin-top: 10px;">
                    <span>סה"כ לתשלום</span>
                    <span style="font-size: 22px;">₪${finalTotal}</span>
                </div>
            </div>

            <a href="${whatsappLink}" target="_blank" style="text-decoration: none;">
                <button style="width: 100%; background: #000; color: #fff; padding: 18px; border: none; border-radius: 50px; font-size: 18px; font-weight: bold; cursor: pointer;">
                    בצע הזמנה (WhatsApp Pay)
                </button>
            </a>

            <div style="margin-top: 30px;">
                <h3 style="font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 5px;">חוות דעת מלקוחות</h3>
                <div id="review-form" style="margin-bottom: 15px;">
                    <input type="text" id="rev-name" placeholder="השם שלך" style="width: 100%; padding: 8px; margin-bottom: 5px; border: 1px solid #ddd; border-radius:4px;">
                    <textarea id="rev-text" placeholder="מה חשבת על המוצר?" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius:4px; height:60px;"></textarea>
                    <button class="buy-btn" style="background:#444; width:100%; margin-top:5px; color:#fff; padding:8px; border:none; cursor:pointer;" onclick="saveReview(${productId})">שלח תגובה</button>
                </div>
                <div id="reviews-list">טוען תגובות...</div>
            </div>
        </div>`;
        
    modal.style.display = "block";
    loadReviews(productId);
}

// פונקציות שירות לקוחות ופרטים נוספים
function showSection(section) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    let content = "";

    if (section === 'support') content = "<h2>שירות לקוחות</h2><p>אנחנו כאן לכל שאלה!<br>אימייל: <strong>dropix.help@gmail.com</strong><br>זמינים ב-WhatsApp: 050-1234567</p>";
    if (section === 'shipping') content = "<h2>מדיניות משלוחים</h2><p>משלוחים חינם לכל הארץ תוך 7-14 ימי עסקים.</p>";
    if (section === 'about') content = "<h2>אודות Dropix</h2><p>החנות המובילה למוצרים טכנולוגיים וגאדג'טים במחירים הכי טובים בארץ.</p>";

    modalBody.innerHTML = `<div style="direction:rtl; text-align:right; padding:10px;">${content}</div>`;
    modal.style.display = "block";
}

// מערכת תגובות מבוססת Firebase
async function saveReview(productId) {
    const name = document.getElementById('rev-name').value;
    const text = document.getElementById('rev-text').value;
    if (!name || !text) return alert("מלא שם ותגובה");
    await db.collection("reviews").add({
        productId, name, text, timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    document.getElementById('rev-text').value = "";
    loadReviews(productId);
}

async function loadReviews(productId) {
    const list = document.getElementById('reviews-list');
    list.innerHTML = "";
    const snap = await db.collection("reviews").where("productId", "==", productId).orderBy("timestamp", "desc").get();
    if (snap.empty) list.innerHTML = "אין תגובות עדיין.";
    snap.forEach(doc => {
        const r = doc.data();
        list.innerHTML += `<div style="border-bottom:1px solid #eee; padding:10px 0; position:relative;">
            <strong>${r.name}:</strong> <p style="margin:2px 0; color:#555;">${r.text}</p>
        </div>`;
    });
}

function closeModal() { document.getElementById('modal').style.display = "none"; }
