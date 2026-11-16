export const initialCategories = [
  {
    id: "cat-thinking",
    slug: "thinking-intelligence",
    name: "Thinking & Intelligence",
    description: "Develop structured reasoning, lateral problem-solving, cognitive bias awareness, and decision frameworks.",
    icon: "Brain",
    coursesCount: 12,
    displayOrder: 1,
    isActive: true
  },
  {
    id: "cat-communication",
    slug: "communication",
    name: "Communication",
    description: "Master verbal clarity, persuasive rhetoric, storytelling, and active listening for professional resonance.",
    icon: "MessageSquare",
    coursesCount: 9,
    displayOrder: 2,
    isActive: true
  },
  {
    id: "cat-interpersonal",
    slug: "interpersonal-skills",
    name: "Interpersonal Skills",
    description: "Navigate high-stakes negotiations, cross-functional collaboration, empathy, and conflict resolution.",
    icon: "Users",
    coursesCount: 8,
    displayOrder: 3,
    isActive: true
  },
  {
    id: "cat-creativity",
    slug: "creativity-innovation",
    name: "Creativity & Innovation",
    description: "Learn design thinking heuristics, iterative ideation, visual storytelling, and lateral problem synthesis.",
    icon: "Lightbulb",
    coursesCount: 7,
    displayOrder: 4,
    isActive: true
  },
  {
    id: "cat-personal-dev",
    slug: "personal-development",
    name: "Personal Development",
    description: "Cultivate metacognition, habit architecture, time prioritization, and emotional resilience under pressure.",
    icon: "UserCheck",
    coursesCount: 10,
    displayOrder: 5,
    isActive: true
  },
  {
    id: "cat-life-skills",
    slug: "life-skills",
    name: "Life Skills",
    description: "Foundational personal finance, contractual literacy, critical health awareness, and everyday negotiation.",
    icon: "ShieldCheck",
    coursesCount: 6,
    displayOrder: 6,
    isActive: true
  },
  {
    id: "cat-exploration",
    slug: "exploration",
    name: "Exploration",
    description: "Broaden your mental horizons through philosophy, debate, visual aesthetics, and cross-disciplinary curiosity.",
    icon: "Compass",
    coursesCount: 5,
    displayOrder: 7,
    isActive: true
  }
];

export const initialResearchSources = [
  {
    id: "res-kahneman-2011",
    title: "Thinking, Fast and Slow: Dual-Process Cognitive Architecture",
    authorOrOrganization: "Daniel Kahneman (Princeton University)",
    publicationDate: "2011-10-25",
    sourceType: "Academic Book / Empirical Research",
    publisher: "Farrar, Straus and Giroux",
    url: "https://doi.org/10.1037/e524672012-001",
    doiOrIdentifier: "ISBN 978-0374275631",
    summary: "Comprehensive synthesis of System 1 heuristic thinking versus System 2 deliberate analytical processing, detailing framing effects and cognitive bias mitigating strategies.",
    credibilityNotes: "Nobel Memorial Prize in Economic Sciences Laureate research. Peer-reviewed foundational work.",
    verificationStatus: "Verified & Peer Reviewed",
    copyrightNotes: "Cited under fair-use educational quotation standards. Original synthesis.",
    lastReviewedAt: "2026-09-15T10:00:00Z"
  },
  {
    id: "res-paul-elder-2019",
    title: "The Miniature Guide to Critical Thinking Concepts and Tools (8th Ed.)",
    authorOrOrganization: "Dr. Richard Paul & Dr. Linda Elder (Foundation for Critical Thinking)",
    publicationDate: "2019-06-01",
    sourceType: "Methodological Monograph",
    publisher: "Rowman & Littlefield",
    url: "https://www.criticalthinking.org/pages/defining-critical-thinking/766",
    doiOrIdentifier: "ISBN 978-1538134498",
    summary: "Structural framework of intellectual standards (clarity, accuracy, precision, relevance, depth, breadth, logic, significance, fairness) applied to argument deconstruction.",
    credibilityNotes: "Industry-standard pedagogical framework for higher education critical thinking curriculum.",
    verificationStatus: "Verified",
    copyrightNotes: "Original conceptual synthesis with formal attribution.",
    lastReviewedAt: "2026-10-01T12:00:00Z"
  },
  {
    id: "res-tufte-2001",
    title: "The Visual Display of Quantitative Information (2nd Ed.)",
    authorOrOrganization: "Edward R. Tufte (Yale University)",
    publicationDate: "2001-05-01",
    sourceType: "Academic Monograph",
    publisher: "Graphics Press",
    url: "https://www.edwardtufte.com/tufte/books_vdqi",
    doiOrIdentifier: "ISBN 978-0961392147",
    summary: "Theory and practice in designing data graphics for precise, efficient, and truthful analytical reporting. Maximizing data-ink ratio.",
    credibilityNotes: "Seminal publication in statistical visual design and information ergonomics.",
    verificationStatus: "Verified",
    copyrightNotes: "Educational reference and principles analysis.",
    lastReviewedAt: "2026-10-10T14:30:00Z"
  },
  {
    id: "res-fisher-ury-2011",
    title: "Getting to Yes: Negotiating Agreement Without Giving In",
    authorOrOrganization: "Roger Fisher, William Ury, Bruce Patton (Harvard Negotiation Project)",
    publicationDate: "2011-05-03",
    sourceType: "Institutional Research Monograph",
    publisher: "Penguin Books",
    url: "https://www.pon.harvard.edu/category/research_projects/harvard-negotiation-project/",
    doiOrIdentifier: "ISBN 978-0143118756",
    summary: "Principled negotiation methodology: separating people from problem, focusing on underlying interests rather than positions, inventing options for mutual gain, and insisting on objective criteria (BATNA).",
    credibilityNotes: "Harvard Law School standard negotiation methodology.",
    verificationStatus: "Verified",
    copyrightNotes: "Educational analysis and practice framework.",
    lastReviewedAt: "2026-10-20T09:15:00Z"
  }
];

