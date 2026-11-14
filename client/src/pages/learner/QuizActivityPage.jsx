import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  Star, 
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';

export default function QuizActivityPage() {
  const { activityId } = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [secondsRemaining, setSecondsRemaining] = useState(600); // 10 minutes

  useEffect(() => {
    async function loadQuiz() {
      try {
        const res = await api.getActivity(activityId || 'act-ct-quiz-1');
        setActivity(res.activity);
        if (res.activity.timeLimitMinutes) {
          setSecondsRemaining(res.activity.timeLimitMinutes * 60);
        }
      } catch (err) {
        console.error('Failed to load quiz:', err);
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, [activityId]);

  // Live timer countdown
  useEffect(() => {
    if (result || secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [result, secondsRemaining]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId, optionIndex) => {
    if (result) return; // Locked once submitted
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await api.submitQuizAttempt(activity.id, selectedAnswers);
      setResult(res);

      if (res.passed) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm text-slate-500">Loading knowledge check...</p>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Quiz not found</h2>
        <Link to="/learn" className="text-sm text-blue-600 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const questions = activity.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const progressPct = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      {/* Top Bar matching reference1.png bottom left */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <Link
          to={`/learn/lessons/${activity.lessonId}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Course
        </Link>

        {/* Quiz Progress Counter */}
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-slate-700">
            Quiz Progress: {currentQuestionIndex + 1} / {questions.length}
          </span>
          <div className="w-36 h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
        </div>
      </div>

      {result ? (
        /* Results View */
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-lg space-y-8 animate-in fade-in">
          <div className="text-center space-y-3">
            <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-white shadow-lg ${
              result.passed ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-amber-500 shadow-amber-500/30'
            }`}>
              <Award className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900">
              {result.passed ? 'Knowledge Check Passed!' : 'Review Recommended'}
            </h2>

            <p className="text-sm text-slate-500 max-w-md mx-auto">
              You scored <strong>{result.score}</strong> of <strong>{result.totalPoints}</strong> points ({result.percentage}%).
              {result.passed ? ' Credential credit has been recorded to your Skill Passport.' : ' Review the explanations below and try again to master this concept.'}
            </p>
          </div>

          {/* Breakdown List with Explanations */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Detailed Answer Review</h3>
            {result.breakdown?.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border text-xs space-y-2 ${
                  item.isCorrect 
                    ? 'bg-emerald-50/50 border-emerald-200' 
                    : 'bg-red-50/50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-800">Question {idx + 1}</span>
                  <span className={item.isCorrect ? 'text-emerald-700 flex items-center gap-1' : 'text-red-700 flex items-center gap-1'}>
                    {item.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {item.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                <p className="text-slate-600">{item.explanation}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => { setResult(null); setSelectedAnswers({}); setCurrentQuestionIndex(0); }}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Quiz
            </button>
            <Link
              to={`/learn/lessons/${activity.lessonId}`}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 text-center"
            >
              Continue Next Learning Step →
            </Link>
          </div>
        </div>
      ) : (
        /* Active Quiz Taking Interface */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Question Card (lg:col-span-8) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="space-y-2">
              <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-[10px] font-extrabold uppercase tracking-wider">
                Question {currentQuestionIndex + 1}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Options list matching reference1.png */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((option, oIdx) => {
                const isSelected = selectedAnswers[currentQuestion.id] === oIdx;
                return (
                  <label
                    key={oIdx}
                    onClick={() => handleSelectOption(currentQuestion.id, oIdx)}
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border text-xs sm:text-sm font-medium cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 text-blue-950 font-bold shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                      isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                    }`}>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-white"></span>}
                    </div>
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>

            {/* Navigation buttons: Previous / Next / Submit */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs disabled:opacity-40"
              >
                ← Previous
              </button>

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
                >
                  Next Question →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                >
                  {submitting ? 'Scoring...' : 'Submit Knowledge Check'}
                </button>
              )}
            </div>
          </div>

          {/* Right Floating Quiz Info Card matching reference1.png */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                Quiz Info
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Time Remaining</p>
                    <p className="text-base font-extrabold text-slate-900 font-mono">
                      {formatTimer(secondsRemaining)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Points</p>
                    <p className="text-base font-extrabold text-slate-900">
                      {activity.totalPoints || 10} pts
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 leading-relaxed border border-slate-100">
                Answer each question carefully. Once submitted, answers are audited server-side with instant feedback.
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

