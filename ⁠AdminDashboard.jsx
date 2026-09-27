'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  
  // قائمة طلبات الاشتراك الواردة (كمثال تجريبي)
  const [subscriptionRequests, setSubscriptionRequests] = useState([
    { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', receiptUrl: '/receipts/sample1.jpg', status: 'pending' },
    { id: 2, name: 'خالد عبدالله', email: 'khaled@example.com', receiptUrl: '/receipts/sample2.jpg', status: 'pending' }
  ]);

  useEffect(() => {
    // جلب بريد المستخدم الحالي من النظام أو التخزين المحلي
    const currentEmail = localStorage.getItem('userEmail') || 'kmskms653@gmail.com'; // للتجربة
    setUserEmail(currentEmail);

    // التحقق الصارم من أن البريد هو إيميل المشرف المحدد
    if (currentEmail !== 'kmskms653@gmail.com') {
      alert('عذراً، هذه الصفحة مخصصة للمشرف العام فقط.');
      router.push('/'); // توجيه غير المشرفين للرئيسية
    } else {
      setLoading(false);
    }
  }, [router]);

  // دالة قبول الاشتراك
  const handleAccept = (id) => {
    setSubscriptionRequests(prev => 
      prev.map(req => req.id === id ? { ...req, status: 'accepted' } : req)
    );
    // يمكنك إضافة كود تحديث قاعدة البيانات (API Call) هنا لتفعيل اشتراك المستخدم
    alert('تم قبول الاشتراك بنجاح وتفعيل حساب المستخدم.');
  };

  // دالة رفض الاشتراك
  const handleReject = (id) => {
    setSubscriptionRequests(prev => 
      prev.map(req => req.id === id ? { ...req, status: 'rejected' } : req)
    );
    // تحديث قاعدة البيانات برفض الطلب
    alert('تم رفض طلب الاشتراك.');
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>جاري التحقق من صلاحيات المشرف...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Cairo, sans-serif' }} dir="rtl">
      <h1>لوحة تحكم المشرف العام</h1>
      <p>المشرف المسجل: <strong>{userEmail}</strong></p>
      <hr style={{ margin: '20px 0' }} />

      <h2>طلبات الاشتراك بانتظار الموافقة:</h2>
      {subscriptionRequests.filter(req => req.status === 'pending').length === 0 ? (
        <p>لا توجد طلبات اشتراك جديدة معلقة حالياً.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ background: '#f2f2f2', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '10px', textAlign: 'right' }}>اسم المشترك</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>البريد الإلكتروني</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>إيصال الدفع</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>الإجراءات (قبول / رفض)</th>
            </tr>
          </thead>
          <tbody>
            {subscriptionRequests.filter(req => req.status === 'pending').map((req) => (
              <tr key={req.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{req.name}</td>
                <td style={{ padding: '10px' }}>{req.email}</td>
                <td style={{ padding: '10px' }}>
                  <a href={req.receiptUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3', textDecoration: 'underline' }}>
                    عرض الإيصال 📄
                  </a>
                </td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  {/* أيقونة وقرار القبول */}
                  <button 
                    onClick={() => handleAccept(req.id)}
                    style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', marginLeft: '5px' }}
                    title="قبول"
                  >
                    ✔️ قبول
                  </button>
                  
                  {/* أيقونة وقرار الرفض */}
                  <button 
                    onClick={() => handleReject(req.id)}
                    style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}
                    title="رفض"
                  >
                    ❌ رفض
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
