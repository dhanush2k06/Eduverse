const API_BASE = '/api/v1';

const isCRM = () => {
  if (typeof window === 'undefined') return false;
  return (
    window.location.port === '5174' ||
    window.location.pathname.startsWith('/admin') ||
    window.location.pathname.startsWith('/crm')
  );
};

const getHeaders = () => {
  const isCrm = isCRM();
  const tokenKey = isCrm ? 'eduverse_crm_admin_token' : 'eduverse_public_learner_token';
  const userKey = isCrm ? 'eduverse_crm_admin_user' : 'eduverse_public_learner_user';

  const token = localStorage.getItem(tokenKey) || localStorage.getItem('eduverse_token');
  const user = JSON.parse(localStorage.getItem(userKey) || localStorage.getItem('eduverse_user') || '{}');
  
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (user?.uid) {
    headers['x-user-id'] = user.uid;
    headers['x-user-role'] = user.role || (isCrm ? 'admin' : 'learner');
    if (user.email) {
      headers['x-user-email'] = user.email;
    }
  }

  return headers;
};

export const api = {
  // Categories
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to load categories');
    return res.json();
  },

  // Courses
  async getCourses(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/courses?${query}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to load courses');
    return res.json();
  },

  async getCourse(courseId) {
    const res = await fetch(`${API_BASE}/courses/${courseId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Course not found');
    return res.json();
  },

  async getCourseOutline(courseId) {
    const res = await fetch(`${API_BASE}/courses/${courseId}/outline`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Course outline not found');
    return res.json();
  },

  // Lessons
  async getLesson(lessonId) {
    const res = await fetch(`${API_BASE}/lessons/${lessonId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to load lesson');
    return res.json();
  },

  async markLessonComplete(lessonId) {
    const res = await fetch(`${API_BASE}/lessons/${lessonId}/complete`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to mark lesson complete');
    return res.json();
  },

  // Activities & Quizzes
  async getActivity(activityId) {
    const res = await fetch(`${API_BASE}/activities/${activityId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Activity not found');
    return res.json();
  },

  async submitQuizAttempt(activityId, answers) {
    const res = await fetch(`${API_BASE}/activities/${activityId}/attempts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ answers })
    });
    if (!res.ok) throw new Error('Failed to submit quiz attempt');
    return res.json();
  },

  // Learner Me endpoints
  async getMyProfile() {
    const res = await fetch(`${API_BASE}/me`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to load learner profile');
    return res.json();
  },

  async getMyEnrollments() {
    const res = await fetch(`${API_BASE}/me/enrollments`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to load enrollments');
    return res.json();
  },

  async enrollCourse(courseId) {
    const res = await fetch(`${API_BASE}/me/enroll/${courseId}`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to enroll in course');
    return res.json();
  },

  // Learner CRM & Admin endpoints
  async getCRMOverview() {
    const res = await fetch(`${API_BASE}/admin/crm/overview`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to load CRM overview');
    return res.json();
  },

  async getLearnersDirectory(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/crm/learners?${query}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to load learners directory');
    return res.json();
  },

  async getLearnerProfile360(userId) {
    const res = await fetch(`${API_BASE}/admin/crm/learners/${userId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to load learner 360 profile');
    return res.json();
  },

  async addLearnerNote(userId, text) {
    const res = await fetch(`${API_BASE}/admin/crm/learners/${userId}/notes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error('Failed to add note');
    return res.json();
  },

  async updateFollowUpStatus(userId, followUpStatus) {
    const res = await fetch(`${API_BASE}/admin/crm/learners/${userId}/follow-up`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ followUpStatus })
    });
    if (!res.ok) throw new Error('Failed to update follow-up status');
    return res.json();
  },

  // Admin Courses & Research
  async getAdminCourses() {
    const res = await fetch(`${API_BASE}/admin/courses`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to load admin courses');
    return res.json();
  },

  async createCourse(courseData) {
    const res = await fetch(`${API_BASE}/admin/courses`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(courseData)
    });
    if (!res.ok) throw new Error('Failed to create course');
    return res.json();
  },

  async updateCourseStatus(courseId, status) {
    const res = await fetch(`${API_BASE}/admin/courses/${courseId}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },

  async getResearchSources() {
    const res = await fetch(`${API_BASE}/admin/research-sources`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to load research sources');
    return res.json();
  },

  async addResearchSource(sourceData) {
    const res = await fetch(`${API_BASE}/admin/research-sources`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(sourceData)
    });
    if (!res.ok) throw new Error('Failed to add research source');
    return res.json();
  }
};

