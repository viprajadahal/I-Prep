import {
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  Table2,
  Map,
  Settings2,
  FileText,
  MessageSquare,
  Wrench,
  Scale,
  HelpCircle,
  Mail,
  Send,
  Smile,
  PenTool,
} from 'lucide-react';

export const SUBTYPE_META = {
  graphs: { label: 'Bar Chart', icon: BarChart3, color: '#4c6ef5', description: 'Describe data trends and comparisons shown in bar charts.' },
  line_graph: { label: 'Line Graph', icon: TrendingUp, color: '#7c3aed', description: 'Illustrate changes and trends over time using line graphs.' },
  pie_chart: { label: 'Pie Chart', icon: PieChart, color: '#f59e0b', description: 'Show proportions and percentages from pie charts.' },
  mixed_charts: { label: 'Mixed Charts', icon: Activity, color: '#10b981', description: 'Combine multiple chart types in one report.' },
  tables: { label: 'Tables', icon: Table2, color: '#6366f1', description: 'Organize and compare data presented in tabular form.' },
  maps: { label: 'Maps', icon: Map, color: '#ec4899', description: 'Describe locations, layouts, and geographical features.' },
  process: { label: 'Process Diagram', icon: Settings2, color: '#8b5cf6', description: 'Explain step-by-step natural or industrial processes.' },
  opinion: { label: 'Opinion Essay', icon: FileText, color: '#4c6ef5', description: 'Express and support your personal viewpoint on a topic.' },
  discussion: { label: 'Discussion Essay', icon: MessageSquare, color: '#7c3aed', description: 'Discuss both sides of an issue and give your opinion.' },
  problem_solution: { label: 'Problem Solution', icon: Wrench, color: '#f59e0b', description: 'Identify problems and propose effective solutions.' },
  advantages: { label: 'Advantages & Disadvantages', icon: Scale, color: '#10b981', description: 'Weigh the pros and cons of a given topic.' },
  double_question: { label: 'Double Question', icon: HelpCircle, color: '#ec4899', description: 'Address two related questions in a single essay.' },
  formal_letter: { label: 'Formal Letter', icon: Mail, color: '#4c6ef5', description: 'Write professional correspondence for official purposes.' },
  semi_formal_letter: { label: 'Semi-formal Letter', icon: Send, color: '#7c3aed', description: 'Write letters with a professional yet approachable tone.' },
  informal_letter: { label: 'Informal Letter', icon: Smile, color: '#10b981', description: 'Write casual letters to friends or family members.' },
  essay: { label: 'Essay', icon: PenTool, color: '#f59e0b', description: 'Write structured essays on various general topics.' },
};

export const ACADEMIC_STRUCTURE = {
  'Task 1': {
    label: 'Task 1',
    description: 'Practice visual report writing.',
    time: 20,
    minWords: 150,
    subtypes: ['graphs', 'line_graph', 'pie_chart', 'mixed_charts', 'tables', 'maps', 'process'],
  },
  'Task 2': {
    label: 'Task 2',
    description: 'Essay Practice',
    time: 40,
    minWords: 250,
    subtypes: ['opinion', 'discussion', 'problem_solution', 'advantages', 'double_question'],
  },
};

export const GENERAL_STRUCTURE = {
  'Task 1': {
    label: 'Task 1',
    description: 'Letter Writing',
    time: 20,
    minWords: 150,
    subtypes: ['formal_letter', 'semi_formal_letter', 'informal_letter'],
  },
  'Task 2': {
    label: 'Task 2',
    description: 'Essay Practice',
    time: 40,
    minWords: 250,
    subtypes: ['opinion', 'discussion', 'problem_solution', 'advantages'],
  },
};

export const DIFFICULTY_META = {
  beginner: { label: 'Beginner', color: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
  intermediate: { label: 'Intermediate', color: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' },
  advanced: { label: 'Advanced', color: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
};

export const TASK_TYPE_LABELS = { 'Task 1': 'Task 1', 'Task 2': 'Task 2' };
