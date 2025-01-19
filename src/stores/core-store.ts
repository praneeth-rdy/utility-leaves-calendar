import { populateHolidays, populateLeaves } from '@/actions/core-actions';
import { CoreStore, User } from '@/constraints/types/core-types';
import { create } from 'zustand';

export const useCoreStore = create<CoreStore>((set, get) => ({
  isLeavesLoading: false,
  isHolidaysLoading: false,
  user: null,
  profileEmail: null,
  leaves: [],
  holidays: [],
  updateUser: (user: User | null) => set({ user }),
  updateProfileEmail: (email: string | null) => set({ profileEmail: email }),
  populateLeaves: (username: string, password: string, force?: boolean) =>
    populateLeaves(username, password, set, get, force),
  populateHolidays: (username: string, password: string, force?: boolean) =>
    populateHolidays(username, password, set, get, force),
}));
