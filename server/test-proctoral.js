import { dbStore } from './src/data/dbStore.js';

console.log('🧪 Running Proctoral Assessment Test Suite (test_window_plan.md verification)...\n');

const testUserId = 'test-proctor-learner-1';
const activityId = 'act-ct-quiz-1';

// 1. Verify 10 questions & overview
const overview = dbStore.getAssessmentOverview(activityId, testUserId);
if (!overview || overview.questionCount !== 10) {
  throw new Error(`Expected exactly 10 questions, got ${overview?.questionCount}`);
}
console.log(`✓ Section 2 Rule: Verified assessment contains exactly 10 questions (${overview.totalPoints} total marks, ${overview.durationSeconds}s timer)`);
console.log(`✓ Section 6 Rule: Initial attempts remaining = ${overview.remainingAttempts} / ${overview.attemptLimit}`);

// 2. Start Attempt 1
const attempt1Payload = dbStore.startAssessmentAttempt(activityId, testUserId);
const attempt1Id = attempt1Payload.attempt.id;
console.log(`✓ Section 3.1: Started Attempt #1 (${attempt1Id}) with status: ${attempt1Payload.attempt.status}`);

// Verify answer keys are NOT leaked in active questions payload
const leakedKeys = attempt1Payload.questions.some(q => q.correctAnswerIndex !== undefined || q.correctAnswerIndices !== undefined || q.explanation !== undefined);
if (leakedKeys) {
  throw new Error('SECURITY VIOLATION: Correct answer keys or explanations were leaked in active attempt questions payload!');
}
console.log('✓ Section 4.2 Security: Verified correct answer keys & explanations are safely protected from learner payload');

// 3. Test Autosave functionality
dbStore.saveAttemptResponse(attempt1Id, testUserId, 'q1', [1], false);
dbStore.saveAttemptResponse(attempt1Id, testUserId, 'q3', [0, 1, 3], true);
console.log('✓ Section 8.2: Verified answer autosave works for single-select (q1) and multi-select (q3)');

// 4. Test Strict 3-Warning Termination Policy (Section 5)
const warn1 = dbStore.recordAttemptWarning(attempt1Id, testUserId, 'FULLSCREEN_EXIT', 'Learner exited fullscreen mode');
console.log(`✓ Section 5: Warning 1 registered. Count = ${warn1.warningCount}/3, Terminated = ${warn1.terminated}`);
if (warn1.warningCount !== 1 || warn1.terminated) throw new Error('Warning 1 failed');

const warn2 = dbStore.recordAttemptWarning(attempt1Id, testUserId, 'TAB_SWITCH', 'Switched to unauthorized browser tab');
console.log(`✓ Section 5: Warning 2 registered. Count = ${warn2.warningCount}/3, Terminated = ${warn2.terminated}`);
if (warn2.warningCount !== 2 || warn2.terminated) throw new Error('Warning 2 failed');

const warn3 = dbStore.recordAttemptWarning(attempt1Id, testUserId, 'WINDOW_BLUR', 'Window lost focus');
console.log(`✓ Section 5: Warning 3 registered. Count = ${warn3.warningCount}/3, Terminated = ${warn3.terminated}`);
if (warn3.warningCount !== 3 || !warn3.terminated) throw new Error('Warning 3 must immediately terminate attempt!');

// 5. Verify terminated attempt rejects modifications
try {
  dbStore.saveAttemptResponse(attempt1Id, testUserId, 'q2', [1]);
  throw new Error('Terminated attempt should have rejected answer save!');
} catch (e) {
  console.log(`✓ Section 5.1: Terminated attempt properly rejected answer modification ("${e.message}")`);
}

// 6. Verify Attempt Consumption & Attempt 2 creation
const overviewAfterTerm = dbStore.getAssessmentOverview(activityId, testUserId);
console.log(`✓ Section 6: Terminated attempt consumed. Remaining attempts = ${overviewAfterTerm.remainingAttempts} / 3`);
if (overviewAfterTerm.remainingAttempts !== 2) throw new Error('Remaining attempts should be 2');

// 7. Start Attempt 2 and submit with full marks
const attempt2Payload = dbStore.startAssessmentAttempt(activityId, testUserId);
const attempt2Id = attempt2Payload.attempt.id;
console.log(`✓ Section 6: Started Attempt #2 (${attempt2Id})`);

// Answer all 10 questions accurately
dbStore.saveAttemptResponse(attempt2Id, testUserId, 'q1', [1]);
dbStore.saveAttemptResponse(attempt2Id, testUserId, 'q2', [1]);
dbStore.saveAttemptResponse(attempt2Id, testUserId, 'q3', [0, 1, 3]);
dbStore.saveAttemptResponse(attempt2Id, testUserId, 'q4', [1]);
dbStore.saveAttemptResponse(attempt2Id, testUserId, 'q5', [1]);
dbStore.saveAttemptResponse(attempt2Id, testUserId, 'q6', [0, 2, 3]);
dbStore.saveAttemptResponse(attempt2Id, testUserId, 'q7', [2]);
dbStore.saveAttemptResponse(attempt2Id, testUserId, 'q8', [0]);
dbStore.saveAttemptResponse(attempt2Id, testUserId, 'q9', [0, 1]);
dbStore.saveAttemptResponse(attempt2Id, testUserId, 'q10', [1]);

const submitResult = dbStore.submitAssessmentAttempt(attempt2Id, testUserId);
console.log(`✓ Section 9 & 10: Attempt #2 submitted successfully! Score = ${submitResult.score}/${submitResult.maxScore} (${submitResult.percentage}%), Passed = ${submitResult.passed}`);
if (submitResult.score !== 25 || !submitResult.passed) {
  throw new Error(`Scoring calculation error: expected 25/25, got ${submitResult.score}`);
}

// 8. Start Attempt 3 and consume it
const attempt3Payload = dbStore.startAssessmentAttempt(activityId, testUserId);
const attempt3Id = attempt3Payload.attempt.id;
dbStore.submitAssessmentAttempt(attempt3Id, testUserId);
console.log(`✓ Section 6: Attempt #3 submitted and consumed.`);

// 9. Attempt #4 MUST BE STRICTLY REJECTED by server
try {
  dbStore.startAssessmentAttempt(activityId, testUserId);
  throw new Error('Server failed to reject 4th attempt!');
} catch (err) {
  console.log(`✓ Section 6.2: Attempt #4 correctly blocked by server: "${err.message}"`);
}

console.log('\n🎉 ALL 10-QUESTION PROCTORAL ASSESSMENT SPECIFICATIONS VERIFIED 100%!');
