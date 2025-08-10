
import type { User, Subcast, TrendingPair } from '../types';

const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;
const NEYNAR_BASE_URL = 'https://api.neynar.com/v2';

export class FarcasterAPI {
  private static async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${NEYNAR_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'X-API-KEY': NEYNAR_API_KEY || '',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  static async getUserByUsername(username: string): Promise<User | null> {
    try {
      const data = await this.makeRequest(`/user/by_username?username=${username}`);
      return {
        fid: data.user.fid,
        username: data.user.username,
        displayName: data.user.display_name,
        profileImageUrl: data.user.pfp_url,
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  static async getUserByFid(fid: number): Promise<User | null> {
    try {
      const data = await this.makeRequest(`/user/bulk?fids=${fid}`);
      const user = data.users[0];
      if (!user) return null;
      
      return {
        fid: user.fid,
        username: user.username,
        displayName: user.display_name,
        profileImageUrl: user.pfp_url,
      };
    } catch (error) {
      console.error('Error fetching user by FID:', error);
      return null;
    }
  }

  static async getSubcastsBetweenUsers(fid1: number, fid2: number): Promise<Subcast[]> {
    try {
      // This is a mock implementation - in reality, you'd need to:
      // 1. Fetch casts from both users
      // 2. Filter for subcasts (replies/mentions between them)
      // 3. Check for deleted casts using historical data
      
      const mockSubcasts: Subcast[] = [
        {
          castHash: '0x123',
          fid: fid1,
          mentionedFids: [fid2],
          timestamp: new Date().toISOString(),
          text: `Great point! What do you think about the new protocol update?`,
          deleted: false,
          isReciprocal: true,
        },
        {
          castHash: '0x456',
          fid: fid2,
          mentionedFids: [fid1],
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          text: `[DELETED] This cast was removed by the author`,
          deleted: true,
          isReciprocal: true,
        },
      ];

      return mockSubcasts;
    } catch (error) {
      console.error('Error fetching subcasts:', error);
      return [];
    }
  }

  static async getTrendingSubcastPairs(): Promise<TrendingPair[]> {
    try {
      // Mock implementation - in reality, this would analyze recent cast data
      // to find frequently interacting user pairs
      
      const mockUsers1: User = {
        fid: 1,
        username: 'vitalik',
        displayName: 'Vitalik Buterin',
        profileImageUrl: 'https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_256/https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FAATXAJwJC7_dJhkhWV1YLm2AKzH1BG2Cz52n3kNVr3L6%3Ds96-c',
      };

      const mockUsers2: User = {
        fid: 2,
        username: 'dwr',
        displayName: 'Dan Romero',
        profileImageUrl: 'https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_256/https%3A%2F%2Fi.imgur.com%2F123.png',
      };

      return [
        {
          users: [mockUsers1, mockUsers2],
          subcastCount: 15,
          lastActivity: new Date().toISOString(),
          isReciprocal: true,
        },
      ];
    } catch (error) {
      console.error('Error fetching trending pairs:', error);
      return [];
    }
  }
}
