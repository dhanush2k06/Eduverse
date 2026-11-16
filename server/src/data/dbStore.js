import {
  initialCategories,
  initialCourses,
  initialModules,
  initialLessons,
  initialActivities,
  initialLearners,
  initialEnrollments,
  initialResearchSources,
  initialCRMOverview
} from './mockData.js';
import { firestoreDb, isMockMode } from '../config/firebase.js';

// Global in-memory state initialized with seed data
class DatabaseStore {
  constructor() {
    this.categories = [...initialCategories];
    this.courses = [...initialCourses];
    this.modules = [...initialModules];
    this.lessons = [...initialLessons];
    this.activities = [...initialActivities];
    this.learners = [...initialLearners];
    this.enrollments = [...initialEnrollments];
    this.researchSources = [...initialResearchSources];
    this.crmOverview = JSON.parse(JSON.stringify(initialCRMOverview));
    this.submissions = [];
    this.assessmentAttempts = [];
    this.activityLogs = [
      {
        id: "act-log-1",
        userId: "user-priya-sharma",
        userName: "Priya Sharma",
        eventType: "lesson_completed",
        courseId: "course-critical-thinking",
        lessonId: "lesson-ct-basics",
        lessonTitle: "The Basics of Critical Thinking",
        occurredAt: "2026-11-13T12:30:00Z"
      },
      {
        id: "act-log-2",
        userId: "user-priya-sharma",
        userName: "Priya Sharma",
        eventType: "quiz_completed",
        activityId: "act-ct-quiz-1",
        score: 10,
        totalPoints: 10,
        occurredAt: "2026-11-13T12:40:00Z"
      }
    ];
  }

  // Categories
  getCategories() {
    return this.categories.filter(c => c.isActive !== false);
  }

  // Courses
  getCourses({ search, category, difficulty, status } = {}) {
    let result = [...this.courses];

    if (status) {
      result = result.filter(c => c.status.toLowerCase() === status.toLowerCase());
    } else {
      // By default for public endpoints, only show published
      result = result.filter(c => c.status === 'Published');
    }

    if (category && category !== 'All') {
      result = result.filter(c => 
        c.categoryId === category || 
        c.categoryName.toLowerCase() === category.toLowerCase() ||
        c.slug.includes(category.toLowerCase())
      );
    }

    if (difficulty && difficulty !== 'All') {
      result = result.filter(c => c.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.shortDescription.toLowerCase().includes(q) ||
        c.skillsAwarded.some(s => s.toLowerCase().includes(q))
      );
    }

    return result;
  }

  getCourseByIdOrSlug(idOrSlug) {
    const course = this.courses.find(c => c.id === idOrSlug || c.slug === idOrSlug);
    if (!course) return null;

    const modules = this.modules
      .filter(m => m.courseId === course.id)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    const enrichedModules = modules.map(m => {
      const lessons = this.lessons
        .filter(l => l.moduleId === m.id)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map(l => ({
          id: l.id,
          title: l.title,
          summary: l.summary,
          readingTimeEstimate: l.readingTimeEstimate,
          displayOrder: l.displayOrder,
          status: l.status
        }));
      return { ...m, lessons };
    });

    return {
      ...course,
      modules: enrichedModules
    };
  }

  // Lessons
  getLessonById(lessonId) {
    const lesson = this.lessons.find(l => l.id === lessonId);
    if (!lesson) return null;

    const course = this.courses.find(c => c.id === lesson.courseId);
    const moduleItem = this.modules.find(m => m.id === lesson.moduleId);
    const research = this.researchSources.filter(r => (lesson.researchSourceIds || []).includes(r.id));
    const quizOrActivity = this.activities.find(a => a.lessonId === lesson.id);

    // Get sibling lessons for previous/next navigation
    const siblings = this.lessons
      .filter(l => l.courseId === lesson.courseId)
      .sort((a, b) => a.displayOrder - b.displayOrder);
    const currentIndex = siblings.findIndex(l => l.id === lesson.id);
    const prevLesson = currentIndex > 0 ? { id: siblings[currentIndex - 1].id, title: siblings[currentIndex - 1].title } : null;
    const nextLesson = currentIndex < siblings.length - 1 ? { id: siblings[currentIndex + 1].id, title: siblings[currentIndex + 1].title } : null;

    return {
      ...lesson,
      courseTitle: course ? course.title : 'Course',
      courseSlug: course ? course.slug : '',
      moduleTitle: moduleItem ? moduleItem.title : 'Module',
      researchSources: research,
      linkedActivityId: quizOrActivity ? quizOrActivity.id : null,
      prevLesson,
      nextLesson
    };
  }

