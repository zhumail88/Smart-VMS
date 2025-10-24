export type VisitorStatus = 'checked-in' | 'checked-out' | 'pre-approved';

export interface Visitor {
  id: string;
  name: string;
  cnic: string;
  contact: string;
  purpose: string;
  houseNumber: string;
  residentName: string;
  photo: string;
  status: VisitorStatus;
  checkInTime: string;
  checkOutTime?: string;
  preApproved?: boolean;
  approvedBy?: string;
}

export interface AnalyticsData {
  totalVisitors: number;
  checkInsToday: number;
  checkOutsToday: number;
  activeVisitors: number;
  averageStayTime: number;
  peakHours: { hour: string; count: number }[];
  purposeDistribution: { purpose: string; count: number }[];
}
