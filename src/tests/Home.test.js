import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuth0 } from '@auth0/auth0-react';
import Home from '../pages/Home';
import { handleFetchReminders, toggleCompleteReminder, handleDeleteReminder } from '../api/reminder-api';
import { toast } from 'react-toastify';

// Mock the external dependencies
jest.mock('@auth0/auth0-react');
jest.mock('../api/reminder-api');
jest.mock('react-toastify');

// Mock data
const mockReminders = [
  {
    id: 1,
    title: 'Test Reminder 1',
    description: 'Test Description 1',
    date: '2024-03-20',
    completed: false,
  },
  {
    id: 2,
    title: 'Test Reminder 2',
    description: 'Test Description 2',
    date: '2024-03-21',
    completed: true,
  }
];

describe('Home Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Mock Auth0 user
    useAuth0.mockReturnValue({
      user: { sub: 'test-user-id' },
      isAuthenticated: true,
    });

    // Mock API calls
    handleFetchReminders.mockResolvedValue(mockReminders);
    toggleCompleteReminder.mockResolvedValue({});
    handleDeleteReminder.mockResolvedValue({});
  });

  test('renders home page with reminders', async () => {
    render(<Home />);
    
    // Wait for reminders to load
    await waitFor(() => {
      expect(screen.getByText('Test Reminder 1')).toBeInTheDocument();
    });

    // Check if stats are displayed
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Total tasks count
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // Completed count
  });

  test('handles toggle complete reminder', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Test Reminder 1')).toBeInTheDocument();
    });

    // Find and click the complete button for the first reminder
    const completeButtons = screen.getAllByRole('button');
    const completeButton = completeButtons[0]; // First complete button
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(toggleCompleteReminder).toHaveBeenCalledWith(mockReminders[0]);
      expect(toast.success).toHaveBeenCalledWith('Reminder status updated successfully!');
    });
  });

  test('handles delete reminder', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Test Reminder 1')).toBeInTheDocument();
    });

    // Find and click the delete button for the first reminder
    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons[1]; // Second button (delete)
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(handleDeleteReminder).toHaveBeenCalledWith(mockReminders[0].id);
      expect(toast.success).toHaveBeenCalledWith('Reminder deleted successfully!');
    });
  });

  test('displays no reminders message when empty', async () => {
    handleFetchReminders.mockResolvedValueOnce([]);
    
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('No reminders found.')).toBeInTheDocument();
    });
  });

  test('handles overdue reminders correctly', async () => {
    const overdueReminder = {
      id: 3,
      title: 'Overdue Reminder',
      description: 'This is overdue',
      date: '2024-01-01', // Past date
      completed: false,
    };

    handleFetchReminders.mockResolvedValueOnce([overdueReminder]);
    
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('Overdue Reminder')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // Overdue count
    });
  });

  test('handles API errors gracefully', async () => {
    handleFetchReminders.mockRejectedValueOnce(new Error('API Error'));
    
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('No reminders found.')).toBeInTheDocument();
    });
  });

  test('formats dates correctly', async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('2024-03-20')).toBeInTheDocument();
      expect(screen.getByText('2024-03-21')).toBeInTheDocument();
    });
  });
}); 