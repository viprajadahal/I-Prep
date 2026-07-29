import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import writingService from '../../services/writingService';
import { ACADEMIC_STRUCTURE, GENERAL_STRUCTURE } from '../../constants/writingCategories';
import WritingHeader from './writing/WritingHeader';
import StatisticsCards from './writing/StatisticsCards';
import FilterBar from './writing/FilterBar';
import TaskSection from './writing/TaskSection';
import RecentPractice from './writing/RecentPractice';
import ProgressPanel from './writing/ProgressPanel';
import LearningPath from './writing/LearningPath';

const WritingDashboard = () => {
  const navigate = useNavigate();
  const [module, setModule] = useState('academic');
  const [prompts, setPrompts] = useState([]);
  const [essays, setEssays] = useState([]);
  const [history, setHistory] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    task: 'all',
    difficulty: 'all',
    category: 'all',
    sort: 'newest',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [promptsRes, essaysRes, historyRes, resultsRes] = await Promise.all([
          writingService.getPrompts(),
          writingService.getEssays(),
          writingService.getHistory(),
          writingService.getResultsBatch(),
        ]);
        setPrompts(promptsRes.data);
        setEssays(essaysRes.data);
        setHistory(historyRes.data);
        setResults(resultsRes.data);
      } catch (err) {
        console.error('Failed to load writing data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const completedIds = useMemo(() => {
    const promptIds = new Set(essays.map(e => e.prompt_id).filter(Boolean));
    return promptIds;
  }, [essays]);

  const filteredPrompts = useMemo(() => {
    let list = prompts.filter(p => p.module === module);

    if (filters.task !== 'all') {
      list = list.filter(p => p.task_type === filters.task);
    }
    if (filters.difficulty !== 'all') {
      list = list.filter(p => p.difficulty === filters.difficulty);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.subtype && p.subtype.toLowerCase().includes(q)) ||
        p.prompt_text.toLowerCase().includes(q)
      );
    }
    if (filters.category !== 'all') {
      const catMap = {
        graphs: ['graphs', 'line_graph', 'pie_chart', 'mixed_charts'],
        tables: ['tables'],
        maps: ['maps'],
        process: ['process'],
        letters: ['formal_letter', 'semi_formal_letter', 'informal_letter'],
        essays: ['opinion', 'discussion', 'problem_solution', 'advantages', 'double_question'],
      };
      const allowed = catMap[filters.category] || [];
      if (allowed.length > 0) {
        list = list.filter(p => allowed.includes(p.subtype));
      }
    }

    if (filters.sort === 'difficulty') {
      const order = { beginner: 0, intermediate: 1, advanced: 2 };
      list = [...list].sort((a, b) => (order[a.difficulty] || 1) - (order[b.difficulty] || 1));
    } else if (filters.sort === 'completed') {
      list = [...list].sort((a, b) => {
        const aC = completedIds.has(a.id) ? 0 : 1;
        const bC = completedIds.has(b.id) ? 0 : 1;
        return aC - bC;
      });
    }

    return list;
  }, [prompts, module, filters, completedIds]);

  const structure = module === 'academic' ? ACADEMIC_STRUCTURE : GENERAL_STRUCTURE;

  const handleStart = (prompt) => {
    navigate(`/dashboard/writing/${prompt.id}`, { state: { prompt } });
  };

  const handleContinue = (essay) => {
    const prompt = prompts.find(p => p.title === essay.title);
    if (prompt) {
      navigate(`/dashboard/writing/${prompt.id}`, { state: { prompt } });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-violet-500" />
        <span className="ml-3 text-gray-500 dark:text-gray-400">Loading writing data...</span>
      </div>
    );
  }

  return (
    <div>
      <WritingHeader module={module} onModuleChange={setModule} />
      <StatisticsCards prompts={prompts} essays={essays} history={history} results={results} />
      <FilterBar filters={filters} onFilterChange={setFilters} module={module} />

      {essays.length > 0 && (
        <RecentPractice essays={essays} results={results} onContinue={handleContinue} />
      )}

      {Object.entries(structure).map(([taskKey, taskInfo]) => {
        const taskPrompts = filteredPrompts.filter(p => p.task_type === taskKey);
        return (
          <TaskSection
            key={`${module}-${taskKey}`}
            taskLabel={taskInfo.label}
            description={taskInfo.description}
            time={taskInfo.time}
            minWords={taskInfo.minWords}
            prompts={taskPrompts}
            completedIds={completedIds}
            onStart={handleStart}
          />
        );
      })}

      {filteredPrompts.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          No practice types match your filters. Try adjusting the search or filters.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 mb-8">
        <ProgressPanel prompts={prompts} essays={essays} />
        <LearningPath essays={essays} history={history} />
      </div>
    </div>
  );
};

export default WritingDashboard;
