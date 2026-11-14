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

    // Sanitize quiz questions so learner cannot see correctAnswerIndex in payload!
    if (activity.type === 'quiz' && !isStaff) {
      const sanitizedQuestions = activity.questions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options
      }));
      return {
        ...activity,
        questions: sanitizedQuestions
      };
    }

    return activity;
  }

  submitQuizAttempt(activityId, userId, answers) {
    const activity = this.activities.find(a => a.id === activityId);
    if (!activity || activity.type !== 'quiz') {
      throw new Error('Invalid quiz activity');
    }

    let correctCount = 0;
    const results = activity.questions.map(q => {
      const selectedIndex = answers[q.id];
      const isCorrect = selectedIndex === q.correctAnswerIndex;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        selectedIndex,
        correctAnswerIndex: q.correctAnswerIndex,
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

    // Record activity event
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
      passed: percentage >= 70,
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