export const initialCourses = [
  {
    id: "course-critical-thinking",
    slug: "critical-thinking",
    title: "The Basics of Critical Thinking & Analytical Reasoning",
    shortDescription: "Think deeper. Decide better. Learn to evaluate arguments, spot cognitive distortions, and build sound logical deductions.",
    description: "Critical thinking is the disciplined art of analyzing information objectively, diagnosing bias, and formulating reasoned conclusions. In this research-backed curriculum, you explore foundational epistemological standards, deconstruct common cognitive traps using Kahneman's dual-process model, and practice real-world analytical evaluations.",
    categoryId: "cat-thinking",
    categoryName: "Thinking & Intelligence",
    difficulty: "Intermediate",
    rating: 4.8,
    reviewsCount: "12k",
    estimatedDuration: "8 hours",
    modulesCount: 3,
    lessonsCount: 6,
    thumbnailURL: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80",
    bannerURL: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1600&q=80",
    prerequisites: ["Open curiosity", "Willingness to interrogate personal assumptions"],
    learningOutcomes: [
      "Distinguish empirical evidence from subjective assertion and emotional appeals",
      "Identify the 10 most pervasive cognitive biases (confirmation bias, anchoring, availability heuristic)",
      "Construct valid deductive syllogisms and spot fallacies (strawman, ad hominem, false dilemma)",
      "Formulate sound decision matrices under uncertainty with documented trade-offs"
    ],
    status: "Published",
    publishedAt: "2026-09-01T00:00:00Z",
    enrolledCount: 4820,
    completionRate: 74,
    skillsAwarded: ["Critical Thinking", "Analytical Reasoning", "Decision Making"]
  },
  {
    id: "course-data-science",
    slug: "data-science-fundamentals",
    title: "Data Science Fundamentals: Visualizing Insights",
    shortDescription: "Learn how to visualize data effectively using charts, graphs, and statistical storytelling.",
    description: "Modern problem-solvers must communicate data with fidelity and impact. Grounded in Edward Tufte's principles of visual integrity, this course guides you from raw distribution analysis through comparative chart selection, avoiding chart junk, and presenting executive summaries.",
    categoryId: "cat-thinking",
    categoryName: "Thinking & Intelligence",
    difficulty: "Beginner",
    rating: 4.8,
    reviewsCount: "14k",
    estimatedDuration: "6 hours",
    modulesCount: 4,
    lessonsCount: 8,
    thumbnailURL: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    bannerURL: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
    prerequisites: ["Basic arithmetic", "Familiarity with spreadsheets"],
    learningOutcomes: [
      "Select optimal visual forms (bar charts, histograms, scatter plots, sankey diagrams) for specific questions",
      "Audit visualizations for deceptive scaling, baseline truncation, and selective sampling",
      "Translate multidimensional statistical outputs into actionable narrative insights"
    ],
    status: "Published",
    publishedAt: "2026-09-10T00:00:00Z",
    enrolledCount: 6150,
    completionRate: 78,
    skillsAwarded: ["Data Visualization", "Statistical Analysis", "Data Storytelling"]
  },
  {
    id: "course-public-speaking",
    slug: "public-speaking",
    title: "Public Speaking & High-Impact Presentations",
    shortDescription: "Speak with confidence. Structure talks that inspire, persuade, and command audience attention.",
    description: "Conquer stage anxiety through physiological regulation and master the architecture of persuasive rhetoric. Built on classical Aristotelian modes (Ethos, Pathos, Logos) and modern non-verbal communication research.",
    categoryId: "cat-communication",
    categoryName: "Communication",
    difficulty: "Beginner",
    rating: 4.7,
    reviewsCount: "8k",
    estimatedDuration: "8 hours",
    modulesCount: 3,
    lessonsCount: 6,
    thumbnailURL: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
    bannerURL: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80",
    prerequisites: ["No prior speaking experience required"],
    learningOutcomes: [
      "Structure keynote messages using the 'Problem-Agitation-Solution' arc",
      "Regulate vocal pitch, pacing, and intentional pauses to retain audience focus",
      "Deliver memorable slides adhering to the 10/20/30 presentation rule"
    ],
    status: "Published",
    publishedAt: "2026-09-15T00:00:00Z",
    enrolledCount: 3940,
    completionRate: 69,
    skillsAwarded: ["Public Speaking", "Persuasion", "Executive Presence"]
  },
  {
    id: "course-design-thinking",
    slug: "design-thinking",
    title: "Design Thinking & Creative Problem Solving",
    shortDescription: "Solve problems creatively. Turn ambiguity into structured, human-centered innovations.",
    description: "Explore the Stanford d.school five-stage methodology: Empathize, Define, Ideate, Prototype, and Test. Gain concrete tools to interview users, synthesize empathy maps, and iterate rapid paper prototypes.",
    categoryId: "cat-creativity",
    categoryName: "Creativity & Innovation",
    difficulty: "Beginner",
    rating: 4.8,
    reviewsCount: "7k",
    estimatedDuration: "7 hours",
    modulesCount: 3,
    lessonsCount: 6,
    thumbnailURL: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
    bannerURL: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1600&q=80",
    prerequisites: ["Curiosity for user-centered research"],
    learningOutcomes: [
      "Conduct non-leading ethnographic user interviews to uncover latent needs",
      "Formulate high-leverage 'How Might We' problem statements",
      "Facilitate divergent brainstorming workshops with Crazy Eights and SCAMPER techniques"
    ],
    status: "Published",
    publishedAt: "2026-09-20T00:00:00Z",
    enrolledCount: 3120,
    completionRate: 82,
    skillsAwarded: ["Design Thinking", "User Research", "Prototyping"]
  },
  {
    id: "course-negotiation",
    slug: "negotiation-skills",
    title: "Negotiation Skills: Achieving Principled Agreements",
    shortDescription: "Reach win-win solutions without conceding your core interests or damaging valuable relationships.",
    description: "Learn the Harvard Negotiation Project framework. Discover how to identify your BATNA (Best Alternative to a Negotiated Agreement), expand the value pie before dividing it, and anchor terms constructively.",
    categoryId: "cat-interpersonal",
    categoryName: "Interpersonal Skills",
    difficulty: "Intermediate",
    rating: 4.7,
    reviewsCount: "6k",
    estimatedDuration: "8 hours",
    modulesCount: 3,
    lessonsCount: 6,
    thumbnailURL: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80",
    bannerURL: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=80",
    prerequisites: ["None"],
    learningOutcomes: [
      "Distinguish surface positions from core emotional and economic interests",
      "Calculate your true walk-away reservation price and establish a robust BATNA",
      "Defuse hardball tactics, ultimatums, and high-pressure artificial deadlines"
    ],
    status: "Published",
    publishedAt: "2026-09-25T00:00:00Z",
    enrolledCount: 2890,
    completionRate: 71,
    skillsAwarded: ["Negotiation", "Conflict Resolution", "Strategic Compromise"]
  }
];

