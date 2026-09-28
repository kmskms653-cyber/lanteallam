const DB_KEY = "lntalem_db_v6";

// جلب أو إنشاء قاعدة البيانات تلقائياً مع بيانات المشرف والبنك والأسعار
function loadDB() {
    let db = JSON.parse(localStorage.getItem(DB_KEY) || "null");
    if (!db) {
        db = {
            users: [
                {
                    id: "admin_default", 
                    email: "Kmskms653@gmail.com", 
                    password: "Ka11223344", 
                    is_admin: true, 
                    status: "active"
                }
            ],
            subs: [],
            settings: {
                bankName: "Urpay / خالد العتيبي",
                iban: "SA7280206153985222121018",
                price: "30 ريال (شهر) و 299 ريال (سنة)"
            }
        };
        saveDB(db);
    }
    return db;
}

function saveDB(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}
// التحقق من المستخدم الحالي
function currentUser() {
    const sid = localStorage.getItem("lntalem_session");
    if (!sid) return null;
    return loadDB().users.find(u => u.id === sid) || null;
}

// التحقق مما إذا كان المستخدم مشرفاً أو مشتركاً فعالاً
function isSubscribed() {
    const u = currentUser();
    if (!u) return false;
    // منح صلاحية مطلقة واشتراك دائم للمشرف أو البريد المحدد تلقائياً
    if (u.is_admin || u.email.toLowerCase() === "kmskms653@gmail.com") return true;
    return u.status === "active";
}
// تسجيل الدخول مع توجيه المشرف للوحة التحكم مباشرة
function doLogin() {
    const em = document.getElementById("em").value.trim().toLowerCase();
    const pw = document.getElementById("pw").value;
    const db = loadDB();
    const u = db.users.find(x => x.email.toLowerCase() === em && x.password === pw);
    
    if (!u) return alert("بيانات الدخول غير صحيحة");
    localStorage.setItem("lntalem_session", u.id);
    
    // إذا كان البريد هو بريد المشرف، يتم تفعيل صلاحيات الإشراف فوراً
    if (em === "kmskms653@gmail.com") {
        u.is_admin = true;
        u.status = "active";
        saveDB(db);
    }
    
    go((u.is_admin || em === "kmskms653@gmail.com") ? "admin" : "home");
}

// التسجيل الجديد مع تعيين المشرف تلقائياً
function doRegister() {
    const em = document.getElementById("em").value.trim().toLowerCase();
    const pw = document.getElementById("pw").value;
    if (!em || !pw) return alert("أدخل البريد وكلمة المرور");
    
    const db = loadDB();
    if (db.users.find(x => x.email.toLowerCase() === em)) return alert("البريد مسجل مسبقاً");
    
    // تعيين صلاحيات المشرف تلقائياً للبريد المحدد
    const isAdmin = (em === "kmskms653@gmail.com");
    const u = {
        id: "u" + Date.now(),
        email: em,
        password: pw,
        is_admin: isAdmin,
        status: isAdmin ? "active" : "none"
    };
    
    db.users.push(u);
    saveDB(db);
    localStorage.setItem("lntalem_session", u.id);
    
    alert(isAdmin ? "👑 تم تسجيلك كمشرف بنجاح واشتراك دائم" : "✅ تم إنشاء حسابك بنجاح");
    go(isAdmin ? "admin" : "home");
}
// رندر لوحة المشرف الرئيسية
function renderAdmin(app) {
    const u = currentUser();
    if (!u || (!u.is_admin && u.email.toLowerCase() !== "kmskms653@gmail.com")) {
        alert("صفحة خاصة بالمشرف فقط");
        return go("home");
    }
    
    const db = loadDB();
    const pending = db.subs.filter(s => s.status === "pending");
    const users = db.users;

    app.innerHTML = `
        <div class="max-w-3xl mx-auto p-4">
            <h1 class="text-3xl font-bold mb-6 flex items-center gap-2">🛠️ لوحة تحكم المشرف</h1>
            <div class="flex gap-2 mb-6 border-b pb-3 overflow-x-auto">
                <button onclick="adminTab('subs')" id="btn-subs" class="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-sm">الاشتراكات المعلقة (${pending.length})</button>
                <button onclick="adminTab('users')" id="btn-users" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold text-sm">المستخدمون (${users.length})</button>
                <button onclick="adminTab('settings')" id="btn-settings" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold text-sm">إعدادات البنك والأسعار</button>
            </div>
            <div id="admin-content"></div>
        </div>`;
    adminTab('subs');
}

