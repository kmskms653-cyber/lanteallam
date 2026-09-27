import React, { useState } from 'react';
import { platformContent } from './content';

export default function App() {
  // حالة لتتبع هل المستخدم مسجل دخول أم لا
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('kmskms653@gmail.com');
  const [password, setPassword] = useState('********');

  const handleLogin = (e) => {
    e.preventDefault();
    // عند الضغط على تسجيل الدخول، يتم تحويل الحالة إلى true للانتقال للرئيسية
    setIsLoggedIn(true);
  };

  // إذا كان المستخدم قد سجّل دخوله، اعرض الصفحة الرئيسية للمنصة
  if (isLoggedIn) {
    return (
      <div className="app-background min-h-screen p-6 flex flex-col items-center text-right" dir="rtl">
        {/* رأس الصفحة الرئيسية */}
        <div className="soft-card p-6 max-w-xl w-full mb-6 flex justify-between items-center fade-in">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">
              {platformContent.title}
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              أهلاً بك، تم تسجيل الدخول بنجاح
            </p>
          </div>
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="secondary-button px-4 py-2 text-sm font-bold"
          >
            تسجيل الخروج
          </button>
        </div>

        {/* قائمة الدورات والمحتوى التعليمي */}
        <div className="w-full max-w-xl space-y-4 slide-up">
          <h2 className="text-xl font-bold text-slate-800 mb-2">الدورات المتاحة</h2>
          {platformContent.courses.map((course) => (
            <div key={course.id} className="interactive-option p-5 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  {course.category}
                </span>
                <h3 className="text-lg font-bold text-slate-800 mt-2">
                  {course.title}
                </h3>
              </div>
              <div className="text-left">
                <span className="text-sm font-semibold text-slate-500">
                  التقدم {course.progress}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // وإلا، اعرض واجهة تسجيل الدخول
  return (
    <div className="app-background min-h-screen p-6 flex flex-col items-center justify-center text-right" dir="rtl">
      <div className="soft-card p-8 max-w-md w-full text-center fade-in">
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">
          منصة لنتعلم التعليمية
        </h1>
        <p className="text-slate-600 text-sm mb-6">
          أهلاً بك! يرجى تسجيل الدخول للمتابعة
        </p>

        <form onSubmit={handleLogin} className="space-y-4 text-right">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required 
            />
          </div>

          <button type="submit" className="primary-button w-full py-3 font-extrabold mt-2">
            تسجيل الدخول
          </button>
        </form>

        <button className="secondary-button w-full py-3 font-extrabold mt-3">
          إنشاء حساب جديد
        </button>
      </div>
    </div>
  );
}

