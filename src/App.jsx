import React, { useState } from 'react';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('جاري تسجيل الدخول...');
    setTimeout(() => {
      setLoading(false);
      setMessage('تم تسجيل الدخول بنجاح! أهلاً بك في منصة لنتعلم.');
    }, 1200);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0e7ff 0%, #e0f2fe 50%, #f3e8ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      direction: 'rtl'
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        width: '100%',
        maxWidth: '400px',
        borderRadius: '20px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        padding: '32px',
        textAlign: 'right',
        boxSizing: 'border-box'
      }}>

        {/* الهيدر */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>📚</div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>
            منصة <span style={{ color: '#4f46e5' }}>لنتعلم</span> التعليمية
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            أهلاً بك! يرجى تسجيل الدخول للمتابعة
          </p>
        </div>

        {/* رسالة التنبيه */}
        {message && (
          <div style={{
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: '#eef2ff',
            border: '1px solid #c7d2fe',
            color: '#3730a3',
            fontSize: '14px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        {/* النموذج */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '6px' }}>
              البريد الإلكتروني
            </label>
            <input
              type="email"
              required
              placeholder="kmskms653@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                textAlign: 'right'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '6px' }}>
              كلمة المرور
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                textAlign: 'right'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                fontWeight: '600',
                borderRadius: '12px',
                border: 'none',
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.3)'
              }}
            >
              {loading ? 'جاري التحميل...' : 'تسجيل الدخول'}
            </button>

            <button
              type="button"
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#f8fafc',
                color: '#475569',
                fontWeight: '600',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                fontSize: '15px',
                cursor: 'pointer'
              }}
            >
              إنشاء حساب جديد
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
