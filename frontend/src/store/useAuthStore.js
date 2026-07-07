import { create } from 'zustand';

const getInitialUser = () => {
  try {
    const userStr = localStorage.getItem('studyflow_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
};

export const useAuthStore = create((set) => ({
  user: getInitialUser(),
  login: (name) => {
    const user = { id: 'demo-user', name };
    localStorage.setItem('studyflow_user', JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    localStorage.removeItem('studyflow_user');
    set({ user: null });
  }
}));
