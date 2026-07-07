import axiosInstance from './axiosInstance';
import { format, addDays } from 'date-fns';

/**
 * Sends a raw natural language description to the AI parser endpoint.
 * Falls back to local regex-based parsing if the backend server is unavailable.
 */
export async function parseTask(rawText) {
  try {
    const response = await axiosInstance.post('/parse-task', { text: rawText });
    return response.data;
  } catch (error) {
    console.warn('Backend parse-task failed or is offline. Using local parsing fallback.');
    
    const text = rawText.toLowerCase();
    const today = new Date();
    
    let dueDate = format(today, 'yyyy-MM-dd');
    let subject = 'General';
    let priority = 'medium';
    let title = rawText.trim();

    // Subject parsing logic
    const subjects = [
      'math', 'history', 'science', 'english', 'biology', 
      'chemistry', 'physics', 'art', 'music', 'coding', 
      'programming', 'cs', 'spanish'
    ];
    for (const sub of subjects) {
      if (text.includes(sub)) {
        subject = sub === 'cs' ? 'CS' : sub.charAt(0).toUpperCase() + sub.slice(1);
        break;
      }
    }

    // Due date parsing logic
    if (text.includes('tomorrow')) {
      dueDate = format(addDays(today, 1), 'yyyy-MM-dd');
    } else if (text.includes('next week')) {
      dueDate = format(addDays(today, 7), 'yyyy-MM-dd');
    } else if (text.includes('in 2 days') || text.includes('2 days from now')) {
      dueDate = format(addDays(today, 2), 'yyyy-MM-dd');
    } else if (text.includes('in 3 days')) {
      dueDate = format(addDays(today, 3), 'yyyy-MM-dd');
    } else if (text.includes('yesterday') || text.includes('last active')) {
      dueDate = format(addDays(today, -1), 'yyyy-MM-dd'); // to support testing overdue tasks
    }

    // Priority parsing logic
    if (text.includes('urgent') || text.includes('important') || text.includes('high') || text.includes('asap')) {
      priority = 'high';
    } else if (text.includes('low') || text.includes('easy') || text.includes('minor') || text.includes('chill')) {
      priority = 'low';
    }

    // Trim title if it's too long
    if (title.length > 50) {
      title = title.substring(0, 47) + '...';
    }

    return {
      title,
      subject,
      dueDate,
      priority,
      status: 'pending'
    };
  }
}