export const initialModules = [
  // Modules for Critical Thinking Course
  {
    id: "mod-ct-1",
    courseId: "course-critical-thinking",
    title: "Module 1: Foundations of Critical Thinking",
    description: "Explore the core definition of rational evaluation, the dual-process cognitive architecture, and foundational epistemological criteria.",
    displayOrder: 1,
    estimatedDuration: "2.5 hours"
  },
  {
    id: "mod-ct-2",
    courseId: "course-critical-thinking",
    title: "Module 2: Cognitive Biases & Logical Fallacies",
    description: "Unmask heuristics that distort human perception, analyze flawed syllogisms, and build defensive thinking habits.",
    displayOrder: 2,
    estimatedDuration: "3.0 hours"
  },
  {
    id: "mod-ct-3",
    courseId: "course-critical-thinking",
    title: "Module 3: Real-World Applications & Decision Matrices",
    description: "Apply analytical frameworks to high-stakes news evaluation, organizational decisions, and personal life choices.",
    displayOrder: 3,
    estimatedDuration: "2.5 hours"
  },
  // Modules for Data Science Course
  {
    id: "mod-ds-1",
    courseId: "course-data-science",
    title: "Module 1: Introduction to Data Literacy",
    description: "Understand variables, distributions, sampling, and data integrity.",
    displayOrder: 1,
    estimatedDuration: "1.5 hours"
  },
  {
    id: "mod-ds-2",
    courseId: "course-data-science",
    title: "Module 2: Statistical Summaries & Cleanliness",
    description: "Measure central tendency, variance, and detect anomalies.",
    displayOrder: 2,
    estimatedDuration: "1.5 hours"
  },
  {
    id: "mod-ds-3",
    courseId: "course-data-science",
    title: "Module 3: Data Visualization",
    description: "Master chart selection, color ethics, data-ink ratios, and avoid misleading graphs.",
    displayOrder: 3,
    estimatedDuration: "2.0 hours"
  },
  {
    id: "mod-ds-4",
    courseId: "course-data-science",
    title: "Module 4: Insights & Executive Storytelling",
    description: "Communicate conclusions with executive summaries and visual clarity.",
    displayOrder: 4,
    estimatedDuration: "1.0 hours"
  }
];

