import React, { useMemo, useState } from "react";
import educationalData from "./data/data.json";
import { tahsiliTest01 } from "./examsData";

const ADMIN_EMAIL = "kmskms653@gmail.com";

const LESSON_TYPES = {
  choice: "اختيار من متعدد",
  matching: "مطابقة",
  ordering: "ترتيب",
  writing: "كتابة",
  reading: "قراءة",
  calculation: "حساب",
};

function createLessonFromSection(stage, section) {
  const shortLessons = [];
  const activities = [];
  const assessmentQuestions = [];

  /*
   * الحروف العربية
   */
  if (Array.isArray(section.items) && section.items.length > 0) {
    const firstItem = section.items[0];

    if (firstItem.char) {
      shortLessons.push({
        id: `${section.subId}-letters`,
        title: "التعرف على الحروف",
        explanation:
          "نتعرف على الحرف وشكله واسمه، ثم نتدرب على نطقه وكتابته بطريقة تدريجية.",
        examples: section.items.map(
          (item) => `${item.char} — ${item.name}`
        ),
      });

      section.items.forEach((item, index) => {
        activities.push({
          id: `${section.subId}-activity-${index + 1}`,
          type: "reading",
          question: `اقرأ الحرف التالي: ${item.char}`,
          correctAnswer: item.name,
          explanation: `الحرف ${item.char} يسمى ${item.name}.`,
        });
      });
    }

    /*
     * قراءة الكلمات
     */
    if (firstItem.word && firstItem.meaning) {
      shortLessons.push({
        id: `${section.subId}-words`,
        title: "قراءة الكلمات وفهم معناها",
        explanation:
          "نقرأ الكلمة بالتشكيل ثم نتعرف على معناها ونربطها بالنطق الصحيح.",
        examples: section.items.map(
          (item) => `${item.word} — ${item.meaning}`
        ),
      });

      section.items.forEach((item, index) => {
        activities.push({
          id: `${section.subId}-activity-${index + 1}`,
          type: "reading",
          question: `ما معنى كلمة «${item.word}»؟`,
          options: [item.meaning, "كلمة أخرى", "لا نعرف معناها"],
          correctAnswer: item.meaning,
          explanation: `معنى «${item.word}» هو: ${item.meaning}.`,
        });
      });
    }

    /*
     * الكتابة
     */
    if (firstItem.steps) {
      shortLessons.push({
        id: `${section.subId}-writing`,
        title: "تكوين الكلمة خطوة بخطوة",
        explanation:
          "نتعلم تكوين الكلمة من حروفها بالترتيب الصحيح.",
        examples: section.items.map(
          (item) => `${item.word}: ${item.steps.join(" ← ")}`
        ),
      });

      section.items.forEach((item, index) => {
        activities.push({
          id: `${section.subId}-activity-${index + 1}`,
          type: "ordering",
          question: `رتب حروف كلمة «${item.word}» بالترتيب الصحيح.`,
          options: item.steps,
          correctAnswer: item.steps,
          explanation: `تتكون كلمة «${item.word}» من: ${item.steps.join(
            "، "
          )}.`,
        });
      });
    }

    /*
     * الأرقام
     */
    if (typeof firstItem.number === "number") {
      shortLessons.push({
        id: `${section.subId}-numbers`,
        title: "التعرف على الأرقام",
        explanation:
          "نتعرف على الرقم واسمه وتمثيله بعدد من العناصر.",
        examples: section.items.map(
          (item) =>
            `${item.number} — ${item.name} — ${item.representation}`
        ),
      });

      section.items.forEach((item, index) => {
        activities.push({
          id: `${section.subId}-activity-${index + 1}`,
          type: "choice",
          question: `ما اسم الرقم ${item.number}؟`,
          options: [
            item.name,
            "اسم مختلف",
            "لا يوجد اسم",
            "رقم آخر",
          ],
          correctAnswer: item.name,
          explanation: `الرقم ${item.number} يسمى ${item.name}.`,
        });
      });
    }
  }

  /*
   * أمثلة العمليات الحسابية
   */
  if (Array.isArray(section.examples)) {
    shortLessons.push({
      id: `${section.subId}-examples`,
      title: section.title,
      explanation: section.description || "شرح مبسط للموضوع.",
      examples: section.examples.map(
        (example) =>
          `${example.operation}: ${example.explanation}`
      ),
    });

    section.examples.forEach((example, index) => {
      const answerMatch = example.operation.match(/=\s*([^=]+)$/);
      const answer = answerMatch ? answerMatch[1].trim() : "";

      if (answer) {
        activities.push({
          id: `${section.subId}-activity-${index + 1}`,
          type: "calculation",
          question: `احسب: ${example.operation.split("=")[0].trim()} = ؟`,
          correctAnswer: answer,
          explanation: example.explanation,
        });
      }
    });
  }

  /*
   * الإنجليزية
   */
  if (section.part1) {
    shortLessons.push({
      id: `${section.subId}-part1`,
      title: section.part1.title,
      explanation: section.part1.description || "",
      examples:
        section.part1.items?.map(
          (item) => `${item.char} — ${item.word}`
        ) || [],
    });

    if (Array.isArray(section.part1.items)) {
      section.part1.items.forEach((item, index) => {
        activities.push({
          id: `${section.subId}-part1-${index + 1}`,
          type: "reading",
          question: `ما الكلمة المرتبطة بالحرف ${item.char}؟`,
          options: [item.word],
          correctAnswer: item.word,
          explanation: `الحرف ${item.char} مرتبط بالكلمة ${item.word}.`,
        });
      });
    }

    if (Array.isArray(section.part1.topics)) {
      shortLessons.push({
        id: `${section.subId}-rules`,
        title: "القواعد الأساسية",
        explanation: section.part1.description || "",
        examples: section.part1.topics.map(
          (topic) => `${topic.rule}: ${topic.example}`
        ),
      });
    }
  }

  if (section.part2) {
    shortLessons.push({
      id: `${section.subId}-part2`,
      title: section.part2.title,
      explanation: section.part2.description || "",
      examples:
        section.part2.vocab?.flatMap((group) =>
          group.words.map((word) => `${group.category}: ${word}`)
        ) || (section.part2.content ? [section.part2.content] : []),
    });
  }

  /*
   * الاختبار المدمج داخل data.json
   */
  if (Array.isArray(section.quizList)) {
    section.quizList.forEach((quiz, index) => {
      const correctOption =
        quiz.options?.[quiz.correctIndex] || "";

      assessmentQuestions.push({
        id: `${section.subId}-assessment-${index + 1}`,
        question: quiz.question,
        type: "multiple-choice",
        options: quiz.options || [],
        correctAnswer: correctOption,
        explanation: quiz.explanation || "",
      });
    });
  }

  /*
   * أهداف الدرس تُولد من طبيعة المحتوى الموجود فعليًا.
   */
  const objectives = [];

  if (section.items?.some((item) => item.char)) {
    objectives.push("التعرف على الحروف ونطقها بشكل صحيح.");
  }

  if (section.items?.some((item) => item.word)) {
    objectives.push("قراءة الكلمات وفهم معانيها.");
  }

  if (section.items?.some((item) => item.steps)) {
    objectives.push("تكوين الكلمات وترتيب حروفها.");
  }

  if (section.items?.some((item) => typeof item.number === "number")) {
    objectives.push("التعرف على الأرقام وأسمائها وتمثيلها.");
  }

  if (section.examples) {
    objectives.push("فهم الفكرة من خلال أمثلة تطبيقية.");
  }

  if (section.part1 || section.part2) {
    objectives.push("اكتساب أساسيات الموضوع والتطبيق عليها.");
  }

  if (objectives.length === 0) {
    objectives.push("فهم المفاهيم الأساسية في هذا القسم.");
    objectives.push("التدرب على المهارات المرتبطة بالدرس.");
    objectives.push("الاستعداد للتقييم في نهاية الدرس.");
  }

  return {
    id: `${stage.stageId}-${section.subId}`,
    title: section.title,
    introduction:
      section.description ||
      "درس تعليمي تفاعلي يساعدك على فهم الموضوع والتدرب عليه.",
    objectives,
    shortLessons:
      shortLessons.length > 0
        ? shortLessons
        : [
            {
              id: `${section.subId}-intro`,
              title: section.title,
              explanation:
                section.description ||
                "مقدمة للموضوع التعليمي.",
              examples: [],
            },
          ],
    activities,
    assessmentQuestions,
    reviewRecommendations: [
      "أعد قراءة شرح الدرس.",
      "راجع الأمثلة وحاول حلها بنفسك.",
      "أعد الأنشطة التي أخطأت فيها.",
      "جرّب التقييم مرة أخرى بعد المراجعة.",
    ],
  };
}

