import { Job, Withdrawal } from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'video_quest_data_v1';
const GOAL_KEY = 'video_quest_goal_v1';
const WITHDRAWALS_KEY = 'video_quest_withdrawals_v1';

export const saveJob = (job: Job): Job[] => {
  const currentJobs = getJobs();
  const updatedJobs = [job, ...currentJobs];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedJobs));
  return updatedJobs;
};

export const getJobs = (): Job[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    const parsed = JSON.parse(data) as Job[];
    // Migration: Ensure all jobs have correct properties
    return parsed.map(job => ({
        ...job,
        status: (job.status || 'pending') as 'pending' | 'paid',
        withdrawn: job.withdrawn || false
    }));
  } catch (e) {
    console.error("Failed to parse jobs from storage", e);
    return [];
  }
};

export const deleteJob = (id: string): Job[] => {
  const currentJobs = getJobs();
  const updatedJobs = currentJobs.filter(job => job.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedJobs));
  return updatedJobs;
};

export const markClientJobsAsPaid = (clientName: string): Job[] => {
    const currentJobs = getJobs();
    const updatedJobs = currentJobs.map(job => {
        if (job.clientName === clientName && job.status === 'pending') {
            return { ...job, status: 'paid' as const };
        }
        return job;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedJobs));
    return updatedJobs;
};

export const saveGoal = (goal: number) => {
  localStorage.setItem(GOAL_KEY, goal.toString());
};

export const getGoal = (): number => {
  const goal = localStorage.getItem(GOAL_KEY);
  return goal ? parseInt(goal, 10) : 5000; // Default goal 5000
};

// --- Withdrawal Logic ---

export const getWithdrawals = (): Withdrawal[] => {
    const data = localStorage.getItem(WITHDRAWALS_KEY);
    if (!data) return [];
    try {
        return JSON.parse(data) as Withdrawal[];
    } catch (e) {
        return [];
    }
};

export const performWithdrawal = (): { jobs: Job[], withdrawals: Withdrawal[] } => {
    const currentJobs = getJobs();
    
    // Calculate amount to withdraw (Only paid and not yet withdrawn)
    const jobsToWithdraw = currentJobs.filter(j => j.status === 'paid' && !j.withdrawn);
    const totalAmount = jobsToWithdraw.reduce((sum, j) => sum + j.amount, 0);

    if (totalAmount === 0) {
        return { jobs: currentJobs, withdrawals: getWithdrawals() };
    }

    // Mark jobs as withdrawn
    const updatedJobs = currentJobs.map(j => {
        if (j.status === 'paid' && !j.withdrawn) {
            return { ...j, withdrawn: true };
        }
        return j;
    });

    // Create Withdrawal Record
    const now = new Date();
    const monthName = now.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
    
    const newWithdrawal: Withdrawal = {
        id: uuidv4(),
        amount: totalAmount,
        date: now.toISOString().split('T')[0],
        month: monthName.charAt(0).toUpperCase() + monthName.slice(1), // Capitalize
        timestamp: Date.now()
    };

    const currentWithdrawals = getWithdrawals();
    const updatedWithdrawals = [newWithdrawal, ...currentWithdrawals];

    // Save everything
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedJobs));
    localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(updatedWithdrawals));

    return { jobs: updatedJobs, withdrawals: updatedWithdrawals };
};