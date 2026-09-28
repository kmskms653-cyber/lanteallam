import React, { useMemo, useState } from "react";
import educationalData from "./data/data.json";
import {
  tahsiliTest01,
  tahsiliExams,
  getExamData,
} from "./examsData";

const ADMIN_EMAIL = "kmskms653@gmail.com";

const LESSON_TYPES = {
  choice: "اختيار من متعدد",
  matching: "مطابقة",
  ordering: "ترتيب",
  writing: "كتابة",
  reading: "قراءة",
  calculation: "حساب",
};

function normalizeAnswer(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim().toLowerCase())
      .join("|");
  }

  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function answersAreEqual(userAnswer, correctAnswer) {
  if (Array.isArray(correctAnswer)) {
    if (!Array.isArray(userAnswer)) return false;

    if (userAnswer.length !== correctAnswer.length) {
      return false;
    }

    return userAnswer.every(
      (answer, index) =>
        normalizeAnswer(answer) ===
        normalizeAnswer(correctAnswer[index])
    );
  }

  return (
    normalizeAnswer(userAnswer) ===
    normalizeAnswer(correctAnswer)
  );
}

function createLessonFromSection(stage, section) {
  const activities = [];
  const shortLessons = [];

  /*
   * الحروف / الكلمات / الأرقام
   */
  if (Array.isArray(section.items)) {
    section.items.forEach((item, index) => {
      if (item.char) {
        shortLessons.push({
          id: `${section.subId}-lesson-${index + 1}`,
          title: `الحرف ${item.char}`,
          explanation: `نتعلم نطق وكتابة حرف ${item.char} (${item.name || ""}).`,
          examples: [
            item.name
              ? `${item.char} = ${item.name}`
              : item.char,
          ],
        });

        activities.push({
          id: `${section.subId}-activity-${index + 1}`,
          type: "reading",
          question: `اقرأ الحرف التالي: ${item.char}`,
          correctAnswer: item.char,
          explanation: item.name
            ? `هذا الحرف هو ${item.name}.`
            : `الحرف المطلوب هو ${item.char}.`,
        });

        return;
      }

      if (item.word) {
        shortLessons.push({
          id: `${section.subId}-lesson-${index + 1}`,
          title: `كلمة: ${item.word}`,
          explanation:
            item.meaning ||
            `نتعلم قراءة وكتابة كلمة ${item.word}.`,
          examples: [item.word],
        });

        activities.push({
          id: `${section.subId}-activity-${index + 1}`,
          type: "reading",
          question: `اقرأ الكلمة التالية: ${item.word}`,
          correctAnswer: item.word,
          explanation:
            item.meaning ||
            `الكلمة هي: ${item.word}.`,
        });

        if (Array.isArray(item.steps)) {
          activities.push({
            id: `${section.subId}-writing-${index + 1}`,
            type: "writing",
            question: `اكتب الكلمة التالية: ${item.word}`,
            correctAnswer: item.word,
            explanation: `تتكون الكلمة من: ${item.steps.join(" - ")}`,
          });
        }

        return;
      }

      if (typeof item.number === "number") {
        shortLessons.push({
          id: `${section.subId}-lesson-${index + 1}`,
          title: `الرقم ${item.number}`,
          explanation:
            item.name
              ? `الرقم ${item.number} يسمى ${item.name}.`
              : `نتعلم الرقم ${item.number}.`,
          examples: [
            item.representation ||
              String(item.number),
          ],
        });

        activities.push({
          id: `${section.subId}-activity-${index + 1}`,
          type: "choice",
          question: `ما الرقم الذي أمامك؟ ${item.representation || ""}`,
          options: [
            String(item.number),
            String(item.number + 1),
            String(Math.max(0, item.number - 1)),
          ],
          correctAnswer: String(item.number),
          explanation: `الإجابة الصحيحة هي ${item.number}.`,
        });
      }
    });
  }

  /*
   * الأمثلة الحسابية
   */
  if (Array.isArray(section.examples)) {
    section.examples.forEach((example, index) => {
      shortLessons.push({
        id: `${section.subId}-example-${index + 1}`,
        title: example.operation,
        explanation:
          example.explanation ||
          "تطبيق عملي على المهارة.",
        examples: [example.operation],
      });

      activities.push({
        id: `${section.subId}-calculation-${index + 1}`,
        type: "calculation",
        question: `حل العملية التالية: ${example.operation}`,
        correctAnswer: example.operation,
        explanation:
          example.explanation ||
          "راجع خطوات الحل للوصول إلى النتيجة الصحيحة.",
      });
    });
  }

  /*
   * الإنجليزية
   */
  if (section.part1) {
    if (section.part1.title) {
      shortLessons.push({
        id: `${section.subId}-part1`,
        title: section.part1.title,
        explanation:
          section.part1.description ||
          "شرح مبسط للمهارة.",
        examples: [],
      });
    }

    if (Array.isArray(section.part1.items)) {
      section.part1.items.forEach((item, index) => {
        if (!item.char) return;

        activities.push({
          id: `${section.subId}-english-${index + 1}`,
          type: "reading",
          question: `اقرأ الحرف التالي: ${item.char}`,
          correctAnswer: item.char,
          explanation: item.word
            ? `الحرف ${item.char}، ومن أمثلته كلمة ${item.word}.`
            : `الحرف هو ${item.char}.`,
        });
      });
    }
  }

  if (section.part2) {
    if (section.part2.title) {
      shortLessons.push({
        id: `${section.subId}-part2`,
        title: section.part2.title,
        explanation:
          section.part2.description ||
          "شرح مبسط للمهارة.",
        examples: [],
      });
    }

    if (Array.isArray(section.part2.topics)) {
      section.part2.topics.forEach((topic, index) => {
        shortLessons.push({
          id: `${section.subId}-topic-${index + 1}`,
          title: topic.rule,
          explanation:
            topic.example ||
            "قاعدة أساسية في اللغة الإنجليزية.",
          examples: [
            topic.example || "",
          ],
        });
      });
    }

    if (Array.isArray(section.part2.vocab)) {
      section.part2.vocab.forEach((category, index) => {
        shortLessons.push({
          id: `${section.subId}-vocab-${index + 1}`,
          title: category.category,
          explanation:
            "مجموعة من الكلمات الإنجليزية الشائعة.",
          examples: Array.isArray(category.words)
            ? category.words
            : [],
        });
      });
    }

    if (section.part2.content) {
      shortLessons.push({
        id: `${section.subId}-content`,
        title: "نص تدريبي",
        explanation: section.part2.content,
        examples: [],
      });
    }
  }

  /*
   * الاختبارات الموجودة داخل data.json
   */
  if (Array.isArray(section.quizList)) {
    section.quizList.forEach((quiz, index) => {
      let type = "multiple-choice";

      if (
        quiz.type === "true-false" ||
        quiz.type === "true_false"
      ) {
        type = "true-false";
      }

      if (
        quiz.type === "short-answer" ||
        quiz.type === "short_answer"
      ) {
        type = "short-answer";
      }

      const correctAnswer =
        quiz.correctAnswer ??
        quiz.correct_answer ??
        (
          typeof quiz.correctIndex === "number"
            ? quiz.options?.[quiz.correctIndex]
            : ""
        );

      activities.push({
        id: `${section.subId}-quiz-activity-${index + 1}`,
        type:
          type === "multiple-choice"
            ? "choice"
            : "reading",
        question: quiz.question,
        options: quiz.options || [],
        correctAnswer,
        explanation:
          quiz.explanation ||
          "راجع الإجابة والشرح.",
      });
    });
  }

  /*
   * الأهداف التعليمية
   */
  const objectives = [
    `فهم أساسيات ${section.title}.`,
    "تطبيق المهارة من خلال أنشطة تفاعلية.",
    "التأكد من فهم الدرس من خلال أسئلة التقييم.",
  ];

  if (activities.length === 0) {
    activities.push({
      id: `${section.subId}-info`,
      type: "reading",
      question:
        section.description ||
        `تعلم ${section.title}.`,
      correctAnswer:
        section.description ||
        section.title,
      explanation:
        "هذا القسم يحتوي على المحتوى التعليمي الخاص بهذه المهارة.",
    });
  }

  return {
    id: `${stage.stageId}-${section.subId}`,
    title: section.title,
    introduction:
      section.description ||
      `درس تعليمي ضمن مرحلة ${stage.title}.`,
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
                "شرح تعليمي مبسط.",
              examples: [],
            },
          ],
    activities,
    assessmentQuestions:
      Array.isArray(section.quizList)
        ? section.quizList.map((quiz, index) => {
            let type = "multiple-choice";

            if (
              quiz.type === "true-false" ||
              quiz.type === "true_false"
            ) {
              type = "true-false";
            }

            if (
              quiz.type === "short-answer" ||
              quiz.type === "short_answer"
            ) {
              type = "short-answer";
            }

            const correctAnswer =
              quiz.correctAnswer ??
              quiz.correct_answer ??
              (
                typeof quiz.correctIndex === "number"
                  ? quiz.options?.[quiz.correctIndex]
                  : ""
              );

            return {
              id: `${section.subId}-assessment-${index + 1}`,
              question: quiz.question,
              type,
              options:
                quiz.options || [],
              correctAnswer,
              explanation:
                quiz.explanation ||
                "راجع الإجابة الصحيحة.",
            };
          })
        : [],
    reviewRecommendations: [
      "راجع الشرح مرة أخرى إذا أخطأت في أحد الأنشطة.",
      "أعد حل الأسئلة التي لم تتمكن من الإجابة عنها.",
      "انتقل إلى الدرس التالي بعد إتقان المهارة.",
    ],
  };
}

