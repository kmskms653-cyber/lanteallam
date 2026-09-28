// src/examsData.js

export const tahsiliTest01 = {
  exam_id: "tahsili_test_01",
  testId: "test_01",
  title: "الاختبار الأول: أساسيات الأعداد واللغة",
  testTitle: "اختبار التحصيلي 1",
  category: "اختبارات التحصيلي",
  subject: "عام",

  questions: [
    {
      id: 1,
      subject: "رياضيات",
      question_text: "ما ناتج 45 - 14؟",
      question: "ما ناتج 45 - 14؟",

      options: [
        "33",
        "59",
        "31",
        "29",
      ],

      correct_answer_index: 2,
      correctIndex: 2,
      correct_answer: "31",

      explanation:
        "نطرح 14 من 45: 45 - 14 = 31",

      difficulty: "سهل",
      skill: "الطرح",
    },

    {
      id: 2,
      subject: "رياضيات",
      question_text: "ما ناتج 2 × 6؟",
      question: "ما ناتج 2 × 6؟",

      options: [
        "12",
        "14",
        "8",
        "6",
      ],

      correct_answer_index: 0,
      correctIndex: 0,
      correct_answer: "12",

      explanation:
        "نضرب 2 في 6 فنحصل على 12",

      difficulty: "سهل",
      skill: "الضرب",
    },

    {
      id: 3,
      subject: "علوم",
      question_text: "ما مصدر الضوء والحرارة للأرض؟",
      question: "ما مصدر الضوء والحرارة للأرض؟",

      options: [
        "الشمس",
        "التربة",
        "القمر",
        "السحاب",
      ],

      correct_answer_index: 0,
      correctIndex: 0,
      correct_answer: "الشمس",

      explanation:
        "الشمس مصدر الضوء والحرارة الرئيس للأرض",

      difficulty: "سهل",
      skill: "مصادر الطاقة",
    },
  ],
};
