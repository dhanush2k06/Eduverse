import { Router } from 'express';
import { dbStore } from '../data/dbStore.js';

const router = Router();

// GET /api/v1/courses - list published courses with filters
router.get('/', (req, res) => {
  try {
    const { search, category, difficulty, status } = req.query;
    const courses = dbStore.getCourses({ search, category, difficulty, status });
    res.json({ courses, total: courses.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/courses/:courseId - course details with outline & syllabus
router.get('/:courseId', (req, res) => {
  try {
    const course = dbStore.getCourseByIdOrSlug(req.params.courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/courses/:courseId/outline
router.get('/:courseId/outline', (req, res) => {
  try {
    const course = dbStore.getCourseByIdOrSlug(req.params.courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({
      courseId: course.id,
      title: course.title,
      modules: course.modules
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

