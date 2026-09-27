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
import React, { useState } from 'react';
import { tahsiliTest01 } from './examsData';

export default function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const question = tahsiliTest01.questions[currentQuestionIndex];

  return (
    <div style={{ padding: '20px', fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}>
      <h1>{tahsiliTest01.title}</h1>
      <h3>السؤال {question.id}: {question.question_text}</h3>
      
      <ul>
        {question.options.map((option, index) => (
          <li key={index} style={{ margin: '10px 0' }}>
            <button onClick={() => {
              if (index === question.correct_answer_index) {
                alert("إجابة صحيحة! " + question.explanation);
              } else {
                alert("إجابة خاطئة. حاول مرة أخرى.");
              }
            }}>
              {option}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
import React, { useState } from 'react';
import educationalData from './data/data.json'; // استدعاء البيانات الشاملة

export default function App() {
  // بريد المشرف المعتمد
  const adminEmail = "kmskms653@gmail.com";
  const [currentUserEmail, setCurrentUserEmail] = useState(
    localStorage.getItem('userEmail') || "user@example.com"
  );
  
  const [isSubscribed, setIsSubscribed] = useState(false); // حماية المحتوى لغير المشتركين
  const [currentView, setCurrentView] = useState('home'); // 'home', 'admin', 'stageDetail'
  const [selectedStage, setSelectedStage] = useState(null);

  // طلبات الاشتراك التجريبية للمشرف
  const [requests, setRequests] = useState([
    { id: 1, name: "عمر أحمد", email: "omar@example.com", receipt: "إيصال_دفع_1.jpg", status: "pending" }
  ]);

  const isAdmin = currentUserEmail === adminEmail;

  const handleApprove = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "approved" } : r));
    alert("تم قبول الاشتراك وتفعيل المستخدم بنجاح.");
  };

  const handleReject = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "rejected" } : r));
    alert("تم رفض طلب الاشتراك.");
  };

  return (
    <div className="app-background min-h-screen p-6 flex flex-col items-center" dir="rtl">
      
      {/* شريط التنقل العلوي والأزرار */}
      <div className="w-full max-w-xl flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold">منصتي التعليمية</h2>
        <div className="flex gap-2">
          <button onClick={() => setCurrentView('home')} className="px-3 py-1 bg-gray-200 rounded">الرئيسية</button>
          
          {/* لوحة الإدارة تظهر للمشرف حصراً */}
          {isAdmin && (
            <button 
              onClick={() => setCurrentView('admin')} 
              className="px-3 py-1 bg-yellow-400 font-bold rounded"
            >
              🔒 لوحة الإدارة
            </button>
          )}

          <button 
            onClick={() => {
              const email = prompt("أدخل الإيميل للتجربة:", currentUserEmail);
              if(email) {
                localStorage.setItem('userEmail', email);
                setCurrentUserEmail(email);
              }
            }}
            className="px-3 py-1 bg-slate-700 text-white rounded text-sm"
          >
            إيميلك: {currentUserEmail}
          </button>
        </div>
      </div>

      {/* عرض الصفحة الرئيسية */}
      {currentView === 'home' && (
        <div className="w-full max-w-xl space-y-4">
          <div className="soft-card p-6 bg-white rounded-lg shadow mb-6">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2">تطبيقي التعليمي الشامل</h1>
            <p className="text-slate-600 mb-4">تأسيس الحروف، الرياضيات، الإنجليزية، واختبارات القدرات والتحصيلي.</p>
          </div>

          <h3 className="text-xl font-bold text-slate-700">المراحل والأقسام التعليمية:</h3>
          <div className="grid gap-4">
            {educationalData.educationalStages.map((stage) => (
              <div 
                key={stage.stageId}
                onClick={() => {
                  setSelectedStage(stage);
                  setCurrentView('stageDetail');
                }}
                className="interactive-card p-4 bg-white border rounded-lg shadow cursor-pointer hover:bg-slate-50 transition"
              >
                <h4 className="text-lg font-bold text-blue-600">{stage.title}</h4>
                <p className="text-sm text-gray-500">اضغط لعرض الأقسام الفرعية، الدروس، والاختبارات</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* تفاصيل المرحلة والأقسام الفرعية (محمية لغير المشتركين) */}
      {currentView === 'stageDetail' && selectedStage && (
        <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow">
          <button onClick={() => setCurrentView('home')} className="mb-4 px-3 py-1 bg-gray-300 rounded">⬅ عودة للرئيسية</button>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">{selectedStage.title}</h2>

          {!isSubscribed ? (
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg text-center my-4">
              <h3 className="text-lg font-bold text-amber-800 mb-2">هذا المحتوى للمشتركين فقط 🔒</h3>
              <p className="text-sm text-amber-700 mb-4">الرجاء إرسال إيصال الدفع للاشتراك والوصول إلى الأقسام الفرعية والاختبارات.</p>
              <button 
                onClick={() => alert("تم إرسال طلب الاشتراك وإيصال الدفع إلى المشرف بنجاح.")}
                className="px-4 py-2 bg-blue-600 text-white rounded font-bold"
              >
                إرسال إيصال الدفع للاشتراك
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-slate-700">الأقسام الفرعية والمحتوى:</h3>
              {selectedStage.subSections.map((sub, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border rounded-md">
                  <h4 className="font-bold text-slate-800">{sub.title}</h4>
                  <p className="text-sm text-slate-600 mt-1">{sub.description}</p>
                  
                  {sub.quizList && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                      <strong>سؤال اختبار تجريبي:</strong> {sub.quizList[0].question}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* لوحة تحكم المشرف (متاحة حصراً لـ kmskms653@gmail.com) */}
      {currentView === 'admin' && (
        <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow border-2 border-yellow-400">
          {isAdmin ? (
            <div>
              <h2 className="text-2xl font-bold mb-2">لوحة تحكم المشرف العام</h2>
              <p className="text-sm text-gray-600 mb-4">أهلاً بك، يتم عرض طلبات الاشتراك وإيصالات الدفع أدناه:</p>
              
              <div className="space-y-3">
                {requests.map((req) => (
                  <div key={req.id} className="flex justify-between items-center p-3 border rounded bg-slate-50">
                    <div>
                      <p className="font-bold">{req.name}</p>
                      <p className="text-xs text-gray-500">{req.email} - الإيصال: <a href="#" className="text-blue-500 underline">{req.receipt}</a></p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleApprove(req.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                      >
                        ✔️ قبول
                      </button>
                      <button 
                        onClick={() => handleReject(req.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                      >
                        ❌ رفض
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-red-600 font-bold">
              ❌ عذراً، لا تمتلك صلاحيات الوصول لهذه الصفحة (مخصصة للمشرف فقط).
            </div>
          )}
        </div>
      )}

    </div>
  );
}

