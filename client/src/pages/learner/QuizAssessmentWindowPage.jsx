import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Wifi, 
  WifiOff, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Bookmark, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  RotateCcw, 
  Maximize, 
  Award, 
  HelpCircle, 
  Check, 
  ArrowLeft,
  FileCheck,
  AlertOctagon,
  RefreshCw,
  CheckSquare,
  Square
} from 'lucide-react';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';
import UnderTestingBanner from '../../components/common/UnderTestingBanner';

export default function QuizAssessmentWindowPage() {
  const { activityId } = useParams();
  const currentActivityId = activityId || 'act-ct-quiz-1';
  const navigate = useNavigate();

  // Lifecycle stage: 'LAUNCH' | 'ASSESSMENT' | 'REVIEW' | 'TERMINATED' | 'RESULT'
  const [viewState, setViewState] = useState('LAUNCH');
  
  // Assessment metadata & Attempt state
  const [overview, setOverview] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  
  // Timer state
  const [secondsRemaining, setSecondsRemaining] = useState(900);
  
  // Connectivity ping state
  const [pingMs, setPingMs] = useState(38);
  const [pingStatus, setPingStatus] = useState('excellent'); // 'excellent' | 'good' | 'moderate' | 'poor' | 'disconnected'
  
  // Autosave state
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'error'
  
  // Warnings state
  const [warningCount, setWarningCount] = useState(0);
  const [activeWarningModal, setActiveWarningModal] = useState(null);
  const [exitModalOpen, setExitModalOpen] = useState(false);
  
  // Evaluation Result state
  const [result, setResult] = useState(null);
  
  // Loading & error
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Critical Refs for solid event tracking across render cycles
  const attemptRef = useRef(attempt);
  attemptRef.current = attempt;

  const viewStateRef = useRef(viewState);
  viewStateRef.current = viewState;

  const lastWarningTimeRef = useRef(0);
  const hasEnteredFullscreenRef = useRef(false);
  const activeWarningModalRef = useRef(activeWarningModal);
  activeWarningModalRef.current = activeWarningModal;
  const exitModalRef = useRef(exitModalOpen);
  exitModalRef.current = exitModalOpen;

  // ─── 1. Load Overview ──────────────────────────────────────────────────
  const loadOverview = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await api.getAssessmentOverview(currentActivityId);
      setOverview(data.overview);
      
      // If there is an existing active attempt in progress
      if (data.overview.activeAttemptId) {
        const attemptState = await api.getAttempt(data.overview.activeAttemptId);
        if (attemptState.attempt.status === 'IN_PROGRESS') {
          setAttempt(attemptState.attempt);
          setQuestions(attemptState.questions);
          setUserResponses(attemptState.attempt.responses || {});
          setWarningCount(attemptState.attempt.warningCount || 0);

          const expiresMs = new Date(attemptState.attempt.expiresAt).getTime();
          const rem = Math.max(0, Math.floor((expiresMs - Date.now()) / 1000));
          setSecondsRemaining(rem);

          if (rem > 0) {
            setViewState('ASSESSMENT');
          }
        }
      }
    } catch (err) {
      console.error('Failed to load assessment overview:', err);
      setErrorMsg(err.message || 'Could not load assessment details.');
    } finally {
      setLoading(false);
    }
  }, [currentActivityId]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  // ─── 2. Fullscreen Helpers ─────────────────────────────────────────────
  const requestFullscreen = async () => {
    try {
      hasEnteredFullscreenRef.current = true;
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (e) {
      console.warn('Fullscreen note:', e.message);
    }
  };

  const exitFullscreen = async () => {
    try {
      hasEnteredFullscreenRef.current = false;
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch (e) {
      console.warn('Exit fullscreen note:', e.message);
    }
  };

  // ─── 3. Launch Attempt ─────────────────────────────────────────────────
  const handleStartAssessment = async () => {
    setActionLoading(true);
    setErrorMsg('');
    try {
      const startRes = await api.startAssessmentAttempt(currentActivityId);
      setAttempt(startRes.attempt);
      attemptRef.current = startRes.attempt;
      setQuestions(startRes.questions);
      setUserResponses(startRes.attempt.responses || {});
      setWarningCount(startRes.attempt.warningCount || 0);
      setCurrentQuestionIndex(0);

      const expiresMs = new Date(startRes.attempt.expiresAt).getTime();
      const rem = Math.max(0, Math.floor((expiresMs - Date.now()) / 1000));
      setSecondsRemaining(rem);

      await requestFullscreen();
      setViewState('ASSESSMENT');
    } catch (err) {
      console.error('Start assessment error:', err);
      setErrorMsg(err.message || 'Failed to initiate examination attempt.');
    } finally {
      setActionLoading(false);
    }
  };

  // ─── 4. Live Game-Style Ping Monitor (Section 7) ───────────────────────
  useEffect(() => {
    const isExamActive = viewState === 'ASSESSMENT' || viewState === 'REVIEW';
    if (!isExamActive || !attempt?.id) return;

    const measurePing = async () => {
      const startTime = performance.now();
      try {
        await api.sendAttemptHeartbeat(attempt.id);
        const rtt = Math.round(performance.now() - startTime);
        setPingMs(rtt);

        if (rtt <= 100) setPingStatus('excellent');
        else if (rtt <= 200) setPingStatus('good');
        else if (rtt <= 400) setPingStatus('moderate');
        else setPingStatus('poor');
      } catch (err) {
        setPingMs(999);
        setPingStatus('disconnected');
      }
    };

    measurePing();
    const interval = setInterval(measurePing, 10000);
    return () => clearInterval(interval);
  }, [attempt?.id, viewState]);

  // ─── 5. Server-Authoritative Countdown Timer ───────────────────────────
  useEffect(() => {
    const isExamActive = viewState === 'ASSESSMENT' || viewState === 'REVIEW';
    if (!isExamActive || !attempt?.expiresAt) return;

    const timerInterval = setInterval(() => {
      const expiresMs = new Date(attempt.expiresAt).getTime();
      const rem = Math.max(0, Math.floor((expiresMs - Date.now()) / 1000));
      setSecondsRemaining(rem);

      if (rem <= 0) {
        clearInterval(timerInterval);
        handleFinalSubmit(true);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [attempt?.expiresAt, viewState]);

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ─── 6. Browser Activity Monitoring & Strict 3-Warning Termination ─────
  const triggerMisconductWarning = useCallback(async (eventType, description) => {
    const isExamActive = viewStateRef.current === 'ASSESSMENT' || viewStateRef.current === 'REVIEW';
    const currentAttemptId = attemptRef.current?.id;
    if (!isExamActive || !currentAttemptId) {
      console.warn('[Proctor] Warning skipped: Exam is not currently active');
      return;
    }

    // Cooldown debounce of 1.5 seconds to prevent double count from a single keypress
    const now = Date.now();
    if (now - lastWarningTimeRef.current < 1500) {
      return;
    }
    lastWarningTimeRef.current = now;

    console.log(`[Proctor Monitor] ⚠️ Misconduct event triggered: ${eventType} - ${description}`);

    try {
      const res = await api.recordAttemptWarning(currentAttemptId, eventType, description);
      setWarningCount(res.warningCount);

      if (res.terminated || res.warningCount >= 3) {
        // Strict 3rd Warning Immediate Termination (Section 5.1)
        console.warn('[Proctor Monitor] 🛑 ATTEMPT TERMINATED: 3 Warnings recorded');
        exitFullscreen();
        setViewState('TERMINATED');
        setActiveWarningModal(null);
      } else {
        // Warning 1 or Warning 2 Modal
        setActiveWarningModal({
          count: res.warningCount,
          max: res.maxWarnings || 3,
          type: eventType,
          description: description || 'Prohibited browser activity detected.'
        });
      }
    } catch (err) {
      console.error('Failed to register warning event on server:', err);
    }
  }, []);

  // Event Listeners attached whenever viewState is ASSESSMENT or REVIEW
  useEffect(() => {
    const isExamActive = viewState === 'ASSESSMENT' || viewState === 'REVIEW';
    if (!isExamActive) return;

    console.log('[Proctor Monitor] Event listeners activated for exam session');

    // 1. Tab visibility changes (switching tabs or minimizing window)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerMisconductWarning('TAB_SWITCH', 'Switched away from assessment tab or minimized window');
      }
    };

    // 2. Fullscreen exit detection
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && hasEnteredFullscreenRef.current) {
        triggerMisconductWarning('FULLSCREEN_EXIT', 'Exited examination full-screen view');
      }
    };

    // 3. Window blur detection (focus loss to another window or desktop application)
    const handleWindowBlur = () => {
      // Do not trigger blur if a warning modal or exit modal is open
      if (activeWarningModalRef.current || exitModalRef.current) return;
      triggerMisconductWarning('WINDOW_BLUR', 'Focus left examination window (switched to another window or desktop app)');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('blur', handleWindowBlur);
      console.log('[Proctor Monitor] Event listeners cleaned up');
    };
  }, [viewState, triggerMisconductWarning]);

  // ─── 7. Autosave Answer Updates ─────────────────────────────────────────
  const handleOptionSelect = async (questionId, optionIndex, isMulti = false) => {
    const currentAttemptId = attemptRef.current?.id;
    if (!currentAttemptId) return;

    const currentResp = userResponses[questionId] || { selectedOptions: [], isMarkedForReview: false };
    let updatedSelected = [];

    if (isMulti) {
      if (currentResp.selectedOptions.includes(optionIndex)) {
        updatedSelected = currentResp.selectedOptions.filter(i => i !== optionIndex);
      } else {
        updatedSelected = [...currentResp.selectedOptions, optionIndex].sort();
      }
    } else {
      updatedSelected = [optionIndex];
    }

    const updatedMap = {
      ...userResponses,
      [questionId]: {
        ...currentResp,
        selectedOptions: updatedSelected
      }
    };
    setUserResponses(updatedMap);

    setSaveStatus('saving');
    try {
      await api.saveAttemptResponse(
        currentAttemptId,
        questionId,
        updatedSelected,
        currentResp.isMarkedForReview
      );
      setSaveStatus('saved');
    } catch (err) {
      console.error('Autosave failure:', err);
      setSaveStatus('error');
    }
  };

  const handleClearSelection = async (questionId) => {
    const currentAttemptId = attemptRef.current?.id;
    if (!currentAttemptId) return;

    const currentResp = userResponses[questionId] || { selectedOptions: [], isMarkedForReview: false };
    const updatedMap = {
      ...userResponses,
      [questionId]: {
        ...currentResp,
        selectedOptions: []
      }
    };
    setUserResponses(updatedMap);

    setSaveStatus('saving');
    try {
      await api.saveAttemptResponse(currentAttemptId, questionId, [], currentResp.isMarkedForReview);
      setSaveStatus('saved');
    } catch (err) {
      console.error('Clear selection error:', err);
      setSaveStatus('error');
    }
  };

  const handleToggleReview = async (questionId) => {
    const currentAttemptId = attemptRef.current?.id;
    if (!currentAttemptId) return;

    const currentResp = userResponses[questionId] || { selectedOptions: [], isMarkedForReview: false };
    const newFlag = !currentResp.isMarkedForReview;

    const updatedMap = {
      ...userResponses,
      [questionId]: {
        ...currentResp,
        isMarkedForReview: newFlag
      }
    };
    setUserResponses(updatedMap);

    setSaveStatus('saving');
    try {
      await api.saveAttemptResponse(currentAttemptId, questionId, currentResp.selectedOptions, newFlag);
      setSaveStatus('saved');
    } catch (err) {
      console.error('Review toggle error:', err);
      setSaveStatus('error');
    }
  };

  // ─── 8. Final Submission & Evaluation ───────────────────────────────────
  const handleFinalSubmit = async (isAutoSubmit = false) => {
    const currentAttemptId = attemptRef.current?.id;
    if (!currentAttemptId) return;
    setActionLoading(true);
    try {
      const res = await api.submitAssessmentAttempt(currentAttemptId);
      setResult(res);
      exitFullscreen();
      setViewState('RESULT');

      if (res.passed) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 }
        });
      }
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMsg(err.message || 'Could not finalize assessment submission.');
    } finally {
      setActionLoading(false);
    }
  };

  // Counters
  const answeredCount = questions.filter(q => (userResponses[q.id]?.selectedOptions || []).length > 0).length;
  const unansweredCount = questions.length - answeredCount;
  const reviewCount = questions.filter(q => userResponses[q.id]?.isMarkedForReview).length;

  // ────────────────────────────────────────────────────────────────────────
  // VIEW 1: ASSESSMENT LAUNCH SCREEN (LIGHT THEME)
  // ────────────────────────────────────────────────────────────────────────
  if (viewState === 'LAUNCH') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link to="/learn" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
              <ArrowLeft className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold tracking-wider uppercase font-mono">Return to Learner Portal</span>
            </Link>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
              <span>PROCTORAL EXAM SPECIFICATION v1.0</span>
            </div>
          </div>
        </header>

        {/* Launch Body */}
        <main className="max-w-4xl mx-auto px-4 py-10 w-full">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm font-medium text-slate-500">Loading Assessment Specification...</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg space-y-8">
              {/* Header Box */}
              <div className="space-y-3 border-b border-slate-100 pb-6">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                    Formal Knowledge Assessment
                  </span>
                  <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                    Module 1: Foundations
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {overview?.title || 'Foundations of Critical Thinking — Formal Proctoral Assessment'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                  {overview?.description || 'Comprehensive 10-question proctoral assessment covering cognitive biases, informal fallacies, and Universal Intellectual Standards.'}
                </p>
              </div>

              {/* Assessment Parameter Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">Question Count</span>
                  <span className="text-xl font-bold text-slate-900 font-mono mt-1 block">
                    {overview?.questionCount || 10} Questions
                  </span>
                  <span className="text-[10px] text-slate-500">Single &amp; Multi MCQs</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">Total Duration</span>
                  <span className="text-xl font-bold text-blue-600 font-mono mt-1 block">
                    {overview?.timeLimitMinutes || 15} Minutes
                  </span>
                  <span className="text-[10px] text-slate-500">Server-timed countdown</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">Total Points</span>
                  <span className="text-xl font-bold text-indigo-600 font-mono mt-1 block">
                    {overview?.totalPoints || 25} Marks
                  </span>
                  <span className="text-[10px] text-slate-500">70% Passing Threshold</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">Attempts Remaining</span>
                  <span className="text-xl font-bold text-amber-600 font-mono mt-1 block">
                    {overview?.remainingAttempts ?? 3} of {overview?.attemptLimit ?? 3}
                  </span>
                  <span className="text-[10px] text-slate-500">Strict 3 attempts max</span>
                </div>
              </div>

              {/* Proctoral Security Rules Notice */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 text-xs font-mono font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Browser Activity Monitoring &amp; Three-Warning Termination Rules</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-2 font-sans list-disc list-inside">
                  <li>
                    <strong>Fullscreen Enforcement:</strong> Fullscreen mode is requested upon start. Exiting fullscreen will trigger an incident warning.
                  </li>
                  <li>
                    <strong>Tab &amp; Focus Tracking:</strong> Switching browser tabs or minimizing the window registers a misconduct warning.
                  </li>
                  <li>
                    <strong className="text-red-600 font-bold">Strict 3-Warning Termination:</strong> On your <strong>3rd warning</strong>, the active attempt is <strong>immediately terminated</strong>, your answers locked, and the attempt consumed.
                  </li>
                  <li>
                    <strong>Live Game Ping Latency:</strong> A live connectivity monitor measures latency to the server. Network drops do <em>not</em> trigger warnings.
                  </li>
                  <li>
                    <strong>Autosave:</strong> Every question selection is automatically synchronized and saved to the server in real-time.
                  </li>
                </ul>
              </div>

              {errorMsg && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2.5">
                  <AlertOctagon className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Launch Action */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs font-mono text-slate-600 text-center sm:text-left">
                  {overview?.remainingAttempts > 0 ? (
                    <span className="text-emerald-700 font-bold">✓ Eligible to take assessment ({overview.remainingAttempts} attempts remaining)</span>
                  ) : (
                    <span className="text-red-600 font-bold">✕ Maximum attempts (3/3) reached for this assessment.</span>
                  )}
                </div>

                <button
                  onClick={handleStartAssessment}
                  disabled={actionLoading || (overview?.remainingAttempts <= 0 && !overview?.activeAttemptId)}
                  className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-sm rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed tracking-wider"
                >
                  {actionLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>INITIALIZING SECURE SESSION...</span>
                    </>
                  ) : (
                    <>
                      <Maximize className="w-4 h-4" />
                      <span>{overview?.activeAttemptId ? 'RESUME ACTIVE ATTEMPT' : 'START ASSESSMENT (ENTER FULLSCREEN)'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </main>

        <UnderTestingBanner mode="light" />
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────
  // VIEW 4: ASSESSMENT TERMINATED (LIGHT THEME)
  // ────────────────────────────────────────────────────────────────────────
  if (viewState === 'TERMINATED') {
    const consumedAttempts = attempt?.attemptNumber || 1;
    const remainingAttempts = Math.max(0, 3 - consumedAttempts);

    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
        <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link to="/learn" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-4 h-4 text-red-600" />
              <span className="text-xs font-mono font-bold tracking-wider">RETURN TO DASHBOARD</span>
            </Link>
            <div className="flex items-center gap-2 text-xs font-mono text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span>TERMINATION PROTOCOL EXECUTED</span>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-12 w-full">
          <div className="bg-white border-2 border-red-400 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6 text-center animate-in fade-in">
            <div className="w-20 h-20 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto shadow-md">
              <ShieldAlert className="w-10 h-10 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-red-700 font-bold bg-red-50 px-2.5 py-1 rounded border border-red-200">
                Misconduct Threshold Exceeded (3 of 3 Warnings)
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
                Assessment Terminated
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans max-w-lg mx-auto">
                Under Section 5 of the Proctoral Policy, your examination session was terminated immediately upon accumulating three recorded browser activity warnings.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono text-left space-y-2.5">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-500">Attempt Number:</span>
                <span className="text-slate-900 font-bold">Attempt #{attempt?.attemptNumber || 1} of 3</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-500">Session Status:</span>
                <span className="text-red-600 font-bold uppercase">TERMINATED (CONSUMED)</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-500">Termination Reason:</span>
                <span className="text-slate-700">Exceeded maximum warnings (3/3)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Remaining Attempts:</span>
                <span className={`font-bold ${remainingAttempts > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                  {remainingAttempts} attempt(s) remaining
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Link
                to="/learn"
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-bold rounded-xl transition-colors text-center"
              >
                Return to Learner Portal
              </Link>
              {remainingAttempts > 0 && (
                <button
                  type="button"
                  onClick={handleStartAssessment}
                  disabled={actionLoading}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start New Attempt ({remainingAttempts} left)</span>
                </button>
              )}
            </div>
          </div>
        </main>

        <UnderTestingBanner mode="light" />
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────
  // VIEW 5: RESULTS & DETAILED REVIEW (LIGHT THEME)
  // ────────────────────────────────────────────────────────────────────────
  if (viewState === 'RESULT') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
        <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link to="/learn" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
              <ArrowLeft className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-mono font-bold tracking-wider">RETURN TO LEARNER PORTAL</span>
            </Link>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>OFFICIAL ASSESSMENT EVALUATION</span>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-10 w-full space-y-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg space-y-8">
            <div className="text-center space-y-3">
              <div className={`w-20 h-20 rounded-2xl mx-auto flex items-center justify-center text-white shadow-md ${
                result?.passed 
                  ? 'bg-emerald-600 shadow-emerald-600/20' 
                  : 'bg-amber-500 shadow-amber-500/20'
              }`}>
                {result?.passed ? <Award className="w-10 h-10" /> : <RotateCcw className="w-10 h-10" />}
              </div>

              <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-3 py-1 rounded-full border inline-block ${
                result?.passed 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {result?.passed ? 'Knowledge Benchmark Achieved' : 'Review & Practice Recommended'}
              </span>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {result?.passed ? 'Assessment Passed Successfully!' : 'Assessment Completed — Keep Practicing'}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto font-sans">
                You earned <strong className="text-slate-900">{result?.score}</strong> out of <strong className="text-slate-900">{result?.maxScore}</strong> points ({result?.percentage}%).
                {result?.passed 
                  ? ' Credential progress has been confirmed and registered to your Skill Passport.' 
                  : ' The passing threshold is 70%. Review the full question explanations below to solidify your understanding.'}
              </p>
            </div>

            {/* Performance Metrics Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Correct Answers</span>
                <span className="text-xl font-bold text-emerald-600 font-mono block mt-1">{result?.correctCount ?? 0}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Incorrect</span>
                <span className="text-xl font-bold text-red-600 font-mono block mt-1">{result?.incorrectCount ?? 0}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Unanswered</span>
                <span className="text-xl font-bold text-slate-600 font-mono block mt-1">{result?.unansweredCount ?? 0}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Remaining Attempts</span>
                <span className="text-xl font-bold text-blue-600 font-mono block mt-1">{result?.remainingAttempts ?? 0} of 3</span>
              </div>
            </div>

            {/* Detailed Answer Review */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-mono font-bold text-slate-900 uppercase tracking-wider">
                  Detailed 10-Question Answer Review &amp; Explanations
                </h2>
                <span className="text-xs font-mono text-slate-500">Official Server Evaluation</span>
              </div>

              <div className="space-y-4">
                {result?.breakdown?.map((item, idx) => (
                  <div
                    key={item.questionId}
                    className={`p-5 rounded-2xl border text-xs space-y-3 ${
                      item.isCorrect 
                        ? 'bg-emerald-50/40 border-emerald-300' 
                        : 'bg-red-50/40 border-red-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono font-bold">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 text-[10px]">
                          Question #{idx + 1}
                        </span>
                        <span className="text-slate-500 text-[10px] uppercase">{item.topicTag}</span>
                      </div>
                      <span className={`flex items-center gap-1.5 text-xs ${item.isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                        {item.isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {item.isCorrect ? `Earned ${item.earnedMarks} / ${item.marks} pts` : `0 / ${item.marks} pts`}
                      </span>
                    </div>

                    <p className="font-bold text-slate-900 font-sans text-sm leading-snug">
                      {item.question}
                    </p>

                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1 font-sans text-slate-700">
                      <span className="text-[10px] font-mono uppercase text-blue-700 font-bold block">
                        Academic Explanation &amp; Rationale:
                      </span>
                      <p className="text-xs leading-relaxed">{item.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                to="/learn"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-bold transition-colors text-center"
              >
                Return to Course Lessons
              </Link>

              {result?.remainingAttempts > 0 && (
                <button
                  type="button"
                  onClick={handleStartAssessment}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Assessment ({result.remainingAttempts} attempts remaining)</span>
                </button>
              )}
            </div>
          </div>
        </main>

        <UnderTestingBanner mode="light" />
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────
  // VIEW 2 & 3: ACTIVE ASSESSMENT & QUESTION REVIEW (LIGHT THEME)
  // ────────────────────────────────────────────────────────────────────────
  const currentQ = questions[currentQuestionIndex] || {};
  const currentAnswer = userResponses[currentQ.id] || { selectedOptions: [], isMarkedForReview: false };
  const isMultiSelect = currentQ.questionType === 'multiple';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans select-none">
      
      {/* ─── A. Header Bar (Light Theme) ─────────────────────────────────── */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-mono font-bold text-xs shadow-sm">
            EV
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xs font-bold text-slate-900 font-mono tracking-tight truncate max-w-xs md:max-w-md">
              {overview?.title || 'Foundations of Critical Thinking'}
            </h1>
            <span className="text-[10px] text-slate-500 font-mono">Attempt #{attempt?.attemptNumber || 1} of 3</span>
          </div>
        </div>

        {/* Telemetry Center: Live Ping + Autosave + Warnings + Countdown Timer */}
        <div className="flex items-center gap-2.5 sm:gap-4 text-xs font-mono">
          
          {/* Live Ping Game-Style Indicator (Section 7) */}
          <div 
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[11px] cursor-help"
            title={`Assessment Service Round-trip latency: ${pingMs} ms (${pingStatus.toUpperCase()})`}
          >
            {pingStatus === 'disconnected' ? (
              <WifiOff className="w-3.5 h-3.5 text-red-600" />
            ) : (
              <Wifi className={`w-3.5 h-3.5 ${
                pingStatus === 'excellent' ? 'text-emerald-600' :
                pingStatus === 'good' ? 'text-green-600' :
                pingStatus === 'moderate' ? 'text-amber-600' : 'text-red-600'
              }`} />
            )}
            <span className={`font-bold ${
              pingStatus === 'disconnected' ? 'text-red-600' :
              pingStatus === 'excellent' ? 'text-emerald-700' :
              pingStatus === 'good' ? 'text-green-700' :
              pingStatus === 'moderate' ? 'text-amber-700' : 'text-red-600'
            }`}>
              {pingStatus === 'disconnected' ? '999+' : `${pingMs} ms`}
            </span>
          </div>

          {/* Autosave Status Indicator */}
          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-500">
            {saveStatus === 'saving' && (
              <>
                <RefreshCw className="w-3 h-3 text-blue-600 animate-spin" />
                <span className="text-blue-600 font-medium">Saving...</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Saved</span>
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <AlertOctagon className="w-3 h-3 text-red-600" />
                <span className="text-red-600 font-bold">Sync Error</span>
              </>
            )}
          </div>

          {/* Warning Counter (Section 5) */}
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold ${
            warningCount === 0 
              ? 'bg-slate-100 border-slate-200 text-slate-700' 
              : warningCount === 1 
              ? 'bg-amber-50 border-amber-300 text-amber-800' 
              : 'bg-red-50 border-red-300 text-red-700 animate-pulse'
          }`}>
            <AlertTriangle className={`w-3 h-3 ${warningCount > 0 ? 'text-amber-600' : 'text-slate-500'}`} />
            <span>Warnings: {warningCount}/3</span>
          </div>

          {/* Countdown Timer */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono font-bold text-xs ${
            secondsRemaining < 120 
              ? 'bg-red-50 border-red-300 text-red-700 animate-pulse' 
              : 'bg-blue-50 border-blue-200 text-blue-700'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>

          {/* Exit Control with Confirmation Modal */}
          <button
            onClick={() => setExitModalOpen(true)}
            className="px-2.5 py-1 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-mono transition-colors"
          >
            Exit
          </button>
        </div>
      </header>

      {/* ─── B. Main Layout: Questions Navigator + Active Question Panel ──── */}
      {viewState === 'ASSESSMENT' && (
        <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Question Panel (lg:col-span-8) */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            
            {/* Top Question Info Bar */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-mono font-bold border border-blue-200">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono">
                    Marks: {currentQ.marks || 2} pts
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono">
                    {currentQ.topicTag || 'General'}
                  </span>
                </div>

                {/* Mark for review toggle */}
                <button
                  onClick={() => handleToggleReview(currentQ.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                    currentAnswer.isMarkedForReview
                      ? 'bg-purple-50 text-purple-700 border border-purple-300 font-bold'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${currentAnswer.isMarkedForReview ? 'fill-purple-600 text-purple-600' : ''}`} />
                  <span>{currentAnswer.isMarkedForReview ? 'Marked for Review' : 'Mark for Review'}</span>
                </button>
              </div>

              {/* Question Text */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-blue-600 font-bold">
                  {isMultiSelect ? 'Multiple-Choice (Select all that apply)' : 'Single-Choice (Select one option)'}
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed font-sans">
                  {currentQ.question}
                </h2>
              </div>

              {/* Options List */}
              <div className="space-y-3 pt-4">
                {currentQ.options?.map((optionText, optIdx) => {
                  const isSelected = currentAnswer.selectedOptions.includes(optIdx);
                  return (
                    <label
                      key={optIdx}
                      onClick={() => handleOptionSelect(currentQ.id, optIdx, isMultiSelect)}
                      className={`flex items-start gap-3.5 p-4 rounded-xl border text-xs sm:text-sm font-medium cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-semibold shadow-sm'
                          : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50/80 hover:border-slate-300'
                      }`}
                    >
                      {/* Checkbox or Radio Icon */}
                      <div className={`w-5 h-5 rounded-${isMultiSelect ? 'md' : 'full'} border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                        isSelected 
                          ? 'border-blue-600 bg-blue-600 text-white' 
                          : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && (
                          isMultiSelect ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <span className="w-2 h-2 rounded-full bg-white"></span>
                        )}
                      </div>

                      <div className="flex-1 leading-snug">
                        <span className="font-mono text-slate-500 mr-2 font-bold">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span>{optionText}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 mt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleClearSelection(currentQ.id)}
                disabled={currentAnswer.selectedOptions.length === 0}
                className="text-xs font-mono text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
              >
                Clear Selection
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs flex items-center gap-1.5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>Save &amp; Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setViewState('REVIEW')}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>Review &amp; Submit</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Question Navigation Palette */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                  Question Palette (10 Questions)
                </h3>
                <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                  Click any question to navigate freely.
                </p>
              </div>

              {/* 10-Question Grid */}
              <div className="grid grid-cols-5 gap-2.5">
                {questions.map((q, idx) => {
                  const resp = userResponses[q.id];
                  const hasAnswer = (resp?.selectedOptions || []).length > 0;
                  const isCurrent = idx === currentQuestionIndex;
                  const isReview = resp?.isMarkedForReview;

                  let style = 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100';
                  if (hasAnswer) {
                    style = 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold';
                  }
                  if (isReview) {
                    style = 'bg-purple-50 border-purple-400 text-purple-800 font-bold';
                  }
                  if (isCurrent) {
                    style += ' ring-2 ring-blue-600 ring-offset-2 border-blue-600';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-11 rounded-xl border font-mono text-xs flex flex-col items-center justify-center transition-all relative ${style}`}
                    >
                      <span>{idx + 1}</span>
                      {isReview && (
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600 absolute top-1.5 right-1.5"></span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Summary Counts */}
              <div className="space-y-2 pt-4 border-t border-slate-100 text-[11px] font-mono">
                <div className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span>Answered:</span>
                  </div>
                  <span className="font-bold text-emerald-700">{answeredCount}</span>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                    <span>Unanswered:</span>
                  </div>
                  <span className="font-bold text-slate-600">{unansweredCount}</span>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                    <span>Marked for Review:</span>
                  </div>
                  <span className="font-bold text-purple-700">{reviewCount}</span>
                </div>
              </div>
            </div>

            {/* Review and Submit Action */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => setViewState('REVIEW')}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all tracking-wider"
              >
                <span>REVIEW &amp; SUBMIT EXAM</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── C. Question Review Screen (Light Theme) ──────────────────────── */}
      {viewState === 'REVIEW' && (
        <div className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg space-y-8">
            <div className="border-b border-slate-100 pb-5 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Pre-Submission Verification
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Assessment Question Review
              </h2>
              <p className="text-xs text-slate-600 font-sans">
                Carefully verify your answered status below before submitting. You may return to any question to make adjustments.
              </p>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Answered</span>
                <span className="text-2xl font-bold text-emerald-600 font-mono block mt-1">{answeredCount}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Unanswered</span>
                <span className="text-2xl font-bold text-slate-500 font-mono block mt-1">{unansweredCount}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Marked for Review</span>
                <span className="text-2xl font-bold text-purple-600 font-mono block mt-1">{reviewCount}</span>
              </div>
            </div>

            {/* Questions Table Overview */}
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
              {questions.map((q, idx) => {
                const resp = userResponses[q.id];
                const hasAnswer = (resp?.selectedOptions || []).length > 0;
                const isReview = resp?.isMarkedForReview;

                return (
                  <div
                    key={q.id}
                    onClick={() => {
                      setCurrentQuestionIndex(idx);
                      setViewState('ASSESSMENT');
                    }}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors text-xs font-mono"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-500 w-6">#{idx + 1}</span>
                      <span className="text-slate-800 font-sans truncate max-w-xs sm:max-w-md">
                        {q.question}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isReview && (
                        <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px]">
                          Review
                        </span>
                      )}
                      {hasAnswer ? (
                        <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                          Answered ({resp.selectedOptions.length})
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px]">
                          Unanswered
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submission Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setViewState('ASSESSMENT')}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-mono text-xs flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Questions</span>
              </button>

              <button
                type="button"
                onClick={() => handleFinalSubmit(false)}
                disabled={actionLoading}
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs shadow-md shadow-blue-600/20 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 tracking-wider"
              >
                {actionLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>EVALUATING RESPONSES...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>CONFIRM &amp; FINALIZE SUBMISSION</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── D. Modal 1: Misconduct Warning Notification (Light Theme) ─────── */}
      {activeWarningModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="max-w-md w-full bg-white border-2 border-amber-500 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                {activeWarningModal.count === 2 ? 'FINAL WARNING (2 of 3)' : 'INCIDENT WARNING (1 of 3)'}
              </span>
              <h3 className="text-lg font-bold text-slate-900 pt-2">
                {activeWarningModal.count === 2 ? 'Security Warning Alert!' : 'Prohibited Activity Detected'}
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              {activeWarningModal.description}
            </p>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] font-mono text-slate-700 text-left space-y-1.5">
              <p>• Warning count recorded: <strong className="text-amber-700">{activeWarningModal.count} / 3</strong></p>
              <p>• Remaining warnings before termination: <strong className="text-red-600">{3 - activeWarningModal.count}</strong></p>
              <p className="text-red-600 font-bold">• Note: 3rd violation will immediately terminate this examination.</p>
            </div>

            <button
              type="button"
              onClick={async () => {
                setActiveWarningModal(null);
                await requestFullscreen();
              }}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-mono font-bold text-xs rounded-xl shadow-md transition-all uppercase tracking-wider"
            >
              I Understand &amp; Re-enter Fullscreen
            </button>
          </div>
        </div>
      )}

      {/* ─── E. Modal 2: Exit Confirmation (Light Theme) ───────────────────── */}
      {exitModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
              <HelpCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Exit Assessment?</h3>
              <p className="text-xs text-slate-600 font-sans">
                Your answered questions are saved on the server. However, your countdown timer continues ticking until the server deadline.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setExitModalOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-semibold rounded-xl"
              >
                Resume Exam
              </button>
              <button
                type="button"
                onClick={() => {
                  exitFullscreen();
                  navigate('/learn');
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs rounded-xl shadow-sm"
              >
                Exit to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── F. Bottom Under Testing Banner ─────────────────────────────────── */}
      <UnderTestingBanner mode="light" />
    </div>
  );
}
