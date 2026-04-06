// הנתונים של ה-Firebase שלך
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

const adminPassword = "1234"; // סיסמת מחיקה שתבחר

const products = [
    { id: 1, name: "שעון יד חכם - דגם 2026", price: 199, image: "p1.jpg" },
    { id: 2, name: "אוזניות אלחוטיות PRO", price: 250, image: "p2.jpg" },
    { id: 3, name: "מטען מהיר לנייד", price: 89, image: "p3.jpg" },
    { id: 4, name: "רמקול בלוטות' Ortizan – עמיד במים", price: 149, image: "p4.jpg" },
    { id: 5, name: "מעמד מגנטי לנייד לרכב", price: 45, image: "p5.jpg" },
    { id: 6, name: "מנורת שולחן חכמה LED", price: 120, image: "p6.jpg" }
];

window.onload = function() {
    const container = document.getElementById('products-container');
    if (!container) return;
    products.forEach(product => {
        container.innerHTML += `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/250'">
                <h3>${product.name}</h3>
                <p class="price">₪${product.price}</p>
                <button class="buy-btn" onclick="openPayment(${product.id})">פרטים ורכישה</button>
            </div>`;
    });
};

function openPayment(productId) {
    const product = products.find(p => p.id === productId);
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    // יצירת קישור תשלום (לדוגמה WhatsApp)
    const whatsappLink = `https://wa.me/972XXXXXXXXX?text=שלום, אני מעוניין לרכוש את ${product.name} במחיר ₪${product.price}`;

    modalBody.innerHTML = `
        <div style="text-align: right; direction: rtl;">
            <img src="${product.image}" style="max-width: 120px; float: left;" onerror="this.src='https://via.placeholder.com/150'">
            <h2>${product.name}</h2>
            <p style="font-size: 20px; color: green;"><strong>מחיר: ₪${product.price}</strong></p>
            
            <a href="${whatsappLink}" target="_blank" style="text-decoration:none;">
                <button class="buy-btn" style="width:100%; background:#25D366; margin-bottom:10px;">💬 רכישה מהירה ב-WhatsApp</button>
            </a>
            
            <hr>
            <h3>חוות דעת מהלקוחות שלנו</h3>
            <div id="review-form" style="background:#f4f4f4; padding:10px; border-radius:5px;">
                <input type="text" id="rev-name" placeholder="השם שלך" style="width:100%; margin-bottom:5px; padding:5px;">
                <select id="rev-stars" style="width:100%; margin-bottom:5px; padding:5px;">
                    <option value="5">★★★★★ (5 כוכבים)</option>
                    <option value="4">★★★★☆ (4 כוכבים)</option>
                </select>
                <textarea id="rev-text" placeholder="כתוב משהו על המוצר..." style="width:100%; height:50px; padding:5px;"></textarea>
                <button class="buy-btn" onclick="saveReview(${productId})">שלח תגובה</button>
            </div>
            <div id="reviews-list" style="margin-top:15px;">טוען תגובות...</div>
        </div>`;
    modal.style.display = "block";
    loadReviews(productId);
}

async function saveReview(productId) {
    const name = document.getElementById('rev-name').value;
    const rating = document.getElementById('rev-stars').value;
    const text = document.getElementById('rev-text').value;
    if (!name || !text) return alert("בבקשה מלא את כל השדות");

    await db.collection("reviews").add({
        productId, name, rating: parseInt(rating), text, timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    document.getElementById('rev-text').value = ""; // ניקוי הטופס
    loadReviews(productId);
}

async function loadReviews(productId) {
    const list = document.getElementById('reviews-list');
    list.innerHTML = "";
    const snap = await db.collection("reviews").where("productId", "==", productId).orderBy("timestamp", "desc").get();
    
    if (snap.empty) {
        list.innerHTML = "אין תגובות עדיין. תהיה הראשון לדרג!";
        return;
    }

    snap.forEach(doc => {
        const r = doc.data();
        const id = doc.id;
        list.innerHTML += `
            <div style="border-bottom:1px solid #eee; padding:10px 0; position: relative;">
                <strong>${r.name}</strong> <span style="color:#ffcc00;">${"★".repeat(r.rating)}</span>
                <p style="margin:5px 0;">${r.text}</p>
                <span onclick="deleteReview('${id}', ${productId})" style="color:red; cursor:pointer; font-size:10px; position:absolute; left:0; top:10px;">[מחק]</span>
            </div>`;
    });
}

async function deleteReview(reviewId, productId) {
    const pass = prompt("הכנס סיסמת מנהל למחיקה:");
    if (pass === adminPassword) {
        await db.collection("reviews").doc(reviewId).delete();
        alert("התגובה נמחקה!");
        loadReviews(productId);
    } else {
        alert("סיסמה שגויה!");
    }
}

function closeModal() { document.getElementById('modal').style.display = "none"; }
