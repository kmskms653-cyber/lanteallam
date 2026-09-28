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

