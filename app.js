// הגדרות Firebase - מבוסס על הצילום שלך
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

const adminPassword = "1234"; // סיסמה למחיקת תגובות
const myPhone = "972501234567"; // שים כאן את המספר שלך (בלי 0 בהתחלה)

const products = [
    { id: 1, name: "שעון יד חכם - דגם 2026", price: 199, image: "p1.jpg" },
    { id: 2, name: "אוזניות אלחוטיות PRO", price: 250, image: "p2.jpg" },
    { id: 3, name: "מטען מהיר לנייד", price: 89, image: "p3.jpg" },
    { id: 4, name: "רמקול בלוטות' Ortizan", price: 149, image: "p4.jpg" }
];

window.onload = function() {
    const container = document.getElementById('products-container');
    products.forEach(p => {
        container.innerHTML += `
            <div class="product-card">
                <img src="${p.image}" onerror="this.src='https://via.placeholder.com/250'">
                <h3>${p.name}</h3>
                <p class="price">₪${p.price}</p>
                <button class="buy-btn" onclick="openPayment(${p.id})">פרטים ורכישה</button>
            </div>`;
    });
};

function openPayment(productId) {
    const product = products.find(p => p.id === productId);
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    // סיכום בסגנון אלי-אקספרס
    const discount = 5;
    const finalPrice = product.price - discount;
    const waLink = `https://api.whatsapp.com/send?phone=${myPhone}&text=${encodeURIComponent('אני רוצה להזמין: ' + product.name + '\nסכום סופי: ₪' + finalPrice)}`;

    modalBody.innerHTML = `
        <div style="direction: rtl;">
            <div style="display:flex; gap:15px; align-items:center;">
                <img src="${product.image}" style="width:80px; border-radius:10px;" onerror="this.src='https://via.placeholder.com/80'">
                <div>
                    <h2 style="font-size:18px; margin:0;">${product.name}</h2>
                    <p style="color:#f03; font-weight:bold; margin:5px 0;">₪${product.price}</p>
                </div>
            </div>

            <div class="summary-box">
                <p style="font-weight:bold; margin-top:0;">סיכום הזמנה</p>
                <div class="summary-line"><span>מחיר פריט</span><span>₪${product.price}</span></div>
                <div class="summary-line"><span>דמי משלוח</span><span style="color:#2ecc71;">חינם</span></div>
                <div class="summary-line"><span>הנחת חנות</span><span style="color:#f03;">-₪${discount}</span></div>
                <div class="total-line"><span>סך הכל</span><span>₪${finalPrice}</span></div>
            </div>

            <a href="${waLink}" target="_blank" style="text-decoration:none;">
                <button class="order-btn">בצע הזמנה</button>
            </a>

            <hr style="margin:20px 0; border:0; border-top:1px solid #eee;">
            
            <h3>חוות דעת על המוצר</h3>
            <div style="background:#f4f4f4; padding:10px; border-radius:8px; margin-bottom:15px;">
                <input type="text" id="rev-name" placeholder="השם שלך" style="width:95%; padding:8px; margin-bottom:5px; border-radius:5px; border:1px solid #ddd;">
                <textarea id="rev-text" placeholder="מה דעתך?" style="width:95%; height:50px; padding:8px; border-radius:5px; border:1px solid #ddd;"></textarea>
                <button class="buy-btn" style="background:#333;" onclick="saveReview(${productId})">שלח תגובה</button>
            </div>
            <div id="reviews-list">טוען תגובות...</div>
        </div>`;
    modal.style.display = "block";
    loadReviews(productId);
}

async function saveReview(productId) {
    const name = document.getElementById('rev-name').value;
    const text = document.getElementById('rev-text').value;
    if (!name || !text) return alert("מלא פרטים אחי");

    await db.collection("reviews").add({
        productId, name, text, rating: 5, timestamp: firebase.firestore.FieldValue.serverTimestamp()
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
        list.innerHTML += `
            <div class="review-item">
                <div style="color:#ffcc00;">★★★★★</div>
                <strong>${r.name}</strong>
                <p style="margin:5px 0; font-size:14px; color:#555;">${r.text}</p>
                <span class="delete-btn" onclick="deleteReview('${doc.id}', ${productId})">מחק 🗑️</span>
            </div>`;
    });
}

async function deleteReview(id, pId) {
    if (prompt("סיסמת מנהל:") === adminPassword) {
        await db.collection("reviews").doc(id).delete();
        loadReviews(pId);
    } else {
        alert("לא מורשה!");
    }
}

function closeModal() { document.getElementById('modal').style.display = "none"; }