// إدارة التبويبات داخل لوحة المشرف
function adminTab(tab) {
    ['subs', 'users', 'settings'].forEach(t => {
        const btn = document.getElementById("btn-" + t);
        if (btn) {
            btn.className = (t === tab) 
                ? "bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-sm" 
                : "bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold text-sm";
        }
    });
    
    const box = document.getElementById("admin-content");
    if (!box) return;
    const db = loadDB();

    if (tab === "subs") {
        const pending = db.subs.filter(s => s.status === "pending");
        if (pending.length === 0) {
            box.innerHTML = `<p class="text-gray-500 bg-white p-6 rounded-2xl text-center shadow">لا توجد طلبات اشتراك معلقة حالياً.</p>`;
            return;
        }
        box.innerHTML = `<div class="space-y-4">${pending.map(s => `
            <div class="bg-white rounded-2xl shadow p-4 flex items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                    <img src="${s.receipt}" class="w-16 h-16 object-cover rounded-xl cursor-pointer border" onclick="window.open('${s.receipt}')">
                    <div>
                        <p class="font-bold">${s.email}</p>
                        <p class="text-xs text-gray-400">${s.date}</p>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button onclick="decide('${s.id}', true)" class="bg-green-600 text-white px-4 py-2 rounded-xl font-bold text-sm">موافقة</button>
                    <button onclick="decide('${s.id}', false)" class="bg-red-600 text-white px-4 py-2 rounded-xl font-bold text-sm">رفض</button>
                </div>
            </div>`).join("")}</div>`;
            
    } else if (tab === "users") {
        box.innerHTML = `<div class="bg-white rounded-2xl shadow p-6 space-y-3">${db.users.map(us => `
            <div class="flex items-center justify-between border-b pb-3">
                <div>
                    <p class="font-bold">${us.email}</p>
                    <p class="text-xs text-gray-500">الحالة: ${us.status}${us.is_admin ? '| مشرف 👑' : ''}</p>
                </div>
                ${us.email.toLowerCase() !== "kmskms653@gmail.com" ? `<button onclick="deleteUser('${us.id}')" class="text-red-500 text-sm hover:underline font-bold">حذف</button>` : ""}
            </div>`).join("")}</div>`;
            
    } else if (tab === "settings") {
        box.innerHTML = `<div class="bg-white rounded-2xl shadow p-6 space-y-4">
            <div>
                <label class="block font-bold text-sm mb-1">اسم البنك / المستفيد:</label>
                <input id="st-bank" type="text" value="${db.settings.bankName}" class="w-full border rounded-xl p-3">
            </div>
            <div>
                <label class="block font-bold text-sm mb-1">رقم الآيبان (IBAN):</label>
                <input id="st-iban" type="text" value="${db.settings.iban}" class="w-full border rounded-xl p-3 font-mono">
            </div>
            <div>
                <label class="block font-bold text-sm mb-1">أسعار الاشتراك:</label>
                <input id="st-price" type="text" value="${db.settings.price}" class="w-full border rounded-xl p-3">
            </div>
            <button onclick="saveSettings()" class="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700">حفظ الإعدادات</button>
        </div>`;
    }
}

// اتخاذ قرار قبول أو رفض الإيصال
function decide(sid, ok) {
    const db = loadDB();
    const s = db.subs.find(x => x.id === sid);
    if (!s) return;
    s.status = ok ? "active" : "rejected";
    const usr = db.users.find(x => x.id === s.userId);
    if (usr) usr.status = ok ? "active" : "rejected";
    saveDB(db);
    adminTab('subs');
}

// حذف مستخدم
function deleteUser(uid) {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;
    const db = loadDB();
    db.users = db.users.filter(x => x.id !== uid);
    saveDB(db);
    adminTab('users');
}