export const initialLessons = [
  // Lessons for Critical Thinking Module 1
  {
    id: "lesson-ct-basics",
    courseId: "course-critical-thinking",
    moduleId: "mod-ct-1",
    title: "The Basics of Critical Thinking",
    summary: "Critical thinking is the ability to analyze information objectively, evaluate arguments, and make reasoned decisions.",
    readingTimeEstimate: "12 min read",
    displayOrder: 1,
    bannerImageURL: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1200&q=80",
    bannerCaption: "Neural activation patterns during deliberate System 2 analytical processing",
    researchSourceIds: ["res-kahneman-2011", "res-paul-elder-2019"],
    downloadableResources: [
      {
        id: "res-dl-1",
        title: "Critical Thinking Standards Checklist (PDF)",
        size: "1.2 MB",
        type: "pdf",
        url: "#"
      },
      {
        id: "res-dl-2",
        title: "Cognitive Bias Quick Reference Sheet",
        size: "850 KB",
        type: "pdf",
        url: "#"
      }
    ],
    contentBlocks: [
      {
        type: "heading",
        level: 2,
        text: "What Exactly Is Critical Thinking?"
      },
      {
        type: "paragraph",
        text: "Critical thinking is neither cynicism nor a perpetual desire to contradict others. Rather, it is the self-directed, self-disciplined, self-monitored, and self-corrective habits of mind by which we interrogate our own reasoning and the assertions presented to us."
      },
      {
        type: "key_takeaway",
        title: "Core Principle",
        text: "Critical thinking requires a conscious transition from automatic, reactive thinking (System 1) to deliberate, structured reflection (System 2)."
      },
      {
        type: "heading",
        level: 3,
        text: "The Dual-Process Theory (Kahneman & Tversky)"
      },
      {
        type: "paragraph",
        text: "Psychologists characterize human thought as operating across two distinct modalities:"
      },
      {
        type: "comparison_table",
        title: "System 1 vs. System 2 Thinking Modalities",
        headers: ["Characteristic", "System 1 (Heuristic / Fast)", "System 2 (Analytical / Slow)"],
        rows: [
          ["Speed", "Instantaneous, automatic", "Deliberate, effortful"],
          ["Conscious Effort", "Low or subconscious", "High cognitive demand"],
          ["Susceptibility to Bias", "High (anchoring, confirmation bias)", "Lower (when rigorously checked)"],
          ["Energy Cost", "Minimal metabolic load", "High glucose and mental fatigue"],
          ["Ideal Application", "Recognizing faces, braking on red", "Evaluating complex contracts, medical diagnosis"]
        ]
      },
      {
        type: "callout_tip",
        title: "Best-Practice Heuristic",
        text: "Whenever the stakes of a decision are high (financial commitments, strategic plans, hiring decisions), deliberately pause and write down three reasons why your initial intuition might be completely wrong."
      },
      {
        type: "heading",
        level: 3,
        text: "The Eight Universal Intellectual Standards"
      },
      {
        type: "paragraph",
        text: "According to the Foundation for Critical Thinking (Paul & Elder, 2019), whenever you inspect a statement or claim, evaluate it against these fundamental benchmarks:"
      },
      {
        type: "bullet_list",
        items: [
          "**Clarity**: Could you elaborate further? Can you provide an illustrative example?",
          "**Accuracy**: How can we verify whether this claim corresponds with empirical reality?",
          "**Precision**: Are details specific enough, or are vague generalizations hiding assumptions?",
          "**Relevance**: How does this evidence directly connect to the core question at hand?",
          "**Depth**: Does this address the underlying systemic complexities, or is it a superficial answer?",
          "**Breadth**: Have we accounted for alternative viewpoints, contradictory data, or dissenting perspectives?",
          "**Logic**: Does the conclusion inevitably follow from the premises without non-sequiturs?",
          "**Fairness**: Are we representing the opposing argument in its strongest form (steelmanning)?"
        ]
      },
      {
        type: "case_study",
        title: "Case Study: The Challenger Disaster & Confirmation Bias",
        text: "On January 28, 1986, the Space Shuttle Challenger disintegrated 73 seconds into flight. Engineering post-mortems identified that O-ring resilience at freezing temperatures had been challenged prior to launch. However, managers operated under intense schedule pressure and selected only historical flights with zero failures to confirm their launch readiness, completely discounting cold-temperature tests. This tragic instance represents classic organizational confirmation bias and failure of System 2 rigor."
      },
      {
        type: "callout_warning",
        title: "Common Pitfall: The Motivated Reasoner",
        text: "Highly intelligent people frequently use their reasoning capacity not to discover what is true, but to defend preexisting emotional beliefs or ideological alignments. True critical thinking requires intellectual humility."
      },
      {
        type: "reflection_prompt",
        prompt: "Reflect on a decision you made recently where you felt 100% confident initially, but subsequent events revealed you had overlooked vital evidence. Which intellectual standard (accuracy, breadth, depth) was violated?"
      }
    ],
    status: "Published"
  },
  {
    id: "lesson-ct-biases",
    courseId: "course-critical-thinking",
    moduleId: "mod-ct-1",
    title: "Key Concepts & Cognitive Biases",
    summary: "Examine confirmation bias, availability cascade, sunk cost fallacy, and anchoring effects.",
    readingTimeEstimate: "15 min read",
    displayOrder: 2,
    bannerImageURL: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
    bannerCaption: "Systematic patterns of deviation from norm or rationality in judgment",
    researchSourceIds: ["res-kahneman-2011"],
    downloadableResources: [
      {
        id: "res-dl-bias-matrix",
        title: "Cognitive Bias Diagnostic Matrix",
        size: "920 KB",
        type: "pdf",
        url: "#"
      }
    ],
    contentBlocks: [
      {
        type: "heading",
        level: 2,
        text: "The Architecture of Cognitive Distortion"
      },
      {
        type: "paragraph",
        text: "A cognitive bias is not a character flaw; it is an evolutionary shortcut (heuristic) wired into human cognition to conserve energy and react swiftly under prehistoric survival pressures."
      },
      {
        type: "bullet_list",
        items: [
          "**Confirmation Bias**: The tendency to search for, interpret, favor, and recall information in a way that confirms preexisting beliefs.",
          "**Anchoring Bias**: Relying too heavily on the first piece of information encountered when making subsequent estimates or decisions.",
          "**Availability Heuristic**: Overestimating the likelihood of events that easily come to mind due to emotional vividness or recency (e.g., plane crashes vs. automobile collisions).",
          "**Sunk Cost Fallacy**: Continuing an endeavor once an investment in money, effort, or time has been made, regardless of the current expected value."
        ]
      },
      {
        type: "key_takeaway",
        title: "De-Biasing Mechanism",
        text: "You cannot eliminate cognitive bias purely through willpower. You must install structured checklists, pre-mortems, and adversarial peer reviews into your decision workflows."
      }
    ],
    status: "Published"
  },
  {
    id: "lesson-ct-realworld",
    courseId: "course-critical-thinking",
    moduleId: "mod-ct-1",
    title: "Real-World Use & Practical Scenarios",
    summary: "Translate analytical standards to workplace decisions, media consumption, and contract reviews.",
    readingTimeEstimate: "10 min read",
    displayOrder: 3,
    bannerImageURL: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    bannerCaption: "Executing formal decision matrices in professional environments",
    researchSourceIds: ["res-paul-elder-2019"],
    downloadableResources: [],
    contentBlocks: [
      {
        type: "heading",
        level: 2,
        text: "Deploying Critical Thinking in Daily Practice"
      },
      {
        type: "paragraph",
        text: "The true test of analytical acumen is not whether you can solve textbook logic puzzles, but whether you can navigate ambiguous business initiatives, misleading statistics, and emotionally charged team debates."
      }
    ],
    status: "Published"
  },
  // Lesson for Data Science Module 3 (matching reference_design.png exactly!)
  {
    id: "lesson-ds-dataviz",
    courseId: "course-data-science",
    moduleId: "mod-ds-3",
    title: "Data Visualization",
    summary: "Learn how to visualize data effectively using charts and graphs.",
    readingTimeEstimate: "14 min read",
    displayOrder: 3,
    bannerImageURL: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    bannerCaption: "Quantitative charts: Bar, Pie, and Scatter plots for statistical clarity",
    researchSourceIds: ["res-tufte-2001"],
    downloadableResources: [
      {
        id: "res-dl-viz-guide",
        title: "Visualization Guide (PDF)",
        size: "2.4 MB",
        type: "pdf",
        url: "#"
      },
      {
        id: "res-dl-example-data",
        title: "Example Dataset (CSV)",
        size: "180 KB",
        type: "csv",
        url: "#"
      }
    ],
    contentBlocks: [
      {
        type: "heading",
        level: 2,
        text: "The Purpose and Principles of Data Visualization"
      },
      {
        type: "paragraph",
        text: "Data visualization is the graphical representation of information and data. By using visual elements like charts, graphs, and maps, data visualization tools provide an accessible way to see and understand trends, outliers, and patterns in data."
      },
      {
        type: "infographic_chart",
        title: "Visual Form Comparison",
        description: "Choose the chart type that honors your underlying distribution."
      },
      {
        type: "heading",
        level: 3,
        text: "Key Concepts"
      },
      {
        type: "bullet_list",
        items: [
          "**Choosing the right chart type**: Bar charts for discrete categories, Line charts for continuous time series, Scatter plots for bivariate correlations, and Pie/Donut charts strictly for part-to-whole proportions under 5 segments.",
          "**Best practices for visualizations**: Maintain zero baseline on bar charts, avoid 3D chart effects that distort perspective, and ensure colors are accessible to colorblind viewers.",
          "**Tools and libraries**: Mastering modern visualization stacks including D3.js, Chart.js, Recharts, and Python Matplotlib/Seaborn."
        ]
      },
      {
        type: "callout_tip",
        title: "Tufte's Data-Ink Maxim",
        text: "A large share of ink on a graphic should present data-information, the ink changing as the data change. Data-ink is the non-erasable core of a graphic. Erase non-data ink, within reason."
      }
    ],
    status: "Published"
  }
];

