import { createContext, useContext, useState, useEffect } from 'react';
import { calculateLevel, awardXp, checkBadgeEligibility } from '../utils';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

const GamificationContext = createContext();

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};

export const GamificationProvider = ({ children }) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  
  const [userStats, setUserStats] = useState({
    totalXp: 0,
    level: 1,
    earnedBadges: [],
    questProgress: {},
    profileCompletion: 0,
    totalApplications: 0,
    totalSkills: 0,
    applicationsToday: 0,
    interviewsScheduled: 0,
    offersReceived: 0,
    isPlaced: false,
    lastLogin: null,
    consecutiveLogins: 0
  });

  const [recentXpGain, setRecentXpGain] = useState({ xp: 0, action: null });

  // Load user stats from localStorage
  useEffect(() => {
    if (user) {
      const savedStats = localStorage.getItem(`gamification_${user.id}`);
      if (savedStats) {
        setUserStats(JSON.parse(savedStats));
      }
    }
  }, [user]);

  // Save stats to localStorage whenever they change
  useEffect(() => {
    if (user && userStats.totalXp > 0) {
      localStorage.setItem(`gamification_${user.id}`, JSON.stringify(userStats));
    }
  }, [user, userStats]);

  const awardXpToUser = (action, customXp = null) => {
    const xpGained = customXp || awardXp(action);
    
    if (xpGained > 0) {
      setUserStats(prev => {
        const newTotalXp = prev.totalXp + xpGained;
        const newLevel = calculateLevel(newTotalXp);
        const leveledUp = newLevel > prev.level;
        
        // Check for new badges
        const newStats = { ...prev, totalXp: newTotalXp, level: newLevel };
        const eligibleBadges = checkBadgeEligibility(newStats);
        const newBadges = eligibleBadges.filter(badge => !prev.earnedBadges.includes(badge));
        
        if (newBadges.length > 0) {
          newStats.earnedBadges = [...prev.earnedBadges, ...newBadges];
          
          // Show badge notification
          newBadges.forEach(badge => {
            showNotification(`🏅 Badge Earned: ${badge.replace('_', ' ')}!`, 'success');
          });
        }
        
        // Show level up notification
        if (leveledUp) {
          showNotification(`🎉 Level Up! You're now level ${newLevel}!`, 'success');
        }
        
        return newStats;
      });
      
      // Show XP notification
      setRecentXpGain({ xp: xpGained, action });
      
      return xpGained;
    }
    
    return 0;
  };

  const updateUserStats = (updates) => {
    setUserStats(prev => ({ ...prev, ...updates }));
  };

  const updateQuestProgress = (questKey, progress) => {
    setUserStats(prev => ({
      ...prev,
      questProgress: {
        ...prev.questProgress,
        [questKey]: progress
      }
    }));
  };

  const completeQuest = (questKey, reward) => {
    awardXpToUser('quest_complete', reward);
    showNotification(`🎯 Quest Completed: +${reward} XP!`, 'success');
  };

  const trackDailyLogin = () => {
    const today = new Date().toDateString();
    const lastLogin = userStats.lastLogin;
    
    if (lastLogin !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const isConsecutive = lastLogin === yesterday.toDateString();
      const newConsecutiveLogins = isConsecutive ? userStats.consecutiveLogins + 1 : 1;
      
      updateUserStats({
        lastLogin: today,
        consecutiveLogins: newConsecutiveLogins
      });
      
      // Award daily login XP
      awardXpToUser('daily_login');
      
      // Check for consecutive login achievements
      if (newConsecutiveLogins === 7) {
        awardXpToUser('weekly_warrior', 50);
      } else if (newConsecutiveLogins === 30) {
        awardXpToUser('monthly_champion', 200);
      }
    }
  };

  const clearXpNotification = () => {
    setRecentXpGain({ xp: 0, action: null });
  };

  const value = {
    userStats,
    recentXpGain,
    awardXpToUser,
    updateUserStats,
    updateQuestProgress,
    completeQuest,
    trackDailyLogin,
    clearXpNotification
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};

export default GamificationContext;