  // Activities & Quizzes
  getActivityById(activityId, isStaff = false) {
    const activity = this.activities.find(a => a.id === activityId);
    if (!activity) return null;

    // Sanitize quiz questions so learner cannot see correctAnswerIndex or explanation in payload!
    if (activity.type === 'quiz' && !isStaff) {
      const sanitizedQuestions = activity.questions.map(q => ({
        id: q.id,
        question: q.question,
        questionType: q.questionType || 'single',
        options: q.options,
        marks: q.marks || 2,
        topicTag: q.topicTag,
        difficulty: q.difficulty
      }));
      return {
        ...activity,
        questions: sanitizedQuestions
      };
    }

    return activity;
  }

  // Proctoral Assessment Methods (test_window_plan.md specification)
  getAssessmentOverview(activityId, userId) {
    const activity = this.activities.find(a => a.id === activityId);
    if (!activity) return null;

    const userAttempts = this.assessmentAttempts.filter(
      a => a.activityId === activityId && a.userId === userId
    );

    const consumedAttempts = userAttempts.filter(a => 
      ['SUBMITTED', 'TERMINATED', 'EXPIRED'].includes(a.status)
    );

    const activeAttempt = userAttempts.find(a => {
      if (a.status !== 'IN_PROGRESS') return false;
      const isExpired = Date.now() > new Date(a.expiresAt).getTime();
      if (isExpired) {
        a.status = 'EXPIRED';
        return false;
      }
      return true;
    });

    const maxAttempts = activity.attemptLimit || 3;
    const remainingAttempts = Math.max(0, maxAttempts - consumedAttempts.length);

    return {
      id: activity.id,
      title: activity.title,
      description: activity.description || activity.instructions,
      instructions: activity.instructions,
      courseId: activity.courseId,
      moduleId: activity.moduleId,
      lessonId: activity.lessonId,
      timeLimitMinutes: activity.timeLimitMinutes || 15,
      durationSeconds: activity.durationSeconds || (activity.timeLimitMinutes ? activity.timeLimitMinutes * 60 : 900),
      totalPoints: activity.totalPoints || 25,
      passingScorePercentage: activity.passingScorePercentage || 70,
      questionCount: (activity.questions || []).length,
      attemptLimit: maxAttempts,
      warningLimit: activity.warningLimit || 3,
      negativeMarkingEnabled: !!activity.negativeMarkingEnabled,
      userAttemptsCount: consumedAttempts.length,
      remainingAttempts,
      canStart: remainingAttempts > 0 || !!activeAttempt,
      activeAttemptId: activeAttempt ? activeAttempt.id : null,
      previousAttempts: consumedAttempts.map(a => ({
        attemptId: a.id,
        attemptNumber: a.attemptNumber,
        status: a.status,
        score: a.score,
        maxScore: a.maxScore,
        percentage: a.percentage,
        passed: a.passed,
        submittedAt: a.submittedAt,
        terminatedAt: a.terminatedAt,
        terminationReason: a.terminationReason,
        warningCount: a.warningCount
      }))
    };
  }

