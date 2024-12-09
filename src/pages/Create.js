import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { handleCreateReminder } from '../api/reminder-api';
import { toast } from 'react-toastify';

const Create = () => {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title?.trim()) {
      errors.title = 'Title is required';
    }
    if (!formData.date) {
      errors.date = 'Due date is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const reminderData = {
        title: formData.title,
        description: formData.description,
        type: 1,
        picture_Url: "test",
        date: formData.date,
        start_time: "00:00",
        user: {
          id: user.sub,
        },
      };

      const result = await handleCreateReminder(reminderData);
      if (result) {
        navigate('/'); 
        toast.success('Creation successful!');
      } else {
        throw new Error('Failed to create reminder');
      }
    } catch (error) {
      console.error('Error details:', error);
      setSubmitError(error.message || 'Failed to create reminder');
      toast.error('Creation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h3 className="text-gray-700 text-3xl font-medium">Create Reminder</h3>
      <div className="mt-8">
        <div className="max-w-xl bg-white rounded-lg shadow-md p-6">
          {submitError && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
              {submitError}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter reminder title"
                required
              />
              {formErrors.title && (
                <span className="error">{formErrors.title}</span>
              )}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter reminder description"
              />
            </div>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Due Date
              </label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
              {formErrors.date && (
                <span className="error">{formErrors.date}</span>
              )}
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isSubmitting ? 'Creating...' : 'Create Reminder'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Create; 