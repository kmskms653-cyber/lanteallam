import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabaseClient';

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [pendingReceipts, setPendingReceipts] = useState([]);
  const [message, setMessage] = useState('');

  const ADMIN_EMAIL = 'Kmskms653@gmail.com';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchUserData(session.user);
    });

    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) fetchUserData(session.user);
      }
    );

    return () => authListener.unsubscribe();
  }, []);

  const fetchUserData = async (currentUser) => {
    // جلب حالة الاشتراك
    const { data: subData } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', currentUser.id)
      .single();
    
    if (subData) setSubscription(subData);

    // إذا كان المستخدم هو الأدمن، نأتي بكل الطلبات المعلقة
    if (currentUser.email === ADMIN_EMAIL) {
      const { data: pending } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('status', 'pending');
      if (pending) setPendingReceipts(pending);
    }
  };

  const handleAuth = async (type) => {
    setLoading(true);
    setMessage('');
    const { error } = type === 'login' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    
    if (error) setMessage(error.message);
    setLoading(false);
  };

  const handleLogout = () => supabase.auth.signOut();

  const handleUploadReceipt = async (e) => {
    e.preventDefault();
    if (!receiptFile) return setMessage('يرجى اختيار صورة الإيصال أولاً');

    setLoading(true);
    setMessage('');

    const fileExt = receiptFile.name.split('.').pop();
    const fileName = `${user.id}_${Date.now()}.${fileExt}`;

    // 1. رفع الصورة إلى الحاوية receipts
    const { error: uploadError } = await supabase.storage
      .from('receipts')
      .upload(fileName, receiptFile);

    if (uploadError) {
      setMessage('فشل رفع الإيصال: ' + uploadError.message);
      setLoading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('receipts')
      .getPublicUrl(fileName);

    // 2. تحديث/إنشاء طلب الاشتراك في جدول subscriptions
    const { error: subError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        user_email: user.email,
        receipt_url: urlData.publicUrl,
        status: 'pending'
      });

    if (subError) {
      setMessage('فشل حفظ بيانات الاشتراك: ' + subError.message);
    } else {
      setMessage('تم رفع الإيصال بنجاح! طلبك قيد المراجعة من قبل الإدارة.');
      fetchUserData(user);
    }
    setLoading(false);
  };

  const handleApproveSubscription = async (subId) => {
    const { error } = await supabase
      .from('subscriptions')
      .update({ status: 'active' })
      .eq('id', subId);

    if (!error) {
      setMessage('تم تفعيل الاشتراك بنجاح!');
      fetchUserData(user);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '20px', direction: 'rtl' }}>
      <h1>منصة لنتعلم التعليمية 📚</h1>

      {message && <p style={{ color: 'blue', background: '#eef', padding: '10px' }}>{message}</p>}

      {!user ? (
        <div style={{ maxWidth: '300px', margin: '0 auto' }}>
          <h2>تسجيل الدخول / حساب جديد</h2>
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <button onClick={() => handleAuth('login')} disabled={loading} style={{ width: '100%', padding: '10px', marginBottom: '5px' }}>
            تسجيل الدخول
          </button>
          <button onClick={() => handleAuth('signup')} disabled={loading} style={{ width: '100%', padding: '10px' }}>
            إنشاء حساب جديد
          </button>
        </div>
      ) : (
        <div>
          <p>أهلاً بك: <strong>{user.email}</strong></p>
          <button onClick={handleLogout} style={{ padding: '5px 15px', marginBottom: '20px' }}>تسجيل الخروج</button>

          <hr />

          {/* لوحة الأدمن */}
          {user.email === ADMIN_EMAIL ? (
            <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
              <h2>لوحة تحكم الإدارة 🛡️</h2>
              <h3>طلبات الاشتراكات المعلقة ({pendingReceipts.length})</h3>
              {pendingReceipts.map((sub) => (
                <div key={sub.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                  <p>المستخدم: {sub.user_email}</p>
                  <a href={sub.receipt_url} target="_blank" rel="noreferrer">عرض إيصال التحويل</a>
                  <br /><br />
                  <button onClick={() => handleApproveSubscription(sub.id)}>تفعيل الاشتراك</button>
                </div>
              ))}
            </div>
          ) : (
            /* واجهة المستخدم العادي */
            <div>
              <h2>حالة الاشتراك: {subscription?.status === 'active' ? '✅ نشط' : subscription?.status === 'pending' ? '⏳ قيد المراجعة' : '❌ غير مشترك'}</h2>

              {subscription?.status !== 'active' && (
                <form onSubmit={handleUploadReceipt} style={{ border: '1px solid #eee', padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
                  <h3>تفعيل الاشتراك</h3>
                  <p>يرجى تحويل رسوم الاشتراك ورفع صورة الإيصال:</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setReceiptFile(e.target.files[0])}
                    style={{ marginBottom: '10px' }}
                  />
                  <br />
                  <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
                    {loading ? 'جاري الرفع...' : 'ارسال الإيصال'}
                  </button>
                </form>
              )}

              {subscription?.status === 'active' && (
                <div style={{ background: '#e6ffe6', padding: '20px', marginTop: '20px' }}>
                  🎉 مرحباً بك في المحتوى التعليمي المميز لـ "لنتعلم"!
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
