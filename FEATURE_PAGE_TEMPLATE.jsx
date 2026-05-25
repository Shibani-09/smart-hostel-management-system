// Template for modern feature pages
// Usage: Copy this template and customize for each page (GatePass, Notices, Complaints, Rooms, AdminUsers)

import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiPlus, FiSearch, FiFilter, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import Layout from '../components/layouts/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import StatCard from '../components/cards/StatCard';
import Badge from '../components/ui/Badge';

function FeaturePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <Layout role="student">
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants}>
          <Card variant="elevated">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-slate-100">Feature Name</h1>
                <p className="text-slate-400 mt-2">Manage and track your feature items here.</p>
              </div>

              <Button
                variant="primary"
                size="lg"
                icon={FiPlus}
                onClick={() => setShowForm(!showForm)}
              >
                New Item
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Stats Overview */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Items"
              value="24"
              color="primary"
              icon={FiPlus}
            />
            <StatCard
              title="Pending"
              value="5"
              color="warning"
              icon={FiFilter}
            />
            <StatCard
              title="Completed"
              value="19"
              color="success"
              icon={FiCheck}
            />
            <StatCard
              title="This Month"
              value="8"
              color="info"
              icon={FiBell}
            />
          </div>
        </motion.div>

        {/* Search & Filter */}
        <motion.div variants={itemVariants}>
          <Card variant="default">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={FiSearch}
                className="flex-1"
              />
              <Button variant="secondary" icon={FiFilter}>
                Filter
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Items Table */}
        <motion.div variants={itemVariants}>
          <Card variant="default">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Items List</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((item) => (
                    <tr
                      key={item}
                      className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-slate-300">Sample Item {item}</td>
                      <td className="px-4 py-3">
                        <Badge variant="success">Active</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">May {item}, 2024</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={FiEdit2}
                            onClick={() => console.log('Edit')}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={FiTrash2}
                            onClick={() => console.log('Delete')}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Empty State (show when no items) */}
        {/* 
        <motion.div variants={itemVariants}>
          <Card variant="default" className="text-center py-12">
            <div className="space-y-4">
              <div className="text-4xl opacity-20">📭</div>
              <h3 className="text-lg font-semibold text-slate-300">No items found</h3>
              <p className="text-slate-500">Create your first item to get started</p>
              <Button variant="primary" icon={FiPlus}>
                Create New Item
              </Button>
            </div>
          </Card>
        </motion.div>
        */}
      </motion.div>
    </Layout>
  );
}

export default FeaturePage;
