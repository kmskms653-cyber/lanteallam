// src/examsData.js
export const tahsiliTest01 = {
  "exam_id": "tahsili_test_01",
  "title": "الاختبار الأول: أساسيات الأعداد واللغة",
  "category": "اختبارات التحصيلي",
  "questions": [
    {
      "id": 1,
      "subject": "رياضيات",
      "question_text": "ما ناتج 45 - 14؟",
      "options": [
        "33",
        "59",
        "31",
        "29"
      ],
      "correct_answer_index": 2,
      "correct_answer": "31",
      "explanation": "نطرح 14 من 45: 45 - 14 = 31"
    },
    {
      "id": 2,
      "subject": "رياضيات",
      "question_text": "ما ناتج 2 × 6؟",
      "options": [
        "12",
        "14",
        "8",
        "6"
      ],
      "correct_answer_index": 0,
      "correct_answer": "12",
      "explanation": "نضرب 2 في 6 فنحصل على 12"
    },
    {
      "id": 3,
      "subject": "علوم",
      "question_text": "ما مصدر الضوء والحرارة للأرض؟",
      "options": [
        "الشمس",
        "التربة",
        "القمر",
        "السحاب"
      ],
      "correct_answer_index": 0,
      "correct_answer": "الشمس",
      "explanation": "الشمس مصدر الضوء والحرارة الرئيس للأرض"
    }
  ]
};
import fs from 'fs';
import path from 'path';

// دالة لجلب تفاصيل الاختبار بناءً على معرفه
async function getExamData(examId: string) {
  const filePath = path.join(process.cwd(), 'src/data/exams', `${examId}.json`);
  const fileData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileData);
}
{
  "testId": "test_01",
  "testTitle": "اختبار التحصيلي 1",
  "subject": "عام",
  "questions": [
    {
      "id": 1,
      "question": "نص السؤال هنا...",
      "options": [
        "الخيار الأول",
        "الخيار الثاني",
        "الخيار الثالث",
        "الخيار الرابع"
      ],
      "correctIndex": 0,
      "explanation": "شرح الإجابة الصحيحة ولماذا كانت بقية الخيارات خاطئة...",
      "difficulty": "متوسط",
      "skill": "المهارة المستهدفة"
    }
  ]
}
// نموذج قائمة اختبارات القدرات والتحصيلي المعمارية
class TestListScreen extends StatelessWidget {
  final List<Map<String, dynamic>> availableTests = [
    {"testId": "t1", "title": "اختبار تحصيلي (1) - عام", "questionsCount": 30},
    {"testId": "t2", "title": "اختبار قدرات (1) - كمي", "questionsCount": 25},
    {"testId": "t3", "title": "اختبار قدرات (2) - لفظي", "questionsCount": 25},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('اختبارات القدرات والتحصيلي')),
      body: ListView.builder(
        itemCount: availableTests.length,
        itemBuilder: (context, index) {
          final test = availableTests[index];
          return Card(
            margin: EdgeInsets.all(8),
            child: ListTile(
              title: Text(test['title']),
              subtitle: Text('عدد الأسئلة: ${test['questionsCount']}'),
              trailing: ElevatedButton(
                onPressed: () {
                  // بدء الاختبار وتمرير بيانات الاختبار المحدد
                },
                child: Text('ابدأ الاختبار'),
              ),
            ),
          );
        },
      ),
    );
  }
}
