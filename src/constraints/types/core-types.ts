import { LeaveType } from '../enums/core-enums';

import { LeaveCategory } from '../enums/core-enums';

export type Leave = {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  leaveReason: string;
  leaveType: LeaveType;
  leaveCategory: LeaveCategory;
  startDate: Date;
  endDate: Date;
};

export type PublicHoliday = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
};

export type User = {
  username: string;
  password: string;
};

export type CoreStore = {
  isLeavesLoading: boolean;
  isHolidaysLoading: boolean;
  user: User | null;
  profileEmail: string | null;
  leaves: Leave[];
  holidays: PublicHoliday[];
  updateUser: (user: User | null) => void;
  updateProfileEmail: (email: string | null) => void;
  populateLeaves: (username: string, password: string, force?: boolean) => Promise<void>;
  populateHolidays: (username: string, password: string, force?: boolean) => Promise<void>;
};
