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
          className="btn-primary text-sm shadow-button hover:shadow-button-hover"
          aria-label="Save frame to your collection"
        >
          ✨ Save Frame
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
    <div className="relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-b-2xl" />
      
      <div className="relative flex items-center justify-between px-6 py-6 mb-8">
        <div className="flex items-center gap-4">
          {/* Enhanced logo */}
          <div className="relative">
            <div className="h-12 w-12 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center shadow-button group-hover:shadow-button-hover transition-all duration-200">
              <span className="text-white font-extrabold text-lg">SP</span>
            </div>
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-accent rounded-full animate-pulse-slow" />
          </div>
          
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-gradient">
              Subcast Pulse
            </h1>
            <p className="text-sm text-text-muted font-medium">
              Track Farcaster connections & conversations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saveFrameButton && (
            <div className="animate-bounce-subtle">
              {saveFrameButton}
            </div>
          )}
          <button
            onClick={() => viewProfile()}
            className="btn-secondary text-sm"
            aria-label="View profile"
          >
            Profile
          </button>
        </div>
      </div>
    </div>
  );

  const renderNavigation = () => (
    <div className="sticky top-0 z-10 bg-bg/80 backdrop-blur-sm border-b border-border px-6 mb-6">
      <div className="flex">
        <button
          onClick={() => setCurrentView('home')}
          className={`flex items-center gap-3 px-6 py-4 text-sm font-semibold border-b-2 transition-all duration-200 min-h-[60px] ${
            currentView === 'home'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-text-muted hover:text-text-primary hover:bg-surface/30'
          }`}
          aria-label="View trending pairs"
          role="tab"
          aria-selected={currentView === 'home'}
        >
          <TrendingUp className={`h-5 w-5 transition-transform duration-200 ${
            currentView === 'home' ? 'scale-110' : ''
          }`} />
          <span>Trending</span>
        </button>
        <button
          onClick={() => setCurrentView('search')}
          className={`flex items-center gap-3 px-6 py-4 text-sm font-semibold border-b-2 transition-all duration-200 min-h-[60px] ${
            currentView === 'search'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-text-muted hover:text-text-primary hover:bg-surface/30'
          }`}
          aria-label="Search for users"
          role="tab"
          aria-selected={currentView === 'search'}
        >
          <Search className={`h-5 w-5 transition-transform duration-200 ${
            currentView === 'search' ? 'scale-110' : ''
          }`} />
          <span>Search</span>
        </button>
      </div>
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
        <div className="space-y-8 animate-in">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
                <Search className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary">Find User Interactions</h2>
            </div>
            <UserSearch
              onUserSelect={handleUserSelect}
              placeholder="Search for a Farcaster user..."
            />
          </div>
          
          <div className="card p-12 text-center animate-scale-in">
            <div className="space-y-6">
              <div className="relative">
                <div className="h-20 w-20 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-10 w-10 text-accent" />
                </div>
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                  <Search className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">
                  Discover Farcaster Conversations
                </h3>
                <p className="text-text-muted mb-4 max-w-md mx-auto leading-relaxed">
                  Search for any Farcaster user to explore their subcast interactions and discover meaningful conversations.
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-sm">
                  <span className="px-3 py-1 bg-surface-hover rounded-full text-text-muted">
                    Try: @username
                  </span>
                  <span className="px-3 py-1 bg-surface-hover rounded-full text-text-muted">
                    Or: FID number
                  </span>
                </div>
              </div>
            </div>
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
      <div className="px-6 mb-8">
        <div className="card p-4">
          <Wallet className="w-full">
            <ConnectWallet className="w-full btn-primary justify-center">
              <Name className="text-inherit font-medium" />
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
      </div>

      {currentView !== 'feed' && renderNavigation()}
      
      <div className="px-6 pb-8">
        {renderContent()}
      </div>

      {/* Footer */}
      <div className="px-6 py-8 border-t border-border mt-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-6 w-6 bg-gradient-to-br from-primary to-accent rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">SP</span>
            </div>
            <p className="text-sm text-text-muted">
              Built with{' '}
              <button
                onClick={() => openUrl('https://docs.base.org/tools/minikit')}
                className="text-accent hover:text-accent-600 font-medium transition-colors duration-200"
              >
                MiniKit
              </button>
            </p>
          </div>
          <p className="text-sm text-text-muted">
            Powered by{' '}
            <button
              onClick={() => openUrl('https://base.org')}
              className="text-accent hover:text-accent-600 font-medium transition-colors duration-200"
            >
              Base
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
