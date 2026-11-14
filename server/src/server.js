import app from './app.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 EduVerse Platform & CRM Backend API`);
  console.log(`📡 Listening on http://localhost:${PORT}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📚 Courses API: http://localhost:${PORT}/api/v1/courses`);
  console.log(`👥 Learner CRM API: http://localhost:${PORT}/api/v1/admin/crm/overview`);
  console.log(`===============================================`);
});

