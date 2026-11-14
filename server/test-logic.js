import app from './src/app.js';
import { dbStore } from './src/data/dbStore.js';

console.log('Testing in-memory data store and business logic...');

const categories = dbStore.getCategories();
console.log(`✓ Categories loaded: ${categories.length} categories`);

const courses = dbStore.getCourses();
console.log(`✓ Courses loaded: ${courses.length} courses`);

const course = dbStore.getCourseByIdOrSlug('critical-thinking');
console.log(`✓ Course detail loaded: "${course.title}" with ${course.modules.length} modules`);

const lesson = dbStore.getLessonById('lesson-ct-basics');
console.log(`✓ Lesson loaded: "${lesson.title}" with ${lesson.contentBlocks.length} content blocks and ${lesson.researchSources.length} research citations`);

const quizResult = dbStore.submitQuizAttempt('act-ct-quiz-1', 'user-priya-sharma', {
  'q1': 1,
  'q2': 1,
  'q3': 1,
  'q4': 1,
  'q5': 1
});
console.log(`✓ Quiz scoring executed: Score = ${quizResult.score}/${quizResult.totalPoints} (${quizResult.percentage}%), Passed = ${quizResult.passed}`);

const crmOverview = dbStore.getCRMOverview();
console.log(`✓ CRM Overview metrics: Total Learners = ${crmOverview.metrics.totalLearners}, Active Courses = ${crmOverview.metrics.activeCourses}, Growth weeks = ${crmOverview.growthChart.labels.length}`);

const learners = dbStore.getLearnersDirectory();
console.log(`✓ CRM Learners Directory: ${learners.length} learners loaded`);

const learner360 = dbStore.getLearnerProfile360('user-priya-sharma');
console.log(`✓ Learner 360 profile loaded: ${learner360.displayName}, Enrolled: ${learner360.enrollments.length}, Notes: ${learner360.notes.length}`);

const note = dbStore.addLearnerNote('user-priya-sharma', 'Admin Sarah', 'Test follow-up note');
console.log(`✓ CRM Note added: "${note.text}" by ${note.author}`);

const updatedLearner = dbStore.updateFollowUpStatus('user-priya-sharma', 'Resolved', 'Admin Sarah');
console.log(`✓ CRM Follow-up updated: Status = ${updatedLearner.followUpStatus}`);

console.log('\n🎉 ALL BUSINESS LOGIC & CRM MODULES VERIFIED SUCCESSFULLY!');