export const initialActivities = [
  {
    id: "act-ct-quiz-1",
    courseId: "course-critical-thinking",
    moduleId: "mod-ct-1",
    lessonId: "lesson-ct-basics",
    type: "quiz",
    title: "Foundations of Critical Thinking — Formal Proctoral Assessment",
    description: "Comprehensive 10-question proctoral assessment covering System 1 vs. System 2 cognition, cognitive biases, informal fallacies, and Universal Intellectual Standards.",
    instructions: "This is a proctored examination. You have 15 minutes to complete 10 questions (both single-select and multi-select). Fullscreen mode is enforced. Tab switching or exiting fullscreen will register misconduct warnings. 3 warnings will immediately terminate your attempt. A maximum of 3 attempts are permitted.",
    timeLimitMinutes: 15,
    durationSeconds: 900,
    totalPoints: 25,
    passingScorePercentage: 70,
    attemptLimit: 3,
    warningLimit: 3,
    questionCount: 10,
    negativeMarkingEnabled: false,
    questions: [
      {
        id: "q1",
        question: "Which of the following best defines the primary objective of critical thinking?",
        questionType: "single",
        options: [
          "Accepting institutional consensus without interrogation",
          "Evaluating claims and evidence systematically using objective standards",
          "Generating persuasive emotional appeals in debate",
          "Relying on initial intuitive heuristics to make rapid decisions"
        ],
        correctAnswerIndex: 1,
        marks: 2,
        topicTag: "Foundations",
        difficulty: "Beginner",
        explanation: "Critical thinking specifically requires the systematic, objective analysis and evaluation of evidence, rather than emotional belief or passive acceptance."
      },
      {
        id: "q2",
        question: "According to Kahneman & Tversky's dual-process cognition model, System 1 thinking is characterized as:",
        questionType: "single",
        options: [
          "Deliberate, slow, metabolically demanding, and structured",
          "Fast, automatic, subconscious, and heuristic-driven",
          "Exclusively activated during advanced mathematical calculations",
          "Completely immune to framing effects and cognitive bias"
        ],
        correctAnswerIndex: 1,
        marks: 2,
        topicTag: "Dual-Process Theory",
        difficulty: "Intermediate",
        explanation: "System 1 is the rapid, heuristic, automatic mode of cognition that responds instantaneously with low conscious effort, while System 2 is slow, deliberate, and effortful."
      },
      {
        id: "q3",
        question: "Which of the following behavioral patterns are direct manifestations of Confirmation Bias? (Select all that apply)",
        questionType: "multiple",
        options: [
          "Searching specifically for data that validates an already-formed hypothesis",
          "Discounting or dismissing contradictory peer-reviewed findings",
          "Actively seeking disconfirming evidence to stress-test one's own assumptions",
          "Interpreting ambiguous observations as unequivocal support for one's own view",
          "Immediately updating beliefs when presented with rigorous counter-evidence"
        ],
        correctAnswerIndices: [0, 1, 3],
        marks: 3,
        topicTag: "Cognitive Biases",
        difficulty: "Intermediate",
        explanation: "Confirmation bias manifests through cherry-picking supporting data (A), discounting contradictory findings (B), and interpreting ambiguous facts favorably (D). Actively seeking disconfirming evidence (C) and updating beliefs (E) are critical thinking remedies against confirmation bias."
      },
      {
        id: "q4",
        question: "A tech company continues funding a failing software project solely because they have already spent $4,000,000 on it. What cognitive fallacy does this represent?",
        questionType: "single",
        options: [
          "Availability cascade",
          "Sunk cost fallacy",
          "Fundamental attribution error",
          "Survivorship bias"
        ],
        correctAnswerIndex: 1,
        marks: 2,
        topicTag: "Fallacies",
        difficulty: "Beginner",
        explanation: "The sunk cost fallacy occurs when unrecoverable past investments dictate future decisions instead of future expected utility and objective prospects."
      },
      {
        id: "q5",
        question: "In academic and strategic discourse, 'steelmanning' an opposing argument refers to:",
        questionType: "single",
        options: [
          "Misrepresenting the argument to make it trivially easy to refute",
          "Constructing the strongest, most coherent version of the opposing argument before critiquing it",
          "Attacking the speaker's personal motives instead of evaluating their evidence",
          "Repeating your original thesis continuously until the counterparty concedes"
        ],
        correctAnswerIndex: 1,
        marks: 2,
        topicTag: "Intellectual Standards",
        difficulty: "Intermediate",
        explanation: "Steelmanning is the intellectual standard of fairness where one constructs the most rigorous, charitable, and formidable representation of an opponent's viewpoint before analyzing its validity."
      },
      {
        id: "q6",
        question: "Which of the following examples represent valid Informal Logical Fallacies? (Select all that apply)",
        questionType: "multiple",
        options: [
          "Ad Hominem: Discrediting a mathematical claim by insulting the researcher's appearance",
          "Modus Ponens: If P implies Q, and P is true, then Q must be true",
          "False Dilemma: Forcing an audience to choose between only two extremes when nuances exist",
          "Post Hoc Ergo Propter Hoc: Assuming that because event B followed event A, event A caused event B",
          "Empirical Verification: Cross-referencing field data against calibrated control benchmarks"
        ],
        correctAnswerIndices: [0, 2, 3],
        marks: 3,
        topicTag: "Informal Fallacies",
        difficulty: "Advanced",
        explanation: "Ad Hominem (A), False Dilemma (C), and Post Hoc Ergo Propter Hoc (D) are classic informal fallacies. Modus Ponens (B) is a valid rule of deductive inference, and Empirical Verification (E) is scientific method practice."
      },
      {
        id: "q7",
        question: "Which Universal Intellectual Standard (Paul & Elder) asks: 'Could you give an illustrative concrete example to clarify what this assertion means in practice?'",
        questionType: "single",
        options: [
          "Breadth",
          "Precision",
          "Clarity",
          "Fairness"
        ],
        correctAnswerIndex: 2,
        marks: 2,
        topicTag: "Intellectual Standards",
        difficulty: "Beginner",
        explanation: "Clarity asks whether a statement is understandable, requiring elaboration, illustration, or examples if vague."
      },
      {
        id: "q8",
        question: "In a corporate negotiation, the first number stated on the table heavily influences subsequent counteroffers, regardless of its objective merit. This heuristic phenomenon is known as:",
        questionType: "single",
        options: [
          "Anchoring bias",
          "Hindsight bias",
          "The framing effect",
          "The halo effect"
        ],
        correctAnswerIndex: 0,
        marks: 2,
        topicTag: "Heuristics",
        difficulty: "Intermediate",
        explanation: "Anchoring bias is the tendency to rely too heavily on the initial piece of information offered (the 'anchor') when making decisions or estimations."
      },
      {
        id: "q9",
        question: "What conditions must be satisfied for a deductive argument to be considered 'Sound'? (Select all that apply)",
        questionType: "multiple",
        options: [
          "The argument must be logically valid (the conclusion follows necessarily from premises)",
          "All premises within the argument must be empirically true in reality",
          "The conclusion must be emotionally pleasant and universally popular",
          "The argument must rely on circular reasoning to reinforce its own premise"
        ],
        correctAnswerIndices: [0, 1],
        marks: 4,
        topicTag: "Deductive Logic",
        difficulty: "Advanced",
        explanation: "In formal logic, an argument is 'Sound' if and only if (1) it is logically valid in structure, and (2) all of its premises are factually true. Popularity (C) and circularity (D) are irrelevant or invalid."
      },
      {
        id: "q10",
        question: "Why do individuals often estimate the probability of airplane crashes as higher than car accidents, despite statistics proving the opposite?",
        questionType: "single",
        options: [
          "Airplane accidents are more frequently covered by insurance companies",
          "Availability heuristic: Vivid, catastrophic airplane crashes are recalled with greater cognitive ease",
          "System 2 thinking automatically prioritizes aviation physics",
          "Confirmation bias prevents people from recognizing automobiles"
        ],
        correctAnswerIndex: 1,
        marks: 3,
        topicTag: "Availability Heuristic",
        difficulty: "Intermediate",
        explanation: "The Availability Heuristic leads people to assess frequency or probability based on how easily examples come to mind; highly publicized and vivid events are easily recalled and therefore perceived as more probable."
      }
    ]
  },
  {
    id: "act-ds-quiz-1",
    courseId: "course-data-science",
    moduleId: "mod-ds-3",
    lessonId: "lesson-ds-dataviz",
    type: "quiz",
    title: "Quick Quiz: Data Visualization Principles",
    instructions: "Test your knowledge of chart mechanics, visual ethics, and data-ink ratio.",
    timeLimitMinutes: 10,
    totalPoints: 10,
    questions: [
      {
        id: "qd1",
        question: "What is the primary purpose of data visualization?",
        options: [
          "To store data securely",
          "To represent data visually for clear insight",
          "To clean noisy data",
          "To analyze data manually in binary"
        ],
        correctAnswerIndex: 1,
        explanation: "Data visualization translates numerical distributions into perceptual patterns so decision-makers can spot trends, anomalies, and insights quickly."
      },
      {
        id: "qd2",
        question: "Why is truncating the y-axis (not starting at zero) on a bar chart generally considered deceptive?",
        options: [
          "It makes the file size too large",
          "It artificially exaggerates relatively minor percentage differences",
          "It violates RGB color compliance",
          "Computers cannot render numbers starting above zero"
        ],
        correctAnswerIndex: 1,
        explanation: "Because human vision perceives bar magnitude proportionally by length, truncating the baseline exaggerates modest variance into dramatic false disparities."
      }
    ]
  },
  {
    id: "act-ct-assignment-1",
    courseId: "course-critical-thinking",
    moduleId: "mod-ct-2",
    lessonId: "lesson-ct-biases",
    type: "assignment",
    title: "Cognitive Bias Audit of a Recent Public Debate",
    instructions: "Select an article, press release, or debate transcript from the past 12 months. Identify at least two distinct cognitive biases or logical fallacies present in the arguments. Propose how the author or speaker could have reformatted their claim to satisfy the standards of Clarity and Accuracy.",
    totalPoints: 100,
    rubric: [
      { criterion: "Bias & Fallacy Identification", points: 40, description: "Accurately name and demonstrate bias with direct citations." },
      { criterion: "Intellectual Standards Analysis", points: 30, description: "Assess clarity, accuracy, breadth, and depth rigorously." },
      { criterion: "Constructive Reformulation", points: 30, description: "Provide an objective, steelmanned alternative statement." }
    ]
  }
];

