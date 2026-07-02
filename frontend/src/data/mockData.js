export const skillCards = [
  {
    id: 'listening',
    title: 'Listening',
    description: 'Practice listening comprehension with real IELTS audio passages and diverse question types.',
    icon: 'Headphones',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    lessons: 24,
    completed: 8,
  },
  {
    id: 'reading',
    title: 'Reading',
    description: 'Improve reading speed and accuracy with academic and general training passages.',
    icon: 'BookOpen',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    lessons: 30,
    completed: 12,
  },
  {
    id: 'writing',
    title: 'Writing',
    description: 'Master Task 1 & Task 2 essays with structured templates and AI-powered feedback.',
    icon: 'PenTool',
    color: 'from-violet-500 to-violet-600',
    bgColor: 'bg-violet-50',
    lessons: 18,
    completed: 6,
  },
  {
    id: 'speaking',
    title: 'Speaking',
    description: 'Build fluency and confidence with AI-assessed cue cards and pronunciation analysis.',
    icon: 'Mic',
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50',
    lessons: 20,
    completed: 5,
  },
];

export const writingLessons = [
  {
    id: 1,
    title: 'Describing Charts & Graphs',
    description: 'Learn to interpret and describe visual data effectively for Task 1.',
    duration: '45 min',
    difficulty: 'Beginner',
    score: 72,
    completed: true,
    type: 'task1',
  },
  {
    id: 2,
    title: 'Letter Writing Techniques',
    description: 'Master formal, semi-formal, and informal letter structures.',
    duration: '30 min',
    difficulty: 'Beginner',
    score: 68,
    completed: true,
    type: 'task1',
  },
  {
    id: 3,
    title: 'Process Description',
    description: 'Describe processes and cycles using sequential language.',
    duration: '40 min',
    difficulty: 'Intermediate',
    score: 0,
    completed: false,
    type: 'task1',
  },
  {
    id: 4,
    title: 'Opinion Essay Structure',
    description: 'Build compelling argumentative essays with clear thesis statements.',
    duration: '50 min',
    difficulty: 'Intermediate',
    score: 0,
    completed: false,
    type: 'task2',
  },
  {
    id: 5,
    title: 'Problem-Solution Essays',
    description: 'Identify problems and propose logical solutions with evidence.',
    duration: '45 min',
    difficulty: 'Advanced',
    score: 0,
    completed: false,
    type: 'task2',
  },
  {
    id: 6,
    title: 'Advantages & Disadvantages',
    description: 'Balance pros and cons essays with nuanced analysis.',
    duration: '40 min',
    difficulty: 'Intermediate',
    score: 0,
    completed: false,
    type: 'task2',
  },
];

export const readingPassages = [
  {
    id: 1,
    title: 'The Impact of Artificial Intelligence on Modern Education',
    content: `Artificial intelligence (AI) has rapidly transformed numerous sectors, and education is no exception. In recent years, educational institutions worldwide have increasingly adopted AI-powered tools to enhance learning experiences, personalize instruction, and improve administrative efficiency.

One of the most significant applications of AI in education is adaptive learning. These systems analyze individual student performance data to create customized learning paths. By identifying areas where students struggle and adjusting content difficulty accordingly, adaptive learning platforms ensure that each learner receives instruction tailored to their specific needs. Research has shown that students using adaptive learning systems demonstrate 30% better retention rates compared to traditional classroom methods.

AI also plays a crucial role in automated assessment. Natural language processing algorithms can evaluate written responses, providing instant feedback on grammar, coherence, and argumentation. While these systems are not yet perfect—they sometimes struggle with nuanced or creative responses—they offer a scalable solution for institutions dealing with large volumes of student submissions.

Furthermore, AI-driven chatbots and virtual assistants provide 24/7 support to students, answering common queries about course content, deadlines, and administrative procedures. This reduces the workload on human staff while ensuring students receive timely assistance.

However, the integration of AI in education raises important ethical concerns. Privacy issues related to student data collection, the potential for algorithmic bias, and the risk of over-reliance on technology are all challenges that educators and policymakers must address. There is also the question of whether AI might eventually replace certain teaching roles, though most experts argue that technology should augment rather than replace human educators.

Despite these challenges, the trajectory of AI in education appears promising. As technology evolves and ethical frameworks mature, AI is likely to become an increasingly valuable tool in the educational landscape.`,
    questions: [
      {
        id: 1,
        type: 'mcq',
        text: 'According to the passage, what is the main benefit of adaptive learning systems?',
        options: [
          'They replace traditional classroom methods entirely',
          'They customize learning paths based on individual student data',
          'They reduce the cost of education for institutions',
          'They eliminate the need for human teachers',
        ],
        correct: 1,
      },
      {
        id: 2,
        type: 'mcq',
        text: 'What percentage improvement in retention rates is mentioned for adaptive learning?',
        options: ['15%', '25%', '30%', '40%'],
        correct: 2,
      },
      {
        id: 3,
        type: 'mcq',
        text: 'What limitation of AI assessment systems is mentioned in the passage?',
        options: [
          'They are too expensive to implement',
          'They cannot evaluate written responses at all',
          'They sometimes struggle with nuanced or creative responses',
          'They only work for mathematics assessments',
        ],
        correct: 2,
      },
      {
        id: 4,
        type: 'mcq',
        text: 'Which ethical concern about AI in education is NOT mentioned?',
        options: [
          'Student data privacy',
          'Algorithmic bias',
          'Over-reliance on technology',
          'Carbon footprint of data centers',
        ],
        correct: 3,
      },
      {
        id: 5,
        type: 'mcq',
        text: 'The passage suggests that AI should:',
        options: [
          'Replace all human educators',
          'Be banned from educational settings',
          'Augment rather than replace human educators',
          'Only be used in higher education',
        ],
        correct: 2,
      },
    ],
    difficulty: 'Intermediate',
    duration: '20 min',
    wordCount: 320,
  },
];

