import { Visitor } from '@/types/visitor';

const STORAGE_KEY = 'smart_vms_visitors';

export const getVisitors = (): Visitor[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading visitors:', error);
    return [];
  }
};

export const saveVisitor = (visitor: Visitor): void => {
  try {
    const visitors = getVisitors();
    visitors.push(visitor);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visitors));
  } catch (error) {
    console.error('Error saving visitor:', error);
    throw new Error('Failed to save visitor data');
  }
};

export const updateVisitor = (id: string, updates: Partial<Visitor>): void => {
  try {
    const visitors = getVisitors();
    const index = visitors.findIndex(v => v.id === id);
    if (index !== -1) {
      visitors[index] = { ...visitors[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visitors));
    }
  } catch (error) {
    console.error('Error updating visitor:', error);
    throw new Error('Failed to update visitor data');
  }
};

export const getVisitorById = (id: string): Visitor | undefined => {
  const visitors = getVisitors();
  return visitors.find(v => v.id === id);
};

export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
