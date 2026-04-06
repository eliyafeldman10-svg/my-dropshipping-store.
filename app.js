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

const myPhone = "972501234567"; // שים פה את המספר שלך!
const adminPassword = "1234";

const products = [
    { id: 1, name: "שעון יד חכם", price: 199, image: "p1.jpg" },
    { id: 2, name: "אוזניות אלחוטיות", price: 250, image: "p2.jpg" },
    { id: 3, name: "מטען מהיר", price: 89, image: "p3.jpg" },
    { id: 4, name: "רמקול בלוטות'", price: 149, image: "p4.jpg" }
];

window.onload = function() {
    const container = document.getElementById('products-container');
    products.forEach(p => {
        container.innerHTML += `
            <div class="product-card">
                <img src="${p.image}" onerror="this.src='https://via.placeholder.com/200'">
                <h3>${p.name}</h3>
                <p>₪${p.price}</p>
                <button class="buy-btn" onclick="openPayment(${p.id})">רכישה</button>
            </div>`;
    });
};

function openPayment(productId) {
    const product = products.find(p => p.id === productId);
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    // תיקון הקישור לוואטסאפ
    const waLink = `https://api.whatsapp.com/send?phone=${myPhone}&text=אני רוצה לקנות את ${product.name}`;

    modalBody.innerHTML = `
        <h3>${product.name}</h3>
        <p>מחיר: ₪${product.price}</p>
        <a href="${waLink}" target="_blank">
            <button class="buy-btn">המשך לתשלום בוואטסאפ</button>
        </a>
        <hr>
        <h4>תגובות</h4>
        <input type="text" id="rev-name" placeholder="שם">
        <textarea id="rev-text" placeholder="תגובה"></textarea>
        <button onclick="saveReview(${productId})">שלח</button>
        <div id="reviews-list"></div>
    `;
    modal.style.display = "block";
    loadReviews(productId);
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
    list.innerHTML = "";
    const snap = await db.collection("reviews").where("productId", "==", productId).get();
    snap.forEach(doc => {
        const r = doc.data();
        list.innerHTML += `
            <div class="review-item">
                <strong>${r.name}:</strong> ${r.text}
                <span class="delete-btn" onclick="deleteReview('${doc.id}', ${productId})">מחק</span>
            </div>`;
    });
}

async function deleteReview(id, pId) {
    if(prompt("סיסמה:") === adminPassword) {
        await db.collection("reviews").doc(id).delete();
        loadReviews(pId);
    }
}

function closeModal() { document.getElementById('modal').style.display = "none"; }
