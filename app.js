const firebaseConfig = {
  apiKey: "AIzaSyDlSzbnHSzF3pqCSAzP9-4uttDxnyaQOAI",
  authDomain: "dropix-bf5f6.firebaseapp.com",
  projectId: "dropix-bf5f6",
  storageBucket: "dropix-bf5f6.firebasestorage.app",
  messagingSenderId: "660480064549",
  appId: "1:660480064549:web:2240b990ae88cbd74513cc"
}; //

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const adminPassword = "1234";
const myPhone = "972501234567"; // תעדכן למספר שלך

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
                <img src="${p.image}" onerror="this.src='https://via.placeholder.com/250/111/fff?text=Product'">
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
    
    const discount = 5;
    const finalPrice = product.price - discount;
    const waLink = `https://api.whatsapp.com/send?phone=${myPhone}&text=${encodeURIComponent('הזמנה חדשה מ-Dropix:\nמוצר: ' + product.name + '\nמחיר סופי: ₪' + finalPrice)}`;

    modalBody.innerHTML = `
        <div>
            <div style="display:flex; gap:15px; align-items:center;">
                <img src="${product.image}" style="width:70px; border-radius:8px;" onerror="this.src='https://via.placeholder.com/70'">
                <div>
                    <h2 style="font-size:18px; margin:0; color:#ff00ff;">${product.name}</h2>
                    <p style="margin:5px 0; color:#aaa;">מחיר רגיל: ₪${product.price}</p>
                </div>
            </div>

            <div class="summary-box">
                <p style="font-weight:bold; margin:0 0 10px 0; color:#ff00ff;">סיכום הזמנה</p>
                <div class="summary-line"><span>מחיר פריט</span><span>₪${product.price}</span></div>
                <div class="summary-line"><span>משלוח</span><span style="color:#2ecc71;">חינם</span></div>
                <div class="summary-line"><span>הנחת מועדון</span><span style="color:#ff00ff;">-₪${discount}</span></div>
                <div class="total-line"><span>סה"כ לתשלום</span><span>₪${finalPrice}</span></div>
            </div>

            <a href="${waLink}" target="_blank" style="text-decoration:none;">
                <button class="order-btn">בצע הזמנה בוואטסאפ</button>
            </a>

            <div style="margin-top:30px;">
                <h3 style="font-size:16px; border-bottom:1px solid #333; padding-bottom:10px;">ביקורות</h3>
                <div id="review-form">
                    <input type="text" id="rev-name" placeholder="השם שלך">
                    <textarea id="rev-text" placeholder="מה דעתך על המוצר?"></textarea>
                    <button class="buy-btn" style="background:#333; font-size:14px;" onclick="saveReview(${productId})">שלח ביקורת</button>
                </div>
                <div id="reviews-list" style="margin-top:15px;">טוען...</div>
            </div>
        </div>`;
    modal.style.display = "block";
    loadReviews(productId);
}

async function loadReviews(productId) {
    const list = document.getElementById('reviews-list');
    list.innerHTML = "";
    const snap = await db.collection("reviews").where("productId", "==", productId).orderBy("timestamp", "desc").get();
    
    if (snap.empty) { list.innerHTML = "<p style='color:#666;'>אין תגובות עדיין.</p>"; return; }
    
    snap.forEach(doc => {
        const r = doc.data();
        list.innerHTML += `
            <div class="review-item">
                <div style="color:#ff00ff; font-size:12px;">★★★★★</div>
                <strong style="font-size:14px;">${r.name}</strong>
                <p style="margin:5px 0; font-size:13px; color:#ccc;">${r.text}</p>
                <span class="delete-btn" onclick="deleteReview('${doc.id}', ${productId})">מחק</span>
            </div>`;
    });
}

async function saveReview(productId) {
    const name = document.getElementById('rev-name').value;
    const text = document.getElementById('rev-text').value;
    if (!name || !text) return;
    await db.collection("reviews").add({
        productId, name, text, timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    document.getElementById('rev-text').value = "";
    loadReviews(productId);
}

async function deleteReview(id, pId) {
    if (prompt("סיסמת מנהל:") === adminPassword) {
        await db.collection("reviews").doc(id).delete();
        loadReviews(pId);
    }
}

function closeModal() { document.getElementById('modal').style.display = "none"; }