function ProgressBar({ value }) {
  return (
    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
      <div
        className="h-2 bg-blue-600 rounded-full transition-all"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

function Header({ currentUserEmail, isAdmin, onHome, onAdmin }) {
  return (
    <header className="w-full max-w-5xl mb-6 bg-white rounded-2xl shadow-sm border p-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <button
          onClick={onHome}
          className="text-2xl font-black text-slate-800"
        >
          لنتعلم 📚
        </button>

        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={onHome}
            className="px-4 py-2 bg-slate-100 rounded-xl font-bold"
          >
            الرئيسية
          </button>

          {isAdmin && (
            <button
              onClick={onAdmin}
              className="px-4 py-2 bg-yellow-400 rounded-xl font-bold"
            >
              🔒 الإدارة
            </button>
          )}

          <span className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm">
            {currentUserEmail}
          </span>
        </div>
      </div>
    </header>
  );
}

function HomeScreen({
  stages,
  onStage,
  onExamCenter,
}) {
  return (
    <main className="w-full max-w-5xl">
      <section className="bg-white rounded-3xl shadow-sm border p-6 md:p-10 mb-6">
        <div className="text-center">
          <div className="text-5xl mb-4">🎓</div>

          <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
            منصة لنتعلم التعليمية
          </h1>

          <p className="text-slate-600 text-lg leading-8 max-w-2xl mx-auto">
            تعلم خطوة بخطوة من خلال الدروس القصيرة والأنشطة
            والتقييمات والاختبارات.
          </p>

          <button
            onClick={() => {
              document
                .getElementById("educational-stages")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="mt-6 px-7 py-3 bg-blue-600 text-white rounded-xl font-black"
          >
            ابدأ التعلم
          </button>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4 mb-8">
        <InfoCard icon="📖" title="دروس قصيرة" text="تعلم المفاهيم بطريقة مبسطة." />
        <InfoCard icon="✏️" title="أنشطة تفاعلية" text="طبّق ما تعلمته مباشرة." />
        <InfoCard icon="📊" title="تقييم ونتيجة" text="اختبر فهمك وتعرف على أخطائك." />
      </section>

      <section id="educational-stages">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black text-slate-800">
            المراحل التعليمية
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {stages.map((stage) => (
            <button
              key={stage.stageId}
              onClick={() => onStage(stage)}
              className="text-right bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition"
            >
              <div className="text-3xl mb-3">
                {getStageIcon(stage.stageId)}
              </div>

              <h3 className="text-xl font-black text-slate-800 mb-2">
                {stage.title}
              </h3>

              <p className="text-sm text-slate-500">
                {stage.subSections?.length || 0} أقسام تعليمية
              </p>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8 bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-indigo-900">
              القدرات والتحصيلي
            </h2>
            <p className="text-indigo-700 mt-1">
              انتقل إلى الاختبار الموجود حاليًا في بيانات المشروع.
            </p>
          </div>

          <button
            onClick={onExamCenter}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black"
          >
            مركز الاختبارات
          </button>
        </div>
      </section>
    </main>
  );
}

function InfoCard({ icon, title, text }) {
  return (
    <div className="bg-white border rounded-2xl p-5">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-black text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 mt-1">{text}</p>
    </div>
  );
}

function StageScreen({ stage, onBack, onLesson }) {
  const lessons = useMemo(
    () =>
      (stage.subSections || [])
        .filter((section) => section.subId !== "tests")
        .map((section) => createLessonFromSection(stage, section)),
    [stage]
  );

  const testSections = (stage.subSections || []).filter(
    (section) => section.subId === "tests"
  );

  return (
    <main className="w-full max-w-5xl">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-white border rounded-xl font-bold"
      >
        ← العودة للرئيسية
      </button>

      <section className="bg-white border rounded-3xl shadow-sm p-6 md:p-8 mb-6">
        <div className="text-4xl mb-3">
          {getStageIcon(stage.stageId)}
        </div>

        <h1 className="text-3xl font-black text-slate-800">
          {stage.title}
        </h1>

        <p className="text-slate-500 mt-2">
          اختر الدرس الذي تريد البدء به.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        {lessons.map((lesson, index) => (
          <button
            key={lesson.id}
            onClick={() => onLesson(lesson)}
            className="text-right bg-white border rounded-2xl p-5 shadow-sm hover:border-blue-400 hover:shadow-md transition"
          >
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-black mb-3">
              الدرس {index + 1}
            </span>

            <h2 className="text-xl font-black text-slate-800">
              {lesson.title}
            </h2>

            <p className="text-sm text-slate-500 mt-2 line-clamp-2">
              {lesson.introduction}
            </p>

            <div className="mt-4 text-sm text-blue-600 font-bold">
              فتح الدرس ←
            </div>
          </button>
        ))}
      </div>

      {testSections.length > 0 && (
        <section className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-5">
          <h2 className="font-black text-green-900 mb-2">
            📝 اختبار المرحلة
          </h2>

          {testSections.map((section) => (
            <div key={section.subId}>
              <p className="text-sm text-green-800">
                {section.description || "اختبار المرحلة متاح للتدريب."}
              </p>

              {section.quizList?.map((quiz, index) => (
                <div
                  key={index}
                  className="mt-4 bg-white rounded-xl border p-4"
                >
                  <p className="font-bold text-slate-800">
                    {quiz.question}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    سؤال تقييم موجود ضمن بيانات المرحلة.
                  </p>
                </div>
              ))}
            </div>
          ))}
        </section>
      )}
    </main>
  );
}

function LessonScreen({
  lesson,
  onBack,
  onAssessment,
}) {
  const [activityAnswers, setActivityAnswers] = useState({});
  const [writingValues, setWritingValues] = useState({});

  const completedActivities = lesson.activities.filter((activity) => {
    return activityAnswers[activity.id] !== undefined;
  }).length;

  const progress =
    lesson.activities.length === 0
      ? 0
      : Math.round(
          (completedActivities / lesson.activities.length) * 100
        );

  function checkActivity(activity, answer) {
    setActivityAnswers((prev) => ({
      ...prev,
      [activity.id]: answer,
    }));
  }

  return (
    <main className="w-full max-w-4xl">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-white border rounded-xl font-bold"
      >
        ← العودة للقسم
      </button>

      <section className="bg-white border rounded-3xl shadow-sm p-6 md:p-8">
        <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-black">
          درس تعليمي
        </span>

        <h1 className="text-3xl font-black text-slate-800 mt-3">
          {lesson.title}
        </h1>

        <div className="mt-5 bg-slate-50 rounded-2xl p-5">
          <h2 className="font-black text-lg mb-2">مقدمة الدرس</h2>
          <p className="text-slate-600 leading-8">
            {lesson.introduction}
          </p>
        </div>

        <div className="mt-5">
          <h2 className="font-black text-lg mb-3">
            🎯 أهداف التعلم
          </h2>

          <ul className="space-y-2">
            {lesson.objectives.map((objective, index) => (
              <li
                key={index}
                className="bg-blue-50 text-blue-900 rounded-xl p-3"
              >
                ✓ {objective}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-black text-slate-800 mb-4">
            📚 الدروس القصيرة
          </h2>

          <div className="space-y-4">
            {lesson.shortLessons.map((shortLesson) => (
              <article
                key={shortLesson.id}
                className="border rounded-2xl p-5"
              >
                <h3 className="text-xl font-black text-slate-800">
                  {shortLesson.title}
                </h3>

                <p className="text-slate-600 leading-8 mt-2">
                  {shortLesson.explanation}
                </p>

                {shortLesson.examples.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-black mb-2">أمثلة</h4>

                    <div className="grid gap-2">
                      {shortLesson.examples.map((example, index) => (
                        <div
                          key={index}
                          className="bg-slate-50 border rounded-xl p-3"
                        >
                          {example}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>

        {lesson.activities.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-black">
                ✏️ أنشطة تفاعلية
              </h2>

              <span className="text-sm font-bold text-slate-500">
                {progress}%
              </span>
            </div>

            <ProgressBar value={progress} />

            <div className="space-y-5 mt-5">
              {lesson.activities.map((activity, index) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  index={index}
                  answer={activityAnswers[activity.id]}
                  writingValue={writingValues[activity.id] || ""}
                  onAnswer={(answer) =>
                    checkActivity(activity, answer)
                  }
                  onWriting={(value) =>
                    setWritingValues((prev) => ({
                      ...prev,
                      [activity.id]: value,
                    }))
                  }
                />
              ))}
            </div>
          </div>
        )}

        {lesson.assessmentQuestions.length > 0 && (
          <section className="mt-8 bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
            <h2 className="text-2xl font-black text-indigo-900">
              📝 تقييم الدرس
            </h2>

            <p className="text-indigo-700 mt-2 mb-4">
              بعد مراجعة الدرس والأنشطة، ابدأ التقييم.
            </p>

            <button
              onClick={onAssessment}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black"
            >
              ابدأ التقييم
            </button>
          </section>
        )}

        <section className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <h2 className="font-black text-amber-900 mb-3">
            🔄 توصيات المراجعة
          </h2>

          <ul className="space-y-2 text-amber-800">
            {lesson.reviewRecommendations.map((recommendation, index) => (
              <li key={index}>• {recommendation}</li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  );
}

function ActivityCard({
  activity,
  index,
  answer,
  writingValue,
  onAnswer,
  onWriting,
}) {
  const isAnswered = answer !== undefined;

  const correct = isAnswered
    ? Array.isArray(activity.correctAnswer)
      ? JSON.stringify(answer) === JSON.stringify(activity.correctAnswer)
      : String(answer).trim() ===
        String(activity.correctAnswer).trim()
    : false;

  return (
    <div className="border rounded-2xl p-5 bg-white">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="font-black">
          نشاط {index + 1}
        </h3>

        <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">
          {LESSON_TYPES[activity.type] || activity.type}
        </span>
      </div>

      <p className="font-bold text-slate-800 leading-7">
        {activity.question}
      </p>

      {activity.type === "writing" && (
        <div className="mt-4">
          <input
            value={writingValue}
            onChange={(e) => onWriting(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onAnswer(writingValue);
              }
            }}
            placeholder="اكتب إجابتك هنا"
            className="w-full border rounded-xl p-3 text-right"
          />

          <button
            onClick={() => onAnswer(writingValue)}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold"
          >
            تحقق
          </button>
        </div>
      )}

      {activity.options && activity.options.length > 0 && (
        <div className="grid gap-2 mt-4">
          {activity.options.map((option, optionIndex) => (
            <button
              key={optionIndex}
              disabled={isAnswered}
              onClick={() => {
                if (activity.type === "ordering") {
                  onAnswer([option]);
                } else {
                  onAnswer(option);
                }
              }}
              className={`text-right p-3 rounded-xl border transition ${
                isAnswered &&
                String(answer) === String(option)
                  ? "bg-blue-100 border-blue-400"
                  : "bg-slate-50 hover:bg-slate-100"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {isAnswered && (
        <div
          className={`mt-4 rounded-xl p-4 ${
            correct
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          <p className="font-black">
            {correct ? "✓ إجابة صحيحة" : "✗ تحتاج إلى مراجعة"}
          </p>

          {activity.explanation && (
            <p className="mt-1 text-sm">
              {activity.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function AssessmentScreen({ lesson, onBack, onFinish }) {
  const questions = lesson.assessmentQuestions;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = questions[currentIndex];

  function selectAnswer(answer) {
    if (submitted) return;

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
  }

  function finish() {
    setSubmitted(true);

    let score = 0;

    questions.forEach((question) => {
      if (
        String(answers[question.id]).trim() ===
        String(question.correctAnswer).trim()
      ) {
        score++;
      }
    });

    onFinish(score, questions.length);
  }

  return (
    <main className="w-full max-w-3xl">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-white border rounded-xl font-bold"
      >
        ← العودة للدرس
      </button>

      <section className="bg-white border rounded-3xl shadow-sm p-6 md:p-8">
        <div className="flex justify-between items-center mb-5">
          <span className="font-black text-slate-700">
            تقييم: {lesson.title}
          </span>

          <span className="text-sm text-slate-500">
            السؤال {currentIndex + 1} من {questions.length}
          </span>
        </div>

        <ProgressBar
          value={((currentIndex + 1) / questions.length) * 100}
        />

        <h1 className="text-xl md:text-2xl font-black text-slate-800 mt-6 leading-9">
          {currentQuestion.question}
        </h1>

        <div className="grid gap-3 mt-6">
          {(currentQuestion.options || []).map((option, index) => {
            const selected =
              answers[currentQuestion.id] === option;

            return (
              <button
                key={index}
                disabled={submitted}
                onClick={() => selectAnswer(option)}
                className={`text-right p-4 rounded-xl border font-bold ${
                  selected
                    ? "bg-blue-100 border-blue-500"
                    : "bg-slate-50 hover:bg-slate-100"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-5 bg-slate-50 border rounded-xl p-4">
            <p className="font-black">
              الإجابة الصحيحة: {currentQuestion.correctAnswer}
            </p>
            <p className="text-sm text-slate-600 mt-1">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        <div className="flex justify-between gap-3 mt-8">
          <button
            disabled={currentIndex === 0}
            onClick={() =>
              setCurrentIndex((prev) => Math.max(0, prev - 1))
            }
            className="px-5 py-3 bg-slate-200 rounded-xl font-bold disabled:opacity-40"
          >
            السابق
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              disabled={!answers[currentQuestion.id]}
              onClick={() =>
                setCurrentIndex((prev) =>
                  Math.min(questions.length - 1, prev + 1)
                )
              }
              className="px-5 py-3 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-40"
            >
              التالي
            </button>
          ) : (
            <button
              disabled={!answers[currentQuestion.id] || submitted}
              onClick={finish}
              className="px-5 py-3 bg-green-600 text-white rounded-xl font-bold disabled:opacity-40"
            >
              إنهاء التقييم
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

function ExamCenter({ onBack, onStartExam }) {
  return (
    <main className="w-full max-w-4xl">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-white border rounded-xl font-bold"
      >
        ← العودة للرئيسية
      </button>

      <section className="bg-white border rounded-3xl p-6 md:p-8">
        <h1 className="text-3xl font-black text-slate-800">
          مركز الاختبارات
        </h1>

        <p className="text-slate-500 mt-2">
          الاختبارات المتوفرة فعليًا في بيانات المشروع حاليًا.
        </p>

        <div className="mt-6 border rounded-2xl p-5 bg-slate-50">
          <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-black">
            {tahsiliTest01.category}
          </span>

          <h2 className="text-xl font-black text-slate-800 mt-3">
            {tahsiliTest01.title}
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            عدد الأسئلة: {tahsiliTest01.questions.length}
          </p>

          <button
            onClick={() => onStartExam(tahsiliTest01)}
            className="mt-5 px-6 py-3 bg-indigo-600 text-white rounded-xl font-black"
          >
            ابدأ الاختبار
          </button>
        </div>

        <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          ملاحظة: ملف `examsData.js` الذي تم فحصه يحتوي حاليًا على
          اختبار تحصيلي واحد فقط. وصف 30 اختبارًا في `data.json`
          لا يعني أن ملفات الاختبارات الثلاثين موجودة فعليًا.
        </div>
      </section>
    </main>
  );
}

function ExamScreen({ exam, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = exam.questions[currentIndex];

  function handleAnswer(index) {
    if (answered) return;

    setSelectedIndex(index);
    setAnswered(true);

    if (index === question.correct_answer_index) {
      setScore((prev) => prev + 1);
    }
  }

  function nextQuestion() {
    if (currentIndex < exam.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedIndex(null);
      setAnswered(false);
    } else {
      setFinished(true);
    }
  }

  if (finished) {
    const percentage = Math.round(
      (score / exam.questions.length) * 100
    );

    return (
      <main className="w-full max-w-3xl">
        <section className="bg-white border rounded-3xl shadow-sm p-8 text-center">
          <div className="text-6xl mb-4">🏆</div>

          <h1 className="text-3xl font-black text-slate-800">
            انتهى الاختبار
          </h1>

          <p className="text-slate-500 mt-2">
            {exam.title}
          </p>

          <div className="my-8 bg-slate-50 rounded-2xl p-6">
            <div className="text-5xl font-black text-blue-600">
              {score}/{exam.questions.length}
            </div>

            <p className="font-bold text-slate-600 mt-2">
              النسبة: {percentage}%
            </p>
          </div>

          <button
            onClick={onBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black"
          >
            العودة إلى مركز الاختبارات
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="w-full max-w-3xl">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-white border rounded-xl font-bold"
      >
        ← العودة للاختبارات
      </button>

      <section className="bg-white border rounded-3xl shadow-sm p-6 md:p-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-black text-slate-800">
            {exam.title}
          </h1>

          <span className="text-sm text-slate-500">
            السؤال {currentIndex + 1} من {exam.questions.length}
          </span>
        </div>

        <ProgressBar
          value={((currentIndex + 1) / exam.questions.length) * 100}
        />

        <div className="mt-7">
          <span className="text-xs bg-slate-100 px-3 py-1 rounded-full">
            {question.subject}
          </span>

          <h2 className="text-xl md:text-2xl font-black text-slate-800 leading-9 mt-4">
            {question.question_text}
          </h2>
        </div>

        <div className="grid gap-3 mt-6">
          {question.options.map((option, index) => {
            let classes =
              "text-right p-4 rounded-xl border font-bold transition ";

            if (!answered) {
              classes +=
                "bg-slate-50 hover:bg-blue-50 hover:border-blue-300";
            } else if (index === question.correct_answer_index) {
              classes += "bg-green-100 border-green-500 text-green-900";
            } else if (index === selectedIndex) {
              classes += "bg-red-100 border-red-500 text-red-900";
            } else {
              classes += "bg-slate-50 opacity-70";
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={answered}
                className={classes}
              >
                <span className="ml-2">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {answered && (
          <div
            className={`mt-6 rounded-2xl p-5 ${
              selectedIndex === question.correct_answer_index
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <h3 className="font-black">
              {selectedIndex === question.correct_answer_index
                ? "✓ إجابة صحيحة"
                : "✗ إجابة غير صحيحة"}
            </h3>

            <p className="text-sm mt-2">
              <strong>الإجابة الصحيحة:</strong>{" "}
              {question.correct_answer}
            </p>

            <p className="text-sm text-slate-600 mt-2 leading-7">
              <strong>الشرح:</strong>{" "}
              {question.explanation}
            </p>

            <button
              onClick={nextQuestion}
              className="mt-5 px-6 py-3 bg-blue-600 text-white rounded-xl font-black"
            >
              {currentIndex === exam.questions.length - 1
                ? "عرض النتيجة"
                : "السؤال التالي"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

function AdminScreen({
  requests,
  onApprove,
  onReject,
  onBack,
}) {
  return (
    <main className="w-full max-w-4xl">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-white border rounded-xl font-bold"
      >
        ← العودة
      </button>

      <section className="bg-white border-2 border-yellow-400 rounded-3xl p-6">
        <h1 className="text-2xl font-black text-slate-800">
          لوحة تحكم المشرف
        </h1>

        <p className="text-sm text-slate-500 mt-2">
          هذه النسخة تعرض طلبات الاشتراك المخزنة محليًا في المتصفح.
        </p>

        <div className="space-y-4 mt-6">
          {requests.length === 0 && (
            <div className="bg-slate-50 border rounded-xl p-5 text-center text-slate-500">
              لا توجد طلبات اشتراك.
            </div>
          )}

          {requests.map((request) => (
            <div
              key={request.id}
              className="border rounded-2xl p-5 bg-slate-50"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h2 className="font-black text-lg">
                    {request.name}
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    {request.email}
                  </p>

                  <p className="text-sm mt-2">
                    الإيصال:{" "}
                    <span className="text-blue-600">
                      {request.receipt}
                    </span>
                  </p>

                  <p className="text-sm mt-2">
                    الحالة:{" "}
                    <strong>
                      {request.status === "approved"
                        ? "مقبول"
                        : request.status === "rejected"
                        ? "مرفوض"
                        : "قيد المراجعة"}
                    </strong>
                  </p>
                </div>

                {request.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onApprove(request.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-xl font-bold"
                    >
                      ✓ قبول
                    </button>

                    <button
                      onClick={() => onReject(request.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold"
                    >
                      ✕ رفض
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 leading-7">
          تنبيه تقني: بما أن Supabase في وضعك الحالي لا يسمح
          بعمليات INSERT/UPDATE/DELETE، فإن الموافقة هنا محلية
          في متصفح المشرف وليست نظام اشتراكات مركزيًا للمستخدمين.
          سنعالج هذه النقطة لاحقًا بخدمة تخزين مناسبة عندما نجهز
          نظام الاشتراكات الفعلي.
        </div>
      </section>
    </main>
  );
}

function getStageIcon(stageId) {
  const icons = {
    arabic_foundation: "🔤",
    math_foundation: "🔢",
    english_learning: "🇬🇧",
    qudrat_tahsili: "📝",
  };

  return icons[stageId] || "📚";
}

export default function App() {
  const [currentUserEmail, setCurrentUserEmail] = useState(
    localStorage.getItem("userEmail") || "user@example.com"
  );

  const [view, setView] = useState("home");
  const [selectedStage, setSelectedStage] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [assessmentResult, setAssessmentResult] = useState(null);

  const [requests, setRequests] = useState(() => {
    try {
      const saved = localStorage.getItem("lntalem_subscription_requests");

      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // تجاهل البيانات المحلية غير الصالحة
    }

    return [
      {
        id: 1,
        name: "عمر أحمد",
        email: "omar@example.com",
        receipt: "إيصال_دفع_1.jpg",
        status: "pending",
      },
    ];
  });

  const isAdmin = currentUserEmail === ADMIN_EMAIL;

  const stages = educationalData?.educationalStages || [];

  function saveRequests(nextRequests) {
    setRequests(nextRequests);
    localStorage.setItem(
      "lntalem_subscription_requests",
      JSON.stringify(nextRequests)
    );
  }

  function changeEmail() {
    const email = window.prompt(
      "أدخل بريدك الإلكتروني:",
      currentUserEmail
    );

    if (!email) return;

    const normalizedEmail = email.trim().toLowerCase();

    localStorage.setItem("userEmail", normalizedEmail);
    setCurrentUserEmail(normalizedEmail);
  }

  function requestSubscription() {
    const name =
      window.prompt("أدخل اسمك:", "متعلم جديد") || "متعلم جديد";

    const receipt =
      window.prompt(
        "اكتب اسم/مرجع إيصال الدفع:",
        "receipt.jpg"
      ) || "غير مرفق";

    const newRequest = {
      id: Date.now(),
      name,
      email: currentUserEmail,
      receipt,
      status: "pending",
    };

    saveRequests([...requests, newRequest]);

    window.alert(
      "تم تسجيل طلب الاشتراك محليًا. يحتاج الطلب إلى مراجعة المشرف."
    );
  }

  function approveRequest(id) {
    saveRequests(
      requests.map((request) =>
        request.id === id
          ? { ...request, status: "approved" }
          : request
      )
    );

    window.alert("تم قبول الطلب.");
  }

  function rejectRequest(id) {
    saveRequests(
      requests.map((request) =>
        request.id === id
          ? { ...request, status: "rejected" }
          : request
      )
    );

    window.alert("تم رفض الطلب.");
  }

  function openStage(stage) {
    setSelectedStage(stage);
    setView("stage");
  }

  function openLesson(lesson) {
    setSelectedLesson(lesson);
    setAssessmentResult(null);
    setView("lesson");
  }

  function openAssessment() {
    setAssessmentResult(null);
    setView("assessment");
  }

  function finishAssessment(score, total) {
    setAssessmentResult({ score, total });
    setView("assessment-result");
  }

  function goHome() {
    setView("home");
    setSelectedStage(null);
    setSelectedLesson(null);
    setSelectedExam(null);
    setAssessmentResult(null);
  }

  function goBackToStage() {
    setView("stage");
    setSelectedLesson(null);
    setAssessmentResult(null);
  }

  function startExam(exam) {
    setSelectedExam(exam);
    setView("exam");
  }

  const page = (() => {
    if (view === "home") {
      return (
        <HomeScreen
          stages={stages}
          onStage={openStage}
          onExamCenter={() => setView("exam-center")}
        />
      );
    }

    if (view === "stage" && selectedStage) {
      return (
        <StageScreen
          stage={selectedStage}
          onBack={goHome}
          onLesson={openLesson}
        />
      );
    }

    if (view === "lesson" && selectedLesson) {
      return (
        <LessonScreen
          lesson={selectedLesson}
          onBack={goBackToStage}
          onAssessment={openAssessment}
        />
      );
    }

    if (view === "assessment" && selectedLesson) {
      return (
        <AssessmentScreen
          lesson={selectedLesson}
          onBack={goBackToStage}
          onFinish={finishAssessment}
        />
      );
    }

    if (
      view === "assessment-result" &&
      selectedLesson &&
      assessmentResult
    ) {
      const percentage = Math.round(
        (assessmentResult.score / assessmentResult.total) * 100
      );

      return (
        <main className="w-full max-w-3xl">
          <section className="bg-white border rounded-3xl p-8 text-center">
            <div className="text-6xl mb-4">
              {percentage >= 80 ? "🎉" : "📚"}
            </div>

            <h1 className="text-3xl font-black">
              نتيجة التقييم
            </h1>

            <p className="text-slate-500 mt-2">
              {selectedLesson.title}
            </p>

            <div className="my-8 bg-slate-50 rounded-2xl p-6">
              <div className="text-5xl font-black text-blue-600">
                {assessmentResult.score}/{assessmentResult.total}
              </div>

              <p className="font-bold text-slate-600 mt-2">
                النسبة: {percentage}%
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setView("assessment")}
                className="px-5 py-3 bg-blue-600 text-white rounded-xl font-bold"
              >
                إعادة التقييم
              </button>

              <button
                onClick={() => setView("lesson")}
                className="px-5 py-3 bg-slate-200 rounded-xl font-bold"
              >
                العودة للدرس
              </button>
            </div>
          </section>
        </main>
      );
    }

    if (view === "exam-center") {
      return (
        <ExamCenter
          onBack={goHome}
          onStartExam={startExam}
        />
      );
    }

    if (view === "exam" && selectedExam) {
      return (
        <ExamScreen
          exam={selectedExam}
          onBack={() => setView("exam-center")}
        />
      );
    }

    if (view === "admin" && isAdmin) {
      return (
        <AdminScreen
          requests={requests}
          onApprove={approveRequest}
          onReject={rejectRequest}
          onBack={goHome}
        />
      );
    }

    return (
      <main className="w-full max-w-xl bg-white rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-black">
          الصفحة غير موجودة
        </h1>

        <button
          onClick={goHome}
          className="mt-5 px-5 py-3 bg-blue-600 text-white rounded-xl font-bold"
        >
          العودة للرئيسية
        </button>
      </main>
    );
  })();

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-100 p-4 md:p-6"
    >
      <Header
        currentUserEmail={currentUserEmail}
        isAdmin={isAdmin}
        onHome={goHome}
        onAdmin={() => setView("admin")}
      />

      {view === "home" && (
        <div className="w-full max-w-5xl mx-auto mb-4 flex justify-end">
          <button
            onClick={changeEmail}
            className="px-4 py-2 bg-white border rounded-xl text-sm font-bold"
          >
            تغيير البريد الإلكتروني
          </button>
        </div>
      )}

      <div className="w-full max-w-5xl mx-auto">
        {page}
      </div>

      {view === "stage" && selectedStage && !isAdmin && (
        <div className="w-full max-w-5xl mx-auto mt-6">
          <div className="bg-white border rounded-2xl p-5">
            <h3 className="font-black text-slate-800">
              🔐 حالة الاشتراك
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              المحتوى التعليمي في هذه النسخة يعمل كواجهة تعليمية.
              طلبات الاشتراك الحالية تجريبية ومحلية.
            </p>

            <button
              onClick={requestSubscription}
              className="mt-4 px-5 py-3 bg-amber-500 text-white rounded-xl font-black"
            >
              إرسال طلب اشتراك
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