  startAssessmentAttempt(activityId, userId) {
    const activity = this.activities.find(a => a.id === activityId);
    if (!activity) {
      throw new Error('Assessment not found');
    }

    const userAttempts = this.assessmentAttempts.filter(
      a => a.activityId === activityId && a.userId === userId
    );

    // If there is already an active IN_PROGRESS attempt that hasn't expired, resume it
    const activeAttempt = userAttempts.find(a => a.status === 'IN_PROGRESS');
    if (activeAttempt) {
      const isExpired = Date.now() > new Date(activeAttempt.expiresAt).getTime();
      if (!isExpired) {
        return this.getAttemptState(activeAttempt.id, userId);
      }
      activeAttempt.status = 'EXPIRED';
    }

    // Check maximum attempts limit (strictly 3 per learner)
    const consumedAttempts = userAttempts.filter(a => 
      ['SUBMITTED', 'TERMINATED', 'EXPIRED'].includes(a.status)
    );

    const maxAttempts = activity.attemptLimit || 3;
    if (consumedAttempts.length >= maxAttempts) {
      throw new Error(`Maximum attempt limit (${maxAttempts}/${maxAttempts}) reached for this assessment. No additional attempts permitted.`);
    }

    const attemptNumber = consumedAttempts.length + 1;
    const now = new Date();
    const durationSeconds = activity.durationSeconds || (activity.timeLimitMinutes ? activity.timeLimitMinutes * 60 : 900);
    const expiresAt = new Date(now.getTime() + durationSeconds * 1000);

    const newAttempt = {
      id: `att-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      activityId,
      userId,
      attemptNumber,
      status: 'IN_PROGRESS',
      startedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      submittedAt: null,
      terminatedAt: null,
      terminationReason: null,
      warningCount: 0,
      warningEvents: [],
      responses: {},
      score: 0,
      maxScore: activity.totalPoints || 25,
      percentage: 0,
      passed: false
    };

    this.assessmentAttempts.push(newAttempt);

    // Record activity event
    const learner = this.learners.find(l => l.id === userId);
    this.activityLogs.unshift({
      id: `act-log-${Date.now()}`,
      userId,
      userName: learner ? learner.displayName : 'Learner',
      eventType: 'assessment_started',
      activityId,
      attemptNumber,
      occurredAt: now.toISOString()
    });

    return this.getAttemptState(newAttempt.id, userId);
  }

  getAttemptState(attemptId, userId, isStaff = false) {
    const attempt = this.assessmentAttempts.find(a => a.id === attemptId);
    if (!attempt) {
      throw new Error('Attempt not found');
    }

    if (!isStaff && attempt.userId !== userId) {
      throw new Error('Unauthorized access to attempt');
    }

    // Check expiration on read
    if (attempt.status === 'IN_PROGRESS') {
      const isExpired = Date.now() > new Date(attempt.expiresAt).getTime();
      if (isExpired) {
        attempt.status = 'EXPIRED';
      }
    }

    const activity = this.activities.find(a => a.id === attempt.activityId);
    if (!activity) {
      throw new Error('Associated assessment not found');
    }

    const sanitizedQuestions = activity.questions.map(q => ({
      id: q.id,
      question: q.question,
      questionType: q.questionType || 'single',
      options: q.options,
      marks: q.marks || 2,
      topicTag: q.topicTag,
      difficulty: q.difficulty
    }));

    const userAttempts = this.assessmentAttempts.filter(
      a => a.activityId === activity.id && a.userId === userId && ['SUBMITTED', 'TERMINATED', 'EXPIRED'].includes(a.status)
    );
    const maxAttempts = activity.attemptLimit || 3;
    const remainingAttempts = Math.max(0, maxAttempts - userAttempts.length);

    return {
      attempt: {
        id: attempt.id,
        activityId: attempt.activityId,
        attemptNumber: attempt.attemptNumber,
        status: attempt.status,
        startedAt: attempt.startedAt,
        expiresAt: attempt.expiresAt,
        submittedAt: attempt.submittedAt,
        terminatedAt: attempt.terminatedAt,
        terminationReason: attempt.terminationReason,
        warningCount: attempt.warningCount,
        warningLimit: activity.warningLimit || 3,
        responses: attempt.responses,
        score: attempt.score,
        maxScore: attempt.maxScore,
        percentage: attempt.percentage,
        passed: attempt.passed,
        breakdown: attempt.breakdown || null
      },
      assessment: {
        id: activity.id,
        title: activity.title,
        description: activity.description || activity.instructions,
        instructions: activity.instructions,
        courseId: activity.courseId,
        timeLimitMinutes: activity.timeLimitMinutes || 15,
        durationSeconds: activity.durationSeconds || 900,
        totalPoints: activity.totalPoints || 25,
        passingScorePercentage: activity.passingScorePercentage || 70,
        questionCount: activity.questions.length,
        maxAttempts,
        remainingAttempts,
        negativeMarkingEnabled: !!activity.negativeMarkingEnabled
      },
      questions: sanitizedQuestions
    };
  }

  saveAttemptResponse(attemptId, userId, questionId, selectedOptions, isMarkedForReview = false) {
    const attempt = this.assessmentAttempts.find(a => a.id === attemptId);
    if (!attempt) {
      throw new Error('Attempt not found');
    }

    if (attempt.userId !== userId) {
      throw new Error('Unauthorized attempt modification');
    }

    if (attempt.status !== 'IN_PROGRESS') {
      throw new Error(`Cannot save answer: attempt is already ${attempt.status}`);
    }

    if (Date.now() > new Date(attempt.expiresAt).getTime()) {
      attempt.status = 'EXPIRED';
      throw new Error('Assessment deadline has expired');
    }

    // Ensure selectedOptions is an array
    let normalized = [];
    if (Array.isArray(selectedOptions)) {
      normalized = selectedOptions.filter(x => typeof x === 'number');
    } else if (typeof selectedOptions === 'number') {
      normalized = [selectedOptions];
    }

    const savedAt = new Date().toISOString();
    attempt.responses[questionId] = {
      selectedOptions: normalized,
      isMarkedForReview: !!isMarkedForReview,
      savedAt
    };

    return {
      saved: true,
      questionId,
      selectedOptions: normalized,
      isMarkedForReview: !!isMarkedForReview,
      savedAt
    };
  }

  recordAttemptWarning(attemptId, userId, eventType, description) {
    const attempt = this.assessmentAttempts.find(a => a.id === attemptId);
    if (!attempt) {
      throw new Error('Attempt not found');
    }

    if (attempt.userId && userId && attempt.userId !== userId && userId !== 'admin') {
      console.warn(`[dbStore] Warning user note: attempt.userId=${attempt.userId}, caller=${userId}`);
    }

    if (attempt.status !== 'IN_PROGRESS') {
      return {
        warningCount: attempt.warningCount,
        maxWarnings: 3,
        terminated: attempt.status === 'TERMINATED',
        status: attempt.status,
        terminationReason: attempt.terminationReason
      };
    }

    // Register warning event
    const now = new Date();
    const eventRecord = {
      id: `warn-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      eventType,
      description: description || `Misconduct event: ${eventType}`,
      occurredAt: now.toISOString()
    };

    attempt.warningEvents.push(eventRecord);
    attempt.warningCount += 1;

    // Strict 3rd Warning Immediate Termination (test_window_plan.md Section 5)
    let terminated = false;
    if (attempt.warningCount >= 3) {
      attempt.status = 'TERMINATED';
      attempt.terminatedAt = now.toISOString();
      attempt.terminationReason = 'Exceeded maximum permitted browser activity warnings (3/3).';
      terminated = true;

      // Log misconduct termination event
      const learner = this.learners.find(l => l.id === userId);
      this.activityLogs.unshift({
        id: `act-log-${Date.now()}`,
        userId,
        userName: learner ? learner.displayName : 'Learner',
        eventType: 'assessment_terminated_misconduct',
        activityId: attempt.activityId,
        attemptNumber: attempt.attemptNumber,
        warningCount: attempt.warningCount,
        occurredAt: now.toISOString()
      });
    }

    return {
      warningCount: attempt.warningCount,
      maxWarnings: 3,
      terminated,
      status: attempt.status,
      terminationReason: attempt.terminationReason,
      event: eventRecord
    };
  }

