import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useToaster } from 'react-hot-toast';

const ManageTasks = () => {
  const { toast } = useToaster();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    reward: '',
    timeLimit: '',
    difficulty: 'easy',
    category: '',
    requirements: ''
  });

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockTasks = [
      {
        id: 1,
        title: 'Data Entry Task',
        description: 'Enter product information from images into spreadsheet',
        reward: 5,
        timeLimit: '2 hours',
        difficulty: 'Easy',
        category: 'Data Entry',
        requirements: 'Basic computer skills',
        status: 'active',
        createdBy: 'John Buyer',
        createdAt: '2024-01-10T10:30:00Z',
        totalSubmissions: 45,
        approvedSubmissions: 38,
        rejectedSubmissions: 4,
        pendingSubmissions: 3
      },
      {
        id: 2,
        title: 'Website Testing',
        description: 'Test website functionality and report bugs',
        reward: 15,
        timeLimit: '4 hours',
        difficulty: 'Medium',
        category: 'Testing',
        requirements: 'Experience with web browsing',
        status: 'active',
        createdBy: 'Sarah Client',
        createdAt: '2024-01-12T14:20:00Z',
        totalSubmissions: 23,
        approvedSubmissions: 18,
        rejectedSubmissions: 2,
        pendingSubmissions: 3
      },
      {
        id: 3,
        title: 'Content Writing',
        description: 'Write product descriptions for e-commerce items',
        reward: 25,
        timeLimit: '6 hours',
        difficulty: 'Hard',
        category: 'Writing',
        requirements: 'Good English writing skills',
        status: 'paused',
        createdBy: 'Mike Store',
        createdAt: '2024-01-08T09:15:00Z',
        totalSubmissions: 12,
        approvedSubmissions: 8,
        rejectedSubmissions: 3,
        pendingSubmissions: 1
      }
    ];

    setTimeout(() => {
      setTasks(mockTasks);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateTask = (e) => {
    e.preventDefault();
    
    const newTask = {
      id: tasks.length + 1,
      ...taskForm,
      reward: parseInt(taskForm.reward),
      status: 'active',
      createdBy: 'Admin',
      createdAt: new Date().toISOString(),
      totalSubmissions: 0,
      approvedSubmissions: 0,
      rejectedSubmissions: 0,
      pendingSubmissions: 0
    };

    setTasks([newTask, ...tasks]);
    setShowTaskForm(false);
    setTaskForm({
      title: '',
      description: '',
      reward: '',
      timeLimit: '',
      difficulty: 'easy',
      category: '',
      requirements: ''
    });

    toast({
      title: "Task created",
      description: "New task has been created successfully.",
    });
  };

  const handleToggleTaskStatus = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'active' ? 'paused' : 'active' }
        : task
    ));

    const task = tasks.find(t => t.id === taskId);
    toast({
      title: `Task ${task.status === 'active' ? 'paused' : 'activated'}`,
      description: `Task "${task.title}" has been ${task.status === 'active' ? 'paused' : 'activated'}.`,
    });
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      const task = tasks.find(t => t.id === taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      
      toast({
        title: "Task deleted",
        description: `Task "${task.title}" has been deleted.`,
      });
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Tasks</h1>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage Tasks</h1>
        <button
          onClick={() => setShowTaskForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Task</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Tasks</p>
              <p className="text-xl font-bold text-gray-900">{tasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Tasks</p>
              <p className="text-xl font-bold text-gray-900">
                {tasks.filter(t => t.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Submissions</p>
              <p className="text-xl font-bold text-gray-900">
                {tasks.reduce((sum, task) => sum + task.totalSubmissions, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Review</p>
              <p className="text-xl font-bold text-gray-900">
                {tasks.reduce((sum, task) => sum + task.pendingSubmissions, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">{task.description}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(task.difficulty)}`}>
                            {task.difficulty}
                          </span>
                          <span className="text-xs text-gray-500">{task.reward} coins</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="space-y-1">
                      <div>Total: {task.totalSubmissions}</div>
                      <div className="text-xs text-gray-500">
                        <span className="text-green-600">✓ {task.approvedSubmissions}</span> 
                        <span className="mx-1">|</span>
                        <span className="text-yellow-600">⏳ {task.pendingSubmissions}</span>
                        <span className="mx-1">|</span>
                        <span className="text-red-600">✗ {task.rejectedSubmissions}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{formatDate(task.createdAt)}</div>
                    <div className="text-xs">by {task.createdBy}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedTask(task)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleTaskStatus(task.id)}
                        className={task.status === 'active' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}
                        title={task.status === 'active' ? 'Pause Task' : 'Activate Task'}
                      >
                        {task.status === 'active' ? <Clock className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Task Form Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Task</h2>
              
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reward (coins)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={taskForm.reward}
                      onChange={(e) => setTaskForm({...taskForm, reward: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Limit
                    </label>
                    <input
                      type="text"
                      value={taskForm.timeLimit}
                      onChange={(e) => setTaskForm({...taskForm, timeLimit: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 2 hours"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={taskForm.difficulty}
                      onChange={(e) => setTaskForm({...taskForm, difficulty: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={taskForm.category}
                      onChange={(e) => setTaskForm({...taskForm, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Data Entry"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements
                  </label>
                  <textarea
                    value={taskForm.requirements}
                    onChange={(e) => setTaskForm({...taskForm, requirements: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Skills or qualifications needed"
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowTaskForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Task Details</h2>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">{selectedTask.title}</h3>
                  <p className="text-gray-600">{selectedTask.description}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Reward</p>
                    <p className="font-medium">{selectedTask.reward} coins</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time Limit</p>
                    <p className="font-medium">{selectedTask.timeLimit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Difficulty</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedTask.difficulty)}`}>
                      {selectedTask.difficulty}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTask.status)}`}>
                      {selectedTask.status}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Requirements</p>
                  <p className="text-gray-700">{selectedTask.requirements}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Submission Statistics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-xl font-bold">{selectedTask.totalSubmissions}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-600">Approved</p>
                      <p className="text-xl font-bold text-green-600">{selectedTask.approvedSubmissions}</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-sm text-yellow-600">Pending</p>
                      <p className="text-xl font-bold text-yellow-600">{selectedTask.pendingSubmissions}</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="text-sm text-red-600">Rejected</p>
                      <p className="text-xl font-bold text-red-600">{selectedTask.rejectedSubmissions}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500">
                    Created by {selectedTask.createdBy} on {formatDate(selectedTask.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTasks;