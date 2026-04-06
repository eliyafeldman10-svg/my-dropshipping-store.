// הגדרות Firebase
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

const products = [
    { id: 1, name: "שעון יד חכם - דגם 2026", price: 199, image: "p1.jpg" },
    { id: 2, name: "אוזניות אלחוטיות PRO", price: 250, image: "p2.jpg" },
    { id: 3, name: "מטען מהיר לנייד", price: 89, image: "p3.jpg" },
    { id: 4, name: "רמקול בלוטות' Ortizan", price: 149, image: "p4.jpg" },
    { id: 5, name: "מעמד מגנטי לרכב", price: 45, image: "p5.jpg" },
    { id: 6, name: "מנורת שולחן חכמה LED", price: 120, image: "p6.jpg" }
];

window.onload = () => render(products);

function render(arr) {
    const cont = document.getElementById('products-container');
    cont.innerHTML = arr.map(p => `
        <div class="product-card">
            <img src="${p.image}" onerror="this.src='https://via.placeholder.com/250'">
            <h3>${p.name}</h3>
            <p class="price">₪${p.price}</p>
            <button class="buy-btn" onclick="openModal(${p.id})">צפה בפרטים</button>
        </div>
    `).join('');
}

function openModal(id) {
    const p = products.find(item => item.id === id);
    const myPhone = "972501234567"; // המספר שלך
    const waLink = `https://wa.me/${myPhone}?text=שלום, אני רוצה להזמין: ${p.name}`;

    document.getElementById('modal-body').innerHTML = `
        <div style="direction:rtl; text-align:right; font-size: 14px;">
            <div style="display: flex; gap: 15px; align-items: center; margin-bottom: 10px;">
                <img src="${p.image}" style="width:70px; height:70px; object-fit: cover; border-radius:8px;" onerror="this.src='https://via.placeholder.com/70'">
                <h2 style="font-size: 18px; margin: 0;">${p.name}</h2>
            </div>
            
            <div style="background:#f9f9f9; padding:10px; border-radius:8px; margin-bottom:10px; line-height: 1.4;">
                <div style="display: flex; justify-content: space-between;"><span>מחיר פריט:</span><span>₪${p.price}</span></div>
                <div style="display: flex; justify-content: space-between; color: green;"><span>משלוח:</span><span>חינם</span></div>
                <div style="display: flex; justify-content: space-between; font-weight: bold; border-top: 1px solid #ddd; margin-top: 5px; padding-top: 5px; font-size: 16px;">
                    <span>סה"כ לתשלום:</span><span>₪${p.price - 5}</span>
                </div>
            </div>

            <button class="buy-btn" style="background:#ff0033; padding: 10px; font-size: 16px;" onclick="window.open('${waLink}')">בצע הזמנה בוואטסאפ</button>
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
            
            <h4 style="margin: 0 0 10px 0;">ביקורות לקוחות</h4>
            <div id="rev-list" style="max-height:100px; overflow-y:auto; margin-bottom:10px; font-size: 13px; border: 1px solid #f0f0f0; padding: 5px; border-radius: 5px;">טוען...</div>
            
            <div style="display: flex; gap: 5px;">
                <input type="text" id="r-name" placeholder="שם" style="width:30%; padding:5px; border: 1px solid #ddd; border-radius: 4px;">
                <input type="text" id="r-text" placeholder="הוסף תגובה..." style="width:70%; padding:5px; border: 1px solid #ddd; border-radius: 4px;">
                <button style="background:#444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;" onclick="addRev(${id})">שלח</button>
            </div>
        </div>`;
    document.getElementById('modal').style.display = "block";
    loadRev(id);
}

// פונקציות ה-Firebase נשארות ללא שינוי
async function addRev(id) {
    const name = document.getElementById('r-name').value;
    const text = document.getElementById('r-text').value;
    if(!name || !text) return;
    await db.collection("reviews").add({ productId: id, name, text, time: firebase.firestore.FieldValue.serverTimestamp() });
    document.getElementById('r-text').value = "";
    loadRev(id);
}

async function loadRev(id) {
    const list = document.getElementById('rev-list');
    const snap = await db.collection("reviews").where("productId", "==", id).orderBy("time", "desc").get();
    list.innerHTML = snap.empty ? "אין תגובות." : "";
    snap.forEach(doc => {
        const r = doc.data();
        list.innerHTML += `<div style="border-bottom:1px solid #eee; padding:3px 0;"><strong>${r.name}:</strong> ${r.text}</div>`;
    });
}

function filterProducts() {
    const term = document.getElementById('search-input').value.toLowerCase();
    render(products.filter(p => p.name.toLowerCase().includes(term)));
}

function closeModal() { document.getElementById('modal').style.display = "none"; }
