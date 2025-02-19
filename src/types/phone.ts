
export interface BlockedPhone {
  number: string;
  reason: string;
  reportedBy: string;
  timestamp: string;
}

export interface ScamPhone {
  number: string;
  description: string;
  reportCount: number;
  lastReported: string;
}
