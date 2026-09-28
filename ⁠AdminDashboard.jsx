'use client';

import React, { useState } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('subscriptions');

  const [sections, setSections] = useState({
    abilities: true,
    activities: true,
  });

  const [bank, setBank] = useState({
    bankName: 'Urpay / خالد العتيبي',
    iban: 'SA7280206153985222121018',
    price: '30 ريال (شهر) و 299 ريال (سنة)',
  });

  const [file, setFile] = useState(null);

  const tabs = [
    ['subscriptions', 'طلبات الاشتراك'],
    ['locking', 'قفل الأقسام'],
    ['files', 'إدارة الملفات'],
    ['settings', 'إعدادات البنك والأسعار'],
  ];

  function toggleSection(name) {
    setSections(prev => ({
      ...prev,
      [name]: !prev[name],
    }));
  }

  function saveSettings() {
    // يلزم ربط الحفظ بقاعدة بيانات
    alert('يجب ربط الإعدادات بالخادم لحفظها بشكل دائم');
  }

  function uploadFile() {
    if (!file) {
      alert('اختر ملفًا أولاً');
      return;
    }

    // يلزم إنشاء API لرفع الملف إلى الخادم
    alert('يجب ربط رفع الملفات بخدمة تخزين');
  }

  return (
    <main
      dir="rtl"
      className="max-w-3xl mx-auto p-4"
    >
      <h1 className="text-3xl font-bold mb-6">
        🛠️ لوحة تحكم المشرف
      </h1>

      <nav className="flex flex-wrap gap-2 mb-6">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2 rounded-xl font-bold ${
              activeTab === id
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <section className="bg-white text-gray-900 rounded-2xl shadow p-5">

        {activeTab === 'subscriptions' && (
          <div>
            <h2 className="text-xl font-bold mb-4">
              إدارة الاشتراكات
            </h2>
            <p>
              ستظهر هنا طلبات الاشتراك المعلقة من قاعدة البيانات.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              يلزم ربط هذه الصفحة بواجهة API لقبول الطلبات ورفضها.
            </p>
          </div>
        )}

        {activeTab === 'locking' && (
          <div>
            <h2 className="text-xl font-bold mb-4">
              قفل وفتح الأقسام
            </h2>

            <label className="flex gap-3 mb-4">
              <input
                type="checkbox"
                checked={sections.abilities}
                onChange={() => toggleSection('abilities')}
              />
              قفل قسم القدرات والتحصيلي
            </label>

            <label className="flex gap-3">
              <input
                type="checkbox"
                checked={sections.activities}
                onChange={() => toggleSection('activities')}
              />
              قفل الأنشطة التفاعلية
            </label>

            <p className="text-sm text-gray-500 mt-4">
              التغييرات هنا مؤقتة حتى ربطها بقاعدة البيانات.
            </p>
          </div>
        )}

        {activeTab === 'files' && (
          <div>
            <h2 className="text-xl font-bold mb-4">
              إدارة ملفات الأقسام
            </h2>

            <input
              type="file"
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="block w-full mb-4"
            />

            <button
              onClick={uploadFile}
              className="bg-emerald-600 text-white px-5 py-3 rounded-xl"
            >
              رفع الملف
            </button>

            <p className="text-sm text-gray-500 mt-3">
              رفع الملفات يحتاج إلى API وتخزين على الخادم.
            </p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-xl font-bold mb-4">
              إعدادات البنك والأسعار
            </h2>

            <label className="block mb-2">
              اسم البنك والمستفيد
            </label>
            <input
              value={bank.bankName}
              onChange={e =>
                setBank({ ...bank, bankName: e.target.value })
              }
              className="border rounded-xl p-3 w-full mb-4"
            />

            <label className="block mb-2">
              رقم الآيبان
            </label>
            <input
              value={bank.iban}
              onChange={e =>
                setBank({ ...bank, iban: e.target.value })
              }
              className="border rounded-xl p-3 w-full mb-4"
              dir="ltr"
            />

            <label className="block mb-2">
              أسعار الاشتراك
            </label>
            <input
              value={bank.price}
              onChange={e =>
                setBank({ ...bank, price: e.target.value })
              }
              className="border rounded-xl p-3 w-full mb-4"
            />

            <button
              onClick={saveSettings}
              className="bg-emerald-600 text-white px-6 py-3 rounded-xl"
            >
              حفظ الإعدادات
            </button>
          </div>
        )}
      </section>
    </main>
  );
}


