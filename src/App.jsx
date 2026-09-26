import React from 'react';
import { platformContent } from './content';

export default function App() {
  return (
    <div className="app-background min-h-screen p-6 flex flex-col items-center justify-center text-right" dir="rtl">
      
      {/* رأس الصفحة: يأخذ البيانات من ملف content.js */}
      <div className="soft-card p-8 max-w-xl w-full mb-6 text-center fade-in">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-3">
          {platformContent.title}
        </h1>
        <p className="text-slate-600 mb-6">
          {platformContent.description}
        </p>
        
        <div className="flex gap-4 justify-center">
          <button className="primary-button px-6 py-3 font-extrabold">
            ابدأ التعلم
          </button>
          <button className="secondary-button px-6 py-3 font-extrabold">
            عرض التفاصيل
          </button>
        </div>
      </div>

      {/* قائمة الدورات: تقرأ الدورات من ملف content.js بشكل تلقائي */}
      <div className="w-full max-w-xl space-y-4 slide-up">
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
;

  // إنشاء حساب جديد
  const handleSignUp = async () => {
    if (!email || !password) {
      setIsError(true);
      setMessage('يرجى كتابة البريد الإلكتروني وكلمة المرور أولاً.');
      return;
    }
    setLoading(true);
    setMessage('');
    setIsError(false);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setIsError(true);
      setMessage(error.message || 'حدث خطأ أثناء إنشاء الحساب.');
    } else {
      setMessage('تم إنشاء الحساب بنجاح! يرجى مراجعة بريدك الإلكتروني للتأكيد (إن كان مفصلاً) أو تسجيل الدخول الآن.');
    }
    setLoading(false);
  };

  // تسجيل الخروج
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMessage('');
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white/90 backdrop-blur-md w-full max-w-md rounded-2xl shadow-xl p-8 border border-white/60 text-center space-y-4">
          <div className="text-5xl">🎉</div>
          <h1 className="text-2xl font-bold text-gray-800">مرحباً بك في منصة لنتعلم!</h1>
          <p className="text-gray-600 text-sm">{user.email}</p>
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow transition"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white/90 backdrop-blur-md w-full max-w-md rounded-2xl shadow-xl p-8 border border-white/60 text-right">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-indigo-100 rounded-2xl mb-3 shadow-inner">
            <span className="text-4xl">📚</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            منصة <span className="text-indigo-600">لنتعلم</span> التعليمية
          </h1>
          <p className="text-gray-500 text-sm">يرجى تسجيل الدخول أو إنشاء حساب جديد للمتابعة</p>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`mb-4 p-3 rounded-xl text-sm text-center border ${
            isError ? 'bg-red-50 border-red-200 text-red-600' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
          }`}>
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              required
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white text-right"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white text-right"
            />
          </div>

          <div className="pt-2 space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition transform active:scale-95 disabled:opacity-50"
            >
              {loading ? 'جاري التحميل...' : 'تسجيل الدخول'}
            </button>
            
            <button
              type="button"
              onClick={handleSignUp}
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl border border-gray-200 transition active:scale-95 disabled:opacity-50"
            >
              إنشاء حساب جديد
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}



