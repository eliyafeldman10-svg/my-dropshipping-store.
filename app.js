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

function filterProducts() {
    const term = document.getElementById('search-input').value.toLowerCase();
    render(products.filter(p => p.name.toLowerCase().includes(term)));
}

function openModal(id) {
    const p = products.find(item => item.id === id);
    const myPhone = "972501234567"; // המספר שלך פה!
    const waLink = `https://wa.me/${myPhone}?text=שלום, אני רוצה להזמין: ${p.name}`;

    document.getElementById('modal-body').innerHTML = `
        <div style="direction:rtl; text-align:right;">
            <img src="${p.image}" style="width:100px; border-radius:8px;" onerror="this.src='https://via.placeholder.com/100'">
            <h2>${p.name}</h2>
            <div style="background:#f9f9f9; padding:15px; border-radius:10px; margin:15px 0;">
                <p>מחיר: ₪${p.price}</p>
                <p>משלוח: <span style="color:green;">חינם</span></p>
                <h3 style="margin-bottom:0;">סה"כ: ₪${p.price - 5} <small>(הנחת קופון)</small></h3>
            </div>
            <button class="buy-btn" style="background:#ff0033;" onclick="window.open('${waLink}')">בצע הזמנה (אלי אקספרס סטייל)</button>
            <hr>
            <h4>ביקורות לקוחות</h4>
            <div id="rev-list" style="max-height:150px; overflow-y:auto; margin-bottom:10px;">טוען...</div>
            <input type="text" id="r-name" placeholder="השם שלך" style="width:95%; padding:8px; margin-bottom:5px;">
            <textarea id="r-text" placeholder="מה דעתך?" style="width:95%; padding:8px; height:40px;"></textarea>
            <button class="buy-btn" style="background:#444;" onclick="addRev(${id})">שלח תגובה</button>
        </div>`;
    document.getElementById('modal').style.display = "block";
    loadRev(id);
}

async function addRev(id) {
    const name = document.getElementById('r-name').value;
    const text = document.getElementById('r-text').value;
    if(!name || !text) return;
    await db.collection("reviews").add({ productId: id, name, text, time: firebase.firestore.FieldValue.serverTimestamp() });
    loadRev(id);
}

async function loadRev(id) {
    const list = document.getElementById('rev-list');
    const snap = await db.collection("reviews").where("productId", "==", id).orderBy("time", "desc").get();
    list.innerHTML = snap.empty ? "אין תגובות." : "";
    snap.forEach(doc => {
        const r = doc.data();
        list.innerHTML += `<div style="border-bottom:1px solid #eee; padding:5px;"><strong>${r.name}:</strong> ${r.text}</div>`;
    });
}

function showSection(s) {
    let msg = s === 'support' ? "דוא\"ל: dropix.help@gmail.com | וואטסאפ: 050-1234567" : "משלוחים חינם לכל חלקי הארץ!";
    alert(msg);
}

function closeModal() { document.getElementById('modal').style.display = "none"; }