export const listeningPassages = [
  {
    id: 1,
    title: 'University Enrollment Process',
    audioUrl: '/audio/enrollment.mp3',
    duration: '5:30',
    transcript: `Welcome to the University of Melbourne enrollment information session. I'm Dr. Sarah Thompson, head of the Admissions Office, and I'll be walking you through the enrollment process for the upcoming academic year.

First, let me clarify the key dates. The early enrollment window opens on March 15th and closes on April 30th. Students who enroll during this period receive a 10% discount on their first semester tuition fees. The regular enrollment period runs from May 1st through June 15th.

Now, regarding documentation. All new students must submit three essential documents: a completed enrollment form, proof of identity—typically a passport or national ID card—and academic transcripts from your previous institution. International students must additionally provide evidence of English language proficiency, such as an IELTS score of at least 6.5 overall with no band below 6.0.

For accommodation, the university offers three halls of residence. Peterson Hall, located on the main campus, has 200 single rooms with shared facilities, costing $280 per week. Greenwood Hall, approximately 15 minutes by bus from campus, offers 150 rooms with en-suite bathrooms at $320 per week. Finally, the recently opened Riverside Apartments provide 100 self-contained studio apartments at $400 per week, popular among postgraduate students.

I strongly recommend applying for accommodation as early as possible, as rooms are allocated on a first-come, first-served basis. The accommodation application deadline is July 1st, but popular options fill up much sooner.

If you have any questions, our enrollment team is available Monday through Friday, 9 AM to 5 PM, at the Student Services Center in Building A, Room 204. You can also reach us by email at enrollments@unimelb.edu.au.`,
    questions: [
      {
        id: 1,
        type: 'mcq',
        text: 'When does the early enrollment window close?',
        options: ['March 15th', 'April 30th', 'May 1st', 'June 15th'],
        correct: 1,
      },
      {
        id: 2,
        type: 'mcq',
        text: 'What discount do early enrollees receive?',
        options: ['5%', '10%', '15%', '20%'],
        correct: 1,
      },
      {
        id: 3,
        type: 'mcq',
        text: 'What is the minimum IELTS overall score required for international students?',
        options: ['6.0', '6.5', '7.0', '7.5'],
        correct: 1,
      },
      {
        id: 4,
        type: 'mcq',
        text: 'How much does a room in Peterson Hall cost per week?',
        options: ['$250', '$280', '$320', '$400'],
        correct: 1,
      },
      {
        id: 5,
        type: 'mcq',
        text: 'Where is the Student Services Center located?',
        options: [
          'Building A, Room 204',
          'Building B, Room 102',
          'Main Campus, Room 310',
          'Greenwood Hall, Office 5',
        ],
        correct: 0,
      },
    ],
    difficulty: 'Intermediate',
  },
];

