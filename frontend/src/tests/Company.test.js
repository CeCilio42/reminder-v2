import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useAuth0 } from '@auth0/auth0-react';
import Company from '../pages/Company';
import { handleFetchCompanyReminders } from '../api/reminder-api';

// Testing code scans - this comment is added to trigger GitHub Actions
// Mock the external dependencies
jest.mock('@auth0/auth0-react');
jest.mock('../api/reminder-api');

// Test push verification - this comment is added to verify Git functionality

// Mock data with various date formats
const mockCompanyReminders = [
  {
    id: 1,
    title: 'Company Meeting',
    description: 'Quarterly Review',
    date: '2024/03/20',  // Format with slashes
    completed: false,
    user: {
      name: 'John Doe',
      email: 'john@example.com'
    }
  },
  {
    id: 2,
    title: 'Project Deadline',
    description: 'Final Submission',
    date: '2024-03-21',  // Format with dashes
    completed: true,
    user: {
      name: 'Jane Smith',
      email: 'jane@example.com'
    }
  },
  {
    id: 3,
    title: 'Team Building',
    description: 'Office Activity',
    date: '03/25/2024',  // Different date format
    completed: false,
    user: {
      name: 'Bob Wilson',
      email: 'bob@example.com'
    }
  }
];

describe('Company Component Date Formatting', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock Auth0 user with admin role
    useAuth0.mockReturnValue({
      user: { 
        sub: 'test-user-id',
        'https://your-namespace/roles': ['admin']
      },
      isAuthenticated: true,
    });

    // Mock API call
    handleFetchCompanyReminders.mockResolvedValue(mockCompanyReminders);
  });

  test.skip('formats different date styles correctly', async () => {
    render(<Company />);
    //test
    await waitFor(() => {
      // All dates should be formatted consistently as YYYY-MM-DD
      expect(screen.getByText('2024-03-20')).toBeInTheDocument();
      expect(screen.getByText('2024-03-21')).toBeInTheDocument();
      expect(screen.getByText('2024-03-25')).toBeInTheDocument();
    });
  });

  test.skip('handles invalid dates gracefully', async () => {
    const remindersWithInvalidDate = [
      ...mockCompanyReminders,
      {
        id: 4,
        title: 'Invalid Date Test',
        description: 'Test',
        date: 'invalid-date',
        completed: false,
        user: {
          name: 'Test User',
          email: 'test@example.com'
        }
      }
    ];

    handleFetchCompanyReminders.mockResolvedValueOnce(remindersWithInvalidDate);
    
    render(<Company />);
    
    await waitFor(() => {
      // Invalid date should be displayed as is
      expect(screen.getByText('invalid-date')).toBeInTheDocument();
    });
  });

  test.skip('sorts reminders by date correctly', async () => {
    render(<Company />);
    
    await waitFor(() => {
      const dates = screen.getAllByText(/202\d-\d{2}-\d{2}/);
      const dateValues = dates.map(date => date.textContent);
      
      // Check if dates are in ascending order
      const sortedDates = [...dateValues].sort();
      expect(dateValues).toEqual(sortedDates);
    });
  });

  test.skip('displays overdue dates with correct formatting', async () => {
    const remindersWithOverdueDate = [
      {
        id: 5,
        title: 'Overdue Task',
        description: 'Past Due',
        date: '2023-01-01', // Past date
        completed: false,
        user: {
          name: 'Past User',
          email: 'past@example.com'
        }
      },
      ...mockCompanyReminders
    ];

    handleFetchCompanyReminders.mockResolvedValueOnce(remindersWithOverdueDate);
    
    render(<Company />);
    
    await waitFor(() => {
      // Use a more flexible query that looks for the date text within any element
      const dateElements = screen.getAllByText((content, _element) => {
        return content.includes('2023-01-01');
      });
      expect(dateElements.length).toBeGreaterThan(0);
    });
  });
}); 