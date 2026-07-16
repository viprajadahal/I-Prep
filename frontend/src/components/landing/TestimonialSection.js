import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma',
    country: 'India',
    band: '7.5',
    avatar: null,
    text: 'iPrep IELTS helped me improve from 6.0 to 7.5 in just 3 months. The AI feedback on my writing was incredibly detailed and actionable.',
  },
  {
    name: 'Ahmed Hassan',
    country: 'Egypt',
    band: '8.0',
    avatar: null,
    text: 'The reading module is outstanding. The highlight feature and timed practice made me feel confident during the actual exam.',
  },
  {
    name: 'Chen Wei',
    country: 'China',
    band: '7.0',
    avatar: null,
    text: 'I struggled with speaking fluency, but the AI pronunciation analysis and cue card practice transformed my confidence.',
  },
  {
    name: 'Maria Rodriguez',
    country: 'Colombia',
    band: '7.5',
    avatar: null,
    text: 'The progress tracking and weekly analytics kept me motivated. I could clearly see my improvement over time.',
  },
];

const TestimonialSection = () => {
  return (
    <section className="py-20 bg-surface-light dark:bg-surface-dark">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Student Success Stories
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Join thousands of students who achieved their target band scores with iPrep IELTS
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-600 transition-all"
            >
              <Quote size={24} className="text-gray-200 dark:text-gray-700 mb-4" />

              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {testimonial.text}
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-accent flex items-center justify-center text-white font-bold text-sm">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {testimonial.country}
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-gradient-accent text-white text-xs font-bold">
                  Band {testimonial.band}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;