import { Router } from 'express';
import { dbStore } from '../data/dbStore.js';
import { verifyAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/v1/me - Learner Profile & Summary
router.get('/', verifyAuth, (req, res) => {
  try {
    let learner = dbStore.getLearnerProfile360(req.user.uid);
    if (!learner) {
      const enrollments = dbStore.getUserEnrollments(req.user.uid) || [];
      const completedCount = enrollments.filter(e => e.status === 'completed').length;
      learner = {
        id: req.user.uid,
        displayName: req.user.displayName || req.user.email?.split('@')[0] || 'Learner',
        email: req.user.email,
        role: 'learner',
        streakDays: 1,
        learningHours: 0,
        skillLevel: 'Beginner',
        passportLevel: 1,
        passportLevelTitle: 'Level 1 Explorer',
        enrolledCoursesCount: enrollments.length,
        completedCoursesCount: completedCount,
        skillsProgress: [],
        achievements: [],
        enrollments,
        notes: []
      };
    }

    res.json({ user: learner });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/me/enrollments
router.get('/enrollments', verifyAuth, (req, res) => {
  try {
    const enrollments = dbStore.getUserEnrollments(req.user.uid);
    res.json({ enrollments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/courses/:courseId/enroll - Handled directly or routed here
router.post('/enroll/:courseId', verifyAuth, (req, res) => {
  try {
    const enrollment = dbStore.enrollCourse(req.user.uid, req.params.courseId);
    res.status(201).json({
      message: 'Successfully enrolled in course',
      enrollment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/me/activity
router.get('/activity', verifyAuth, (req, res) => {
  try {
    const activity = dbStore.activityLogs.filter(a => a.userId === req.user.uid);
    res.json({ activity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

