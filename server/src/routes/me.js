import { Router } from 'express';
import { dbStore } from '../data/dbStore.js';
import { verifyAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/v1/me - Learner Profile & Summary
router.get('/', verifyAuth, (req, res) => {
  try {
    const learner = dbStore.getLearnerProfile360(req.user.uid) || {
      id: req.user.uid,
      displayName: req.user.displayName,
      email: req.user.email,
      role: req.user.role || 'learner',
      streakDays: 7,
      learningHours: 24.5,
      skillLevel: 'Intermediate',
      passportLevel: 2,
      passportLevelTitle: 'Level 2 Learner',
      enrolledCoursesCount: 5,
      completedCoursesCount: 3,
      skillsProgress: [
        { skill: "Data Science", percentage: 78, level: "Advanced" },
        { skill: "Communication", percentage: 72, level: "Intermediate" },
        { skill: "Problem Solving", percentage: 66, level: "Intermediate" }
      ],
      achievements: [
        { id: "ach-1", title: "Quick Learner", icon: "Zap", date: "2026-09-02" },
        { id: "ach-2", title: "Top Performer", icon: "Award", date: "2026-09-28" },
        { id: "ach-3", title: "Course Star", icon: "Star", date: "2026-10-14" }
      ]
    };

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