function ProgressBar({ value }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div
        className="bg-blue-600 h-full transition-all"
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
        }}
      />
    </div>
  );
}

function Header({
  title,
  currentUserEmail,
  isAdmin,
  onHome,
  onExamCenter,
  onAdmin,
  onChangeEmail,
}) {
  return (
    <header className="w-full bg-white shadow-sm border-b">
      <div
        className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3"
        dir="rtl"
      >
        <button
          onClick={onHome}
          className="font-bold text-xl text-blue-700"
        >
          لنتعلم
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onHome}
            className="px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            الرئيسية
          </button>

          <button
            onClick={onExamCenter}
            className="px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            الاختبارات
          </button>

          {isAdmin && (
            <button
              onClick={onAdmin}
              className="px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              الإدارة
            </button>
          )}

          <button
            onClick={onChangeEmail}
            className="px-3 py-2 rounded-lg bg-gray-100"
          >
            {currentUserEmail}
          </button>
        </div>
      </div>
    </header>
  );
}

function HomeScreen({
  stages,
  onSelectStage,
  onExamCenter,
}) {
  return (
    <main
      className="max-w-6xl mx-auto px-4 py-8"
      dir="rtl"
    >
      <section className="bg-white rounded-3xl shadow-sm p-8 mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          منصة لنتعلم التعليمية
        </h1>

        <p className="text-gray-600 text-lg">
          تعلم بطريقة تفاعلية ومنظمة
        </p>

        <button
          onClick={onExamCenter}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          مركز الاختبارات
        </button>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        {stages.map((stage) => (
          <button
            key={stage.stageId}
            onClick={() => onSelectStage(stage)}
            className="text-right bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition"
          >
            <div className="text-4xl mb-4">
              {getStageIcon(stage.icon)}
            </div>

            <h2 className="text-xl font-bold mb-2">
              {stage.title}
            </h2>

            <p className="text-gray-600">
              {stage.subSections?.length || 0} أقسام تعليمية
            </p>
          </button>
        ))}
      </div>
    </main>
  );
}

function InfoCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h3 className="font-bold text-lg mb-3">
        {title}
      </h3>
      <div className="text-gray-700">
        {children}
      </div>
    </div>
  );
}

function StageScreen({
  stage,
  onBack,
  onSelectLesson,
  subscriptionRequested,
  onRequestSubscription,
}) {
  const lessons = useMemo(
    () =>
      (stage.subSections || [])
        .filter((section) => section.subId !== "tests")
        .map((section) =>
          createLessonFromSection(stage, section)
        ),
    [stage]
  );

  return (
    <main
      className="max-w-6xl mx-auto px-4 py-8"
      dir="rtl"
    >
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-gray-100 rounded-lg"
      >
        ← العودة
      </button>

      <div className="bg-white rounded-3xl shadow-sm p-6 mb-6">
        <h1 className="text-3xl font-bold mb-3">
          {stage.title}
        </h1>

        <p className="text-gray-600">
          اختر أحد الدروس للبدء.
        </p>

        <div className="mt-5">
          <button
            onClick={onRequestSubscription}
            disabled={subscriptionRequested}
            className="px-5 py-3 bg-amber-500 text-white rounded-xl disabled:opacity-60"
          >
            {subscriptionRequested
              ? "تم إرسال طلب الاشتراك"
              : "طلب الاشتراك"}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {lessons.map((lesson) => (
          <button
            key={lesson.id}
            onClick={() => onSelectLesson(lesson)}
            className="text-right bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition"
          >
            <h2 className="text-xl font-bold mb-3">
              {lesson.title}
            </h2>

            <p className="text-gray-600 mb-4">
              {lesson.introduction}
            </p>

            <div className="flex gap-2 flex-wrap text-sm">
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                {lesson.shortLessons.length} دروس قصيرة
              </span>

              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">
                {lesson.activities.length} أنشطة
              </span>

              <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                {lesson.assessmentQuestions.length} تقييم
              </span>
            </div>
          </button>
        ))}
      </div>
    </main>
  );
}