export const speakingTopics = [
  {
    id: 1,
    part: 1,
    title: 'Introduction & Personal Questions',
    cue: 'Tell me about yourself. Where are you from, and what do you enjoy doing in your free time?',
    tips: ['Speak naturally and fluently', 'Expand on your answers', 'Use varied vocabulary'],
    duration: '4-5 min',
  },
  {
    id: 2,
    part: 2,
    title: 'Describe a Memorable Journey',
    cue: 'Describe a journey you remember well. You should say:\n• Where you went\n• How you traveled\n• What you did there\n• And explain why this journey was memorable for you.',
    tips: ['Organize your response around the bullet points', 'Use descriptive language', 'Cover all points equally'],
    duration: '3-4 min',
  },
  {
    id: 3,
    part: 3,
    title: 'Discussion on Travel & Culture',
    cue: 'How has international travel changed in the last decade? Do you think cultural exchange through travel is beneficial?',
    tips: ['Provide balanced opinions', 'Support with examples', 'Use complex sentence structures'],
    duration: '4-5 min',
  },
];

export const dashboardStats = {
  overallBand: 6.5,
  targetBand: 7.5,
  practiceStreak: 12,
  accuracy: 73,
  studyHours: 48,
  totalLessons: 92,
  completedLessons: 31,
  recentActivity: [
    { id: 1, type: 'reading', title: 'AI in Education Passage', score: 7, date: '2024-01-15' },
    { id: 2, type: 'writing', title: 'Opinion Essay Practice', score: 6.5, date: '2024-01-14' },
    { id: 3, type: 'listening', title: 'University Enrollment', score: 7, date: '2024-01-13' },
    { id: 4, type: 'speaking', title: 'Cue Card: Memorable Journey', score: 6, date: '2024-01-12' },
  ],
  progressHistory: [
    { week: 'W1', reading: 5.5, listening: 6, writing: 5, speaking: 5.5 },
    { week: 'W2', reading: 6, listening: 6.5, writing: 5.5, speaking: 6 },
    { week: 'W3', reading: 6.5, listening: 7, writing: 6, speaking: 6 },
    { week: 'W4', reading: 6.5, listening: 7, writing: 6.5, speaking: 6.5 },
    { week: 'W5', reading: 7, listening: 7, writing: 6.5, speaking: 6.5 },
    { week: 'W6', reading: 7, listening: 7.5, writing: 6.5, speaking: 7 },
  ],
  recommendedLessons: [
    { id: 1, title: 'Reading: Matching Headings', skill: 'reading', difficulty: 'Intermediate' },
    { id: 2, title: 'Writing: Coherence & Cohesion', skill: 'writing', difficulty: 'Advanced' },
    { id: 3, title: 'Speaking: Fluency Practice', skill: 'speaking', difficulty: 'Intermediate' },
  ],
};

export const mockTests = [
  { id: 1, title: 'Full IELTS Academic Test #1', duration: '2h 45m', sections: 4, difficulty: 'Full', completed: false },
  { id: 2, title: 'Reading & Listening Only', duration: '1h', sections: 2, difficulty: 'Partial', completed: true, score: 6.5 },
  { id: 3, title: 'Full IELTS Academic Test #2', duration: '2h 45m', sections: 4, difficulty: 'Full', completed: false },
];

export const resources = [
  { id: 1, title: 'IELTS Writing Templates', type: 'PDF', category: 'Writing', size: '2.4 MB' },
  { id: 2, title: 'Vocabulary Booster Pack', type: 'PDF', category: 'General', size: '1.8 MB' },
  { id: 3, title: 'Speaking Cue Card Collection', type: 'PDF', category: 'Speaking', size: '3.1 MB' },
  { id: 4, title: 'Reading Strategies Guide', type: 'PDF', category: 'Reading', size: '2.0 MB' },
  { id: 5, title: 'Grammar Essentials', type: 'Video', category: 'Writing', duration: '45 min' },
  { id: 6, title: 'Listening Tips & Tricks', type: 'Video', category: 'Listening', duration: '30 min' },
];

export const countries = [
  'India', 'Pakistan', 'Bangladesh', 'Nepal', 'Sri Lanka', 'China', 'Japan',
  'South Korea', 'Vietnam', 'Thailand', 'Malaysia', 'Philippines', 'Indonesia',
  'Iran', 'Iraq', 'Saudi Arabia', 'UAE', 'Turkey', 'Egypt', 'Nigeria',
  'Brazil', 'Mexico', 'Colombia', 'Argentina', 'Germany', 'France', 'Italy',
  'Spain', 'United Kingdom', 'Australia', 'Canada', 'United States', 'New Zealand',
];