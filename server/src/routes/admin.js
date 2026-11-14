import { Router } from 'express';
import { dbStore } from '../data/dbStore.js';
import { verifyAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(verifyAuth);
router.use(requireRole(['admin', 'editor', 'reviewer']));

// GET /api/v1/admin/courses - list all courses including drafts & in-review
router.get('/courses', (req, res) => {
  try {
    const courses = dbStore.courses;
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/admin/courses - create course
router.post('/courses', (req, res) => {
  try {
    const newCourse = dbStore.createCourse(req.body, req.user.uid);
    res.status(201).json({ course: newCourse });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH /api/v1/admin/courses/:courseId/status - Publication workflow
router.patch('/courses/:courseId/status', (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Draft', 'In Review', 'Approved', 'Published', 'Archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const updated = dbStore.updateCourseStatus(req.params.courseId, status);
    if (!updated) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ course: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/admin/research-sources
router.get('/research-sources', (req, res) => {
  try {
    res.json({ sources: dbStore.researchSources });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/admin/research-sources
router.post('/research-sources', (req, res) => {
  try {
    const newSource = {
      id: `res-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...req.body
    };
    dbStore.researchSources.unshift(newSource);
    res.status(201).json({ source: newSource });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