function LessonScreen({
  lesson,
  onBack,
}) {
  return (
    <main
      className="max-w-5xl mx-auto px-4 py-8"
      dir="rtl"
    >
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-gray-100 rounded-lg"
      >
        ← العودة
      </button>

      <div className="space-y-6">
        <section className="bg-white rounded-3xl shadow-sm p-7">
          <h1 className="text-3xl font-bold mb-4">
            {lesson.title}
          </h1>

          <p className="text-gray-700 leading-8">
            {lesson.introduction}
          </p>
        </section>

        <InfoCard title="الأهداف التعليمية">
          <ul className="list-disc pr-6 space-y-2">
            {lesson.objectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
        </InfoCard>

        <section>
          <h2 className="text-2xl font-bold mb-4">
            الدروس القصيرة
          </h2>

          <div className="space-y-4">
            {lesson.shortLessons.map((item) => (
              <InfoCard
                key={item.id}
                title={item.title}
              >
                <p className="leading-8 mb-3">
                  {item.explanation}
                </p>

                {item.examples?.length > 0 && (
                  <div className="space-y-2">
                    <strong>أمثلة:</strong>

                    {item.examples.map(
                      (example, index) => (
                        <div
                          key={`${item.id}-${index}`}
                          className="bg-gray-50 p-3 rounded-lg"
                        >
                          {example}
                        </div>
                      )
                    )}
                  </div>
                )}
              </InfoCard>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">
            الأنشطة
          </h2>

          <div className="space-y-4">
            {lesson.activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
              />
            ))}
          </div>
        </section>

        {lesson.assessmentQuestions.length > 0 && (
          <div className="bg-blue-50 rounded-2xl p-5">
            <h2 className="text-xl font-bold mb-2">
              التقييم
            </h2>

            <p>
              يوجد {lesson.assessmentQuestions.length} سؤال
              للتأكد من فهمك للدرس.
            </p>
          </div>
        )}

        <InfoCard title="توصيات المراجعة">
          <ul className="list-disc pr-6 space-y-2">
            {lesson.reviewRecommendations.map(
              (recommendation) => (
                <li key={recommendation}>
                  {recommendation}
                </li>
              )
            )}
          </ul>
        </InfoCard>
      </div>
    </main>
  );
}

function ActivityCard({ activity }) {
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);

  const correct = answersAreEqual(
    answer,
    activity.correctAnswer
  );

  const isOrdering =
    activity.type === "ordering" &&
    Array.isArray(activity.correctAnswer);

  const orderingOptions = isOrdering
    ? activity.correctAnswer
    : [];

  function handleOptionClick(option) {
    if (isOrdering) {
      setAnswer((previous) => {
        const current = Array.isArray(previous)
          ? previous
          : [];

        if (current.includes(option)) {
          return current;
        }

        return [...current, option];
      });

      return;
    }

    setAnswer(option);
    setChecked(false);
  }

  function resetOrdering() {
    setAnswer([]);
    setChecked(false);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="font-bold">
          {LESSON_TYPES[activity.type] ||
            activity.type}
        </h3>
      </div>

      <p className="text-lg mb-4">
        {activity.question}
      </p>

      {Array.isArray(activity.options) &&
        activity.options.length > 0 && (
          <div className="grid gap-2">
            {activity.options.map((option, index) => (
              <button
                key={`${activity.id}-${index}`}
                onClick={() =>
                  handleOptionClick(option)
                }
                className={`text-right p-3 rounded-xl border transition ${
                  answer === option
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

      {isOrdering && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {orderingOptions.map((option, index) => (
              <button
                key={`${activity.id}-order-${index}`}
                onClick={() =>
                  handleOptionClick(option)
                }
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                {option}
              </button>
            ))}
          </div>

          <div className="p-3 bg-gray-50 rounded-xl min-h-12">
            {Array.isArray(answer)
              ? answer.join(" → ")
              : ""}
          </div>

          <button
            onClick={resetOrdering}
            className="px-4 py-2 bg-gray-100 rounded-lg"
          >
            إعادة الترتيب
          </button>
        </div>
      )}

      {!activity.options?.length &&
        !isOrdering && (
          <input
            value={
              Array.isArray(answer)
                ? answer.join(" ")
                : answer
            }
            onChange={(event) =>
              setAnswer(event.target.value)
            }
            placeholder="اكتب إجابتك هنا"
            className="w-full border rounded-xl p-3"
          />
        )}

      <button
        onClick={() => setChecked(true)}
        disabled={
          Array.isArray(answer)
            ? answer.length === 0
            : !String(answer).trim()
        }
        className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-xl disabled:opacity-40"
      >
        تحقق من الإجابة
      </button>

      {checked && (
        <div
          className={`mt-4 p-4 rounded-xl ${
            correct
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          <p className="font-bold">
            {correct
              ? "إجابة صحيحة ✓"
              : "الإجابة غير صحيحة"}
          </p>

          {activity.explanation && (
            <p className="mt-2">
              {activity.explanation}
            </p>
          )}

          {!correct &&
            activity.correctAnswer && (
              <p className="mt-2">
                الإجابة الصحيحة:{" "}
                {Array.isArray(
                  activity.correctAnswer
                )
                  ? activity.correctAnswer.join(" → ")
                  : activity.correctAnswer}
              </p>
            )}
        </div>
      )}
    </div>
  );
}

function AssessmentScreen({
  lesson,
  onBack,
  onFinish,
}) {
  const questions = lesson.assessmentQuestions || [];

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [answers, setAnswers] = useState({});

  const [submitted, setSubmitted] =
    useState(false);

  const [score, setScore] = useState(0);

  if (questions.length === 0) {
    return (
      <main
        className="max-w-3xl mx-auto px-4 py-8"
        dir="rtl"
      >
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 bg-gray-100 rounded-lg"
        >
          ← العودة
        </button>

        <div className="bg-white rounded-2xl shadow-sm p-7 text-center">
          <h1 className="text-2xl font-bold mb-3">
            لا يوجد تقييم لهذا الدرس حاليًا
          </h1>

          <p className="text-gray-600">
            يمكنك متابعة الأنشطة التعليمية.
          </p>
        </div>
      </main>
    );
  }

  const question = questions[currentIndex];

  function saveAnswer(value) {
    setAnswers((previous) => ({
      ...previous,
      [question.id]: value,
    }));
  }

  function isProvided(value) {
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return String(value ?? "").trim().length > 0;
  }

  function nextQuestion() {
    if (
      !isProvided(answers[question.id])
    ) {
      return;
    }

    if (
      currentIndex <
      questions.length - 1
    ) {
      setCurrentIndex((index) => index + 1);
    } else {
      let finalScore = 0;

      questions.forEach((item) => {
        if (
          answersAreEqual(
            answers[item.id],
            item.correctAnswer
          )
        ) {
          finalScore += 1;
        }
      });

      setScore(finalScore);
      setSubmitted(true);
    }
  }

  if (submitted) {
    const percentage = Math.round(
      (score / questions.length) * 100
    );

    return (
      <main
        className="max-w-3xl mx-auto px-4 py-8"
        dir="rtl"
      >
        <div className="bg-white rounded-3xl shadow-sm p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">
            نتيجة التقييم
          </h1>

          <div className="text-5xl font-bold text-blue-600 mb-4">
            {percentage}%
          </div>

          <p className="text-gray-600 mb-6">
            حصلت على {score} من{" "}
            {questions.length}
          </p>

          <button
            onClick={() => onFinish(score)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl"
          >
            إنهاء
          </button>
        </div>
      </main>
    );
  }

  const currentAnswer =
    answers[question.id] ?? "";

  return (
    <main
      className="max-w-3xl mx-auto px-4 py-8"
      dir="rtl"
    >
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-gray-100 rounded-lg"
      >
        ← العودة
      </button>

      <div className="bg-white rounded-3xl shadow-sm p-7">
        <div className="mb-6">
          <ProgressBar
            value={
              ((currentIndex + 1) /
                questions.length) *
              100
            }
          />

          <p className="text-sm text-gray-500 mt-2">
            السؤال {currentIndex + 1} من{" "}
            {questions.length}
          </p>
        </div>

        <h1 className="text-2xl font-bold mb-6">
          {question.question}
        </h1>

        {question.type ===
          "multiple-choice" && (
          <div className="grid gap-3">
            {(question.options || []).map(
              (option, index) => (
                <button
                  key={`${question.id}-${index}`}
                  onClick={() =>
                    saveAnswer(option)
                  }
                  className={`text-right p-4 rounded-xl border ${
                    currentAnswer === option
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {option}
                </button>
              )
            )}
          </div>
        )}

        {question.type ===
          "true-false" && (
          <div className="grid grid-cols-2 gap-3">
            {["صح", "خطأ"].map(
              (option) => (
                <button
                  key={option}
                  onClick={() =>
                    saveAnswer(option)
                  }
                  className={`p-4 rounded-xl border ${
                    currentAnswer === option
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  {option}
                </button>
              )
            )}
          </div>
        )}

        {question.type ===
          "short-answer" && (
          <input
            value={currentAnswer}
            onChange={(event) =>
              saveAnswer(event.target.value)
            }
            placeholder="اكتب إجابتك"
            className="w-full border rounded-xl p-4"
          />
        )}

        <button
          onClick={nextQuestion}
          disabled={
            !isProvided(currentAnswer)
          }
          className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl disabled:opacity-40"
        >
          {currentIndex ===
          questions.length - 1
            ? "إنهاء التقييم"
            : "السؤال التالي"}
        </button>
      </div>
    </main>
  );
}

function ExamCenter({
  exams,
  onSelectExam,
  onBack,
}) {
  return (
    <main
      className="max-w-5xl mx-auto px-4 py-8"
      dir="rtl"
    >
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-gray-100 rounded-lg"
      >
        ← العودة
      </button>

      <div className="bg-white rounded-3xl shadow-sm p-7 mb-6">
        <h1 className="text-3xl font-bold mb-3">
          مركز الاختبارات
        </h1>

        <p className="text-gray-600">
          اختر الاختبار الذي تريد حله.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {exams.map((exam) => (
          <button
            key={exam.exam_id}
            onClick={() => onSelectExam(exam)}
            className="text-right bg-white rounded-2xl shadow-sm p-6 hover:shadow-md"
          >
            <h2 className="text-xl font-bold mb-2">
              {exam.title}
            </h2>

            <p className="text-gray-600 mb-4">
              {exam.category}
            </p>

            <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
              {exam.questions?.length || 0} أسئلة
            </span>
          </button>
        ))}
      </div>

      {exams.length === 0 && (
        <div className="bg-white rounded-2xl p-6 text-center">
          لا توجد اختبارات متاحة حاليًا.
        </div>
      )}
    </main>
  );
}

function ExamScreen({
  exam,
  onBack,
}) {
  const questions = exam?.questions || [];

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [answers, setAnswers] = useState({});

  const [finished, setFinished] =
    useState(false);

  const [score, setScore] = useState(0);

  if (!exam || questions.length === 0) {
    return (
      <main
        className="max-w-4xl mx-auto px-4 py-8"
        dir="rtl"
      >
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 bg-gray-100 rounded-lg"
        >
          ← العودة
        </button>

        <div className="bg-white rounded-2xl p-7 text-center">
          لا توجد أسئلة في هذا الاختبار.
        </div>
      </main>
    );
  }

  const question = questions[currentIndex];
  const currentAnswer =
    answers[question.id] ?? null;

  function chooseAnswer(index) {
    setAnswers((previous) => ({
      ...previous,
      [question.id]: index,
    }));
  }

  function next() {
    if (currentAnswer === null) {
      return;
    }

    if (
      currentIndex <
      questions.length - 1
    ) {
      setCurrentIndex((index) => index + 1);
      return;
    }

    let finalScore = 0;

    questions.forEach((item) => {
      if (
        answers[item.id] ===
        item.correct_answer_index
      ) {
        finalScore += 1;
      }
    });

    setScore(finalScore);
    setFinished(true);
  }

  if (finished) {
    const percentage = Math.round(
      (score / questions.length) * 100
    );

    return (
      <main
        className="max-w-3xl mx-auto px-4 py-8"
        dir="rtl"
      >
        <div className="bg-white rounded-3xl shadow-sm p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">
            نتيجة الاختبار
          </h1>

          <div className="text-5xl font-bold text-blue-600 mb-4">
            {percentage}%
          </div>

          <p className="mb-2">
            الدرجة: {score} /{" "}
            {questions.length}
          </p>

          <p className="text-gray-600 mb-6">
            يمكنك العودة إلى مركز الاختبارات
            واختيار اختبار آخر.
          </p>

          <button
            onClick={onBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl"
          >
            العودة للاختبارات
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      className="max-w-4xl mx-auto px-4 py-8"
      dir="rtl"
    >
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-gray-100 rounded-lg"
      >
        ← العودة
      </button>

      <div className="bg-white rounded-3xl shadow-sm p-7">
        <div className="mb-6">
          <ProgressBar
            value={
              ((currentIndex + 1) /
                questions.length) *
              100
            }
          />

          <p className="text-sm text-gray-500 mt-2">
            السؤال {currentIndex + 1} من{" "}
            {questions.length}
          </p>
        </div>

        <div className="mb-2 text-sm text-blue-600 font-bold">
          {question.subject}
        </div>

        <h1 className="text-2xl font-bold mb-6">
          {question.question_text}
        </h1>

        <div className="grid gap-3">
          {question.options.map(
            (option, index) => (
              <button
                key={`${question.id}-${index}`}
                onClick={() =>
                  chooseAnswer(index)
                }
                className={`text-right p-4 rounded-xl border transition ${
                  currentAnswer === index
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span className="font-bold ml-2">
                  {String.fromCharCode(
                    1571 + index
                  )}.
                </span>

                {option}
              </button>
            )
          )}
        </div>

        <button
          onClick={next}
          disabled={currentAnswer === null}
          className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl disabled:opacity-40"
        >
          {currentIndex ===
          questions.length - 1
            ? "إنهاء الاختبار"
            : "السؤال التالي"}
        </button>
      </div>
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
    <main
      className="max-w-5xl mx-auto px-4 py-8"
      dir="rtl"
    >
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-gray-100 rounded-lg"
      >
        ← العودة
      </button>

      <div className="bg-white rounded-3xl shadow-sm p-7">
        <h1 className="text-3xl font-bold mb-6">
          لوحة الإدارة
        </h1>

        {requests.length === 0 ? (
          <p className="text-gray-600">
            لا توجد طلبات اشتراك حاليًا.
          </p>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.email}
                className="border rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3"
              >
                <div>
                  <p className="font-bold">
                    {request.email}
                  </p>

                  <p className="text-sm text-gray-500">
                    الحالة: {request.status}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      onApprove(request.email)
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                  >
                    قبول
                  </button>

                  <button
                    onClick={() =>
                      onReject(request.email)
                    }
                    className="px-4 py-2 bg-red-600 text-white rounded-lg"
                  >
                    رفض
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function getStageIcon(icon) {
  const icons = {
    arabic_alphabet: "🔤",
    math_icon: "🔢",
    english_icon: "🇬🇧",
    exam_icon: "📝",
  };

  return icons[icon] || "📚";
}

export default function App() {
  const [currentUserEmail, setCurrentUserEmail] =
    useState(() => {
      try {
        return (
          localStorage.getItem(
            "lntalem_user_email"
          ) || "user@example.com"
        );
      } catch {
        return "user@example.com";
      }
    });

  const [view, setView] =
    useState("home");

  const [selectedStage, setSelectedStage] =
    useState(null);

  const [selectedLesson, setSelectedLesson] =
    useState(null);

  const [selectedExam, setSelectedExam] =
    useState(null);

  const [assessmentResult, setAssessmentResult] =
    useState(null);

  const [subscriptionRequests, setSubscriptionRequests] =
    useState(() => {
      try {
        const saved = localStorage.getItem(
          "lntalem_subscription_requests"
        );

        return saved
          ? JSON.parse(saved)
          : [];
      } catch {
        return [];
      }
    });

  const isAdmin =
    currentUserEmail === ADMIN_EMAIL;

  const stages =
    educationalData?.educationalStages || [];

  const isSubscriptionRequested =
    subscriptionRequests.some(
      (request) =>
        request.email === currentUserEmail
    );

  function saveRequests(requests) {
    setSubscriptionRequests(requests);

    try {
      localStorage.setItem(
        "lntalem_subscription_requests",
        JSON.stringify(requests)
      );
    } catch {
      // تجاهل خطأ التخزين المحلي
    }
  }

  function changeEmail() {
    const email = window.prompt(
      "أدخل البريد الإلكتروني:",
      currentUserEmail
    );

    if (!email) return;

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail) return;

    setCurrentUserEmail(normalizedEmail);

    try {
      localStorage.setItem(
        "lntalem_user_email",
        normalizedEmail
      );
    } catch {
      // تجاهل خطأ التخزين المحلي
    }
  }

  function requestSubscription() {
    const exists =
      subscriptionRequests.some(
        (request) =>
          request.email === currentUserEmail
      );

    if (exists) {
      return;
    }

    const updated = [
      ...subscriptionRequests,
      {
        email: currentUserEmail,
        status: "pending",
        createdAt:
          new Date().toISOString(),
      },
    ];

    saveRequests(updated);
  }

  function approveRequest(email) {
    saveRequests(
      subscriptionRequests.map((request) =>
        request.email === email
          ? {
              ...request,
              status: "approved",
            }
          : request
      )
    );
  }

  function rejectRequest(email) {
    saveRequests(
      subscriptionRequests.map((request) =>
        request.email === email
          ? {
              ...request,
              status: "rejected",
            }
          : request
      )
    );
  }

  function goHome() {
    setView("home");
    setSelectedStage(null);
    setSelectedLesson(null);
    setSelectedExam(null);
  }

  function openStage(stage) {
    setSelectedStage(stage);
    setSelectedLesson(null);
    setView("stage");
  }

  function openLesson(lesson) {
    setSelectedLesson(lesson);
    setView("lesson");
  }

  function openAssessment() {
    if (!selectedLesson) return;
    setAssessmentResult(null);
    setView("assessment");
  }

  function openExamCenter() {
    setSelectedExam(null);
    setView("exam-center");
  }

  function openExam(exam) {
    setSelectedExam(exam);
    setView("exam");
  }

  function openAdmin() {
    if (!isAdmin) return;
    setView("admin");
  }

  function handleAssessmentFinish(score) {
    setAssessmentResult({
      score,
      total:
        selectedLesson?.assessmentQuestions
          ?.length || 0,
    });

    setView("lesson");
  }

  let content = null;

  if (view === "home") {
    content = (
      <HomeScreen
        stages={stages}
        onSelectStage={openStage}
        onExamCenter={openExamCenter}
      />
    );
  }

  if (
    view === "stage" &&
    selectedStage
  ) {
    content = (
      <StageScreen
        stage={selectedStage}
        onBack={goHome}
        onSelectLesson={openLesson}
        subscriptionRequested={
          isSubscriptionRequested
        }
        onRequestSubscription={
          requestSubscription
        }
      />
    );
  }

  if (
    view === "lesson" &&
    selectedLesson
  ) {
    content = (
      <LessonScreen
        lesson={selectedLesson}
        onBack={() =>
          setView("stage")
        }
      />
    );
  }

  if (
    view === "assessment" &&
    selectedLesson
  ) {
    content = (
      <AssessmentScreen
        lesson={selectedLesson}
        onBack={() =>
          setView("lesson")
        }
        onFinish={handleAssessmentFinish}
      />
    );
  }

  if (view === "exam-center") {
    content = (
      <ExamCenter
        exams={tahsiliExams}
        onSelectExam={openExam}
        onBack={goHome}
      />
    );
  }

  if (
    view === "exam" &&
    selectedExam
  ) {
    content = (
      <ExamScreen
        exam={selectedExam}
        onBack={openExamCenter}
      />
    );
  }

  if (view === "admin" && isAdmin) {
    content = (
      <AdminScreen
        requests={subscriptionRequests}
        onApprove={approveRequest}
        onReject={rejectRequest}
        onBack={goHome}
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-50 text-gray-900"
      dir="rtl"
    >
      <Header
        title="منصة لنتعلم التعليمية"
        currentUserEmail={currentUserEmail}
        isAdmin={isAdmin}
        onHome={goHome}
        onExamCenter={openExamCenter}
        onAdmin={openAdmin}
        onChangeEmail={changeEmail}
      />

      {assessmentResult && (
        <div className="max-w-5xl mx-auto px-4 pt-5">
          <div className="bg-green-50 text-green-800 rounded-xl p-4">
            آخر نتيجة تقييم:{" "}
            {assessmentResult.score} من{" "}
            {assessmentResult.total}
          </div>
        </div>
      )}

      {content}
    </div>
  );
}
