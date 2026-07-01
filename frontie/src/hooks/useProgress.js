import { useState, useEffect, useCallback } from 'react';

const useProgress = (initialData = null) => {
  const [progress, setProgress] = useState(initialData || {
    reading: { completed: 0, total: 30, avgScore: 0 },
    writing: { completed: 0, total: 18, avgScore: 0 },
    listening: { completed: 0, total: 24, avgScore: 0 },
    speaking: { completed: 0, total: 20, avgScore: 0 },
  });

  const [overallBand, setOverallBand] = useState(0);

  const updateSkillProgress = useCallback((skill, data) => {
    setProgress((prev) => ({
      ...prev,
      [skill]: { ...prev[skill], ...data },
    }));
  }, []);

  const getCompletionPercentage = useCallback((skill) => {
    if (!progress[skill]) return 0;
    return Math.round((progress[skill].completed / progress[skill].total) * 100);
  }, [progress]);

  const getOverallCompletion = useCallback(() => {
    const totalCompleted = Object.values(progress).reduce((sum, s) => sum + s.completed, 0);
    const totalLessons = Object.values(progress).reduce((sum, s) => sum + s.total, 0);
    return Math.round((totalCompleted / totalLessons) * 100);
  }, [progress]);

  useEffect(() => {
    const scores = Object.values(progress).map((s) => s.avgScore).filter((s) => s > 0);
    if (scores.length > 0) {
      setOverallBand(Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 2) / 2);
    }
  }, [progress]);

  return {
    progress,
    overallBand,
    updateSkillProgress,
    getCompletionPercentage,
    getOverallCompletion,
  };
};

export default useProgress;