import { useState } from "react";
import type { NavigableItem } from "../../types";

interface QuizTabProps {
  item: NavigableItem;
}

export default function QuizTab({ item }: QuizTabProps) {
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  const quizzes = item.quizzes || [];
  const totalQuestions = quizzes.length || 1;

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    quizzes.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });
    setQuizScore(correctCount);
    setQuizSubmitted(true);
  };

  const handleRetakeQuiz = () => {
    setQuizSubmitted(false);
    setQuizAnswers({});
    setQuizScore(0);
  };

  const getOptionStyle = (qIdx: number, optIdx: number, correctIndex: number) => {
    const isSelected = quizAnswers[qIdx] === optIdx;
    if (quizSubmitted) {
      if (optIdx === correctIndex) {
        return "bg-emerald-500/15 border-emerald-500 text-emerald-400 font-bold";
      }
      if (isSelected) {
        return "bg-rose-500/15 border-rose-500 text-rose-400";
      }
    } else if (isSelected) {
      return "bg-purple-600/20 border-purple-500 text-purple-300 font-bold";
    }
    return "bg-[var(--surface)] border-[var(--border)] hover:border-purple-500 text-[var(--text)]";
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-4">
        <div>
          <h3 className="text-lg font-black text-[var(--text)]">Knowledge Assessment</h3>
          <p className="text-xs text-[var(--muted)]">Test your mastery on {item.title}</p>
        </div>
        {quizSubmitted && (
          <div className="px-3 py-1.5 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-extrabold">
            Score: {quizScore} / {totalQuestions} Correct (
            {Math.round((quizScore / totalQuestions) * 100)}%)
          </div>
        )}
      </div>

      {/* Quizzes List */}
      <div className="space-y-6">
        {quizzes.map((quiz, qIdx) => (
          <div
            key={quiz.id || qIdx}
            className="p-5 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] space-y-4"
          >
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase">
                Question {qIdx + 1}
              </span>
              <h4 className="text-xs font-bold text-[var(--text)]">{quiz.question}</h4>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {quiz.options.map((opt, optIdx) => (
                <button
                  key={optIdx}
                  disabled={quizSubmitted}
                  onClick={() => setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${getOptionStyle(
                    qIdx,
                    optIdx,
                    quiz.correctIndex
                  )}`}
                >
                  <span>{opt}</span>
                  {quizSubmitted && optIdx === quiz.correctIndex && (
                    <span className="text-emerald-400 font-black">✓ Correct</span>
                  )}
                </button>
              ))}
            </div>

            {/* Explanation */}
            {quizSubmitted && (
              <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border-soft)] text-xs text-[var(--muted)] space-y-1">
                <p className="font-bold text-purple-400">Explanation:</p>
                <p>{quiz.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Submit / Retake Actions */}
      <div className="pt-2 flex justify-end gap-3">
        {quizSubmitted ? (
          <button
            onClick={handleRetakeQuiz}
            className="px-4 py-2 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-bold hover:bg-[var(--surface)] cursor-pointer"
          >
            ↺ Retake Quiz
          </button>
        ) : (
          <button
            onClick={handleSubmitQuiz}
            disabled={Object.keys(quizAnswers).length === 0}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-md shadow-purple-600/25 cursor-pointer disabled:opacity-40"
          >
            Submit Answers
          </button>
        )}
      </div>
    </div>
  );
}