  submitAssessmentAttempt(attemptId, userId) {
    const attempt = this.assessmentAttempts.find(a => a.id === attemptId);
    if (!attempt) {
      throw new Error('Attempt not found');
    }

    if (attempt.userId !== userId) {
      throw new Error('Unauthorized attempt submission');
    }

    if (attempt.status === 'TERMINATED') {
      throw new Error('Attempt cannot be submitted: assessment was terminated due to policy warnings');
    }

    if (attempt.status === 'SUBMITTED') {
      return {
        submissionId: attempt.id,
        score: attempt.score,
        maxScore: attempt.maxScore,
        percentage: attempt.percentage,
        passed: attempt.passed,
        breakdown: attempt.breakdown,
        alreadySubmitted: true
      };
    }

    const activity = this.activities.find(a => a.id === attempt.activityId);
    if (!activity) {
      throw new Error('Assessment definition not found');
    }

    // Evaluate answers server-side
    let totalScore = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    const breakdown = activity.questions.map(q => {
      const userResp = attempt.responses[q.id];
      const selectedOptions = userResp ? userResp.selectedOptions || [] : [];
      let isCorrect = false;

      if (selectedOptions.length === 0) {
        unansweredCount++;
      } else if (q.questionType === 'multiple') {
        const expected = (q.correctAnswerIndices || []).slice().sort();
        const actual = selectedOptions.slice().sort();
        isCorrect = expected.length === actual.length && expected.every((val, idx) => val === actual[idx]);
        if (isCorrect) correctCount++;
        else incorrectCount++;
      } else {
        const expected = q.correctAnswerIndex;
        const actual = selectedOptions[0];
        isCorrect = actual === expected;
        if (isCorrect) correctCount++;
        else incorrectCount++;
      }

      const questionMarks = q.marks || 2;
      const earnedMarks = isCorrect ? questionMarks : 0;
      totalScore += earnedMarks;

      return {
        questionId: q.id,
        question: q.question,
        questionType: q.questionType || 'single',
        options: q.options,
        selectedOptions,
        correctAnswerIndex: q.correctAnswerIndex,
        correctAnswerIndices: q.correctAnswerIndices,
        isCorrect,
        marks: questionMarks,
        earnedMarks,
        explanation: q.explanation,
        topicTag: q.topicTag
      };
    });

    const maxScore = activity.totalPoints || 25;
    const percentage = Math.round((totalScore / maxScore) * 100);
    const passingThreshold = activity.passingScorePercentage || 70;
    const passed = percentage >= passingThreshold;

    attempt.status = 'SUBMITTED';
    attempt.submittedAt = new Date().toISOString();
    attempt.score = totalScore;
    attempt.maxScore = maxScore;
    attempt.percentage = percentage;
    attempt.passed = passed;
    attempt.breakdown = breakdown;

    // Record submission
    const submissionRecord = {
      id: `sub-${Date.now()}`,
      userId,
      activityId: activity.id,
      attemptId: attempt.id,
      courseId: activity.courseId,
      score: totalScore,
      totalPoints: maxScore,
      percentage,
      passed,
      submittedAt: attempt.submittedAt
    };
    this.submissions.push(submissionRecord);

    const learner = this.learners.find(l => l.id === userId);
    this.activityLogs.unshift({
      id: `act-log-${Date.now()}`,
      userId,
      userName: learner ? learner.displayName : 'Learner',
      eventType: 'assessment_submitted',
      activityId: activity.id,
      attemptNumber: attempt.attemptNumber,
      score: totalScore,
      totalPoints: maxScore,
      percentage,
      passed,
      occurredAt: attempt.submittedAt
    });

    const userAttempts = this.assessmentAttempts.filter(
      a => a.activityId === activity.id && a.userId === userId && ['SUBMITTED', 'TERMINATED', 'EXPIRED'].includes(a.status)
    );
    const maxAttempts = activity.attemptLimit || 3;
    const remainingAttempts = Math.max(0, maxAttempts - userAttempts.length);

    return {
      submissionId: submissionRecord.id,
      attemptId: attempt.id,
      attemptNumber: attempt.attemptNumber,
      score: totalScore,
      maxScore,
      percentage,
      passed,
      correctCount,
      incorrectCount,
      unansweredCount,
      totalQuestions: activity.questions.length,
      remainingAttempts,
      maxAttempts,
      submittedAt: attempt.submittedAt,
      breakdown
    };
  }