// حفظ إعدادات البنك والأسعار ديناميكياً
function saveSettings() {
    const db = loadDB();
    db.settings.bankName = document.getElementById("st-bank").value;
    db.settings.iban = document.getElementById("st-iban").value;
    db.settings.price = document.getElementById("st-price").value;
    saveDB(db);
    alert("✅ تم حفظ الإعدادات بنجاح وتحديثها في صفحة الاشتراك فوراً");
}
// عرض صفحة الاشتراك وقراءة بيانات البنك والأسعار المسجلة
function renderSubscribe(app) {
    const u = currentUser();
    if (!u) return renderLogin(app);
    
    const db = loadDB();
    const s = db.settings;
    
    app.innerHTML = `
        <div class="max-w-xl mx-auto p-4">
            <h1 class="text-3xl font-bold text-center mb-6">اشتراك المنصة 💎</h1>
            <div class="bg-white rounded-2xl shadow p-6 mb-6">
                <h2 class="font-bold text-lg mb-2 text-emerald-800">📋 معلومات التحويل (${s.bankName}):</h2>
                <p class="text-gray-600 mb-1">قيمة الاشتراك: <b>${s.price}</b></p>
                <p class="text-sm text-gray-500 mb-2">رقم الآيبان:</p>
                <p dir="ltr" class="bg-gray-100 p-3 rounded-xl text-center font-mono select-all font-bold text-emerald-700">${s.iban}</p>
            </div>
            <div class="bg-white rounded-2xl shadow p-6">
                <label class="block border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-500">
                    <input type="file" accept="image/*" class="hidden" onchange="pickReceipt(this)">
                    <span id="rc-label" class="font-bold text-gray-600">📸 ارفع صورة الإيصال هنا</span>
                </label>
                <button onclick="submitSub()" class="w-full mt-4 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700">إرسال طلب التفعيل</button>
            </div>
        </div>`;
}

let receiptData = null;
function pickReceipt(inp) {
    const f = inp.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = e => {
        receiptData = e.target.result;
        document.getElementById("rc-label").innerHTML = "✅ " + f.name;
    };
    r.readAsDataURL(f);
}

function submitSub() {
    if (!receiptData) return alert("يرجى إرفاق صورة الإيصال أولاً");
    const db = loadDB();
    const u = currentUser();
    
    db.subs.push({
        id: "s" + Date.now(),
        userId: u.id,
        email: u.email,
        receipt: receiptData,
        status: "pending",
        date: new Date().toLocaleDateString("ar-SA")
    });
    
    db.users.find(x => x.id === u.id).status = "pending";
    saveDB(db);
    
    alert("تم استلام طلبك بنجاح، سيتم مراجعته وتفعيله قريباً.");
    go("home");
}
// AdminDashboard.jsx - لوحة إعدادات المشرف والتحكم الكامل
import React, { useState } from 'react';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('subscriptions');

    return (
        <div className="admin-container" style={{ direction: 'rtl', padding: '20px' }}>
            <h2>لوحة إدارة المشرف</h2>
            <hr />
            
            {/* شريط التنقل الخاص بإعدادات المشرف */}
            <div className="admin-nav-buttons" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button 
                    className={`btn ${activeTab === 'subscriptions' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('subscriptions')}
                >
                    طلبات الاشتراك (قبول / رفض)
                </button>
                <button 
                    className={`btn ${activeTab === 'locking' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('locking')}
                >
                    قفل الأيقونات عن غير المشتركين
                </button>
                <button 
                    className={`btn ${activeTab === 'files' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('files')}
                >
                    إضافة أو حذف ملفات للأقسام
                </button>
            </div>

            {/* محتوى التبويبات */}
            <div className="admin-content-card p-4 border rounded">
                {activeTab === 'subscriptions' && (
                    <div id="subscriptions-section">
                        <h3>إدارة طلبات الاشتراكات المعلقة</h3>
                        <p>استعراض الطلبات الجديدة واتخاذ قرار القبول أو الرفض:</p>
                        {/* جدول أو قائمة الطلبات */}
                        <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
                            <span>المستخدم: أحمد محمد (طلب اشتراك باقة سنوية)</span>
                            <div>
                                <button className="btn btn-success btn-sm mx-1" onClick={() => alert('تم قبول الطلب وتفعيل الاشتراك')}>قبول</button>
                                <button className="btn btn-danger btn-sm mx-1" onClick={() => alert('تم رفض الطلب')}>رفض</button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'locking' && (
                    <div id="locking-section">
                        <h3>قفل وفتح الأيقونات والدروس</h3>
                        <p>التحكم في حالة القفل الخاصة بالأقسام لغير المشتركين:</p>
                        <label className="d-block my-2">
                            <input type="checkbox" defaultChecked /> قفل قسم القدرات والتحصيلي عن غير المشتركين
                        </label>
                        <label className="d-block my-2">
                            <input type="checkbox" defaultChecked /> قفل الأنشطة التفاعلية والبارزة
                        </label>
                    </div>
                )}

                {activeTab === 'files' && (
                    <div id="files-section">
                        <h3>إدارة ملفات الأقسام (إضافة / حذف)</h3>
                        <p>رفع ملفات تعليمية جديدة أو حذف الملفات الحالية من الأقسام:</p>
                        <input type="file" className="form-control mb-3" />
                        <button className="btn btn-dark">رفع الملف إلى القسم المحدد</button>
                    </div>
                )}
            </div>
        </div>
    );
}

