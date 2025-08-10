
export interface User {
  fid: number;
  username: string;
  displayName: string;
  profileImageUrl: string;
}

export interface Subcast {
  castHash: string;
  parentCastHash?: string;
  fid: number;
  mentionedFids: number[];
  timestamp: string;
  text: string;
  deleted: boolean;
  isReciprocal: boolean;
  author?: User;
  mentioned?: User[];
}

export interface Notification {
  id: string;
  userId: number;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface TrendingPair {
  users: [User, User];
  subcastCount: number;
  lastActivity: string;
  isReciprocal: boolean;
}