  // Legacy single-call submission for tests and standard quiz
  submitQuizAttempt(activityId, userId, answers) {
    const activity = this.activities.find(a => a.id === activityId);
    if (!activity || activity.type !== 'quiz') {
      throw new Error('Invalid quiz activity');
    }

    let correctCount = 0;
    const results = activity.questions.map(q => {
      const selected = answers[q.id];
      let isCorrect = false;

      if (q.questionType === 'multiple') {
        const expected = (q.correctAnswerIndices || []).slice().sort();
        const actual = Array.isArray(selected) ? selected.slice().sort() : (typeof selected === 'number' ? [selected] : []);
        isCorrect = expected.length === actual.length && expected.every((val, idx) => val === actual[idx]);
      } else {
        const selectedIndex = Array.isArray(selected) ? selected[0] : selected;
        isCorrect = selectedIndex === q.correctAnswerIndex;
      }

      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        selectedIndex: selected,
        correctAnswerIndex: q.correctAnswerIndex,
        correctAnswerIndices: q.correctAnswerIndices,
        isCorrect,
        explanation: q.explanation
      };
    });

    const score = Math.round((correctCount / activity.questions.length) * activity.totalPoints);
    const percentage = Math.round((correctCount / activity.questions.length) * 100);

    const submissionRecord = {
      id: `sub-${Date.now()}`,
      userId,
      activityId,
      courseId: activity.courseId,
      score,
      totalPoints: activity.totalPoints,
      percentage,
      details: results,
      submittedAt: new Date().toISOString()
    };
    this.submissions.push(submissionRecord);

