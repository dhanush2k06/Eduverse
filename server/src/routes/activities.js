import { Router } from 'express';
import { dbStore } from '../data/dbStore.js';
import { verifyAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/v1/activities/:activityId
router.get('/:activityId', verifyAuth, (req, res) => {
  try {
    const isStaff = req.user && req.user.role === 'admin';
    const activity = dbStore.getActivityById(req.params.activityId, isStaff);
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    res.json({ activity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/activities/:activityId/attempts - Submit quiz attempt
router.post('/:activityId/attempts', verifyAuth, (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers) {
      return res.status(400).json({ error: 'Answers payload is required' });
    }

    const result = dbStore.submitQuizAttempt(req.params.activityId, req.user.uid, answers);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

