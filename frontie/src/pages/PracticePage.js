import React from 'react';
import LandingLayout from '../components/layout/LandingLayout';
import SkillCard from '../components/landing/SkillCard';
import { skillCards } from '../data/mockData';

const PracticePage = () => {
  return (
    <LandingLayout>
      <div className="section-container py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Practice Modules
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Choose a skill to start practicing
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCards.map((skill, index) => (
            <SkillCard key={skill.id} skill={skill} index={index} />
          ))}
        </div>
      </div>
    </LandingLayout>
  );
};

export default PracticePage;