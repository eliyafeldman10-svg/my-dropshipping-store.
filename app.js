// הנתונים מצילום המסך של ה-SDK שלך
const firebaseConfig = {
  apiKey: "AIzaSyDlSzbnHSzF3pqCSAzP9-4uttDxnyaQOAI",
  authDomain: "dropix-bf5f6.firebaseapp.com",
  projectId: "dropix-bf5f6",
  storageBucket: "dropix-bf5f6.firebasestorage.app",
  messagingSenderId: "660480064549",
  appId: "1:660480064549:web:2240b990ae88cbd74513cc",
  measurementId: "G-76K15GEXQ7"
};

// אתחול Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

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
        const productHTML = `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/250?text=No+Image'">
                <h3>${product.name}</h3>
                <p class="price">₪${product.price}</p>
                <button class="buy-btn" onclick="openPayment(${product.id})">פרטים ורכישה</button>
            </div>
        `;
        container.innerHTML += productHTML;
    });
};

async function openPayment(productId) {
    const product = products.find(p => p.id === productId);
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <div style="text-align: right; direction: rtl;">
            <img src="${product.image}" style="max-width: 150px; float: left; margin-left: 15px;" onerror="this.src='https://via.placeholder.com/150'">
            <h2 style="font-size: 22px; margin-bottom: 5px;">${product.name}</h2>
            <p style="font-size: 20px; font-weight: bold; margin-bottom: 15px;">מחיר: ₪${product.price}</p>
            
            <div style="background: #000; color: #fff; padding: 15px; text-align: center; font-weight: bold; cursor: pointer; margin-bottom: 20px;">
                💳 המשך לתשלום מאובטח
            </div>

            <hr style="border: 0; border-top: 1px solid #eee; margin-bottom: 15px;">

            <h3 style="font-size: 16px; margin-bottom: 10px;">תגובות ודירוגים</h3>
            
            <div style="background: #f9f9f9; padding: 10px; border-radius: 5px; margin-bottom: 15px;">
                <input type="text" id="reviewer-name" placeholder="השם שלך" style="width: 100%; padding: 8px; margin-bottom: 5px; border: 1px solid #ddd;">
                <select id="reviewer-rating" style="width: 100%; padding: 8px; margin-bottom: 5px; border: 1px solid #ddd;">
                    <option value="5">★★★★★ (5 כוכבים)</option>
                    <option value="4">★★★★☆ (4 כוכבים)</option>
                    <option value="3">★★★☆☆ (3 כוכבים)</option>
                    <option value="2">★★☆☆☆ (2 כוכבים)</option>
                    <option value="1">★☆☆☆☆ (1 כוכבים)</option>
                </select>
                <textarea id="reviewer-text" placeholder="כתוב חוות דעת..." style="width: 100%; padding: 8px; border: 1px solid #ddd; height: 60px;"></textarea>
                <button class="buy-btn" style="margin-top: 5px; padding: 8px; font-size: 14px;" onclick="saveReview(${product.id})">שלח תגובה</button>
            </div>

            <div id="reviews-list">טוען תגובות...</div>
        </div>
    `;
    modal.style.display = "block";
    loadReviews(product.id);
}

async function saveReview(productId) {
    const name = document.getElementById('reviewer-name').value;
    const rating = document.getElementById('reviewer-rating').value;
    const text = document.getElementById('reviewer-text').value;

    if (!name || !text) {
        alert("בבקשה מלא את כל השדות!");
        return;
    }

    try {
        await db.collection("reviews").add({
            productId: productId,
            name: name,
            rating: parseInt(rating),
            text: text,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert("התגובה נשמרה בהצלחה!");
        loadReviews(productId);
    } catch (error) {
        alert("שגיאה בשמירת התגובה. וודא שהפעלת את Firestore במצב בדיקה (Test Mode).");
        console.error(error);
    }
}

async function loadReviews(productId) {
    const reviewsList = document.getElementById('reviews-list');
    reviewsList.innerHTML = "";

    try {
        const snapshot = await db.collection("reviews")
            .where("productId", "==", productId)
            .orderBy("timestamp", "desc")
            .get();

        if (snapshot.empty) {
            reviewsList.innerHTML = "<p style='color: #888;'>אין עדיין תגובות למוצר זה. תהיה הראשון להגיב!</p>";
            return;
        }

        snapshot.forEach(doc => {
            const review = doc.data();
            const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
            
            const reviewHTML = `
                <div style="border-bottom: 1px solid #eee; padding: 10px 0; font-size: 13px;">
                    <p><strong>${review.name}</strong> <span style="color: #ffcc00;">${stars}</span></p>
                    <p style="color: #555;">"${review.text}"</p>
                </div>
            `;
            reviewsList.innerHTML += reviewHTML;
        });
    } catch (error) {
        reviewsList.innerHTML = "<p style='color: #888;'>טוען תגובות...</p>";
        console.error(error);
    }
}

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
