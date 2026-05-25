import { motion } from 'framer-motion';
import { useState } from 'react';

function TabsPanel({ tabs, defaultTab = 0, className = '' }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className={className}>
      {/* Tab Headers */}
      <div className="flex border-b border-slate-700/50 gap-8">
        {tabs.map((tab, index) => (
          <motion.button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`
              px-2 py-3 font-medium text-sm transition-colors relative
              ${
                activeTab === index
                  ? 'text-primary-400'
                  : 'text-slate-400 hover:text-slate-300'
              }
            `}
          >
            {tab.label}
            {activeTab === index && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                layoutId="tabIndicator"
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="pt-6"
      >
        {tabs[activeTab].content}
      </motion.div>
    </div>
  );
}

export default TabsPanel;
