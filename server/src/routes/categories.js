import { Router } from 'express';
import { dbStore } from '../data/dbStore.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const categories = dbStore.getCategories();
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

