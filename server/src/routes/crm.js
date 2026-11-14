import { Router } from 'express';
import { dbStore } from '../data/dbStore.js';
import { verifyAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Protect all CRM endpoints for admin or staff
router.use(verifyAuth);
router.use(requireRole(['admin', 'staff']));

// GET /api/v1/admin/crm/overview
router.get('/overview', (req, res) => {
  try {
    const overview = dbStore.getCRMOverview();
    res.json(overview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/admin/crm/learners - Searchable & filterable directory
router.get('/learners', (req, res) => {
  try {
    const { search, status, followUpStatus } = req.query;
    const learners = dbStore.getLearnersDirectory({ search, status, followUpStatus });
    res.json({
      learners,
      total: learners.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/admin/crm/learners/:userId - 360° Profile view
router.get('/learners/:userId', (req, res) => {
  try {
    const profile = dbStore.getLearnerProfile360(req.params.userId);
    if (!profile) {
      return res.status(404).json({ error: 'Learner record not found' });
    }
    res.json({ profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/admin/crm/learners/:userId/notes - Add internal staff note
router.post('/learners/:userId/notes', (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Note text is required' });
    }

    const note = dbStore.addLearnerNote(req.params.userId, req.user.displayName || 'Admin', text.trim());
    if (!note) {
      return res.status(404).json({ error: 'Learner record not found' });
    }
    res.status(201).json({ note });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/v1/admin/crm/learners/:userId/follow-up - Update follow-up status
router.patch('/learners/:userId/follow-up', (req, res) => {
  try {
    const { followUpStatus } = req.body;
    if (!followUpStatus) {
      return res.status(400).json({ error: 'followUpStatus is required' });
    }

    const updatedLearner = dbStore.updateFollowUpStatus(
      req.params.userId,
      followUpStatus,
      req.user.displayName || 'Admin'
    );

    if (!updatedLearner) {
      return res.status(404).json({ error: 'Learner record not found' });
    }

    res.json({ learner: updatedLearner });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

