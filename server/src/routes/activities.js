import { Router } from 'express';
import { dbStore } from '../data/dbStore.js';
import { verifyAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/v1/activities/:activityId/overview - Assessment Launch overview
router.get('/:activityId/overview', verifyAuth, (req, res) => {
  try {
    const overview = dbStore.getAssessmentOverview(req.params.activityId, req.user.uid);
    if (!overview) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    res.json({ overview });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/activities/attempts/:attemptId - Fetch attempt state & questions
router.get('/attempts/:attemptId', verifyAuth, (req, res) => {
  try {
    const isStaff = req.user && req.user.role === 'admin';
    const state = dbStore.getAttemptState(req.params.attemptId, req.user.uid, isStaff);
    res.json(state);
  } catch (error) {
    const status = error.message.includes('Unauthorized') ? 403 : 404;
    res.status(status).json({ error: error.message });
  }
});

// PUT /api/v1/activities/attempts/:attemptId/responses/:questionId - Autosave answer
router.put('/attempts/:attemptId/responses/:questionId', verifyAuth, (req, res) => {
  try {
    const { selectedOptions, isMarkedForReview } = req.body;
    const result = dbStore.saveAttemptResponse(
      req.params.attemptId,
      req.user.uid,
      req.params.questionId,
      selectedOptions,
      isMarkedForReview
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/v1/activities/attempts/:attemptId/warnings - Record & evaluate misconduct warning
router.post('/attempts/:attemptId/warnings', verifyAuth, (req, res) => {
  try {
    const { eventType, description } = req.body;
    if (!eventType) {
      return res.status(400).json({ error: 'eventType is required' });
    }
    console.log(`[Assessment Server] Warning Event Received: ${eventType} - "${description}" for attempt ${req.params.attemptId}`);
    const result = dbStore.recordAttemptWarning(
      req.params.attemptId,
      req.user ? req.user.uid : null,
      eventType,
      description
    );
    console.log(`[Assessment Server] Attempt ${req.params.attemptId} -> Warning Count: ${result.warningCount}/3, Terminated: ${result.terminated}`);
    res.json(result);
  } catch (error) {
    console.error(`[Assessment Server] Warning Error:`, error.message);
    res.status(400).json({ error: error.message });
  }
});

// POST /api/v1/activities/attempts/:attemptId/heartbeat - Game-style ping latency measurement
router.post('/attempts/:attemptId/heartbeat', verifyAuth, (req, res) => {
  try {
    res.json({
      status: 'ok',
      serverTimestamp: Date.now()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/activities/attempts/:attemptId/submit - Idempotent final submission & evaluation
router.post('/attempts/:attemptId/submit', verifyAuth, (req, res) => {
  try {
    const result = dbStore.submitAssessmentAttempt(req.params.attemptId, req.user.uid);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/v1/activities/:activityId/attempts/start - Start or resume proctoral attempt
router.post('/:activityId/attempts/start', verifyAuth, (req, res) => {
  try {
    const result = dbStore.startAssessmentAttempt(req.params.activityId, req.user.uid);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/v1/activities/:activityId - General activity details
router.get('/:activityId', verifyAuth, (req, res) => {
  try {
    const isStaff = req.user && req.user.role === 'admin';
    const activity = dbStore.getActivityById(req.params.activityId, isStaff);
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    const overview = dbStore.getAssessmentOverview(req.params.activityId, req.user.uid);
    res.json({ activity, overview });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/activities/:activityId/attempts - Dual-mode: start or legacy submit
router.post('/:activityId/attempts', verifyAuth, (req, res) => {
  try {
    const { answers } = req.body;
    if (answers) {
      // Legacy immediate submit
      const result = dbStore.submitQuizAttempt(req.params.activityId, req.user.uid, answers);
      return res.json(result);
    }

    // Start or resume proctoral attempt
    const result = dbStore.startAssessmentAttempt(req.params.activityId, req.user.uid);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