export const initialLearners = [
  {
    id: "user-priya-sharma",
    displayName: "Priya Sharma",
    email: "priya.sharma@example.com",
    role: "learner",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    accountStatus: "active",
    createdAt: "2026-08-14T09:30:00Z",
    streakDays: 7,
    learningHours: 24.5,
    skillLevel: "Intermediate",
    passportLevel: 2,
    passportLevelTitle: "Level 2 Learner",
    enrolledCoursesCount: 5,
    completedCoursesCount: 3,
    followUpStatus: "Resolved",
    assignedStaff: "Admin Sarah",
    lastActiveAt: "2026-11-13T12:45:00Z",
    skillsProgress: [
      { skill: "Data Science", percentage: 78, level: "Advanced" },
      { skill: "Communication", percentage: 72, level: "Intermediate" },
      { skill: "Problem Solving", percentage: 66, level: "Intermediate" },
      { skill: "Critical Thinking", percentage: 85, level: "Proficient" }
    ],
    achievements: [
      { id: "ach-1", title: "Quick Learner", icon: "Zap", date: "2026-09-02" },
      { id: "ach-2", title: "Top Performer", icon: "Award", date: "2026-09-28" },
      { id: "ach-3", title: "Course Star", icon: "Star", date: "2026-10-14" },
      { id: "ach-4", title: "7-Day Streak", icon: "Flame", date: "2026-11-13" }
    ],
    notes: [
      {
        id: "note-1",
        author: "Admin Sarah",
        text: "Priya completed 3 courses with outstanding quiz scores (average 94%). Verified Skill Passport credentials generated.",
        createdAt: "2026-10-15T14:20:00Z"
      }
    ]
  },
  {
    id: "user-alex-chen",
    displayName: "Alex Chen",
    email: "alex.chen@example.com",
    role: "learner",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    accountStatus: "active",
    createdAt: "2026-09-01T11:15:00Z",
    streakDays: 3,
    learningHours: 14.0,
    skillLevel: "Beginner",
    passportLevel: 1,
    passportLevelTitle: "Level 1 Explorer",
    enrolledCoursesCount: 3,
    completedCoursesCount: 1,
    followUpStatus: "Needs Attention",
    assignedStaff: "David Miller",
    lastActiveAt: "2026-11-12T16:20:00Z",
    skillsProgress: [
      { skill: "Critical Thinking", percentage: 45, level: "Beginner" },
      { skill: "Public Speaking", percentage: 30, level: "Beginner" }
    ],
    achievements: [
      { id: "ach-1", title: "First Course Completed", icon: "Award", date: "2026-09-20" }
    ],
    notes: [
      {
        id: "note-alex-1",
        author: "David Miller",
        text: "Learner reached out regarding rubrics for the Critical Thinking essay. Sent guidance guide on 11/12.",
        createdAt: "2026-11-12T17:00:00Z"
      }
    ]
  },
  {
    id: "user-marcus-vance",
    displayName: "Marcus Vance",
    email: "marcus.v@example.com",
    role: "learner",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    accountStatus: "inactive",
    createdAt: "2026-09-10T08:00:00Z",
    streakDays: 0,
    learningHours: 2.5,
    skillLevel: "Beginner",
    passportLevel: 1,
    passportLevelTitle: "Level 1 Explorer",
    enrolledCoursesCount: 2,
    completedCoursesCount: 0,
    followUpStatus: "Needs Attention",
    assignedStaff: "Admin Sarah",
    lastActiveAt: "2026-10-24T10:00:00Z",
    skillsProgress: [
      { skill: "Negotiation", percentage: 15, level: "Beginner" }
    ],
    achievements: [],
    notes: [
      {
        id: "note-mv-1",
        author: "Admin Sarah",
        text: "Inactive for > 18 days. Stalled after failing quiz attempt on Module 1. Recommended automated encouragement check-in.",
        createdAt: "2026-11-05T09:00:00Z"
      }
    ]
  },
  {
    id: "user-sophia-rivera",
    displayName: "Sophia Rivera",
    email: "sophia.r@example.com",
    role: "learner",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    accountStatus: "active",
    createdAt: "2026-08-20T14:40:00Z",
    streakDays: 12,
    learningHours: 31.0,
    skillLevel: "Advanced",
    passportLevel: 3,
    passportLevelTitle: "Level 3 Scholar",
    enrolledCoursesCount: 6,
    completedCoursesCount: 4,
    followUpStatus: "Contacted",
    assignedStaff: "David Miller",
    lastActiveAt: "2026-11-13T11:10:00Z",
    skillsProgress: [
      { skill: "Design Thinking", percentage: 92, level: "Expert" },
      { skill: "Creative Problem Solving", percentage: 88, level: "Advanced" }
    ],
    achievements: [
      { id: "ach-1", title: "Top Scholar", icon: "Trophy", date: "2026-10-01" },
      { id: "ach-2", title: "Streak Master", icon: "Flame", date: "2026-11-10" }
    ],
    notes: [
      {
        id: "note-sr-1",
        author: "David Miller",
        text: "Contacted regarding participation as a peer mentor in upcoming Design Thinking workshops.",
        createdAt: "2026-11-10T15:30:00Z"
      }
    ]
  },
  {
    id: "user-daniel-kim",
    displayName: "Daniel Kim",
    email: "daniel.kim@example.com",
    role: "learner",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
    accountStatus: "active",
    createdAt: "2026-08-01T09:00:00Z",
    streakDays: 19,
    learningHours: 42.0,
    skillLevel: "Advanced",
    passportLevel: 3,
    passportLevelTitle: "Level 3 Scholar",
    enrolledCoursesCount: 7,
    completedCoursesCount: 5,
    followUpStatus: "Resolved",
    assignedStaff: "Admin Sarah",
    lastActiveAt: "2026-11-13T08:30:00Z",
    skillsProgress: [
      { skill: "Critical Thinking", percentage: 95, level: "Expert" },
      { skill: "Financial Literacy", percentage: 89, level: "Advanced" }
    ],
    achievements: [
      { id: "ach-1", title: "Master Thinker", icon: "Award", date: "2026-09-15" }
    ],
    notes: []
  }
];

