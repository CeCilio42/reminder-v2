// API functions for handling reminders

import { toast } from 'react-toastify';

export const handleFetchReminders = async (userId) => {
  try {
    const response = await fetch(`https://localhost:7176/Home/GetRemindersByUserId?user_id=${userId}`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data.reminders;
    
  } catch (error) {
    // Log error in development only
    if (process.env.NODE_ENV === 'development') {
      console.error('There was a problem with the fetch operation:', error);
    }
    return []; 
  }
};

export const handleFetchCompanyReminders = async (userId) => {
  try {
    const response = await fetch(`https://localhost:7176/Home/GetRemindersByCompany?user_id=${userId}`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data.reminders;
    
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('There was a problem with the fetch operation:', error);
    }
    toast.error('Error fetching company reminders: ' + error.message);
    return []; 
  }
};

export const toggleCompleteReminder = async (reminder) => {
  try {
    const response = await fetch('https://localhost:7176/Home/ToggleCompleteReminder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reminder)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('There was a problem with the toggle operation:', error);
    }
    throw error;
  }
};

export const handleDeleteReminder = async (id) => {
  try {
    const response = await fetch('https://localhost:7176/Home/DeleteReminder', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error deleting reminder:', error);
    }
    throw error;
  }
};

export const handleCreateReminder = async (data) => {
  try {
    const response = await fetch('https://localhost:7176/Home/CreateReminder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    toast.success('Reminder created successfully!');
    return result;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error creating reminder:', error);
    }
    toast.error('Error creating reminder: ' + error.message);
    throw error;
  }
};

export const handleCreateCompanyReminder = async (data, companyCode, createCode) => {
  try {
    const response = await fetch(`https://localhost:7176/Home/CreateCompanyReminder?company_code=${companyCode}&create_code=${createCode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      toast.error('Error creating reminder');
    }
    throw error;
  }
};

export const handleSearchReminders = async (userId, searchInput) => {
  try {
    const response = await fetch(`https://localhost:7176/Home/SearchReminders?user_id=${userId}&searchInput=${encodeURIComponent(searchInput)}`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.reminders;
    
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('There was a problem with the fetch operation:', error);
    }
    return []; 
  }
};

