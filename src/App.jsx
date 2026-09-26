import React, { useState } from 'react';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4 dir-rtl" dir="rtl">
      {/* Container Card */}
      <div className="bg-white/80 backdrop-blur-md w-full max-w-md rounded-2xl shadow-xl p-8 border border-white/50 text-right">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-indigo-100 rounded-2xl mb-3 shadow-inner">
            <span className="text-4xl">📚</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            منصة <span className="text-indigo-600">لنتعلم</span> التعليمية
          </h1>
          <p className="text-gray-500 text-sm">مرحباً بك! يرجى تسجيل الدخول للمتابعة</p>
        </div>

        {/* Form Section */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition bg-white/70 text-right"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition bg-white/70 text-right"
            />
          </div>

          <div className="pt-2 space-y-3">
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-200 transition transform active:scale-95"
            >
              تسجيل الدخول
            </button>
            
            <button
              type="button"
              className="w-full py-3.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl border border-gray-200 transition active:scale-95"
            >
              إنشاء حساب جديد
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

  );
}
