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

