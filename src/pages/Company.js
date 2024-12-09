import React, { useState, useEffect } from 'react';
import { handleFetchCompanyReminders, toggleCompleteReminder, handleDeleteReminder, handleCreateCompanyReminder } from '../api/reminder-api';
import { handleFetchCompanyInformation, handleGetCompanyId, handleChangeCompanyCode } from '../api/user-api';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-toastify';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const isOverdue = (dateString, completed) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const reminderDate = new Date(dateString);
  reminderDate.setHours(0, 0, 0, 0);
  return reminderDate < today && !completed;
};

const Company = () => {
  const { user } = useAuth0();
  const [reminders, setReminders] = useState([]);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [isChangeCompanyModalOpen, setIsChangeCompanyModalOpen] = useState(false);
  const [isCreateReminderModalOpen, setIsCreateReminderModalOpen] = useState(false);
  const [newCompanyId, setNewCompanyId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [reminderData, setReminderData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const companyId = await handleGetCompanyId(user.sub);
        if (companyId) {
          const fetchedCompanyInfo = await handleFetchCompanyInformation(companyId);
          setCompanyInfo(fetchedCompanyInfo);
          
          const fetchedReminders = await handleFetchCompanyReminders(user.sub);
          setReminders(fetchedReminders);
        }
      }
    };

    fetchData();
  }, [user]);

  const handleToggleComplete = async (reminder) => {
    try {
      await toggleCompleteReminder(reminder);
      setReminders(reminders.map(r => 
        r.id === reminder.id 
          ? { ...r, completed: !r.completed }
          : r
      ));
      toast.success('Reminder toggled successfully!');
    } catch (error) {
      console.error('Error toggling reminder:', error);
      toast.error('Failed to toggle reminder. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await handleDeleteReminder(id);
      setReminders(reminders.filter(r => r.id !== id));
      toast.success('Reminder deleted successfully!');
    } catch (error) {
      console.error('Error deleting reminder:', error);
      toast.error('Failed to delete reminder. Please try again.');
    }
  };

  const getNextActivity = () => {
    const now = new Date();
    return reminders
      .filter(r => !r.completed && new Date(r.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
  };

  const completedCount = reminders.filter(r => r.completed).length;
  const overdueCount = reminders.filter(r => isOverdue(r.date, r.completed)).length;
  const nextActivity = getNextActivity();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await handleChangeCompanyCode(user.sub, newCompanyId, password);
      setIsChangeCompanyModalOpen(false);
      setError('');
      setNewCompanyId('');
      setPassword('');
      const fetchedCompanyInfo = await handleFetchCompanyInformation(newCompanyId);
      setCompanyInfo(fetchedCompanyInfo);
      toast.success('Company changed successfully!');
    } catch (error) {
      setError('Failed to change company. Please check your credentials.');
      toast.error('Failed to change company. Please check your credentials.');
    }
  };

  const openCreateReminderModal = () => setIsCreateReminderModalOpen(true);
  const closeCreateReminderModal = () => setIsCreateReminderModalOpen(false);

  const handleCreateCompanyReminderSubmit = async () => {
    try {
      await handleCreateCompanyReminder(reminderData, companyInfo?.company?.id, reminderData.create_code);
      closeCreateReminderModal();
      toast.success('Company reminder created successfully!');
    } catch (error) {
      console.error('Error creating company reminder:', error);
      toast.error('Failed to create company reminder. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h3 className="text-gray-700 text-3xl font-medium">Company</h3>
      
      {/* Company Information */}
      <div className="mt-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-lg font-semibold mb-4">Company Information</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <p className="mt-1 text-gray-600">{companyInfo?.company?.name || 'Loading...'}, {companyInfo?.company?.id}</p>
                </div>
                <button
                  onClick={() => setIsChangeCompanyModalOpen(true)}
                  className="px-3 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Change Company
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
          <button 
            onClick={openCreateReminderModal} 
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 mt-8"
          >
            Add Company Reminder
          </button>
            <div className="space-y-4">
              {companyInfo?.departments?.map(dept => (
                <div key={dept.name} className="flex justify-between items-center">
                  <span className="text-gray-600">{dept.name}</span>
                  <span className="text-blue-600 font-semibold">{dept.memberCount} members</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reminder Statistics */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Tasks</p>
              <p className="text-lg font-semibold text-gray-700">{reminders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-lg font-semibold text-gray-700">{completedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-500">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Overdue</p>
              <p className="text-lg font-semibold text-red-600">{overdueCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-500">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Next Activity</p>
              {nextActivity ? (
                <div>
                  <p className="text-sm font-semibold text-purple-600">{nextActivity.title}</p>
                  <p className="text-xs text-gray-500">{formatDate(nextActivity.date)}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No upcoming tasks</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reminders Table */}
      <div className="mt-8">
        {reminders.length > 0 ? (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reminders.map((reminder) => {
                  const isOverdueReminder = isOverdue(reminder.date, reminder.completed);
                  return (
                    <tr 
                      key={reminder.id} 
                      className={`${
                        reminder.completed 
                          ? 'bg-green-50' 
                          : isOverdueReminder 
                            ? 'bg-red-50' 
                            : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`w-3 h-3 rounded-full ${
                          reminder.completed 
                            ? 'bg-green-500' 
                            : isOverdueReminder 
                              ? 'bg-red-500' 
                              : 'bg-gray-200'
                        }`}></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          reminder.completed 
                            ? 'text-green-600 line-through' 
                            : isOverdueReminder 
                              ? 'text-red-600' 
                              : 'text-gray-900'
                        }`}>
                          {reminder.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm ${
                          reminder.completed 
                            ? 'text-green-500 line-through' 
                            : isOverdueReminder 
                              ? 'text-red-500' 
                              : 'text-gray-500'
                        }`}>
                          {reminder.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${
                          reminder.completed 
                            ? 'text-green-500 line-through' 
                            : isOverdueReminder 
                              ? 'text-red-500' 
                              : 'text-gray-500'
                        }`}>
                          {formatDate(reminder.date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            className={`flex items-center justify-center w-8 h-8 ${
                              reminder.completed 
                                ? 'bg-green-500 hover:bg-green-600' 
                                : isOverdueReminder
                                  ? 'bg-red-500 hover:bg-red-600'
                                  : 'bg-blue-500 hover:bg-blue-600'
                            } text-white rounded-full focus:outline-none`}
                            onClick={() => handleToggleComplete(reminder)}
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full focus:outline-none"
                            onClick={() => handleDelete(reminder.id)}
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No reminders found.</p>
        )}
      </div>

      {/* Change Company Modal */}
      {isChangeCompanyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Change Company</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Company ID
                </label>
                <input
                  type="text"
                  value={newCompanyId}
                  onChange={(e) => setNewCompanyId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm mb-4">{error}</p>
              )}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangeCompanyModalOpen(false);
                    setError('');
                    setNewCompanyId('');
                    setPassword('');
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Company Reminder Modal */}
      {isCreateReminderModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Create Company Reminder</h3>
            <div>
              <input
                type="text"
                placeholder="Reminder Title"
                onChange={(e) => setReminderData({ ...reminderData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              />
              <textarea
                placeholder="Reminder Description"
                onChange={(e) => setReminderData({ ...reminderData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              />
              <input
                type="date"
                onChange={(e) => setReminderData({ ...reminderData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              />
              <input
                type="text"
                placeholder="Create Code"
                onChange={(e) => setReminderData({ ...reminderData, create_code: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              />
              {/* Add more fields as necessary */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeCreateReminderModal}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCompanyReminderSubmit}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Company; 