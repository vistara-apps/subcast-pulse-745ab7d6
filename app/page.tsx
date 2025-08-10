
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
  useViewProfile,
  usePrimaryButton,
} from '@coinbase/onchainkit/minikit';
import { TrendingPairs } from './components/TrendingPairs';
import { UserSearch } from './components/UserSearch';
import { SubcastFeed } from './components/SubcastFeed';
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';
import { Name, Identity, Address, Avatar } from '@coinbase/onchainkit/identity';
import { Search, TrendingUp, Users } from 'lucide-react';
import type { User, TrendingPair } from './types';

type View = 'home' | 'search' | 'feed';

export default function Home() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedUsers, setSelectedUsers] = useState<[User, User] | null>(null);
  const [searchedUser, setSearchedUser] = useState<User | null>(null);
  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();
  const viewProfile = useViewProfile();

  // Set frame ready when component mounts
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  // Primary button for quick actions
  usePrimaryButton(
    { text: currentView === 'home' ? 'SEARCH USERS' : 'HOME' },
    () => {
      if (currentView === 'home') {
        setCurrentView('search');
      } else {
        setCurrentView('home');
        setSelectedUsers(null);
        setSearchedUser(null);
      }
    }
  );

  // Handle adding frame to user's list
  const handleAddFrame = useCallback(async () => {
    try {
      const result = await addFrame();
      if (result) {
        console.log('Frame added:', result.url, result.token);
      }
    } catch (error) {
      console.error('Failed to add frame:', error);
    }
  }, [addFrame]);

  // Save frame button (only show if not already added)
  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <button
          onClick={handleAddFrame}
          className="px-3 py-1 bg-primary/20 text-primary rounded-md text-sm hover:bg-primary/30 transition-colors"
        >
          Save Frame
        </button>
      );
    }
    return null;
  }, [context, handleAddFrame]);

  const handleSelectTrendingPair = (pair: TrendingPair) => {
    setSelectedUsers(pair.users);
    setCurrentView('feed');
  };

  const handleUserSelect = (user: User) => {
    setSearchedUser(user);
    // For demo purposes, create a mock second user for the conversation
    // In reality, this would open a user selection flow
    const mockUser: User = {
      fid: 999,
      username: 'demo',
      displayName: 'Demo User',
      profileImageUrl: 'https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_256/https%3A%2F%2Fi.imgur.com%2FdemoUser.png',
    };
    setSelectedUsers([user, mockUser]);
    setCurrentView('feed');
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-6 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
          <span className="text-white font-bold text-sm">SP</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-text">Subcast Pulse</h1>
          <p className="text-xs text-gray-400">Track Farcaster connections</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {saveFrameButton}
        <button
          onClick={() => viewProfile()}
          className="px-3 py-1 bg-surface rounded-md text-sm hover:bg-gray-700 transition-colors"
        >
          Profile
        </button>
      </div>
    </div>
  );

  const renderNavigation = () => (
    <div className="flex border-b border-gray-700 px-4">
      <button
        onClick={() => setCurrentView('home')}
        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
          currentView === 'home'
            ? 'border-primary text-primary'
            : 'border-transparent text-gray-400 hover:text-text'
        }`}
      >
        <TrendingUp className="h-4 w-4" />
        Trending
      </button>
      <button
        onClick={() => setCurrentView('search')}
        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
          currentView === 'search'
            ? 'border-primary text-primary'
            : 'border-transparent text-gray-400 hover:text-text'
        }`}
      >
        <Search className="h-4 w-4" />
        Search
      </button>
    </div>
  );

  const renderContent = () => {
    if (currentView === 'feed' && selectedUsers) {
      return (
        <SubcastFeed
          users={selectedUsers}
          onBack={() => {
            setCurrentView('home');
            setSelectedUsers(null);
          }}
        />
      );
    }

    if (currentView === 'search') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-text mb-4">Find User Interactions</h2>
            <UserSearch
              onUserSelect={handleUserSelect}
              placeholder="Search for a Farcaster user..."
            />
          </div>
          
          <div className="text-center py-8 text-gray-400">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Search for a user to see their subcast interactions</p>
            <p className="text-sm mt-2">Enter a username or FID to get started</p>
          </div>
        </div>
      );
    }

    return <TrendingPairs onSelectPair={handleSelectTrendingPair} />;
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      {renderHeader()}
      
      {/* Wallet Connection */}
      <div className="px-4 mb-6">
        <Wallet className="w-full">
          <ConnectWallet className="w-full">
            <Name className="text-inherit" />
          </ConnectWallet>
          <WalletDropdown>
            <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
              <Avatar />
              <Name />
              <Address />
            </Identity>
            <WalletDropdownDisconnect />
          </WalletDropdown>
        </Wallet>
      </div>

      {currentView !== 'feed' && renderNavigation()}
      
      <div className="px-4 py-6">
        {renderContent()}
      </div>

      {/* Footer */}
      <div className="px-4 py-6 border-t border-gray-700 mt-8">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Built with{' '}
            <button
              onClick={() => openUrl('https://docs.base.org/tools/minikit')}
              className="text-accent hover:underline"
            >
              MiniKit
            </button>
          </p>
          <p className="text-xs text-gray-500">
            Powered by{' '}
            <button
              onClick={() => openUrl('https://base.org')}
              className="text-accent hover:underline"
            >
              Base
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