    const learner = this.learners.find(l => l.id === userId);
    this.activityLogs.unshift({
      id: `act-log-${Date.now()}`,
      userId,
      userName: learner ? learner.displayName : 'Learner',
      eventType: 'quiz_submitted',
      activityId,
      score,
      totalPoints: activity.totalPoints,
      occurredAt: new Date().toISOString()
    });

    return {
      submissionId: submissionRecord.id,
      score,
      totalPoints: activity.totalPoints,
      percentage,
      passed: percentage >= (activity.passingScorePercentage || 70),
      breakdown: results
    };
  }

  // Enrollments & Progress
  getUserEnrollments(userId) {
    const userEnrollments = this.enrollments.filter(e => e.userId === userId);
    return userEnrollments.map(enr => {
      const course = this.courses.find(c => c.id === enr.courseId) || {};
      return {
        ...enr,
        courseTitle: course.title,
        courseSlug: course.slug,
        categoryName: course.categoryName,
        thumbnailURL: course.thumbnailURL,
        estimatedDuration: course.estimatedDuration
      };
    });
  }

  enrollCourse(userId, courseId) {
    let enrollment = this.enrollments.find(e => e.userId === userId && e.courseId === courseId);
    if (!enrollment) {
      enrollment = {
        id: `enr-${Date.now()}`,
        userId,
        courseId,
        status: 'in-progress',
        progressPercentage: 0,
        completedLessons: [],
        enrolledAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString()
      };
      this.enrollments.push(enrollment);

      // Add to CRM overview count
      this.crmOverview.metrics.totalEnrollments += 1;
      
      const learner = this.learners.find(l => l.id === userId);
      const course = this.courses.find(c => c.id === courseId);
      if (learner) learner.enrolledCoursesCount += 1;

      this.activityLogs.unshift({
        id: `act-log-${Date.now()}`,
        userId,
        userName: learner ? learner.displayName : 'Learner',
        eventType: 'course_enrolled',
        courseId,
        courseTitle: course ? course.title : 'Course',
        occurredAt: new Date().toISOString()
      });
    }
    return enrollment;
  }

  markLessonComplete(userId, lessonId) {
    const lesson = this.lessons.find(l => l.id === lessonId);
    if (!lesson) return null;

    let enrollment = this.enrollments.find(e => e.userId === userId && e.courseId === lesson.courseId);
    if (!enrollment) {
      enrollment = this.enrollCourse(userId, lesson.courseId);
    }

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
      
      // Calculate new progress percentage
      const courseLessons = this.lessons.filter(l => l.courseId === lesson.courseId);
      enrollment.progressPercentage = Math.round((enrollment.completedLessons.length / courseLessons.length) * 100);
      
      if (enrollment.progressPercentage === 100) {
        enrollment.status = 'completed';
        enrollment.completedAt = new Date().toISOString();
        const learner = this.learners.find(l => l.id === userId);
        if (learner) learner.completedCoursesCount += 1;
      }
      enrollment.lastAccessedAt = new Date().toISOString();

      const learner = this.learners.find(l => l.id === userId);
      this.activityLogs.unshift({
        id: `act-log-${Date.now()}`,
        userId,
        userName: learner ? learner.displayName : 'Learner',
        eventType: 'lesson_completed',
        courseId: lesson.courseId,
        lessonId,
        lessonTitle: lesson.title,
        occurredAt: new Date().toISOString()
      });
    }

    return enrollment;
  }

  // CRM & Admin Operations
  getCRMOverview() {
    return {
      metrics: { ...this.crmOverview.metrics, activeCourses: this.courses.length },
      growthChart: this.crmOverview.growthChart,
      recentActivity: this.activityLogs.slice(0, 10).map(log => ({
        id: log.id,
        type: log.eventType.includes('enroll') ? 'enrollment' : log.eventType.includes('quiz') ? 'quiz' : 'completion',
        text: `${log.userName} — ${log.lessonTitle || log.courseTitle || log.eventType.replace('_', ' ')}`,
        user: log.userName,
        timeAgo: 'Just now',
        timestamp: log.occurredAt
      }))
    };
  }

  getLearnersDirectory({ search, status, followUpStatus } = {}) {
    let result = [...this.learners];

    if (status && status !== 'All') {
      result = result.filter(l => l.accountStatus.toLowerCase() === status.toLowerCase());
    }

    if (followUpStatus && followUpStatus !== 'All') {
      result = result.filter(l => l.followUpStatus.toLowerCase() === followUpStatus.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(l => 
        l.displayName.toLowerCase().includes(q) || 
        l.email.toLowerCase().includes(q)
      );
    }

    return result;
  }

  getLearnerProfile360(userId) {
    const learner = this.learners.find(l => l.id === userId);
    if (!learner) return null;

    const enrollments = this.getUserEnrollments(userId);
    const submissions = this.submissions.filter(s => s.userId === userId);
    const timeline = this.activityLogs.filter(a => a.userId === userId);

    return {
      ...learner,
      enrollments,
      submissions,
      timeline,
      notes: learner.notes || []
    };
  }

  addLearnerNote(userId, staffName, text) {
    const learner = this.learners.find(l => l.id === userId);
    if (!learner) return null;

    if (!learner.notes) learner.notes = [];
    const note = {
      id: `note-${Date.now()}`,
      author: staffName || 'Admin',
      text,
      createdAt: new Date().toISOString()
    };
    learner.notes.unshift(note);
    return note;
  }

  updateFollowUpStatus(userId, followUpStatus, staffName) {
    const learner = this.learners.find(l => l.id === userId);
    if (!learner) return null;

    learner.followUpStatus = followUpStatus;
    if (staffName) learner.assignedStaff = staffName;
    learner.updatedAt = new Date().toISOString();
    return learner;
  }

  // Course Admin Management
  createCourse(courseData, creatorId = 'admin') {
    const newCourse = {
      id: `course-${Date.now()}`,
      slug: (courseData.title || 'new-course').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating: 5.0,
      reviewsCount: "1",
      enrolledCount: 0,
      completionRate: 0,
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      modulesCount: 0,
      lessonsCount: 0,
      skillsAwarded: courseData.skillsAwarded || [],
      ...courseData
    };
    this.courses.unshift(newCourse);
    return newCourse;
  }

  updateCourseStatus(courseId, newStatus) {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) return null;
    course.status = newStatus;
    course.updatedAt = new Date().toISOString();
    return course;
  }
}

export const dbStore = new DatabaseStore();

