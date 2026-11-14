import express from 'express';
import cors from 'cors';
import categoriesRoutes from './routes/categories.js';
import coursesRoutes from './routes/courses.js';
import lessonsRoutes from './routes/lessons.js';
import activitiesRoutes from './routes/activities.js';
import meRoutes from './routes/me.js';
import crmRoutes from './routes/crm.js';
import adminRoutes from './routes/admin.js';

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-user-role']
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'EduVerse Platform & CRM API',
    version: '1.0.0'
  });
});

// Mount versioned API routes (/api/v1)
app.use('/api/v1/categories', categoriesRoutes);
app.use('/api/v1/courses', coursesRoutes);
app.use('/api/v1/lessons', lessonsRoutes);
app.use('/api/v1/activities', activitiesRoutes);
app.use('/api/v1/me', meRoutes);
app.use('/api/v1/admin/crm', crmRoutes);
app.use('/api/v1/admin', adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[API Error]:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

export default app;