export const initialEnrollments = [
  {
    id: "enr-priya-ct",
    userId: "user-priya-sharma",
    courseId: "course-critical-thinking",
    status: "in-progress",
    progressPercentage: 65,
    completedLessons: ["lesson-ct-basics"],
    enrolledAt: "2026-10-01T10:00:00Z",
    lastAccessedAt: "2026-11-13T12:30:00Z"
  },
  {
    id: "enr-priya-ds",
    userId: "user-priya-sharma",
    courseId: "course-data-science",
    status: "in-progress",
    progressPercentage: 75,
    completedLessons: ["lesson-ds-dataviz"],
    enrolledAt: "2026-10-05T12:00:00Z",
    lastAccessedAt: "2026-11-13T12:45:00Z"
  },
  {
    id: "enr-priya-ps",
    userId: "user-priya-sharma",
    courseId: "course-public-speaking",
    status: "completed",
    progressPercentage: 100,
    completedLessons: ["lesson-ps-1", "lesson-ps-2"],
    enrolledAt: "2026-09-01T08:00:00Z",
    completedAt: "2026-09-25T16:00:00Z",
    lastAccessedAt: "2026-09-25T16:00:00Z"
  }
];

export const initialCRMOverview = {
  metrics: {
    totalLearners: 12480,
    learnersGrowthPct: 12,
    activeCourses: 5,
    activeCoursesGrowthPct: 9,
    completionRate: 76,
    completionRateGrowthPct: 5,
    revenue: 248000,
    revenueFormatted: "₹2,48,000",
    revenueGrowthPct: 18,
    activeLearnersPast30Days: 8940,
    pendingAssignments: 34,
    totalEnrollments: 28450
  },
  growthChart: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    thisMonth: [4200, 7100, 9800, 12480],
    lastMonth: [3100, 4800, 7200, 9400]
  },
  recentActivity: [
    {
      id: "ev-1",
      type: "enrollment",
      text: "New enrollment in Data Science Fundamentals",
      user: "Priya Sharma",
      timeAgo: "2 min ago",
      timestamp: "2026-11-13T12:45:00Z"
    },
    {
      id: "ev-2",
      type: "submission",
      text: "Assignment submitted: Cognitive Bias Audit",
      user: "Alex Chen",
      timeAgo: "5 min ago",
      timestamp: "2026-11-13T12:42:00Z"
    },
    {
      id: "ev-3",
      type: "completion",
      text: "Course completed: Public Speaking Mastery",
      user: "Sophia Rivera",
      timeAgo: "12 min ago",
      timestamp: "2026-11-13T12:35:00Z"
    },
    {
      id: "ev-4",
      type: "quiz",
      text: "Quiz completed: Data Visualization (Score 10/10)",
      user: "Daniel Kim",
      timeAgo: "34 min ago",
      timestamp: "2026-11-13T12:13:00Z"
    },
    {
      id: "ev-5",
      type: "registration",
      text: "New user registered: Emily Watson",
      user: "Emily Watson",
      timeAgo: "1 hour ago",
      timestamp: "2026-11-13T11:47:00Z"
    }
  ]
};

