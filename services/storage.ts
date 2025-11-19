import { Job } from '../types';

const STORAGE_KEY = 'video_quest_data_v1';

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
    return JSON.parse(data) as Job[];
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