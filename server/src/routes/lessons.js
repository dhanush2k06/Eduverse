import { Router } from 'express';
import { dbStore } from '../data/dbStore.js';
import { verifyAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/v1/lessons/:lessonId - Fetch full lesson reading content, blocks, and research references
router.get('/:lessonId', verifyAuth, (req, res) => {
  try {
    const lesson = dbStore.getLessonById(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    res.json({ lesson });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/lessons/:lessonId/start - Mark start / track activity
router.post('/:lessonId/start', verifyAuth, (req, res) => {
  try {
    const lesson = dbStore.getLessonById(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    res.json({ message: 'Lesson session started', lessonId: lesson.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/lessons/:lessonId/complete - Mark lesson complete
router.post('/:lessonId/complete', verifyAuth, (req, res) => {
  try {
    const enrollment = dbStore.markLessonComplete(req.user.uid, req.params.lessonId);
    if (!enrollment) {
      return res.status(404).json({ error: 'Lesson not found or unable to mark complete' });
    }
    res.json({
      message: 'Lesson marked as complete',
      lessonId: req.params.lessonId,
      enrollment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

